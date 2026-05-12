import { useState } from "react";

import Icon from "../components/Icon";

import { callClaude } from "../services/claude";

const ChatPage = ({ notes }) => {
  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hi! I'm your AI study assistant. Ask me anything about your uploaded notes, or pick a topic to explore.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const quickActions = [
    "Summarize all my notes",
    "What are the key concepts?",
    "Explain the hardest topic simply",
    "Generate 5 important questions",
  ];

  const notesContext = notes
    .map(
      (note) =>
        `## ${note.name}\n${note.content}`
    )
    .join("\n\n")
    .slice(0, 12000);

  const sendMessage = async (
    text = input
  ) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setLoading(true);

    try {
      const finalPrompt = `
You are StudyAI, a professional AI study assistant.

Rules:

- If the user asks a normal question, answer it directly professionally.
- DO NOT mention missing notes unless the user specifically asks about uploaded notes.
- If notes are uploaded, use them when relevant.
- If no notes exist, still answer normally using your own knowledge.
- Keep answers clean, structured, and student-friendly.
- Use bullet points when useful.
- Explain concepts clearly and professionally.

UPLOADED NOTES:
${notesContext || "No notes uploaded."}

USER QUESTION:
${text}
`;

      let aiResponse = "";

      await callClaude(
        "You are a helpful AI study assistant.",

        finalPrompt,

        (chunk) => {
          aiResponse = chunk;

          setMessages((prev) => {
            const updated = [
              ...prev,
            ];

            const last =
              updated[
              updated.length - 1
              ];

            if (
              last?.role ===
              "assistant"
            ) {
              updated[
                updated.length - 1
              ] = {
                role: "assistant",
                content: chunk,
              };
            } else {
              updated.push({
                role: "assistant",
                content: chunk,
              });
            }

            return updated;
          });
        }
      );

      if (!aiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "No response from AI.",
          },
        ]);
      }
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-page">
      {/* HEADER */}

      <div className="chat-header">
        <div>
          <h1 className="page-title">
            AI Chat
          </h1>

          <p className="page-sub">
            {notes.length} note
            {notes.length !== 1
              ? "s"
              : ""}{" "}
            loaded
          </p>
        </div>

        <div className="chat-top-actions">
          {quickActions
            .slice(0, 2)
            .map((action, i) => (
              <button
                key={i}
                className="chip"
                onClick={() =>
                  sendMessage(action)
                }
              >
                {action}
              </button>
            ))}
        </div>
      </div>

      {/* CHAT BODY */}

      <div className="chat-messages">
        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`message-row ${msg.role === "user"
                ? "user-row"
                : ""
                }`}
            >
              {msg.role ===
                "assistant" && (
                  <div className="avatar ai">
                    AI
                  </div>
                )}

              <div
                className={`message-bubble ${msg.role ===
                  "user"
                  ? "user"
                  : "assistant"
                  }`}
              >
                {msg.content}
              </div>

              {msg.role ===
                "user" && (
                  <div className="avatar user">
                    U
                  </div>
                )}
            </div>
          )
        )}

        {loading && (
          <div className="message-row">
            <div className="avatar ai">
              AI
            </div>

            <div className="message-bubble assistant">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}

      <div className="chat-bottom">
        <div className="quick-actions">
          {quickActions.map(
            (action, index) => (
              <button
                key={index}
                className="chip"
                onClick={() =>
                  sendMessage(action)
                }
              >
                {action}
              </button>
            )
          )}
        </div>

        <div className="chat-input-box">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything about your notes..."
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                sendMessage();
              }
            }}
          />

          <button
            className="send-btn"
            onClick={() =>
              sendMessage()
            }
            disabled={loading}
          >
            <Icon
              name="send"
              size={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;