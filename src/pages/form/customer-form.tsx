import {
  Checkbox,
  Button,
  Box,
  FormControlLabel,
  Container,
  Paper,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";
import {
  ConfirmLeaveSnackbar,
  ConfirmAddressOverrideSnackbar,
  ConfirmCustomerOverrideSnackbar,
} from "./confirmations";
import { FormTextField, FormSelect, ContactsSection, AdminSupport } from "./components";
import { countryOptions, existingCustomers, formStrings } from "./constants";
import {
  containerStyles,
  paperStyles,
  headerBoxStyles,
  titleStyles,
  unsavedChangesStyles,
  subtitleStyles,
  sectionBoxStyles,
  sectionTitleStyles,
  sectionDividerStyles,
  fieldRowStyles,
  fieldBoxStyles,
  buttonContainerStyles,
  submitButtonStyles,
  errorMessageStyles,
} from "./styles";
import { FormProvider } from "./contexts/form-provider";
import { useFormContext } from "./contexts/form-context";
import type { CustomerFormValues } from "./types";

interface Props {
  initialData?: CustomerFormValues;
  onSubmitData?: (data: CustomerFormValues) => void;
}

function CustomerFormContent() {
  const {
    control,
    isDirty,
    isSubmitting,
    currentStateOptions,
    currentCityOptions,
    selectedCustomerId,
    handleSubmit,
    onSubmit,
    handleCountryChange,
    handleStateChange,
    handleExistingCustomerChange,
    handleLeave,
    handleCustomerConfirm,
    handleCustomerCancel,
    handleAddressConfirm,
    handleAddressCancel,
    showConfirm,
    showAddressConfirm,
    showCustomerConfirm,
    setShowConfirm,
    newsletter,
  } = useFormContext();

  return (
    <Container maxWidth="md" sx={containerStyles}>
      <Paper elevation={3} sx={paperStyles}>
        <Box sx={headerBoxStyles}>
          <Typography sx={titleStyles}>
            {formStrings.title}
          </Typography>
          {isDirty && (
            <Typography sx={unsavedChangesStyles}>
              {formStrings.unsavedChanges}
            </Typography>
          )}
        </Box>
        <Typography sx={subtitleStyles}>
          {formStrings.subtitle}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Basic Information Section */}
          <Box sx={sectionBoxStyles}>
            <Typography sx={sectionTitleStyles}>
              {formStrings.basicInformation}
            </Typography>
            <Divider sx={sectionDividerStyles} />

            <Box display="flex" flexDirection="column" gap={3}>
              {/* Existing Customers Dropdown */}
              <Box>
                <Controller
                  name="name"
                  control={control}
                  render={() => (
                    <FormControl fullWidth>
                      <InputLabel>{formStrings.existingCustomers}</InputLabel>
                      <Select
                        value={selectedCustomerId}
                        label={formStrings.existingCustomers}
                        variant="outlined"
                        onChange={(e) => handleExistingCustomerChange(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>{formStrings.none}</em>
                        </MenuItem>
                        {existingCustomers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={fieldRowStyles}>
                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="name"
                    control={control}
                    label={formStrings.fullName}
                  />
                </Box>

                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="email"
                    control={control}
                    label={formStrings.emailAddress}
                    type="email"
                  />
                </Box>
              </Box>

              <Box sx={fieldRowStyles}>
                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="age"
                    control={control}
                    label={formStrings.age}
                    type="number"
                    inputProps={{ min: 18 }}
                    transform={(value) => Number(value)}
                  />
                </Box>

                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="estimatedQuantity"
                    control={control}
                    label={formStrings.estimatedQuantity}
                    type="number"
                    inputProps={{ min: 0.0001, step: 0.0001 }}
                    transform={(value) => Number(value)}
                  />
                </Box>
              </Box>

              <Box display="flex" gap={3} flexDirection={{ xs: "column", md: "row" }}>
                <Box flex={1}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>{formStrings.country}</InputLabel>
                        <Select
                          {...field}
                          label={formStrings.country}
                          variant="outlined"
                          value={field.value || ""}
                          onChange={(e) => {
                            const newValue = e.target.value as string;
                            handleCountryChange(newValue, field.onChange);
                          }}
                        >
                          {countryOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography sx={errorMessageStyles}>
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Address Section */}
          <Box sx={sectionBoxStyles}>
            <Typography sx={sectionTitleStyles}>
              {formStrings.addressInformation}
            </Typography>
            <Divider sx={sectionDividerStyles} />

            <Box display="flex" flexDirection="column" gap={3}>
              <Box sx={fieldRowStyles}>
                <Box sx={fieldBoxStyles}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>{formStrings.state}</InputLabel>
                        <Select
                          {...field}
                          label={formStrings.state}
                          variant="outlined"
                          onChange={(e) => {
                            const newValue = e.target.value as string;
                            handleStateChange(newValue, field.onChange);
                          }}
                        >
                          {currentStateOptions?.map((option: { value: string; label: string }) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography sx={errorMessageStyles}>
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                <Box sx={fieldBoxStyles}>
                  <FormSelect
                    name="city"
                    control={control}
                    label={formStrings.city}
                    options={currentCityOptions || []}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Newsletter Section */}
          <Box sx={sectionBoxStyles}>
            <Controller
              name="newsletter"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body1" fontWeight={500}>
                      {formStrings.subscribeNewsletter}
                    </Typography>
                  }
                />
              )}
            />
          </Box>

          {/* Company Information Section (Conditional) */}
          {newsletter && (
            <Box sx={sectionBoxStyles}>
              <Typography sx={sectionTitleStyles}>
                {formStrings.companyInformation}
              </Typography>
              <Divider sx={sectionDividerStyles} />

              <Box sx={fieldRowStyles}>
                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="company.name"
                    control={control}
                    label={formStrings.companyName}
                  />
                </Box>
                <Box sx={fieldBoxStyles}>
                  <FormTextField
                    name="company.role"
                    control={control}
                    label={formStrings.role}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Contacts Section */}
          <ContactsSection control={control} />

          {/* Action Buttons */}
          <Divider sx={{ my: 3 }} />
          <Box sx={buttonContainerStyles}>
            <Button
              variant="outlined"
              onClick={handleLeave}
              size="large"
            >
              {formStrings.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              size="large"
              sx={submitButtonStyles}
            >
              {isSubmitting ? formStrings.saving : formStrings.save}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Admin Support Section */}
      <AdminSupport />

      {/* Dirty confirmation */}
      <ConfirmLeaveSnackbar
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
        }}
      />

      {/* Address override confirmation */}
      <ConfirmAddressOverrideSnackbar
        open={showAddressConfirm}
        onCancel={handleAddressCancel}
        onConfirm={handleAddressConfirm}
      />

      {/* Customer override confirmation */}
      <ConfirmCustomerOverrideSnackbar
        open={showCustomerConfirm}
        onCancel={handleCustomerCancel}
        onConfirm={handleCustomerConfirm}
      />
    </Container>
  );
}

export function CustomerForm({ initialData, onSubmitData }: Props) {
  return (
    <FormProvider initialData={initialData} onSubmitData={onSubmitData}>
      <CustomerFormContent />
    </FormProvider>
  );
}

export default CustomerForm;
