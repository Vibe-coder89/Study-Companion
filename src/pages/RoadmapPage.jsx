import { useState } from "react";

import Icon from "../components/Icon";

import { callClaudeJSON } from "../services/claude";

const RoadmapPage = ({ notes }) => {
  const [topic, setTopic] = useState("");

  const [days, setDays] =
    useState(7);

  const [roadmap, setRoadmap] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const context = notes
    .map((n) => n.content)
    .join("\n")
    .slice(0, 3000);

  const generate = async () => {
    setLoading(true);

    setRoadmap([]);

    try {
      const data =
        await callClaudeJSON(
          "You are an expert study planner.",

          `
Create a detailed exam preparation roadmap.

Subject:
${topic}

Days until exam:
${days}

Study material:
${context}

Return ONLY valid JSON:

{
  "roadmap": [
    {
      "day": "Day 1",
      "title": "...",
      "description": "..."
    }
  ]
}
`
        );

      setRoadmap(
        data.roadmap || []
      );
    } catch (err) {
      console.log(err);

      alert(
        "Failed to generate roadmap."
      );
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="gradient-badge">
          AI Study Planner
        </div>

        <h1 className="page-title">
          Study Roadmap
        </h1>

        <p className="page-sub">
          AI-generated exam preparation plan
          tailored for you
        </p>
      </div>

      {roadmap.length === 0 &&
        !loading && (
          <div className="card">
            <div className="label">
              Subject / Exam
            </div>

            <input
              className="input"
              placeholder="e.g. Operating Systems, UPSC History, Data Structures..."
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              style={{
                marginBottom: 24,
              }}
            />

            <div className="label">
              Days Until Exam
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 30,
              }}
            >
              {[3, 7, 14, 30].map(
                (d) => (
                  <button
                    key={d}
                    className={`chip ${
                      days === d
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setDays(d)
                    }
                  >
                    {d} days
                  </button>
                )
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={generate}
            >
              <Icon
                name="map"
                size={16}
              />
              Generate Roadmap
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
            Building your roadmap...
          </div>
        </div>
      )}

      {roadmap.length > 0 &&
        !loading && (
          <div>
            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                marginBottom: 24,
              }}
            >
              <div className="tag tag-blue">
                {roadmap.length} Steps
              </div>

              <button
                className="btn btn-ghost"
                onClick={() =>
                  setRoadmap([])
                }
              >
                Reset
              </button>
            </div>

            <div className="card">
              {roadmap.map(
                (step, index) => (
                  <div
                    key={index}
                    className="roadmap-step"
                  >
                    <div className="roadmap-dot">
                      {index + 1}
                    </div>

                    <div className="roadmap-content">
                      <div
                        className="roadmap-title"
                      >
                        {step.day} —{" "}
                        {step.title}
                      </div>

                      <div
                        className="roadmap-desc"
                      >
                        {
                          step.description
                        }
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default RoadmapPage;