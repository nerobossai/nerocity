import { Text, VStack } from "@chakra-ui/react";

function timeDifference(current: number, previous: number) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) return `${Math.round(elapsed / 1000)} seconds ago`;
  if (elapsed < msPerHour)
    return `${Math.round(elapsed / msPerMinute)} minutes ago`;
  if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)} hours ago`;
  return `${Math.round(elapsed / msPerDay)} days ago`;
}

function CreatedAtComponent({
  timeStamp,
  noHeader = false,
  fontSize = "14px",
  alignItems = "flex-end",
}: {
  timeStamp: number;
  noHeader?: boolean;
  fontSize?: string;
  alignItems?: string;
}) {
  const date = new Date(timeStamp);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <VStack alignItems={alignItems} gap="1px">
      {!noHeader && (
        <Text fontSize="12px" color="text.100">
          CREATED
        </Text>
      )}
      <Text fontSize={fontSize}>{timeDifference(Date.now(), timeStamp)}</Text>
      <Text fontSize="12px" color="text.100">
        {formattedTime}
      </Text>
      <Text fontSize="12px" color="text.100">
        {formattedDate}
      </Text>
    </VStack>
  );
}

export default CreatedAtComponent;
