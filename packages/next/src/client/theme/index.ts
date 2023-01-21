import { extendTheme, theme as baseTheme } from "@chakra-ui/react";
import * as components from "./components";
import * as foundations from "./foundations";

const brown = {
  50: "#EFEBE9",
  100: "#D7CCC8",
  200: "#BCAAA4",
  300: "#A1887F",
  400: "#8D6E63",
  500: "#795548",
  600: "#6D4C41",
  700: "#5D4037",
  800: "#4E342E",
  900: "#3E2723",
};

export const theme: Record<string, any> = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  ...foundations,
  components: { ...components },
  colors: {
    ...baseTheme.colors,
    brown,
    brand: brown,
  },
  space: {
    "4.5": "1.125rem",
  },
});
