import { FormProvider } from "../contexts/form-provider";
import { CustomerFormContent, type Props } from "./customer-form";

export function CustomerForm({ initialData, onSubmitData }: Props) {
  return (
    <FormProvider initialData={initialData} onSubmitData={onSubmitData}>
      <CustomerFormContent />
    </FormProvider>
  );
}

export default CustomerForm;
