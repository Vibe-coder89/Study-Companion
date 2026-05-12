import Icon from "./Icon";
import features from "../data/features";

const LandingPage = ({ onEnter }) => (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <nav className="nav">
            <span className="nav-brand">StudyAI</span>

            <div className="nav-links">
                <span className="nav-link">Features</span>
                <span className="nav-link">About</span>

            </div>

            <button
                className="btn btn-primary"
                style={{ padding: "8px 18px", fontSize: "13px" }}
                onClick={onEnter}
            >
                Get Started
            </button>
        </nav>

        <div className="hero">
            <div className="hero-bg">
                <div className="hero-orb1" />
                <div className="hero-orb2" />
            </div>

            <div className="hero-content">

                <h1 className="hero-title">
                    Study Smarter with
                    <br />
                    <span>AI That Understands</span>
                    <br />
                    Your Notes
                </h1>

                <p className="hero-sub">
                    Upload your PDFs, slides, and notes. Get instant summaries,
                    quizzes, flashcards, and a personalized study roadmap.
                </p>

                <div className="hero-cta">
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: "16px", padding: "14px 28px" }}
                        onClick={onEnter}
                    >
                        <Icon name="zap" size={18} />
                        Start Studying Free
                    </button>

                    
                </div>
            </div>
        </div>
    </div>
);

export default LandingPage;