import { CapturedImage } from '@/api/lookup';
import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal typing for the Barcode Detection API (not yet in lib.dom)
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorInstance {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
}
interface BarcodeDetectorConstructor {
  new (options?: { formats: string[] }): BarcodeDetectorInstance;
  getSupportedFormats(): Promise<string[]>;
}

const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
const NATIVE_SCAN_INTERVAL_MS = 250;
const DUPLICATE_WINDOW_MS = 2000;
const CAPTURE_MAX_SIZE = 768;
// The API only accepts numeric product codes (EAN/UPC)
const VALID_BARCODE = /^\d{6,14}$/;

export type ScannerStatus =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'denied'
  | 'unavailable';

interface UseBarcodeScannerOptions {
  enabled: boolean;
  onDetect: (code: string) => void;
}

const playBeep = () => {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 1200;
    gain.gain.value = 0.08;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
    oscillator.onended = () => context.close();
  } catch {
    // Audio feedback is optional
  }
};

export const useBarcodeScanner = ({
  enabled,
  onDetect,
}: UseBarcodeScannerOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const onDetectRef = useRef(onDetect);
  const lastDetectionRef = useRef({ code: '', time: 0 });

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    let cancelled = false;
    let stream: MediaStream | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let stopZxing: (() => void) | undefined;

    const handleCode = (code: string) => {
      if (!VALID_BARCODE.test(code)) return;

      const now = Date.now();
      const last = lastDetectionRef.current;
      if (last.code === code && now - last.time < DUPLICATE_WINDOW_MS) return;
      lastDetectionRef.current = { code, time: now };

      navigator.vibrate?.(80);
      playBeep();
      onDetectRef.current(code);
    };

    const start = async () => {
      if (!video || !navigator.mediaDevices?.getUserMedia) {
        setStatus('unavailable');
        return;
      }

      setStatus('starting');
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
          },
          audio: false,
        });
      } catch (error) {
        if (cancelled) return;
        const name = (error as DOMException)?.name;
        setStatus(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? 'denied'
            : 'unavailable'
        );
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      video.srcObject = stream;
      await video.play().catch(() => {});
      setStatus('scanning');

      const NativeDetector = (
        window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }
      ).BarcodeDetector;

      if (NativeDetector) {
        const supported = await NativeDetector.getSupportedFormats();
        const formats = BARCODE_FORMATS.filter((f) => supported.includes(f));
        if (formats.length) {
          const detector = new NativeDetector({ formats });
          const scan = async () => {
            if (cancelled) return;
            try {
              const [barcode] = await detector.detect(video);
              if (barcode) handleCode(barcode.rawValue);
            } catch {
              // Frames can fail to decode while the camera adjusts; keep scanning
            }
            timeoutId = setTimeout(scan, NATIVE_SCAN_INTERVAL_MS);
          };
          scan();
          return;
        }
      }

      // Safari, Firefox and most desktop browsers: lazy-load the pure-JS zxing decoder
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      if (cancelled) return;
      const controls = await new BrowserMultiFormatReader().decodeFromStream(
        stream,
        video,
        (result) => {
          if (result) handleCode(result.getText());
        }
      );
      if (cancelled) controls.stop();
      else stopZxing = () => controls.stop();
    };

    start();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      stopZxing?.();
      stream?.getTracks().forEach((track) => track.stop());
      if (video) video.srcObject = null;
      setStatus('idle');
    };
  }, [enabled]);

  /** Grabs the current frame as a resized JPEG, ready for /lookup/image. */
  const captureFrame = useCallback((): CapturedImage | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;

    const scale = Math.min(
      1,
      CAPTURE_MAX_SIZE / Math.max(video.videoWidth, video.videoHeight)
    );
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas
      .getContext('2d')
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return { imageBase64: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
  }, []);

  return { videoRef, status, captureFrame };
};
