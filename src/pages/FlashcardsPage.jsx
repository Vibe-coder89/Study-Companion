import { useState } from "react";

import Icon from "../components/Icon";

import { callClaudeJSON } from "../services/claude";

const FlashcardsPage = ({ notes }) => {
  const [topic, setTopic] = useState("");

  const [cards, setCards] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [current, setCurrent] =
    useState(0);

  const [flipped, setFlipped] =
    useState(false);

  const context = notes
    .map((n) => n.content)
    .join("\n")
    .slice(0, 3000);

  const generate = async () => {
    setLoading(true);

    setCards([]);

    setCurrent(0);

    setFlipped(false);

    try {
      const data =
        await callClaudeJSON(
          "You are an AI flashcard generator.",

          `
Generate 8 study flashcards.

Topic:
${topic || "General Study"}

Study material:
${context}

Return ONLY valid JSON:

{
  "cards": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}
`
        );

      setCards(data.cards || []);
    } catch (err) {
      console.log(err);

      alert(
        "Failed to generate flashcards."
      );
    }

    setLoading(false);
  };

  const next = () => {
    if (current < cards.length - 1) {
      setCurrent((prev) => prev + 1);

      setFlipped(false);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);

      setFlipped(false);
    }
  };

  const card = cards[current];

  return (
    <div className="page">
      <div className="page-header">
        <div className="gradient-badge">
          AI Flashcards
        </div>

        <h1 className="page-title">
          Flashcards
        </h1>

        <p className="page-sub">
          Active recall with beautiful flip
          cards
        </p>
      </div>

      {cards.length === 0 &&
        !loading && (
          <div className="card">
            <div className="label">
              Topic
            </div>

            <input
              className="input"
              placeholder="e.g. Cell Biology, French Revolution, JavaScript..."
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              style={{
                marginBottom: 22,
              }}
            />

            <button
              className="btn btn-primary"
              onClick={generate}
            >
              <Icon
                name="cards"
                size={16}
              />
              Generate Flashcards
            </button>
          </div>
        )}

      {loading && (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <div
            className="spin"
            style={{
              display: "inline-block",
              marginBottom: 18,
              color: "var(--accent)",
            }}
          >
            <Icon
              name="loader"
              size={38}
            />
          </div>

          <div
            style={{
              color: "var(--text2)",
            }}
          >
            Creating flashcards...
          </div>
        </div>
      )}

      {cards.length > 0 &&
        !loading && (
          <div>
            {/* TOP BAR */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                marginBottom: 20,
              }}
            >
              <div className="tag tag-blue">
                Card {current + 1} /{" "}
                {cards.length}
              </div>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  setCards([]);
                  setCurrent(0);
                }}
              >
                Reset
              </button>
            </div>

            {/* FLASHCARD */}

            <div
              className="flashcard-scene"
              onClick={() =>
                setFlipped(!flipped)
              }
            >
              <div
                className={`flashcard-inner ${
                  flipped
                    ? "flipped"
                    : ""
                }`}
              >
                {/* FRONT */}

                <div className="flashcard-face flashcard-front">
                  <div
                    className="gradient-badge"
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    Question
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      lineHeight: 1.5,
                      maxWidth: 700,
                    }}
                  >
                    {card.question}
                  </div>

                  <div
                    style={{
                      marginTop: 30,

                      color:
                        "var(--text2)",

                      fontSize: 13,
                    }}
                  >
                    Click to flip
                  </div>
                </div>

                {/* BACK */}

                <div className="flashcard-face flashcard-back">
                  <div
                    className="gradient-badge"
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    Answer
                  </div>

                  <div
                    style={{
                      fontSize: 22,
                      lineHeight: 1.8,
                      maxWidth: 700,
                    }}
                  >
                    {card.answer}
                  </div>

                  <div
                    style={{
                      marginTop: 30,

                      color:
                        "var(--text2)",

                      fontSize: 13,
                    }}
                  >
                    Click to flip back
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "center",

                gap: 14,

                marginTop: 28,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={prev}
                disabled={current === 0}
              >
                <Icon
                  name="arrow-left"
                  size={16}
                />
                Previous
              </button>

              <button
                className="btn btn-primary"
                onClick={() =>
                  setFlipped(!flipped)
                }
              >
                <Icon
                  name="refresh"
                  size={16}
                />
                Flip Card
              </button>

              <button
                className="btn btn-ghost"
                onClick={next}
                disabled={
                  current ===
                  cards.length - 1
                }
              >
                Next
                <Icon
                  name="arrow"
                  size={16}
                />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default FlashcardsPage;