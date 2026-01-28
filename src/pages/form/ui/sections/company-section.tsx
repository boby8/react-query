import { Box, Divider, Typography } from "@mui/material";
import { FormTextField } from "../../components";
import { formStrings } from "../../constants";
import {
  sectionBoxStyles,
  sectionTitleStyles,
  sectionDividerStyles,
  fieldRowStyles,
  fieldBoxStyles,
} from "../../styles";
import { useFormContext } from "../../contexts/form-context";

export function CompanySection() {
  const { control, newsletter } = useFormContext();

  if (!newsletter) return null;

  return (
    <Box sx={sectionBoxStyles}>
      <Typography sx={sectionTitleStyles}>{formStrings.companyInformation}</Typography>
      <Divider sx={sectionDividerStyles} />

      <Box sx={fieldRowStyles}>
        <Box sx={fieldBoxStyles}>
          <FormTextField name="company.name" control={control} label={formStrings.companyName} />
        </Box>
        <Box sx={fieldBoxStyles}>
          <FormTextField name="company.role" control={control} label={formStrings.role} />
        </Box>
      </Box>
    </Box>
  );
}
