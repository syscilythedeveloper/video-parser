import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const transcript = await req.json();

    const topics = transcript[transcript.length - 1].topics;

    const topicsString = topics
      .map(
        (t: {
          timestamp: string;
          topic: string;
          description?: string;
          keywords: string;
        }) =>
          `[${t.timestamp}] ${t.topic}${t.description ? ": " + t.description : ""}${t.keywords ? " (Keywords: " + t.keywords + ")" : ""}`,
      )
      .join("\n");

    const userQuestion = transcript[1].content;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `You are a helpful AI assistant. Use the following topics and their timestampes as your knowledge base : ${topicsString}.

            Use the topics to answer the user's question: ${userQuestion}. The user may ask about specific topics, events, or details mentioned in the topics.

            Provide the associated timestamp for each topic in your response. If the user asks a question that is not covered by the topics, politely inform them that that the video doesn't answer that directly.

       


           INSTRUCTIONS:
          1. Find the most relevant topic(s) from the provided knowledge base
          2. Identify the timestamp(s) associated with those topic(s)
          3. Provide a comprehensive answer based on the topic content
          4. Create a natural, flowing summary of the most relevant information
          5. Weave timestamps naturally into the narrative (e.g., "the video explains X at 02:30")
          6. If the question is not covered by the topics, politely inform the user that the video doesn't answer that directly, but you can provide a general answer based on the topics provided.
          7. If the question is not related to the topics, politely inform the user of the main topics covered in the video and suggest they ask a question related to those topics.
          8. Return only the response in a natural, conversational tone, as if you were speaking to a user. Do not add timestamps at the end. There should only be 1 timestamp in each timestamp array.

        

        Example response format:
            "The video discusses the topic of 'Artificial Intelligence' at [01:15], where it explains the basics of AI. It also covers 'Machine Learning' at [02:30], detailing how machines learn from data. If you have any other questions, feel free to ask!"
    `;
    const result = await model.generateContent([prompt]);
    const aiResponse = result.response.text();

    return new Response(aiResponse, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      "Our AI agent is overloaded at the moment. Please try again later",
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
  }
}
