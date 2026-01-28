import {
  ConfirmAddressOverrideSnackbar,
  ConfirmCustomerOverrideSnackbar,
  ConfirmLeaveSnackbar,
} from "../../confirmations";
import { useFormContext } from "../../contexts/form-context";

export function FormSnackbars() {
  const {
    showConfirm,
    showAddressConfirm,
    showCustomerConfirm,
    setShowConfirm,
    handleAddressCancel,
    handleAddressConfirm,
    handleCustomerCancel,
    handleCustomerConfirm,
  } = useFormContext();

  return (
    <>
      <ConfirmLeaveSnackbar
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
        }}
      />

      <ConfirmAddressOverrideSnackbar
        open={showAddressConfirm}
        onCancel={handleAddressCancel}
        onConfirm={handleAddressConfirm}
      />

      <ConfirmCustomerOverrideSnackbar
        open={showCustomerConfirm}
        onCancel={handleCustomerCancel}
        onConfirm={handleCustomerConfirm}
      />
    </>
  );
}
