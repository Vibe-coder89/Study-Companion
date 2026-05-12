import { useState } from "react";

import Icon from "../components/Icon";

import { callClaudeJSON } from "../services/claude";

const QuizPage = ({ notes }) => {
  const [topic, setTopic] = useState("");

  const [difficulty, setDifficulty] =
    useState("medium");

  const [quiz, setQuiz] = useState(null);

  const [current, setCurrent] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [done, setDone] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [answered, setAnswered] =
    useState(false);

  const context = notes
    .map((n) => n.content)
    .join("\n")
    .slice(0, 3000);

  const generate = async () => {
    setLoading(true);

    setQuiz(null);

    setCurrent(0);

    setScore(0);

    setDone(false);

    setSelected(null);

    setAnswered(false);

    try {
      const data =
        await callClaudeJSON(
          "You are an educational quiz generator.",

          `
Generate 5 MCQ questions.

Difficulty: ${difficulty}

Topic: ${topic || "General"}

Use this study material:
${context}

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "...",
      "options": [
        "A",
        "B",
        "C",
        "D"
      ],
      "answer": 0,
      "explanation": "..."
    }
  ]
}
`
        );

      setQuiz(data.questions || []);
    } catch (err) {
      console.log(err);

      alert("Quiz generation failed.");
    }

    setLoading(false);
  };

  const pick = (index) => {
    if (answered) return;

    setSelected(index);

    setAnswered(true);

    if (
      index ===
      quiz[current].answer
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (current + 1 >= quiz.length) {
      setDone(true);

      return;
    }

    setCurrent((prev) => prev + 1);

    setSelected(null);

    setAnswered(false);
  };

  const q = quiz?.[current];

  return (
    <div className="page">
      <div className="page-header">
        <div className="gradient-badge">
          AI Quiz System
        </div>

        <h1 className="page-title">
          Quiz Generator
        </h1>

        <p className="page-sub">
          Test your knowledge with AI-generated
          questions
        </p>
      </div>

      {!quiz && !loading && (
        <div className="card">
          <div className="label">
            Topic (Optional)
          </div>

          <input
            className="input"
            placeholder="e.g. Photosynthesis, World War 2, React Hooks..."
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value)
            }
            style={{ marginBottom: 22 }}
          />

          <div className="label">
            Difficulty
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 30,
            }}
          >
            {[
              "easy",
              "medium",
              "hard",
            ].map((d) => (
              <button
                key={d}
                className={`chip ${
                  difficulty === d
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setDifficulty(d)
                }
                style={{
                  textTransform:
                    "capitalize",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={generate}
          >
            <Icon name="zap" size={16} />
            Generate Quiz
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
            Generating your quiz...
          </div>
        </div>
      )}

      {quiz && !done && q && (
        <div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((current + 1) /
                    quiz.length) *
                  100
                }%`,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",

              marginBottom: 20,

              color: "var(--text2)",
            }}
          >
            <span>
              Question {current + 1} /{" "}
              {quiz.length}
            </span>

            <span className="tag tag-blue">
              Score: {score}
            </span>
          </div>

          <div className="card">
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.5,
                marginBottom: 30,
              }}
            >
              {q.question}
            </div>

            {q.options.map(
              (option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${
                    answered
                      ? "disabled"
                      : ""
                  }

                  ${
                    answered &&
                    selected === index
                      ? index ===
                        q.answer
                        ? "selected correct"
                        : "selected wrong"
                      : ""
                  }

                  ${
                    answered &&
                    index === q.answer
                      ? "reveal-correct"
                      : ""
                  }
                  `}
                  onClick={() =>
                    pick(index)
                  }
                >
                  <span
                    style={{
                      fontWeight: 700,
                      marginRight: 10,
                    }}
                  >
                    {String.fromCharCode(
                      65 + index
                    )}
                    .
                  </span>

                  {option}
                </div>
              )
            )}

            {answered && (
              <div
                style={{
                  marginTop: 22,

                  padding: 18,

                  borderRadius: 12,

                  background:
                    "rgba(108,142,245,0.08)",

                  color:
                    "var(--text2)",
                }}
              >
                <span
                  style={{
                    color:
                      "var(--accent)",

                    fontWeight: 700,
                  }}
                >
                  Explanation:
                </span>{" "}
                {q.explanation}
              </div>
            )}
          </div>

          {answered && (
            <button
              className="btn btn-primary"
              style={{
                marginTop: 20,
              }}
              onClick={next}
            >
              {current + 1 >=
              quiz.length
                ? "See Results"
                : "Next Question"}

              <Icon
                name="arrow"
                size={16}
              />
            </button>
          )}
        </div>
      )}

      {done && (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "60px",
          }}
        >
          <div className="score-ring">
            <div className="score-num">
              {score}/{quiz.length}
            </div>

            <div
              style={{
                color: "var(--text2)",
                fontSize: 12,
              }}
            >
              Final Score
            </div>
          </div>

          <h2
            style={{
              fontFamily:
                "'Syne', sans-serif",

              marginBottom: 10,
            }}
          >
            {score >= 4
              ? "Excellent Work 🏆"
              : score >= 2
              ? "Good Job 👍"
              : "Keep Practicing 📚"}
          </h2>

          <p
            style={{
              color: "var(--text2)",
              marginBottom: 24,
            }}
          >
            You scored{" "}
            {Math.round(
              (score /
                quiz.length) *
                100
            )}
            %
          </p>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",

              gap: 12,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={generate}
            >
              <Icon
                name="refresh"
                size={16}
              />
              New Quiz
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuiz(null);

                setDone(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;