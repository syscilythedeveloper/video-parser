export default function timeFormatter(timestamp) {
  const timeAsNumber = timestamp
    .split(":")
    .reduce((acc, time) => acc * 60 + parseInt(time), 0);

  return timeAsNumber;
}
