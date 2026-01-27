import type { SxProps, Theme } from "@mui/material";

// Container styles
export const containerStyles: SxProps<Theme> = {
  py: 4,
};

// Paper styles
export const paperStyles: SxProps<Theme> = {
  elevation: 3,
  p: 4,
};

// Header styles
export const headerBoxStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const titleStyles: SxProps<Theme> = {
  variant: "h4",
  component: "h1",
  fontWeight: 600,
};

export const unsavedChangesStyles: SxProps<Theme> = {
  variant: "caption",
  color: "warning.main",
  fontStyle: "italic",
};

export const subtitleStyles: SxProps<Theme> = {
  variant: "body2",
  color: "text.secondary",
  mb: 4,
};

// Section styles
export const sectionBoxStyles: SxProps<Theme> = {
  mb: 4,
};

export const sectionTitleStyles: SxProps<Theme> = {
  variant: "h6",
  gutterBottom: true,
  fontWeight: 500,
};

export const sectionDividerStyles: SxProps<Theme> = {
  mb: 3,
};

// Form field container styles
export const fieldRowStyles: SxProps<Theme> = {
  display: "flex",
  gap: 3,
  flexDirection: { xs: "column", md: "row" },
};

export const fieldBoxStyles: SxProps<Theme> = {
  flex: 1,
};

// Button styles
export const buttonContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
};

export const submitButtonStyles: SxProps<Theme> = {
  minWidth: 120,
};

// Error message styles
export const errorMessageStyles: SxProps<Theme> = {
  variant: "caption",
  color: "error",
  mt: 0.5,
  ml: 1.75,
};
