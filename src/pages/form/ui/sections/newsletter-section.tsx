import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { formStrings } from "../../constants";
import { sectionBoxStyles } from "../../styles";
import { useFormContext } from "../../contexts/form-context";

export function NewsletterSection() {
  const { control } = useFormContext();

  return (
    <Box sx={sectionBoxStyles}>
      <Controller
        name="newsletter"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} size="medium" />}
            label={
              <Typography variant="body1" fontWeight={500}>
                {formStrings.subscribeNewsletter}
              </Typography>
            }
          />
        )}
      />
    </Box>
  );
}
