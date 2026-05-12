import { useEffect, useState } from "react";

import "./styles/global.css";

import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";

import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SummarizePage from "./pages/SummarizePage";

export default function App() {
  const [entered, setEntered] =
    useState(false);

  const [page, setPage] =
    useState("home");

  const [notes, setNotes] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "studyai-notes"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  /* SAVE NOTES */

  useEffect(() => {
    localStorage.setItem(
      "studyai-notes",
      JSON.stringify(notes)
    );
  }, [notes]);

  return !entered ? (
    <LandingPage
      onEnter={() =>
        setEntered(true)
      }
    />
  ) : (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="main">
        {page === "home" && (
          <Dashboard
            notes={notes}
            setPage={setPage}
          />
        )}

        {page === "upload" && (
          <UploadPage
            notes={notes}
            setNotes={setNotes}
          />
        )}

        {page === "chat" && (
          <ChatPage notes={notes} />
        )}

        {page === "quiz" && (
          <QuizPage notes={notes} />
        )}

        {page === "flashcards" && (
          <FlashcardsPage
            notes={notes}
          />
        )}

        {page === "roadmap" && (
          <RoadmapPage
            notes={notes}
          />
        )}

        {page === "summary" && (
          <SummarizePage
            notes={notes}
          />
        )}
      </main>
    </div>
  );
}