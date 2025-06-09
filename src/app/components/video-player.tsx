export function VideoPlayer({ src }: { src: string }) {
  return (
    <iframe
      key={src}
      width="560"
      height="400"
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="rounded-xl shadow-lg w-full max-w-2xl aspect-video"
    ></iframe>
  );
}
