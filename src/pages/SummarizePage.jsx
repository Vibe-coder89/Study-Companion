import { useState } from "react";

import Icon from "../components/Icon";

import { callClaude } from "../services/claude";

const SummarizePage = ({ notes }) => {
  const [mode, setMode] =
    useState("summarize");

  const [customPrompt, setCustomPrompt] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [selectedNote, setSelectedNote] =
    useState("all");

  const modes = [
    {
      id: "summarize",
      label: "Summarize",
    },

    {
      id: "eli5",
      label: "ELI5 Explain",
    },

    {
      id: "viva",
      label: "Viva Questions",
    },

    {
      id: "revision",
      label: "Quick Revision",
    },
  ];

  const context =
    selectedNote === "all"
      ? notes
          .map(
            (n) =>
              `## ${n.name}\n${n.content}`
          )
          .join("\n\n")
          .slice(0, 6000)

      : `## ${
          notes[
            Number(selectedNote)
          ]?.name
        }\n${
          notes[
            Number(selectedNote)
          ]?.content
        }`;

  const prompts = {
    summarize:
      "Summarize these notes in concise bullet points.",

    eli5:
      "Explain these notes like I'm a beginner student.",

    viva:
      "Generate viva questions and answers from these notes.",

    revision:
      "Create quick revision notes with key concepts and formulas.",
  };

  const generate = async () => {
    if (
      notes.length === 0 &&
      !customPrompt.trim()
    ) {
      alert(
        "Upload notes or add custom text first."
      );

      return;
    }

    setLoading(true);

    setResponse("");

    const finalPrompt = `
${customPrompt || prompts[mode]}

NOTES:
${context}
`;

    try {
      await callClaude(
        "You are an expert AI study assistant.",

        finalPrompt,

        (chunk) => {
          setResponse(chunk);
        }
      );
    } catch (err) {
      console.log(err);

      setResponse(
        "Something went wrong."
      );
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="gradient-badge">
          AI Learning Tools
        </div>

        <h1 className="page-title">
          AI Summarizer
        </h1>

        <p className="page-sub">
          Multiple AI-powered study tools in
          one place
        </p>
      </div>

      {/* SETTINGS */}

      <div
        className="card"
        style={{
          marginBottom: 24,
        }}
      >
        <div className="label">
          Mode
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {modes.map((m) => (
            <button
              key={m.id}
              className={`chip ${
                mode === m.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setMode(m.id)
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* NOTE SELECTOR */}

        <div className="label">
          Select Notes
        </div>

        <select
          className="input"
          value={selectedNote}
          onChange={(e) =>
            setSelectedNote(
              e.target.value
            )
          }

          style={{
            marginBottom: 24,
          }}
        >
          <option value="all">
            Summarize All Notes
          </option>

          {notes.map(
            (note, index) => (
              <option
                key={index}
                value={index}
              >
                {note.name}
              </option>
            )
          )}
        </select>

        <div className="label">
          Custom Prompt (Optional)
        </div>

        <textarea
          className="input textarea"
          placeholder="Add custom instructions, or leave blank to use the selected mode..."
          value={customPrompt}
          onChange={(e) =>
            setCustomPrompt(
              e.target.value
            )
          }
          style={{
            minHeight: 120,
            marginBottom: 24,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spin">
                  <Icon
                    name="loader"
                    size={16}
                  />
                </div>

                Generating...
              </>
            ) : (
              <>
                <Icon
                  name="zap"
                  size={16}
                />

                {mode === "summarize"
                  ? "Summarize"
                  : "Generate"}
              </>
            )}
          </button>

          <span
            style={{
              color: "var(--text3)",
              fontSize: 13,
            }}
          >
            {notes.length > 0
              ? `${notes.length} notes loaded`
              : "Upload notes first, or enter custom content above"}
          </span>
        </div>
      </div>

      {/* OUTPUT */}

      {(response || loading) && (
        <div className="card">
          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily:
                  "'Syne', sans-serif",

                fontSize: 22,
              }}
            >
              AI Response
            </div>

            <div className="tag tag-blue">
              {mode.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.9,
              color: "var(--text2)",
              fontSize: 15,
            }}
          >
            {response}

            {loading && (
              <span className="pulse" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarizePage;