import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: string;
  fullWidth?: boolean;
  required?: boolean;
  inputProps?: TextFieldProps["inputProps"];
  transform?: (value: string) => number | string;
}

export function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  fullWidth = true,
  required = false,
  inputProps,
  transform,
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          label={label}
          type={type}
          {...field}
          onChange={(e) => {
            const value = transform ? transform(e.target.value) : e.target.value;
            field.onChange(value);
          }}
          fullWidth={fullWidth}
          required={required}
          variant="outlined"
          inputProps={inputProps}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
