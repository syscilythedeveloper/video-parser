# Video Parser

Video Parser is a web app that generates a **timestamped summary** of any YouTube video and lets you **chat with an AI agent** about its content. Ask questions about the video, and the AI will answer with relevant timestamps. Clicking any timestamp (in the summary or chat) will automatically jump the video to that point.

---

## Features

- 🎬 **YouTube Video Analysis**: Enter a YouTube URL to get a detailed, timestamped summary.
- 🤖 **AI Chat**: Ask questions about the video; the AI answers with context and timestamps.
- ⏱️ **Timestamp Navigation**: Click any timestamp to jump the video player to that moment.
- 📋 **Clean, Responsive UI**: Modern design with Material UI and Tailwind CSS.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React 19)
- **UI:** [Material UI (MUI)](https://mui.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Generative AI](https://ai.google.dev/) (`@google/generative-ai`)
- **YouTube Transcript API:** [RapidAPI](https://rapidapi.com/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Animation:** [react-type-animation](https://www.npmjs.com/package/react-type-animation)
- **Formatting:** [Prettier](https://prettier.io/)
- **Linting:** [ESLint](https://eslint.org/)
- **Type Checking:** [TypeScript](https://www.typescriptlang.org/)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/video-parser.git
   cd video-parser
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add:

   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```

   > Get your API keys from [Google AI Studio](https://aistudio.google.com/app/apikey) and [RapidAPI](https://rapidapi.com/).

4. **Run the development server:**

   ```sh
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Paste a YouTube URL** into the input field.
2. Click **"Analyze Video"**.
3. View the **timestamped summary**.
4. **Chat with the AI** about the video—ask about topics, events, or details.
5. **Click any timestamp** in the summary or chat to jump the video to that moment.

---

## API Endpoints

- `POST /api/video-analysis`
  - **Body:** `{ videoId: string }`
  - **Returns:** `{ summary: { topics: [{ timestamp, topic, ... }] } }`
- `POST /api/chat`
  - **Body:** Chat history, user question, and topics
  - **Returns:** AI-generated answer with relevant timestamps

---

## Project Structure

- `/src/app/components/Chat/chatbox.tsx` — Chat UI and logic
- `/src/app/components/video-player.tsx` — Video player component
- `/src/app/api/video-analysis/route.ts` — Video summary API
- `/src/app/api/chat/route.ts` — AI chat API

---

## Contributing

Pull requests welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## Demo

https://video-parser-hazel.vercel.app/
