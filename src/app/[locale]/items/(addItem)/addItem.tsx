import { UI_CLASSES } from '@/(constants)';
import { useAddItem, useUpdateItem } from '@/hooks/useItems';
import { useGetLocations } from '@/hooks/useLocations';
import { getExpirationDaysLeft } from '@/lib/helpers';
import { Check, Loader2, Pencil, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Item } from '../type';
import { IAddItemModal, ILocations } from './type';

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal, editingItem }) => {
  const t = useTranslations('AddItemModal');
  const isEditing = !!editingItem;

  const { data: locations = [], status, error } = useGetLocations();
  const createMutation = useAddItem(closeModal);
  const updateMutation = useUpdateItem(closeModal);
  const isLoading = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;

  // State for form fields
  const [formData, setFormData] = useState({
    name: editingItem?.title || '',
    expiration: '',
    location: editingItem?.location?.id?.toString() || '',
    quantity: editingItem?.quantity?.toString() || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    quantity: '',
    expiration: '',
    location: '',
  });

  // Calculate days remaining from expiration date
  useEffect(() => {
    if (isEditing && editingItem?.expireDate) {
      const daysLeft = getExpirationDaysLeft(editingItem.expireDate);
      // Only set expiration if the item is not expired
      if (daysLeft > 0) {
        setFormData((prev) => ({
          ...prev,
          expiration: daysLeft.toString(),
        }));
      }
    }
  }, [editingItem, isEditing]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, expiration, location, quantity: quantityStr } = formData;
      const quantity = parseInt(quantityStr, 10);

      const newErrors = {
        name: !name ? t('NameRequired') : '',
        quantity:
          !quantityStr || isNaN(quantity) || quantity < 1
            ? t('QuantityRequired')
            : '',
        expiration: !expiration ? t('ExpirationRequired') : '',
        location: !location ? t('LocationRequired') : '',
      };

      if (Object.values(newErrors).some(Boolean)) {
        setErrors(newErrors);
        toast.warning(t('PleaseFillAllFields'));
        return;
      }

      let expireDate = '';
      if (expiration) {
        const date = new Date();
        const days = parseInt(expiration, 10);
        date.setDate(date.getDate() + days);
        expireDate = date.toISOString();
      }

      const locationObj = locations.find(
        (loc) => loc.id.toString() === location
      );

      if (!locationObj) {
        setErrors((prev) => ({
          ...prev,
          location: t('LocationRequired'),
        }));
        toast.warning(t('LocationRequired'));
        return;
      }

      const item: Item = {
        title: name,
        expireDate: expireDate,
        location: locationObj,
        quantity: quantity,
      };

      if (isEditing && editingItem?.id) {
        updateMutation.mutate({ id: editingItem.id, item });
      } else if (!isEditing) {
        createMutation.mutate(item);
      } else {
        toast.error(t('ErrorUpdatingItem'));
      }
    } catch (error) {
      toast.error(isEditing ? t('ErrorUpdatingItem') : t('ErrorAddingItem'));
      console.error(
        isEditing ? t('ErrorUpdatingItemLog') : t('ErrorAddingItemLog'),
        error
      );
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const FOCUSABLE =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  if (isLoading) {
    return (
      <div className="mb-2 flex items-center justify-center gap-2">
        <Loader2 size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  if (status === 'pending') {
    return <div>Cargando locations</div>;
  }

  if (error || !locations.length) {
    return <div>Error al cargar locations</div>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={containerRef}
        className="bg-surface-modal border-surface-overlay relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8"
      >
        <button
          onClick={closeModal}
          className="text-fg-dim hover:text-fg hover:bg-divider absolute top-4 right-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors"
          aria-label={t('Close')}
          disabled={isLoading}
        >
          <X size={20} />
        </button>
        <form
          data-testid="addItemForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <section className="mb-1 flex items-center justify-center gap-2">
            {isEditing ? (
              <>
                <div className="bg-accent-edit-bg rounded-xl p-2">
                  <Pencil size={18} className="text-accent-edit" />
                </div>
                <h2
                  id="modal-title"
                  className="text-fg text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('EditItem')}
                </h2>
              </>
            ) : (
              <>
                <div
                  className="bg-accent-add-bg rounded-xl p-2"
                  aria-hidden="true"
                >
                  <Plus size={18} className="text-primary" />
                </div>
                <h2
                  id="modal-title"
                  className="text-fg text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('AddItem')}
                </h2>
              </>
            )}
          </section>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={UI_CLASSES.label}>
              {t('ProductName')}
            </label>
            <input
              id="name"
              name="name"
              placeholder={t('ProductName')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={UI_CLASSES.input}
              autoComplete="on"
              autoFocus
              aria-required="true"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quantity"
              className="text-fg-muted text-xs font-semibold tracking-wider uppercase"
            >
              {t('Quantity')}
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={UI_CLASSES.input}
              min="1"
              aria-required="true"
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="expiration"
              className="text-fg-muted text-xs font-semibold tracking-wider uppercase"
            >
              {t('Expiration')}
            </label>
            <input
              id="expiration"
              name="expiration"
              type="number"
              placeholder="30"
              value={formData.expiration}
              onChange={(e) => handleInputChange('expiration', e.target.value)}
              className={UI_CLASSES.input}
              min="1"
              disabled={isLoading}
            />
            {errors.expiration && (
              <p className="mt-1 text-xs text-red-500">{errors.expiration}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-fg-muted text-xs font-semibold tracking-wider uppercase"
            >
              {t('Location')}
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`${UI_CLASSES.input} cursor-pointer`}
              aria-required="true"
              disabled={isLoading}
            >
              <option value="">{t('SelectLocation')}</option>
              {locations.map((location: ILocations) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </div>
          <div className="mt-1 flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={closeModal}
              className="border-surface-overlay text-fg-muted hover:bg-divider hover:text-fg order-2 min-h-[44px] rounded-xl border bg-transparent px-5 py-3 font-medium transition-all duration-150 sm:order-1"
              disabled={isLoading}
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-bg order-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-md transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
              disabled={isLoading}
            >
              <Check size={18} />
              {isEditing ? t('UpdateItem') : t('Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
