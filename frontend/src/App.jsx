import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import GamePage from './pages/GamePage/GamePage';
import Main from './pages/MainPage/Main';
import Kakao from './components/main/Kakao';
import Profile from './components/Profile';
import Lobby from './pages/LobbyPage/Lobby';
import Mypage from './pages/MyPage/Mypage';
import Naver from './components/main/Naver';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/kakao" element={<Kakao />} />
        <Route path="/naver" element={<Naver />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/gamepage" element={<GamePage />} />

        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
