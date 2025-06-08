export function VideoPlayer({ src }: { src: string }) {
  return (
    <iframe
      key={src} // This ensures React remounts the iframe when src changes
      width="560"
      height="315"
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded-xl shadow-lg w-full max-w-2xl aspect-video"
    ></iframe>
  );
}
