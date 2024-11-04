import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define a custom variant
const customVariant = definePartsStyle(() => {
  return {
    tab: {
      // fontWeight: 600,
      color: "white",
      borderColor: "white",
      borderWidth: "1px",
      // bg: "gray.100",
      paddingLeft: "2rem",
      paddingRight: "2rem",
      borderRadius: "0rem",
      _selected: {
        bg: "white",
        color: "black",
      },
    },
  };
});

const variants = {
  custom: customVariant,
};

// export the component theme
export const tabsTheme = defineMultiStyleConfig({ variants });
