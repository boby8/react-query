import { Box, Typography } from "@mui/material";
import { formStrings } from "../../constants";
import { headerBoxStyles, titleStyles, unsavedChangesStyles, subtitleStyles } from "../../styles";
import { useFormContext } from "../../contexts/form-context";

export function HeaderSection() {
  const { isDirty } = useFormContext();

  return (
    <>
      <Box sx={headerBoxStyles}>
        <Typography sx={titleStyles}>{formStrings.title}</Typography>
        {isDirty && <Typography sx={unsavedChangesStyles}>{formStrings.unsavedChanges}</Typography>}
      </Box>
      <Typography sx={subtitleStyles}>{formStrings.subtitle}</Typography>
    </>
  );
}
