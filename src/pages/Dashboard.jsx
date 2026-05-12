import { useState } from "react";

import Icon from "../components/Icon";

export default function Dashboard({
    notes,
    setPage,
}) {
    const [selectedNote, setSelectedNote] =
        useState(null);

    return (
        <div className="page">
            {/* HEADER */}

            <div className="page-header">
                <div className="gradient-badge">
                    Welcome Back
                </div>

                <h1 className="page-title">
                    Your Study Dashboard
                </h1>

                <p className="page-sub">
                    Pick up where you left off
                    or start something new.
                </p>
            </div>

            {/* STATS */}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <Icon
                            name="upload"
                            size={26}
                        />
                    </div>

                    <h2>{notes.length}</h2>

                    <p>Notes Uploaded</p>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        <Icon
                            name="book"
                            size={26}
                        />
                    </div>

                    <h2>{notes.length}</h2>

                    <p>Topics Studied</p>
                </div>

                <div className="stat-card">
                    <div className="stat-icon cyan">
                        <Icon
                            name="brain"
                            size={26}
                        />
                    </div>

                    <h2>{notes.length}</h2>

                    <p>AI Sessions</p>
                </div>
            </div>

            {/* FEATURES */}

            <div className="feature-grid">
                <div
                    className="feature-card"
                    onClick={() =>
                        setPage("chat")
                    }
                >
                    <div className="feature-icon">
                        <Icon
                            name="chat"
                            size={24}
                        />
                    </div>

                    <div>
                        <h3>
                            Chat with Notes
                        </h3>

                        <p>
                            Ask questions directly
                            from your uploaded
                            study material.
                        </p>
                    </div>
                </div>

                <div
                    className="feature-card"
                    onClick={() =>
                        setPage("quiz")
                    }
                >
                    <div className="feature-icon">
                        <Icon
                            name="quiz"
                            size={24}
                        />
                    </div>

                    <div>
                        <h3>
                            Quiz Generator
                        </h3>

                        <p>
                            Create AI-generated
                            quizzes instantly.
                        </p>
                    </div>
                </div>

                <div
                    className="feature-card"
                    onClick={() =>
                        setPage("flashcards")
                    }
                >
                    <div className="feature-icon">
                        <Icon
                            name="flashcards"
                            size={24}
                        />
                    </div>

                    <div>
                        <h3>Flashcards</h3>

                        <p>
                            Revise using active
                            recall flashcards.
                        </p>
                    </div>
                </div>

                <div
                    className="feature-card"
                    onClick={() =>
                        setPage("summary")
                    }
                >
                    <div className="feature-icon">
                        <Icon
                            name="file"
                            size={24}
                        />
                    </div>

                    <div>
                        <h3>AI Summarizer</h3>

                        <p>
                            Generate summaries,
                            revision notes, and
                            explanations.
                        </p>
                    </div>
                </div>
            </div>

            {/* SAVED NOTES */}

            <div
                className="card"
                style={{
                    marginTop: 30,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        marginBottom: 24,
                    }}
                >
                    <h2
                        style={{
                            fontSize: 30,
                        }}
                    >
                        Saved Notes
                    </h2>

                    <button
                        className="btn"
                        onClick={() =>
                            setPage("upload")
                        }
                    >
                        Upload Notes
                    </button>
                </div>

                {notes.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            color:
                                "var(--text2)",
                        }}
                    >
                        <div
                            style={{
                                opacity: 0.4,
                                marginBottom: 20,
                            }}
                        >
                            <Icon
                                name="upload"
                                size={60}
                            />
                        </div>

                        <h2
                            style={{
                                marginBottom: 12,
                            }}
                        >
                            No notes yet
                        </h2>

                        <p>
                            Upload study material
                            to get started.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gap: 16,
                        }}
                    >
                        {notes.map(
                            (
                                note,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="saved-note"

                                    onClick={() =>
                                        setSelectedNote(
                                            note
                                        )
                                    }

                                    style={{
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",

                                            gap: 18,

                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <div className="note-icon">
                                            <Icon
                                                name="file"
                                                size={22}
                                            />
                                        </div>

                                        <div>
                                            <a
                                                href={note.fileURL}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    fontWeight: 700,
                                                    marginBottom: 6,
                                                    fontSize: 18,
                                                    color: "white",
                                                    textDecoration: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {note.name}
                                            </a>

                                            <div
                                                style={{
                                                    color:
                                                        "var(--text2)",

                                                    fontSize: 14,
                                                }}
                                            >
                                                {
                                                    note.content
                                                        ?.length
                                                }{" "}
                                                characters
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* NOTE VIEWER */}

            {selectedNote && (
                <div
                    className="card"
                    style={{
                        marginTop: 28,
                    }}
                >
                    <div
                        style={{
                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom: 22,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 30,
                            }}
                        >
                            {selectedNote.name}
                        </h2>

                        <button
                            className="delete-btn"
                            onClick={() =>
                                setSelectedNote(
                                    null
                                )
                            }
                        >
                            ×
                        </button>
                    </div>

                    <div
                        style={{
                            whiteSpace:
                                "pre-wrap",

                            lineHeight: 1.8,

                            color:
                                "var(--text2)",

                            fontSize: 15,

                            maxHeight:
                                "500px",

                            overflowY:
                                "auto",
                        }}
                    >
                        {
                            selectedNote.content
                        }
                    </div>
                </div>
            )}
        </div>
    );
}