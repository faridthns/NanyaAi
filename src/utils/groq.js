import { Groq } from "groq-sdk";

const ai_api = import.meta.env.VITE_API_KEYS;
const groq = new Groq({
    apiKey: ai_api,
    dangerouslyAllowBrowser: true,
});

export const reqGroqAi = async (content, chat = []) => {
    const messages = [
        {
        role: "system",
        content:
            "Kamu adalah asisten AI bernama NanyaAI yang ramah dan responsif. Jawab dengan bahasa yang mudah dipahami.",
        },
        ...chat.flatMap((item) => [
        { role: "user", content: item.ask },
        { role: "assistant", content: item.answer },
        ]),
        { role: "user", content },
    ];

    const reply = await groq.chat.completions.create({
        model: "moonshotai/kimi-k2-instruct",
        messages,
    });
    return reply.choices[0].message.content;
};
