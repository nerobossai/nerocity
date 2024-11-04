import { createGlobalStyle } from "styled-components";
import resolveConfig from "tailwindcss/resolveConfig";

import _tailwindConfig from "../../tailwind.config";

export const tailwindConfig = resolveConfig(_tailwindConfig);
// @ts-ignore
export const defaultBgColor = tailwindConfig?.theme?.colors?.black || "#00000";

const GlobalStyle = createGlobalStyle`
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: black;
  color: white;
}

body p {
  margin: 0;
}

body * {
  box-sizing: border-box;
}
`;
export default GlobalStyle;
