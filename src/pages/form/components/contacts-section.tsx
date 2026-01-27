import {
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Controller, useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { CustomerFormValues } from "../types";
import { contactTypeOptions, formStrings } from "../constants";
import {
  contactsSectionBoxStyles,
  contactsHeaderBoxStyles,
  contactsTitleStyles,
  contactsDividerStyles,
  noContactsTextStyles,
  contactsListStyles,
  contactCardStyles,
  contactRowStyles,
  contactTypeSelectStyles,
  deleteButtonStyles,
  contactErrorStyles,
} from "../styles/contacts-section-styles";

interface ContactsSectionProps {
  control: Control<CustomerFormValues>;
}

export function ContactsSection({ control }: ContactsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={contactsSectionBoxStyles}>
      <Box sx={contactsHeaderBoxStyles}>
        <Typography sx={contactsTitleStyles}>
          {formStrings.contactInformation}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => append({ type: "phone", value: "" })}
          size="small"
        >
          {formStrings.addContact}
        </Button>
      </Box>
      <Divider sx={contactsDividerStyles} />

      {fields.length === 0 ? (
        <Typography sx={noContactsTextStyles}>
          {formStrings.noContactsAdded}
        </Typography>
      ) : (
        <Box sx={contactsListStyles}>
          {fields.map((field, index) => (
            <Card sx={contactCardStyles} key={field.id}>
              <CardContent>
                <Box sx={contactRowStyles}>
                  <Controller
                    name={`contacts.${index}.type`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl sx={contactTypeSelectStyles} error={!!error}>
                        <InputLabel>{formStrings.type}</InputLabel>
                        <Select {...field} label={formStrings.type} variant="outlined">
                          {contactTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography sx={contactErrorStyles}>
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name={`contacts.${index}.value`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        label={formStrings.contactValue}
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />

                  <IconButton
                    color="error"
                    onClick={() => handleRemove(index)}
                    sx={deleteButtonStyles}
                    aria-label="delete contact"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
