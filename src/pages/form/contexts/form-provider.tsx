import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContext, type FormContextValue, type AdminCustomerDetails } from "./form-context";
import { customerSchema } from "../schema";
import type { CustomerFormValues } from "../types";
import { defaultValues, stateOptions, cityOptions, existingCustomers } from "../constants";

interface FormProviderProps {
  initialData?: CustomerFormValues;
  onSubmitData?: (data: CustomerFormValues) => void;
  children: ReactNode;
}

export function FormProvider({ initialData, onSubmitData, children }: FormProviderProps) {
  // Merge initialData with defaultValues (initialData takes precedence)
  const formDefaultValues = initialData 
    ? { ...defaultValues, ...initialData }
    : defaultValues;

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { isDirty, isSubmitting, dirtyFields },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: formDefaultValues,
    mode: "onBlur",
  });

  /* ------------------ AUTO POPULATION ------------------ */
  useEffect(() => {
    if (initialData) {
      // Merge with defaults to ensure all fields are populated
      const mergedData = { ...defaultValues, ...initialData };
      reset(mergedData, { keepDefaultValues: false });
    }
  }, [initialData, reset]);

  /* ------------------ STATE MANAGEMENT ------------------ */
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const [showCustomerConfirm, setShowCustomerConfirm] = useState(false);
  const [pendingCountry, setPendingCountry] = useState<string>("");
  const [pendingCustomerId, setPendingCustomerId] = useState<string>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [adminCustomerDetails, setAdminCustomerDetails] = useState<AdminCustomerDetails>({
    name: "",
    age: 0,
    device: "",
    email: "",
  });
  const [isAdminCustomerDirty, setIsAdminCustomerDirty] = useState(false);

  /* ------------------ WATCH FORM FIELDS ------------------ */
  const newsletter = useWatch({ control, name: "newsletter" });
  const country = useWatch({ control, name: "country" });
  const state = useWatch({ control, name: "state" });

  /* ------------------ COMPUTED VALUES ------------------ */
  const isAddressDirty = !!(dirtyFields.state || dirtyFields.city) || undefined;

  const currentStateOptions = useMemo(() => {
    return stateOptions[country as keyof typeof stateOptions] || [];
  }, [country]);

  const currentCityOptions = useMemo(() => {
    if (!country || !state) return [];
    if (country === "IN") {
      return cityOptions.IN[state as keyof typeof cityOptions.IN] || [];
    } else if (country === "US") {
      return cityOptions.US[state as keyof typeof cityOptions.US] || [];
    }
    return [];
  }, [country, state]);

  /* ------------------ AUTO POPULATE ADDRESS HELPERS ------------------ */
  /**
   * Returns default state and city for a given country.
   * Uses the first available state and its first city from constants.
   */
  const getDefaultAddressForCountry = (countryValue: string): { state: string; city: string } => {
    const states = stateOptions[countryValue as keyof typeof stateOptions];
    if (!states || states.length === 0) {
      return { state: "", city: "" };
    }

    const defaultState = states[0].value;

    // Type-safe access to city options based on country
    let stateCities: Array<{ value: string; label: string }> | undefined;
    if (countryValue === "IN") {
      stateCities = cityOptions.IN[defaultState as keyof typeof cityOptions.IN];
    } else if (countryValue === "US") {
      stateCities = cityOptions.US[defaultState as keyof typeof cityOptions.US];
    }

    const defaultCity = stateCities && stateCities.length > 0 ? stateCities[0].value : "";

    return { state: defaultState, city: defaultCity };
  };

  const autoPopulateAddress = (countryValue: string) => {
    const { state, city } = getDefaultAddressForCountry(countryValue);
    if (state) {
      setValue("state", state, { shouldDirty: false });
    }
    if (city) {
      setValue("city", city, { shouldDirty: false });
    }
  };

  const autoPopulateCity = (countryValue: string, stateValue: string) => {
    // Type-safe access to city options based on country
    let stateCities: Array<{ value: string; label: string }> | undefined;
    if (countryValue === "IN") {
      stateCities = cityOptions.IN[stateValue as keyof typeof cityOptions.IN];
    } else if (countryValue === "US") {
      stateCities = cityOptions.US[stateValue as keyof typeof cityOptions.US];
    }

    if (stateCities && stateCities.length > 0) {
      setValue("city", stateCities[0].value, { shouldDirty: false });
    }
  };

  /* ------------------ HANDLERS ------------------ */
  const handleLeave = () => {
    if (isDirty) {
      setShowConfirm(true);
    }
  };

  const handleCountryChange = (newCountry: string, fieldOnChange: (value: string) => void) => {
    // If address is dirty and country was already selected, show confirmation modal
    if (isAddressDirty && country && country !== newCountry) {
      setPendingCountry(newCountry);
      setShowAddressConfirm(true);
    } else {
      // If address is not dirty, allow change and auto-populate
      fieldOnChange(newCountry);
      if (newCountry) {
        autoPopulateAddress(newCountry);
      }
    }
  };

  const handleStateChange = (newState: string, fieldOnChange: (value: string) => void) => {
    fieldOnChange(newState);
    // Auto-populate city when state changes (only if address is not dirty)
    if (country && newState && !dirtyFields.city) {
      autoPopulateCity(country, newState);
    }
  };

  const handleExistingCustomerChange = (newCustomerId: string) => {
    // Check if estimatedQuantity has been modified
    const isEstimatedQuantityDirty = !!dirtyFields.estimatedQuantity;
    
    // If admin customer details are dirty OR estimatedQuantity is dirty, and we're changing customers, show confirmation
    const isChangingCustomer = selectedCustomerId !== newCustomerId;
    const hasDirtyState = isAdminCustomerDirty || isEstimatedQuantityDirty;
    
    // Show modal if:
    // 1. There's dirty state (admin details OR estimatedQuantity changed)
    // 2. We're actually changing customers (not selecting the same one)
    // 3. A customer was already selected (so we have something to lose)
    if (hasDirtyState && isChangingCustomer && selectedCustomerId) {
      setPendingCustomerId(newCustomerId);
      setShowCustomerConfirm(true);
      return; // Early return to prevent immediate change
    }
    
    // No dirty state or no customer selected, proceed with change
    setSelectedCustomerId(newCustomerId);
    if (newCustomerId) {
      const customer = existingCustomers.find((c) => c.id === newCustomerId);
      if (customer) {
        // Auto-populate form fields
        setValue("name", customer.name, { shouldDirty: false });
        setValue("email", customer.email, { shouldDirty: false });
        setValue("age", customer.age, { shouldDirty: false });
        // Set admin customer details
        setAdminCustomerDetails({
          name: customer.name,
          age: customer.age,
          device: customer.device,
          email: customer.email,
        });
        setIsAdminCustomerDirty(false);
      }
    } else {
      setAdminCustomerDetails({
        name: "",
        age: 0,
        device: "",
        email: "",
      });
      setIsAdminCustomerDirty(false);
    }
  };

  const handleCustomerConfirm = () => {
    if (pendingCustomerId) {
      setSelectedCustomerId(pendingCustomerId);
      const customer = existingCustomers.find((c) => c.id === pendingCustomerId);
      if (customer) {
        setValue("name", customer.name, { shouldDirty: false });
        setValue("email", customer.email, { shouldDirty: false });
        setValue("age", customer.age, { shouldDirty: false });
        // Reset estimatedQuantity to default if it was dirty
        if (dirtyFields.estimatedQuantity) {
          setValue("estimatedQuantity", defaultValues.estimatedQuantity, { shouldDirty: false });
        }
        setAdminCustomerDetails({
          name: customer.name,
          age: customer.age,
          device: customer.device,
          email: customer.email,
        });
        setIsAdminCustomerDirty(false);
      }
      setShowCustomerConfirm(false);
      setPendingCustomerId("");
    }
  };

  const handleCustomerCancel = () => {
    setShowCustomerConfirm(false);
    setPendingCustomerId("");
  };

  const handleAddressConfirm = () => {
    if (pendingCountry) {
      const currentValues = getValues();
      const { state: newState, city: newCity } = getDefaultAddressForCountry(pendingCountry);

      // Reset form with updated address values - this clears dirty state
      reset(
        {
          ...currentValues,
          country: pendingCountry,
          state: newState,
          city: newCity,
        },
        { keepDefaultValues: false }
      );

      setShowAddressConfirm(false);
      setPendingCountry("");
    }
  };

  const handleAddressCancel = () => {
    setShowAddressConfirm(false);
    setPendingCountry("");
  };

  /* ------------------ CONTEXT VALUE ------------------ */
  const contextValue: FormContextValue = {
    control,
    isDirty,
    isSubmitting,
    dirtyFields,
    isAddressDirty,
    currentStateOptions,
    currentCityOptions,
    selectedCustomerId,
    adminCustomerDetails,
    isAdminCustomerDirty,
    setSelectedCustomerId,
    setAdminCustomerDetails,
    setIsAdminCustomerDirty,
    onAdminCustomerDetailsChange: (details: AdminCustomerDetails) => {
      setAdminCustomerDetails(details);
      setIsAdminCustomerDirty(true);
    },
    // Form methods
    handleSubmit,
    reset,
    setValue,
    onSubmit: async (data: CustomerFormValues) => {
      await onSubmitData?.(data);
    },
    // Handlers
    handleCountryChange,
    handleStateChange,
    handleExistingCustomerChange,
    handleCustomerConfirm,
    handleCustomerCancel,
    handleAddressConfirm,
    handleAddressCancel,
    handleLeave,
    // Modal state
    showConfirm,
    showAddressConfirm,
    showCustomerConfirm,
    setShowConfirm,
    setShowAddressConfirm,
    setShowCustomerConfirm,
    // Watched values
    newsletter,
    country,
    state,
  };

  return <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>;
}
