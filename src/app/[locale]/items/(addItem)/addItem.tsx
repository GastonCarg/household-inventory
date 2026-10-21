import { UI_CLASSES } from '@/(constants)';
import ExpirationInput from '@/components/ExpirationInput';
import UnitSelect from '@/components/UnitSelect';
import { useAddItem, useUpdateItem } from '@/hooks/useItems';
import { useGetLocations } from '@/hooks/useLocations';
import { useModalA11y } from '@/hooks/useModalA11y';
import { Link } from '@/i18n/navigation';
import {
  dateInputValueToISO,
  getLastLocationId,
  isoToDateInputValue,
  setLastLocationId,
} from '@/lib/helpers';
import {
  DEFAULT_UNIT,
  isValidQuantity,
  parseQuantity,
  roundQuantity,
} from '@/lib/units';
import { Check, Loader2, Pencil, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Item } from '../type';
import { IAddItemModal, ILocations } from './type';

const EMPTY_ERRORS = {
  name: '',
  quantity: '',
  expiration: '',
  location: '',
};

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal, editingItem }) => {
  const t = useTranslations('AddItemModal');
  const tUnits = useTranslations('Units');
  const isEditing = !!editingItem;

  const { data: locations = [], status, error } = useGetLocations();
  const createMutation = useAddItem();
  const updateMutation = useUpdateItem(closeModal);
  const isSaving = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;

  // State for form fields
  const [formData, setFormData] = useState(() => ({
    name: editingItem?.title || '',
    expiration: isoToDateInputValue(editingItem?.expireDate),
    location: editingItem?.location?.id?.toString() || getLastLocationId(),
    quantity: editingItem?.quantity?.toString() || '1',
    unit: editingItem?.unit ?? DEFAULT_UNIT,
  }));

  const [errors, setErrors] = useState(EMPTY_ERRORS);

  // Set by the clicked submit button: keep the modal open for the next product
  const addAnotherRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // A remembered location may have been deleted since
  const selectedLocation = locations.some(
    (loc) => loc.id.toString() === formData.location
  )
    ? formData.location
    : '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, expiration, unit } = formData;
      const quantity = parseQuantity(formData.quantity);

      const newErrors = {
        name: !name.trim() ? t('NameRequired') : '',
        quantity: !isValidQuantity(quantity, unit) ? t('QuantityRequired') : '',
        expiration: !expiration ? t('ExpirationRequired') : '',
        location: !selectedLocation ? t('LocationRequired') : '',
      };

      if (Object.values(newErrors).some(Boolean)) {
        setErrors(newErrors);
        toast.warning(t('PleaseFillAllFields'));
        return;
      }

      const locationObj = locations.find(
        (loc) => loc.id.toString() === selectedLocation
      )!;

      const item: Item = {
        title: name.trim(),
        expireDate: dateInputValueToISO(expiration),
        location: locationObj,
        quantity: roundQuantity(quantity),
        unit,
      };

      if (isEditing && editingItem?.id) {
        updateMutation.mutate({ id: editingItem.id, item });
      } else if (!isEditing) {
        setLastLocationId(locationObj.id);
        const addAnother = addAnotherRef.current;
        createMutation.mutate(item, {
          onSuccess: () => {
            if (!addAnother) {
              closeModal();
              return;
            }
            // Keep location and expiration: consecutive products usually share them
            setFormData((prev) => ({
              ...prev,
              name: '',
              quantity: '1',
              unit: DEFAULT_UNIT,
            }));
            setErrors(EMPTY_ERRORS);
            nameInputRef.current?.focus();
          },
        });
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
  useModalA11y(containerRef, closeModal);

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

  const renderBody = () => {
    if (status === 'pending') {
      return (
        <div
          className="text-fg-muted flex flex-col items-center gap-3 py-10"
          role="status"
        >
          <Loader2 size={32} className="text-primary animate-spin" />
          <p>{t('LoadingLocations')}</p>
        </div>
      );
    }

    if (error || !locations.length) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-fg-secondary">
            {error ? t('ErrorLoadingLocations') : t('NoLocations')}
          </p>
          <Link
            href="/locations"
            onClick={closeModal}
            className={`${UI_CLASSES.buttonPrimary} px-5 py-3`}
          >
            {t('GoToLocations')}
          </Link>
        </div>
      );
    }

    return (
      <form
        data-testid="addItemForm"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        aria-busy={isSaving || undefined}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={UI_CLASSES.label}>
            {t('ProductName')}
          </label>
          <input
            ref={nameInputRef}
            id="name"
            name="name"
            placeholder={t('ProductName')}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={UI_CLASSES.input}
            autoComplete="on"
            autoFocus
            aria-required="true"
            disabled={isSaving}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="quantity" className={UI_CLASSES.label}>
                {t('Quantity')}
              </label>
              {/* Text + decimal keyboard: type="number" rejects a decimal comma in some locales */}
              <input
                id="quantity"
                name="quantity"
                type="text"
                inputMode={formData.unit === 'unit' ? 'numeric' : 'decimal'}
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={UI_CLASSES.input}
                aria-required="true"
                aria-invalid={!!errors.quantity || undefined}
                disabled={isSaving}
              />
            </div>
            <div className="flex w-32 flex-col gap-1.5">
              <label htmlFor="unit" className={UI_CLASSES.label}>
                {tUnits('Label')}
              </label>
              <UnitSelect
                id="unit"
                value={formData.unit}
                onChange={(unit) => handleInputChange('unit', unit)}
                className={`${UI_CLASSES.input} cursor-pointer`}
                disabled={isSaving}
              />
            </div>
          </div>
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiration" className={UI_CLASSES.label}>
            {t('Expiration')}
          </label>
          <ExpirationInput
            id="expiration"
            value={formData.expiration}
            onChange={(value) => handleInputChange('expiration', value)}
            invalid={!!errors.expiration}
            disabled={isSaving}
          />
          {errors.expiration && (
            <p className="mt-1 text-xs text-red-500">{errors.expiration}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className={UI_CLASSES.label}>
            {t('Location')}
          </label>
          <select
            id="location"
            name="location"
            value={selectedLocation}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`${UI_CLASSES.input} cursor-pointer`}
            aria-required="true"
            disabled={isSaving}
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
        <div className="mt-1 flex flex-col justify-end gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={closeModal}
            className="border-surface-overlay text-fg-muted hover:bg-divider hover:text-fg order-3 min-h-[44px] rounded-xl border bg-transparent px-5 py-3 font-medium transition-all duration-150 sm:order-1"
            disabled={isSaving}
          >
            {t('Cancel')}
          </button>
          {!isEditing && (
            <button
              type="submit"
              onClick={() => (addAnotherRef.current = true)}
              className="border-primary/40 text-primary hover:bg-primary/10 order-2 min-h-[44px] rounded-xl border px-5 py-3 font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
            >
              {t('SaveAndAddAnother')}
            </button>
          )}
          <button
            type="submit"
            onClick={() => (addAnotherRef.current = false)}
            className="bg-primary hover:bg-primary-dark text-bg order-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-md transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 sm:order-3"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {isSaving ? t('Saving') : isEditing ? t('UpdateItem') : t('Submit')}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) closeModal();
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
          disabled={isSaving}
        >
          <X size={20} />
        </button>
        <section className="mb-6 flex items-center justify-center gap-2">
          <div
            className={`${isEditing ? 'bg-accent-edit-bg' : 'bg-accent-add-bg'} rounded-xl p-2`}
            aria-hidden="true"
          >
            {isEditing ? (
              <Pencil size={18} className="text-accent-edit" />
            ) : (
              <Plus size={18} className="text-primary" />
            )}
          </div>
          <h2
            id="modal-title"
            className="text-fg text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isEditing ? t('EditItem') : t('AddItem')}
          </h2>
        </section>
        {renderBody()}
      </div>
    </div>
  );
};

export default AddItemModal;
