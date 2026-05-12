import { useRef, useState } from "react";

import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

import Icon from "../components/Icon";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function UploadPage({
  notes = [],
  setNotes,
}) {
  const fileRef = useRef();

  const [title, setTitle] =
    useState("");

  const [text, setText] =
    useState("");

  const extractPDFText = async (
    file
  ) => {
    const arrayBuffer =
      await file.arrayBuffer();

    const pdf =
      await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

    let fullText = "";

    for (
      let i = 1;
      i <= pdf.numPages;
      i++
    ) {
      const page =
        await pdf.getPage(i);

      const content =
        await page.getTextContent();

      const strings =
        content.items.map(
          (item) => item.str
        );

      fullText +=
        strings.join(" ") + "\n";
    }

    return fullText;
  };

  const extractDOCXText =
    async (file) => {
      const arrayBuffer =
        await file.arrayBuffer();

      const result =
        await mammoth.extractRawText({
          arrayBuffer,
        });

      return result.value;
    };

  const handleFiles = async (
    files
  ) => {
    const uploaded = [];

    for (const file of files) {
      try {
        let content = "";

        /* TXT + MD */

        if (
          file.name.endsWith(".txt") ||
          file.name.endsWith(".md")
        ) {
          content =
            await file.text();
        }

        /* PDF */

        else if (
          file.name.endsWith(".pdf")
        ) {
          content =
            await extractPDFText(
              file
            );
        }

        /* DOCX */

        else if (
          file.name.endsWith(".docx")
        ) {
          content =
            await extractDOCXText(
              file
            );
        }

        /* PPT */

        else if (
          file.name.endsWith(".ppt") ||
          file.name.endsWith(".pptx")
        ) {
          content =
            "PPT parsing requires backend support.";
        }

        else {
          alert(
            "Unsupported file type"
          );

          continue;
        }

        /* EMPTY TEXT FIX */

        if (
          !content ||
          !content.trim()
        ) {
          content =
            "Could not extract text from this file.";
        }

        uploaded.push({
          name: file.name,

          content,

          fileURL:
            URL.createObjectURL(
              file
            ),

          type: file.type,
        });
      }

      catch (err) {
        console.log(err);

        uploaded.push({
          name: file.name,

          content:
            "Error reading file.",

          fileURL:
            URL.createObjectURL(
              file
            ),

          type: file.type,
        });
      }
    }

    setNotes((prev) => [
      ...prev,
      ...uploaded,
    ]);
  };

  const saveManualNote = () => {
    if (!text.trim()) return;

    const newNote = {
      name:
        title.trim() ||
        `Note ${notes.length + 1}`,

      content: text,
    };

    setNotes((prev) => [
      ...prev,
      newNote,
    ]);

    setTitle("");
    setText("");
  };

  return (
    <div className="page">
      {/* HEADER */}

      <div className="page-header">
        <div className="gradient-badge">
          Upload Study Material
        </div>

        <h1 className="page-title">
          Upload Notes
        </h1>

        <p className="page-sub">
          Add files or paste text —
          the AI will learn from them.
        </p>
      </div>

      {/* FILE UPLOAD */}

      <div className="card">
        <div
          className="upload-zone"
          onClick={() =>
            fileRef.current.click()
          }
        >
          <div className="upload-icon">
            <Icon
              name="upload"
              size={54}
            />
          </div>

          <h2>
            Drop files here or click
            to browse
          </h2>

          <p
            style={{
              color:
                "var(--text2)",
              margin:
                "16px 0 22px",
            }}
          >
            Supports TXT, MD, PDF,
            DOCX
          </p>

          <div className="upload-tags">
            <span>.TXT</span>
            <span>.MD</span>
            <span>.PDF</span>
            <span>.DOCX</span>
          </div>

          <input
            type="file"
            multiple
            hidden
            ref={fileRef}
            accept=".txt,.md,.pdf,.docx"
            onChange={(e) =>
              handleFiles(
                e.target.files
              )
            }
          />
        </div>
      </div>

      {/* MANUAL NOTES */}

      <div
        className="card"
        style={{
          marginTop: 28,
        }}
      >
        <h2
          style={{
            marginBottom: 24,
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Or paste your notes directly
        </h2>

        <input
          className="input"
          placeholder="Note title (optional)"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={{
            marginBottom: 18,
          }}
        />

        <textarea
          className="textarea"
          placeholder="Paste your study notes, textbook content, lecture notes, or any text here..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />

        <button
          className="btn"
          onClick={saveManualNote}
          style={{
            marginTop: 20,
          }}
        >
          <Icon
            name="upload"
            size={18}
          />
          Save Note
        </button>
      </div>

      {/* SAVED NOTES */}

      {notes &&
        notes.length > 0 && (
          <div
            className="card"
            style={{
              marginTop: 28,
            }}
          >
            <h2
              style={{
                fontSize: 28,
                marginBottom: 24,
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              Saved Notes (
              {notes.length})
            </h2>

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
                    style={{
                      padding: 20,
                      borderRadius: 18,
                      background:
                        "#151d31",
                      border:
                        "1px solid #232d4a",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          gap: 16,
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
                            href={
                              note.fileURL
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontWeight: 700,
                              fontSize: 18,
                              marginBottom: 6,
                              color: "white",
                              textDecoration:
                                "none",
                              cursor:
                                "pointer",
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

                      <button
                        className="delete-btn"
                        onClick={() => {
                          const updated =
                            notes.filter(
                              (
                                _,
                                i
                              ) =>
                                i !==
                                index
                            );

                          setNotes(
                            updated
                          );
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}