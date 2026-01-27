import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be at least 18"),
  country: z.string(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  estimatedQuantity: z.number().min(0.0001, "Quantity must be at least 0.0001"),
  newsletter: z.boolean(),
  company: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
  }),
  contacts: z.array(
    z.object({
      type: z.enum(["phone", "email"]),
      value: z.string().min(5, "Too short"),
    })
  ),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
