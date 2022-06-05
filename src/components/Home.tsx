import React, {useState, useEffect} from 'react'
import {Button, Form} from 'react-bootstrap'
import {Difficulty, Category} from './Constants'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import useSound from "use-sound";

const Picture4 = require('../images/image4.jpg')
const main = require('../sounds/main.mp3');

interface Props {
    setData: React.Dispatch<React.SetStateAction<never[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
}


const Home : React.FC<Props> = ({setData, setLoading, setGameOver, setStart}) => {

    const [difficulty, setDifficulty] = useState('')
    const [category, setCategory] = useState('')
    const navigate = useNavigate()
    const [Main, { stop }] = useSound(main, {interrupt: true});

    const startQuiz = async () => {
        setLoading(true);
        stop()
        setGameOver(false);
        localStorage.setItem('gameOver', 'false')
        await axios
        .get(`https://opentdb.com/api.php?amount=15&category=${category}&difficulty=${difficulty}&type=multiple`, 
        )
        .then(res => {setData(res.data.results); localStorage.setItem('data', JSON.stringify(res.data.results))})
        .catch(err => console.log(err.message))
        setStart(true)
        localStorage.setItem("start", 'true')
        navigate('/trivia')
        setLoading(false);
    };
    
useEffect(() => {
  Main();
}, [Main])


return (
<div className='App' style={{backgroundImage: `url(${Picture4})`, opacity: 0.75}}>
      <Form className='home'>
      <h4 className='options-choice'>Options</h4>
        <Form.Group className='options'>
        <Form.Label className='options-label'>Difficulty</Form.Label>
        <Form.Select aria-label="Default select example" onChange={e => setDifficulty(e.target.value)}>
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.MEDIUM}>Medium</option>
          <option value={Difficulty.HARD}>Hard</option>
        </Form.Select>
        </Form.Group>
        <Form.Group className='options'>
        <Form.Label className='options-label'>Category</Form.Label>
        <Form.Select aria-label="Default select example" onChange={e => setCategory(e.target.value)}>
          <option value={Category.GENERAL_KNOWLEDGE}>General Knowledge</option>
          <option value={Category.BOOKS}>Books</option>
          <option value={Category.FILM}>Film</option>
          <option value={Category.MUSIC}>Music</option>
          <option value={Category.MUSICALS_AND_THEATRES}>Musical And Theatres</option>
          <option value={Category.TELEVISION}>Television</option>
          <option value={Category.VIDEO_GAMES}>Video Games</option>
          <option value={Category.BOARD_GAMES}>Board Games</option>
          <option value={Category.SCIENCE_AND_NATURE}>Science And Nature</option>
          <option value={Category.COMPUTERS}>Computers</option>
          <option value={Category.MATHEMATICS}>Mathematics</option>
          <option value={Category.MYTHOLOGY}>Mythology</option>
          <option value={Category.SPORTS}>Sports</option>
          <option value={Category.GEOGRAPHY}>Geography</option>
          <option value={Category.HISTORY}>History</option>
          <option value={Category.POLITICS}>Politics</option>
          <option value={Category.ART}>Art</option>
          <option value={Category.CELEBRITIES}>Celebrities</option>
          <option value={Category.ANIMALS}>Animals</option>
          <option value={Category.VEHICLES}>Vehicles</option>
          <option value={Category.COMICS}>Comics</option>
          <option value={Category.GADGETS}>Gadgets</option>
          <option value={Category.JAPANESE_ANIME_AND_MANGA}>Japanese Anime And Manga</option>
          <option value={Category.CARTOON_AND_ANIMATIONS}>Cartoon And Animations</option>
        </Form.Select>
        </Form.Group>
        <Button 
        className='options-btn'
        variant="primary" 
        type="submit"
        onClick={() => startQuiz()}
        >
            Start
        </Button>
      </Form>
</div>
)
}

export default Home