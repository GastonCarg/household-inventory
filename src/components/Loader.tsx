import { Loader2 } from "lucide-react";

const Loader: React.FC<{ hasMoreItems?: boolean }> = ({ hasMoreItems }) => {
  return (
    <div
      className="flex items-center justify-center overflow-y-hidden"
      style={
        !hasMoreItems ? { height: "calc(100vh - 64px)" } : { height: "48px" }
      }
    >
      <Loader2
        className="animate-spin text-green-700"
        size={!hasMoreItems ? 48 : 24}
        style={{
          width: !hasMoreItems
            ? "clamp(32px, 8vw, 70px)"
            : "clamp(20px, 6vw, 30px)",
          height: !hasMoreItems
            ? "clamp(32px, 8vw, 70px)"
            : "clamp(20px, 6vw, 30px)",
        }}
      />
    </div>
  );
};

export default Loader;
