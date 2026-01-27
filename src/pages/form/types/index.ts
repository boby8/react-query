export type ContactType = "phone" | "email";

export interface Contact {
  type: ContactType;
  value: string;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  age: number;
  country: string;
  state: string;
  city: string;
  estimatedQuantity: number;
  newsletter: boolean;
  company: {
    name?: string;
    role?: string;
  };
  contacts: Contact[];
}

export interface ExistingCustomer {
  id: string;
  name: string;
  age: number;
  device: string;
  email: string;
  baseAmount: number;
}
