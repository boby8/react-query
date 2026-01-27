import { Snackbar, Alert, Button, Box } from "@mui/material";
import { formStrings } from "../constants";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmLeaveSnackbar({
  open,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={null}
    >
      <Alert
        severity="warning"
        action={
          <Box display="flex" gap={1}>
            <Button color="inherit" size="small" onClick={onCancel}>
              {formStrings.cancel}
            </Button>
            <Button color="error" size="small" onClick={onConfirm} variant="contained">
              {formStrings.leave}
            </Button>
          </Box>
        }
        sx={{ width: "100%" }}
      >
        {formStrings.leaveConfirmationMessage}
      </Alert>
    </Snackbar>
  );
}
