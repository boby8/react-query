import type { SxProps, Theme } from "@mui/material";

// Paper styles
export const adminPaperStyles: SxProps<Theme> = {
  elevation: 2,
  p: 3,
};

export const adminTitleStyles: SxProps<Theme> = {
  variant: "h5",
  component: "h2",
  gutterBottom: true,
  fontWeight: 600,
};

export const adminDividerStyles: SxProps<Theme> = {
  mb: 3,
};

// Customer section styles
export const customerSectionTitleStyles: SxProps<Theme> = {
  variant: "h6",
  gutterBottom: true,
  fontWeight: 500,
};

export const customerSectionDividerStyles: SxProps<Theme> = {
  mb: 2,
};

// Warning box styles
export const warningBoxStyles: SxProps<Theme> = {
  p: 1.5,
  mb: 2,
  bgcolor: "warning.light",
  borderRadius: 1,
  border: "1px solid",
  borderColor: "warning.main",
};

export const warningTextStyles: SxProps<Theme> = {
  variant: "caption",
  color: "warning.dark",
};

// Customer details box styles
export const customerDetailsBoxStyles: SxProps<Theme> = {
  p: 2,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
};

export const customerDetailsTitleStyles: SxProps<Theme> = {
  variant: "subtitle2",
  fontWeight: 500,
  gutterBottom: true,
};

export const customerDetailsFieldsContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  mt: 1,
};

export const customerDetailsRowStyles: SxProps<Theme> = {
  display: "flex",
  gap: 2,
  flexDirection: { xs: "column", sm: "row" },
};

// Money to take box styles
export const moneyBoxStyles: SxProps<Theme> = {
  mt: 2,
  p: 2,
  bgcolor: "primary.light",
  borderRadius: 1,
};

export const moneyTitleStyles: SxProps<Theme> = {
  variant: "subtitle2",
  fontWeight: 600,
  gutterBottom: true,
};

export const moneyAmountStyles: SxProps<Theme> = {
  variant: "h6",
  fontWeight: 700,
};

export const moneyBreakdownStyles: SxProps<Theme> = {
  variant: "caption",
  color: "text.secondary",
};

// Status section styles
export const statusSectionTitleStyles: SxProps<Theme> = {
  variant: "subtitle1",
  fontWeight: 500,
  gutterBottom: true,
};

export const statusTextStyles: SxProps<Theme> = {
  variant: "body2",
  color: "text.secondary",
};

export const statusWarningStyles: SxProps<Theme> = {
  color: "warning.main",
};

export const statusSuccessStyles: SxProps<Theme> = {
  color: "success.main",
};

export const statusModifiedStyles: SxProps<Theme> = {
  color: "warning.main",
  ml: 1,
};
