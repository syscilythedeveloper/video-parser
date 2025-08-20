export default function Footer() {
  return (
    <footer className=" bg-purple-900/40 border-t border-white/10 py-8 text-center text-sm text-gray-800">
      <p>
        © 2025 VidSense AI — Built by{" "}
        <span className="font-medium text-white">Syscily Brown</span>
      </p>
      <div className="mt-3 flex justify-center gap-4">
        <a
          target="_blank"
          href="https://github.com/syscilythedeveloper/video-parser"
          className="hover:text-white transition"
        >
          GitHub
        </a>
        <a
          target="_blank"
          href="https://www.linkedin.com/in/syscilybrown"
          className="hover:text-white transition"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
