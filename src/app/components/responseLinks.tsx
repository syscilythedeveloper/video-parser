export const renderContentWithTimestamps = (
  content: string,
  videoId: string,
  onTimestampClick: (timestamp: string) => void
) => {
  // Split content by timestamp pattern and rebuild with React elements
  console.log("Content received for rendering:", content);

  const parts = content.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);
  console.log("Split parts:", parts);

  return parts.map((part, idx) => {
    const timestampMatch = part.match(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/);

    if (timestampMatch) {
      const timestamp = timestampMatch[1];
      return (
        <button
          key={idx}
          onClick={() =>
            //console.log(`THE BUTTON WAS CLICKED WITH TIMESTAMP ${timestamp}`)
            onTimestampClick(timestamp)
          } // Replace with actual video seek logic
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
