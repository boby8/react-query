import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormTextField } from "../../components";
import { countryOptions, existingCustomers, formStrings } from "../../constants";
import {
  sectionBoxStyles,
  sectionTitleStyles,
  sectionDividerStyles,
  fieldRowStyles,
  fieldBoxStyles,
  errorMessageStyles,
} from "../../styles";
import { useFormContext } from "../../contexts/form-context";

function CountrySelectRow() {
  const { control, handleCountryChange } = useFormContext();

  return (
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
              {error && <Typography sx={errorMessageStyles}>{error.message}</Typography>}
            </FormControl>
          )}
        />
      </Box>
    </Box>
  );
}

export function BasicInformationSection() {
  const { control, selectedCustomerId, handleExistingCustomerChange } = useFormContext();

  return (
    <Box sx={sectionBoxStyles}>
      <Typography sx={sectionTitleStyles}>{formStrings.basicInformation}</Typography>
      <Divider sx={sectionDividerStyles} />

      <Box display="flex" flexDirection="column" gap={3}>
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
            <FormTextField name="name" control={control} label={formStrings.fullName} />
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

        <CountrySelectRow />
      </Box>
    </Box>
  );
}
