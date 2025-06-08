export function timeFormatter(timestamp) {
  const timeAsNumber = timestamp
    .split(":")
    .reduce((acc, time) => acc * 60 + parseInt(time), 0);

  return timeAsNumber;
}

export default function handleVideoDisplay(timestamp, videoId) {
  const timeAsNumber = timeFormatter(timestamp);

  const new_src = `https://www.youtube.com/embed/${
    videoId
  }?start=${timeAsNumber}&autoplay=1&mute=0`;
  console.log("New YouTube embed link:", new_src);
  return new_src;
}
