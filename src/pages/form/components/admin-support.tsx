import { Box, Paper, Typography, Divider, TextField } from "@mui/material";
import { useWatch } from "react-hook-form";
import { countryOptions, existingCustomers, formStrings } from "../constants";
import {
  adminPaperStyles,
  adminTitleStyles,
  adminDividerStyles,
  customerSectionTitleStyles,
  customerSectionDividerStyles,
  warningBoxStyles,
  warningTextStyles,
  customerDetailsBoxStyles,
  customerDetailsTitleStyles,
  customerDetailsFieldsContainerStyles,
  customerDetailsRowStyles,
  moneyBoxStyles,
  moneyTitleStyles,
  moneyAmountStyles,
  moneyBreakdownStyles,
  statusSectionTitleStyles,
  statusTextStyles,
  statusWarningStyles,
  statusSuccessStyles,
  statusModifiedStyles,
} from "../styles/admin-support-styles";
import { useFormContext } from "../contexts/form-context";

export function AdminSupport() {
  const {
    control,
    isDirty,
    isAddressDirty,
    currentStateOptions,
    selectedCustomerId,
    adminCustomerDetails,
    isAdminCustomerDirty,
    onAdminCustomerDetailsChange,
  } = useFormContext();
  /* ------------------ SUBSCRIBE TO FORM FIELDS ------------------ */
  // Use useWatch for subscriptions (more efficient for read-only)
  const newsletter = useWatch({ control, name: "newsletter" });
  const country = useWatch({ control, name: "country" });
  const state = useWatch({ control, name: "state" });
  const contacts = useWatch({ control, name: "contacts" });
  const estimatedQuantity = useWatch({ control, name: "estimatedQuantity" }) || 1;

  // Calculate money to take
  const selectedCustomer = existingCustomers.find((c) => c.id === selectedCustomerId);
  const baseAmount = selectedCustomer?.baseAmount || 0;
  const moneyToTake = baseAmount * estimatedQuantity;

  return (
    <Paper elevation={2} sx={adminPaperStyles}>
      <Typography sx={adminTitleStyles}>{formStrings.adminSupport}</Typography>
      <Divider sx={adminDividerStyles} />

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Customer Details Section */}
        {selectedCustomerId && (
          <Box>
            <Typography sx={customerSectionTitleStyles}>{formStrings.customerSection}</Typography>
            <Divider sx={customerSectionDividerStyles} />

            {isAdminCustomerDirty && (
              <Box sx={warningBoxStyles}>
                <Typography sx={warningTextStyles}>
                  {formStrings.customerDetailsModified}
                </Typography>
              </Box>
            )}

            <Box sx={customerDetailsBoxStyles}>
              <Typography sx={customerDetailsTitleStyles}>{formStrings.customerDetails}</Typography>
              <Box sx={customerDetailsFieldsContainerStyles}>
                <Box sx={customerDetailsRowStyles}>
                  <TextField
                    label={formStrings.name}
                    value={adminCustomerDetails.name}
                    onChange={(e) => {
                      onAdminCustomerDetailsChange({
                        ...adminCustomerDetails,
                        name: e.target.value,
                      });
                    }}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label={formStrings.age}
                    type="number"
                    value={adminCustomerDetails.age}
                    onChange={(e) => {
                      onAdminCustomerDetailsChange({
                        ...adminCustomerDetails,
                        age: Number(e.target.value),
                      });
                    }}
                    fullWidth
                    size="small"
                  />
                </Box>
                <Box sx={customerDetailsRowStyles}>
                  <TextField
                    label={formStrings.deviceBought}
                    value={adminCustomerDetails.device}
                    onChange={(e) => {
                      onAdminCustomerDetailsChange({
                        ...adminCustomerDetails,
                        device: e.target.value,
                      });
                    }}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label={formStrings.email}
                    type="email"
                    value={adminCustomerDetails.email}
                    onChange={(e) => {
                      onAdminCustomerDetailsChange({
                        ...adminCustomerDetails,
                        email: e.target.value,
                      });
                    }}
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>

              {/* Money to Take */}
              <Box sx={moneyBoxStyles}>
                <Typography sx={moneyTitleStyles}>{formStrings.moneyToTake}</Typography>
                <Typography sx={moneyAmountStyles}>
                  ₹{moneyToTake.toLocaleString("en-IN")}
                </Typography>
                <Typography sx={moneyBreakdownStyles}>
                  {formStrings.baseAmount}: ₹{baseAmount.toLocaleString("en-IN")} ×{" "}
                  {formStrings.quantity}: {estimatedQuantity}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Form Status */}
        <Box>
          <Typography sx={statusSectionTitleStyles}>{formStrings.formStatus}</Typography>
          <Typography sx={statusTextStyles}>
            {isDirty === true ? (
              <Box component="span" sx={statusWarningStyles}>
                {formStrings.formHasUnsavedChanges}
              </Box>
            ) : (
              <Box component="span" sx={statusSuccessStyles}>
                {formStrings.formIsClean}
              </Box>
            )}
          </Typography>
        </Box>

        {/* Address Information */}
        <Box>
          <Typography sx={statusSectionTitleStyles}>
            {formStrings.addressInformationLabel}
          </Typography>
          <Typography sx={statusTextStyles}>
            {country ? (
              <>
                {formStrings.country}:{" "}
                <strong>
                  {countryOptions.find((opt) => opt.value === country)?.label || country}
                </strong>
                {state && (
                  <>
                    <br />
                    {formStrings.state}:{" "}
                    <strong>
                      {currentStateOptions.find((opt) => opt.value === state)?.label || state}
                    </strong>
                  </>
                )}
                {isAddressDirty && (
                  <Box component="span" sx={statusModifiedStyles}>
                    {formStrings.modified}
                  </Box>
                )}
              </>
            ) : (
              formStrings.noCountrySelected
            )}
          </Typography>
        </Box>

        {/* Contact Count */}
        <Box>
          <Typography sx={statusSectionTitleStyles}>{formStrings.contactCount}</Typography>
          <Typography sx={statusTextStyles}>
            {contacts?.length || 0} {formStrings.contactsAdded}
          </Typography>
        </Box>

        {/* Newsletter Subscription */}
        <Box>
          <Typography sx={statusSectionTitleStyles}>
            {formStrings.newsletterSubscription}
          </Typography>
          <Typography sx={statusTextStyles}>
            {newsletter ? (
              <Box component="span" sx={statusSuccessStyles}>
                {formStrings.subscribed}
              </Box>
            ) : (
              <Box component="span" sx={statusTextStyles}>
                {formStrings.notSubscribed}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
