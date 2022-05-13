import { createTheme, experimental_sx as sx } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#5348dc",
    },
    secondary: {
      main: "#64bb79",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#F5F5F5",
    },
  },
  typography: {
    h1: { fontSize: "1.2rem" },
    h2: { fontSize: "1rem" },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 6 } },
    },
    MuiTextField: {
      styleOverrides: { root: {} },
      defaultProps: { InputProps: { sx: { borderRadius: 2 } } },
    },
    MuiButtonGroup: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 6 } },
    },
    MuiTypography: {},
  },
});

export default theme;
