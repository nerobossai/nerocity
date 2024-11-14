const SubscriptText = ({ value }: { value: string }) => {
  const isExponential = value?.toLowerCase().includes("e");

  let formattedValue = value;
  let beforeSubscript = "";
  let subscriptDigit = "";
  let afterSubscript = "";

  if (isExponential) {
    formattedValue = Number(value)
      .toFixed(20)
      .replace(/\.?0+$/, "");
  }

  if (!value) {
    return null;
  }
  const valueNum = parseFloat(formattedValue);
  if (valueNum < 0.1 && valueNum !== 0) {
    const [whole, decimal] = formattedValue.split(".");
    const firstNonZeroIndex = decimal?.search(/[1-9]/);
    beforeSubscript = decimal?.slice(0, firstNonZeroIndex) ?? "";
    subscriptDigit = decimal?.charAt(firstNonZeroIndex ?? 0) ?? "";
    afterSubscript = decimal?.slice((firstNonZeroIndex ?? 0) + 1) ?? "";

    return (
      <span>
        ${whole}.{beforeSubscript}
        <span style={{ verticalAlign: "sub", fontSize: "0.8em" }}>
          {subscriptDigit}
        </span>
        {afterSubscript}
      </span>
    );
  }

  return <span>${value}</span>;
};

export default SubscriptText;
