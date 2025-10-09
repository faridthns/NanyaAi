import { useState, useEffect, useRef } from "react";
import "./App.css";
import { reqGroqAi } from "./utils/groq";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // atau style lain
// import { Light as SyntaxHighlight } from "react-syntax-highlighter";
// import { lucario } from "react-syntax-highlighter/dist/cjs/styles/prism";

function App() {
  const [content, setContent] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setData("");
    setLoading(true);
    try {
      const ai = await reqGroqAi(content, chat);

      setData(ai);
      setChat((prevChat) => [...prevChat, { ask: content, answer: ai }]);
      setContent("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setData("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData("");
    setChat([]);
  };

  // biar lansgung scroll ke pertanyaan baru
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <main className={`flex flex-col ${chat.length > 0 ? "h-full" : null}`}>
      <section className="flex flex-col min-h-[90vh] justify-center items-center w-full mx-auto pt-5">
        {/* theme controller */}
        <div className="absolute top-0 right-0 p-3">
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="autumn"
            />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
        <h1 className="text-4xl animate-jump animate-twice">NanyaAI</h1>
        {data && (
          <div className="divider text-xs">
            NanyaAi dapat membuat kesalahan, jadi periksa lagi responsnya
          </div>
        )}
        <div className="md:w-4xl mx-auto">
          {chat.length > 0 ? (
            <div className="mb-[60px]">
              {chat.map((item, index) => (
                <div key={index}>
                  <div className="chat chat-end">
                    <div className="chat-bubble bg-accent">{item.ask}</div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble bg-neutral">
                      <div className="prose prose-invert max-w-none leading-relaxed text-start">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {item.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="divider"></div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          ) : null}
        </div>
        <div
          className={`${
            chat.length > 0 ? "fixed bottom-0 h-[60px] backdrop-blur-[5px]" : "h-fit"
          } mt-4 py-2 w-full`}
        >
          <form
            className="flex flex-row gap-4 md:w-xl w-xs mx-auto animate-fade-up animate-once"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="input w-full"
              placeholder="Kalo mau nanya disini yaa..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-active btn-accent hover:btn-primary py-2 px-4 font-bold rounded-md cursor-pointer"
            >
              {loading ? (
                <span className="loading loading-infinity loading-xl"></span>
              ) : (
                "Kirim"
              )}
            </button>
          </form>
        </div>
      </section>
      {chat.length > 0 ? (
        <div
          className="fixed bottom-2 right-4 border rounded-full p-3 flex gap-2 text-base-content cursor-pointer hover:bg-base-content hover:text-neutral sm:flex hidden"
          onClick={handleReset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentcolor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>Clear</span>
        </div>
      ) : (
        <footer className="footer sm:footer-horizontal footer-center text-base-content p-4 h-[10vh]">
          <aside>
            <p>Copyright © {new Date().getFullYear()} - Nanya mulu beli kaga</p>
          </aside>
        </footer>
      )}
    </main>
  );
}

export default App;
