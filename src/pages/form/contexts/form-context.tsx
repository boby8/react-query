import { createContext, useContext } from "react";
import type { Control, FieldNamesMarkedBoolean, UseFormSetValue } from "react-hook-form";
import type { CustomerFormValues } from "../types";

export interface AdminCustomerDetails {
  name: string;
  age: number;
  device: string;
  email: string;
}

export interface FormContextValue {
  // Form control
  control: Control<CustomerFormValues>;
  
  // Form state
  isDirty: boolean;
  isSubmitting: boolean;
  dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<CustomerFormValues>>>;
  
  // Address state
  isAddressDirty: boolean | undefined;
  currentStateOptions: Array<{ value: string; label: string }>;
  currentCityOptions: Array<{ value: string; label: string }>;
  
  // Admin support state
  selectedCustomerId: string;
  adminCustomerDetails: AdminCustomerDetails;
  isAdminCustomerDirty: boolean;
  
  // Setters
  setSelectedCustomerId: (id: string) => void;
  setAdminCustomerDetails: (details: AdminCustomerDetails) => void;
  setIsAdminCustomerDirty: (dirty: boolean) => void;
  onAdminCustomerDetailsChange: (details: AdminCustomerDetails) => void;
  
  // Form methods (for CustomerForm to use)
  handleSubmit: (onSubmit: (data: CustomerFormValues) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  reset: (values?: Partial<CustomerFormValues>, options?: { keepDefaultValues?: boolean }) => void;
  setValue: UseFormSetValue<CustomerFormValues>;
  onSubmit: (data: CustomerFormValues) => Promise<void>;
  
  // Handlers for CustomerForm
  handleCountryChange: (newCountry: string, fieldOnChange: (value: string) => void) => void;
  handleStateChange: (newState: string, fieldOnChange: (value: string) => void) => void;
  handleExistingCustomerChange: (newCustomerId: string) => void;
  handleCustomerConfirm: () => void;
  handleCustomerCancel: () => void;
  handleAddressConfirm: () => void;
  handleAddressCancel: () => void;
  handleLeave: () => void;
  
  // Modal state
  showConfirm: boolean;
  showAddressConfirm: boolean;
  showCustomerConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
  setShowAddressConfirm: (show: boolean) => void;
  setShowCustomerConfirm: (show: boolean) => void;
  
  // Watched values
  newsletter: boolean;
  country: string;
  state: string;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
