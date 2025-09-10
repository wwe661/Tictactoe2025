import React from "react";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <nav className="navbar">
        <button className="nav-btn">Docs</button>
        <button className="nav-btn">Play</button>
        <button className="nav-btn">About Us</button>
      </nav>

      <div className="content-wrapper">
        <div className="left-panel">
          <h1 className="title">
            THE<br />
            <span className="highlight-white">TIC-</span><br />
            <span className="highlight-white">TAC-</span><br />
            <span className="highlight-white">TOE</span><br />
            <span className="highlight-dark">GAME</span>
          </h1>
        </div>

        <div className="right-panel">
          <button className="mode-btn">Player vs AI</button>
          <button className="mode-btn">Player vs Player</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;