import { Container, Paper } from "@mui/material";
import { ContactsSection, AdminSupport } from "../components";
import { containerStyles, paperStyles } from "../styles";
import { useFormContext } from "../contexts/form-context";
import type { CustomerFormValues } from "../types";
import { HeaderSection } from "./sections/header-section";
import { BasicInformationSection } from "./sections/basic-information-section";
import { AddressSection } from "./sections/address-section";
import { NewsletterSection } from "./sections/newsletter-section";
import { CompanySection } from "./sections/company-section";
import { ActionsSection } from "./sections/actions-section";
import { FormSnackbars } from "./sections/form-snackbars";

export interface Props {
  initialData?: CustomerFormValues;
  onSubmitData?: (data: CustomerFormValues) => void;
}
export function CustomerFormContent() {
  const { handleSubmit, onSubmit, control } = useFormContext();

  return (
    <Container maxWidth="md" sx={containerStyles}>
      <Paper elevation={3} sx={paperStyles}>
        <HeaderSection />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <BasicInformationSection />
          <AddressSection />
          <NewsletterSection />
          <CompanySection />
          <ContactsSection control={control} />
          <ActionsSection />
        </form>
      </Paper>

      <AdminSupport />
      <FormSnackbars />
    </Container>
  );
}

export default CustomerFormContent;
