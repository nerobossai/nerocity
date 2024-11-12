import { Text } from "@chakra-ui/react";

const SubscriptText = ({
  value,
  label = "",
}: {
  value: string;
  label?: String;
}) => {
  console.log("vv", value);
  const isExponential = value.toLowerCase().includes("e");

  let formattedValue = value;
  let beforeSubscript = "";
  let subscriptDigit = "";
  let afterSubscript = "";

  if (isExponential) {
    // Convert exponential value to a decimal string with enough precision
    formattedValue = Number(value)
      .toFixed(20)
      .replace(/\.?0+$/, ""); // Remove trailing zeros
  }

  const valueNum = parseFloat(formattedValue);
  console.log("vvvvvv", valueNum);
  if (valueNum < 0.1 && valueNum !== 0) {
    const [whole, decimal] = formattedValue.split(".");
    const firstNonZeroIndex = decimal?.search(/[1-9]/);
    beforeSubscript = decimal?.slice(0, firstNonZeroIndex) ?? "";
    subscriptDigit = decimal?.charAt(firstNonZeroIndex ?? 0) ?? "";
    afterSubscript = decimal?.slice((firstNonZeroIndex ?? 0) + 1) ?? "";

    return (
      <Text fontSize="12px" fontWeight="bold" color="green.50">
        {label} ${whole}.{beforeSubscript}
        <span style={{ verticalAlign: "sub", fontSize: "0.8em" }}>
          {subscriptDigit}
        </span>
        {afterSubscript}
      </Text>
    );
  }

  return (
    <Text fontSize="12px" fontWeight="bold" color="green.50">
      {label} ${value}
    </Text>
  );
};

export default SubscriptText;
