import { createTheme } from "@mui/material";

export const themeColors = {
  bgDefault: "#030504",
  bgPaper: "#08110c",
  textPrimary: "#b9ffd2",
  textSecondary: "#8ac9a3"
} as const;

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: themeColors.bgDefault,
      paper: themeColors.bgPaper
    },
    text: {
      primary: themeColors.textPrimary,
      secondary: themeColors.textSecondary
    }
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Consolas", monospace',
    h5: {
      fontSize: "2rem",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
