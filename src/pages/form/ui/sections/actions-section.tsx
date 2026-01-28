import { Box, Button, Divider } from "@mui/material";
import { formStrings } from "../../constants";
import { buttonContainerStyles, submitButtonStyles } from "../../styles";
import { useFormContext } from "../../contexts/form-context";

export function ActionsSection() {
  const { handleLeave, isSubmitting } = useFormContext();

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Box sx={buttonContainerStyles}>
        <Button variant="outlined" onClick={handleLeave} size="large">
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
    </>
  );
}
