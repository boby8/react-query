import type { SxProps, Theme } from "@mui/material";

export const contactsSectionBoxStyles: SxProps<Theme> = {
  mb: 4,
};

export const contactsHeaderBoxStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const contactsTitleStyles: SxProps<Theme> = {
  variant: "h6",
  fontWeight: 500,
};

export const contactsDividerStyles: SxProps<Theme> = {
  mb: 3,
};

export const noContactsTextStyles: SxProps<Theme> = {
  variant: "body2",
  color: "text.secondary",
  textAlign: "center",
  py: 3,
};

export const contactsListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const contactCardStyles: SxProps<Theme> = {
  variant: "outlined",
};

export const contactRowStyles: SxProps<Theme> = {
  display: "flex",
  gap: 2,
  alignItems: "flex-start",
};

export const contactTypeSelectStyles: SxProps<Theme> = {
  minWidth: 120,
};

export const deleteButtonStyles: SxProps<Theme> = {
  mt: 1,
};

export const contactErrorStyles: SxProps<Theme> = {
  variant: "caption",
  color: "error",
  mt: 0.5,
  ml: 1.75,
};
