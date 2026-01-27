import type { CustomerFormValues } from "../types";

const defaultValues: CustomerFormValues = {
    name: "",
    email: "",
    age: 18,
    country: "",
    state: "",
    city: "",
    estimatedQuantity: 1,
    newsletter: false,
    company: {
      name: "",
      role: "",
    },
    contacts: [],
  };

const existingCustomers = [
  {
    id: "1",
    name: "Bobby",
    age: 28,
    device: "iPhone 15 Pro",
    email: "bobby@example.com",
    baseAmount: 100000,
  },
  {
    id: "2",
    name: "Alice",
    age: 32,
    device: "Samsung Galaxy S24",
    email: "alice@example.com",
    baseAmount: 150000,
  },
  {
    id: "3",
    name: "Charlie",
    age: 25,
    device: "MacBook Pro",
    email: "charlie@example.com",
    baseAmount: 200000,
  },
];
  
  const countryOptions = [
    { value: "IN", label: "India" },
    { value: "US", label: "USA" },
  ];
  
  const stateOptions = {
    IN: [
      { value: "UP", label: "Uttar Pradesh" },
      { value: "MH", label: "Maharashtra" },
      { value: "DL", label: "Delhi" },
      { value: "KA", label: "Karnataka" },
    ],
    US: [
      { value: "CA", label: "California" },
      { value: "NY", label: "New York" },
      { value: "TX", label: "Texas" },
      { value: "FL", label: "Florida" },
    ],
  };
  
  const cityOptions = {
    IN: {
      UP: [{ value: "Lucknow", label: "Lucknow" }, { value: "Kanpur", label: "Kanpur" }],
      MH: [{ value: "Mumbai", label: "Mumbai" }, { value: "Pune", label: "Pune" }],
      DL: [{ value: "New Delhi", label: "New Delhi" }],
      KA: [{ value: "Bangalore", label: "Bangalore" }, { value: "Mysore", label: "Mysore" }],
    },
    US: {
      CA: [{ value: "Los Angeles", label: "Los Angeles" }, { value: "San Francisco", label: "San Francisco" }],
      NY: [{ value: "New York City", label: "New York City" }, { value: "Buffalo", label: "Buffalo" }],
      TX: [{ value: "Houston", label: "Houston" }, { value: "Austin", label: "Austin" }],
      FL: [{ value: "Miami", label: "Miami" }, { value: "Orlando", label: "Orlando" }],
    },
  };

  const contactTypeOptions = [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
  ];

  export { defaultValues, countryOptions, stateOptions, cityOptions, existingCustomers, contactTypeOptions };