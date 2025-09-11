import React from "react";
import "./Mode.css";
import { useNavigate } from "react-router-dom";


const Mode: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage-container">
      {/* <nav className="navbar">
        <button className="nav-btn">Docs</button>
        <button className="nav-btn">Play</button>
        <button className="nav-btn">About Us</button>
      </nav> */}
      <div className="navbar">
        <div className="logo">Tic Tac Toe</div>
        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/mode")}>Mode</button>
          {/* <button>About Us</button> */}
        </div>
      </div>

      <div className="content-wrapper">
        <div className="left-panel">
          <h1 className="title">
            <span className="highlight-white">THE</span><br />
            <span className="highlight-white">TIC-</span><br />
            <span className="highlight-white">TAC-</span><br />
            <span className="highlight-white">TOE</span><br />
            <span className="highlight-white">GAME</span>
          </h1>
        </div>

        <div className="center-gradient"></div>

        <div className="right-panel">
          <button className="mode-btn" onClick={() => navigate("/easy")}>
            Player vs AI (Easy)
          </button>
          <button className="mode-btn" onClick={() => navigate("/hard")}>
            Player vs AI (Hard)
          </button>
          <button className="mode-btn" onClick={() => navigate("/pvp")}>
            Player vs Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mode;