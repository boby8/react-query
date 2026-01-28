import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormSelect } from "../../components";
import { formStrings } from "../../constants";
import {
  sectionBoxStyles,
  sectionTitleStyles,
  sectionDividerStyles,
  fieldRowStyles,
  fieldBoxStyles,
  errorMessageStyles,
} from "../../styles";
import { useFormContext } from "../../contexts/form-context";

export function AddressSection() {
  const { control, currentStateOptions, currentCityOptions, handleStateChange } = useFormContext();

  return (
    <Box sx={sectionBoxStyles}>
      <Typography sx={sectionTitleStyles}>{formStrings.addressInformation}</Typography>
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
                  {error && <Typography sx={errorMessageStyles}>{error.message}</Typography>}
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
  );
}
