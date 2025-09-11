// src/App.js
// import AI_TTT from './Hard_TTT';
// import React from 'react';
// import TicTacToe from './TicTacToe';
// import EasyAiTic from './EasyAiTic';
// import EasyTic from './EasyTic';
// import HomePage from './HomePage';
// function App() {
//   return (
//     <div className="App">
//       {/* <h1>Tic Tac Toe</h1> */}
//       {/* <TicTacToe /> */}
//       {/* <AI_TTT /> */}
//       {/* <EasyAiTic /> */}
//       {/* <EasyTic />  */}
//       <HomePage /> 
//     </div>
//   );
// }

// export default App;

// src/App.js
// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useRef } from "react";
import AI_TTT from './Hard_TTT';
import TicTacToe from './TicTacToe';
import EasyAiTic from './EasyAiTic';
import EasyTic from './EasyTic';
import HomePage from './HomePage';
import Mode from './Mode';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const playMusic = async () => {
      try {
        await audioRef.current?.play(); // try autoplay
      } catch (err) {
        console.log("Autoplay blocked, waiting for user interaction...");
        const handleInteraction = () => {
          audioRef.current?.play();
          document.removeEventListener("click", handleInteraction);
        };
        document.addEventListener("click", handleInteraction);
      }
    };

    playMusic();
  }, []);

  return (
    <Router>
      {/* 🎵 Background Music (global, always playing) */}
      <audio ref={audioRef} loop>
        <source src="/music/bg-music.mp3" type="audio/mp3" />
      </audio>
      <Routes>
        
        
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Game mode routes */}
        <Route path="/easy" element={<EasyAiTic />} />
        <Route path="/hard" element={<AI_TTT />} />
        <Route path="/pvp" element={<EasyTic />} />
         <Route path="/mode" element={<Mode />} />

        {/* Optional extra route (if you want EasyTic somewhere) */}
        {/* <Route path="/easy2" element={<EasyTic />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
