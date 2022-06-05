import React, {useState, useEffect} from 'react';
import './App.css';
import Home from "./components/Home";
import Trivia from "./components/Trivia";
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'

const Picture1 = require('./images/image1.jpg')
const Picture2 = require('./images/image2.jpg')
const Picture3 = require('./images/image3.jpg')
const Picture4 = require('./images/image4.jpg')
const Picture5 = require('./images/image5.jpg')
const Picture6 = require('./images/image6.jpg')
const Picture7 = require('./images/image7.webp')

const App : React.FC = () => {

  const [backgroundImage, setBackgroundImage] = useState(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState(localStorage.data ? JSON.parse(localStorage.data) : []);
  const [questionNumber, setQuestionNumber] = useState<number>(Number(localStorage.questionNumber) || 1);
  const [gameOver, setGameOver] = useState<boolean>(localStorage.getItem("gameOver") === "true" ? true : false);
  const [start, setStart] = useState<boolean>(localStorage.getItem("start") === "true" ? true : false)
  const [earned, setEarned] = useState<string | undefined>(localStorage.getItem('earned') || "$ 0");

  const backgroundStyle = {
    background: !gameOver 
      ? `url(${backgroundImage}) center no-repeat` 
      : (gameOver && earned === "1.000.000$") ? 
      `url(https://media.istockphoto.com/videos/firework-particles-animation-on-blue-background-video-id1208486365?s=640x640) center no-repeat`
      :'#06063e',
    opacity: loading ? '0.5' : 1,
    width: loading ? '100%' : '75%'
  }

  useEffect(() => {
    const pictureArray = [Picture1, Picture2, Picture3, Picture4, Picture5, Picture6, Picture7]
    const randomPicture = pictureArray[Math.floor(Math.random() * pictureArray.length)];
    setBackgroundImage(randomPicture);
    //localStorage.clear()
  }, [setBackgroundImage])


if (loading) {
  return (
    <div className='App'>
      <div className='main' style={backgroundStyle}></div>
    </div>
  )
}

return (
<BrowserRouter>
  <Routes>
    <Route 
    path="/" 
    element={
      <Home
      setData={setData}
      setLoading={setLoading}
      setGameOver={setGameOver}
      setStart={setStart}
      />} 
    />
    
    <Route path="/trivia" element={
      start 
      ?
      <Trivia
      data={data}
      setData={setData}
      setLoading={setLoading}
      questionNumber={questionNumber}
      setQuestionNumber={setQuestionNumber}
      setGameOver={setGameOver}
      gameOver={gameOver}
      setStart={setStart}
      backgroundStyle={backgroundStyle}
      earned={earned}
      setEarned={setEarned}
      />
      : 
      <Navigate to="/"/>
    }
    />
  </Routes>
</BrowserRouter>
)
}

export default App
