export const renderContentWithTimestamps = (
  content: string,

  onTimestampClick: (timestamp: string) => void,
) => {
  console.log("Content received for rendering:", content);

  const parts = content.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);

  return parts.map((part, idx) => {
    const timestampMatch = part.match(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/);

    if (timestampMatch) {
      const timestamp = timestampMatch[1];
      return (
        <button
          key={idx}
          onClick={() => onTimestampClick(timestamp)}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "2px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "inherit",
            margin: "0 2px",
          }}
        >
          {timestamp}
        </button>
      );
    }

    return part;
  });
};
