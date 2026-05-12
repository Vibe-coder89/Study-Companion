import Icon from "./Icon";

const navItems = [
  { id: "home", icon: "home", label: "Dashboard" },
  { id: "upload", icon: "upload", label: "Upload Notes" },
  { id: "chat", icon: "chat", label: "AI Chat" },
  { id: "quiz", icon: "quiz", label: "Quiz Generator" },
  { id: "flashcards", icon: "cards", label: "Flashcards" },
  { id: "roadmap", icon: "map", label: "Study Roadmap" },
  { id: "summary", icon: "summary", label: "Summarize" },
];

const Sidebar = ({ page, setPage }) => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      <div className="sidebar-logo-icon">
        <Icon name="brain" size={18} />
      </div>

      <div>
        <div className="sidebar-logo-text">StudyAI</div>
        <div className="sidebar-logo-sub">AI Study Companion</div>
      </div>
    </div>

    <div className="nav-section">Tools</div>

    {navItems.map((item) => (
      <div
        key={item.id}
        className={`nav-item ${page === item.id ? "active" : ""}`}
        onClick={() => setPage(item.id)}
      >
        <Icon name={item.icon} size={18} />
        <span>{item.label}</span>
      </div>
    ))}
  </aside>
);

export default Sidebar;