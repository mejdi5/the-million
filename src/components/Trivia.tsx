import React, {useState, useEffect} from 'react'
import {Button} from 'react-bootstrap'
import MoneyList from "./MoneyList";
import { Question } from './Constants'
import { FormEvent } from 'react';
import useSound from "use-sound";
import {
    firstPercentage, 
    secondPerentage, 
    thirdPercentage, 
    fourthPercentage, 
    maxPercentage,
    firstNonMaxPercentage,
    secondNonMaxPercentage,
    thirdNonMaxPercentage
} from './utils'

const playSound = require('../sounds/play.mp3');
const breakSound = require('../sounds/break.mp3');
const correct = require('../sounds/correct.mp3');
const wrong = require('../sounds/wrong.mp3');
const firstQuestionsSound = require('../sounds/firstquestions.mp3');
const middleQuestionsSound = require('../sounds/waiting1.mp3');
const lastQuestionsSound = require('../sounds/waiting2.mp3');
const finalAnswerSound = require('../sounds/final-answer.mp3');
const victory = require('../sounds/victory.mp3');


interface Props {
    data: Question[];
    setData: React.Dispatch<any>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    questionNumber: number;
    setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
    backgroundStyle: any;
    earned: string | undefined;
    setEarned: React.Dispatch<React.SetStateAction<string | undefined>>
}

const Trivia: React.FC<Props> = ({data, setData, setLoading, questionNumber, setQuestionNumber, gameOver, setGameOver, setStart, backgroundStyle, earned, setEarned}) => {

const [question, setQuestion] = useState<Question | null>(null)
const [answers, setAnswers] = useState<string[]>(localStorage.answers ? JSON.parse(localStorage.answers) : [])
const [selectedAnswer, setSelectedAnswer] = useState<String | null>(localStorage.getItem('selectedAnswer') || null);
const [selectedAnswerStyle, setSelectedAnswerStyle] = useState<string>(localStorage.getItem('selectedAnswerStyle') || "answer");
const [correctAnswerStyle, setCorrectAnswerStyle] = useState<string>(localStorage.getItem('correctAnswerStyle') ||"answer");
const [usedRemovingTwoAnswers, setUsedRemovingTwoAnswers] = useState(localStorage.getItem("usedRemovingTwoAnswers") === "true" ? true : false)
const [usedPublicHelp, setUsedPublicHelp] = useState(localStorage.getItem("usedPublicHelp") === "true" ? true : false)
const [usedFriendHelp, setUsedFriendHelp] = useState(localStorage.getItem("usedFriendHelp") === "true" ? true : false)
const [sound, setSound] = useState<any>('');

const [play, {stop}] = useSound(sound, {interrupt: true});
const [Play] = useSound(playSound);
const [Break] = useSound(breakSound);  
const [Correct] = useSound(correct);
const [Wrong] = useSound(wrong);
const [Victory] = useSound(victory);

//submit answer
const handleSubmit = (Answer: string, e: FormEvent) => {
    e.preventDefault();
    setSelectedAnswer(Answer);
    localStorage.setItem('selectedAnswer', Answer);
    if (questionNumber > 5 ) {
        setSound(finalAnswerSound); 
        play()
    }
}

//remove two incorrect answers
const removeTwoAnswers = (e: FormEvent) => {
    e.preventDefault()
    if(!usedRemovingTwoAnswers) {
        setTimeout(() => {
            const notRemovedAnswers = question ? question.incorrect_answers && [question.incorrect_answers[Math.floor(Math.random() * question.incorrect_answers.length)], question.correct_answer].sort(() => Math.random() - 0.5) : []
            setAnswers(notRemovedAnswers)
            localStorage.setItem('answers', JSON.stringify(notRemovedAnswers))
        }, 3000)
    }
    setUsedRemovingTwoAnswers(true)
    localStorage.setItem('usedRemovingTwoAnswers', 'true')
}

var array: any[] | undefined = []
for(let i = 0 ; i < 8 ; i++) {
    array[i] = question?.correct_answer
}
answers.length === 2  //consulting a friend after removing two incorrect answers
? array =  [...array, answers[0], answers[1] , "No idea"]
: array = question?.incorrect_answers && [...array, ...question?.incorrect_answers, "No idea"]


//consulting a friend
const friendHelp = (e: FormEvent) => {
    e.preventDefault()
    if(!usedFriendHelp) {
        const friendAnswer = array && array[Math.floor(Math.random()*array.length)];
        if(friendAnswer === "No idea") {
            setTimeout(() => {
                alert('Friend: I have no idea')
            }, 1000)
        } else {
            setTimeout(() => {
                alert(`Friend: I think the answer is ${friendAnswer}`)
            }, 1000)
        }
    }
    setUsedFriendHelp(true)
    localStorage.setItem('usedFriendHelp', 'true')
}

//consulting public
const PublicHelp = (e: FormEvent) => {
    e.preventDefault()
    if(!usedPublicHelp) {
        const newArray = array?.filter(el => el !== "No idea")
        const maxPercentageAnswer = newArray && newArray[Math.floor(Math.random()*newArray.length)];
        const firstNonMaxPercentageAnswer = answers?.find(answer => answer !== maxPercentageAnswer)
        const secondNonMaxPercentageAnswer = answers?.find(answer => answer !== maxPercentageAnswer && answer !== firstNonMaxPercentageAnswer)
        const thirdNonMaxPercentageAnswer = answers?.find(answer => answer !== maxPercentageAnswer && answer !== firstNonMaxPercentageAnswer && answer !== secondNonMaxPercentageAnswer)
        setTimeout(() => {
            alert(`
            ${maxPercentageAnswer} : ${maxPercentage}%
            ${firstNonMaxPercentageAnswer} : ${firstNonMaxPercentage}%
            ${secondNonMaxPercentageAnswer} : ${secondNonMaxPercentage}%
            ${thirdNonMaxPercentageAnswer} : ${thirdNonMaxPercentage}%
            `)
        }, 3000)
    }
    setUsedPublicHelp(true)
    localStorage.setItem('usedPublicHelp', 'true')
}

//leave  
const Leave = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true);
    setData([]);
    setQuestion(null)
    setQuestionNumber(1)
    setGameOver(true)
    setLoading(false)
    setTimeout(() => {
        stop()
        setStart(false)
        localStorage.clear()
    }, 3000)
}

//sound when refreshing page
useEffect(() => {
    Break();
}, [Break]);

//change sounds
useEffect(() => {
    if(questionNumber < 6 && !gameOver) {
            setSound(firstQuestionsSound) 
            play()
    }
    else if(questionNumber > 5 && questionNumber < 11  && !gameOver && !selectedAnswer) { 
            stop()
            setSound(middleQuestionsSound); 
            play()
    }
    else if(questionNumber > 10 && questionNumber < 16  && !gameOver) {
            stop()
            setSound(lastQuestionsSound); 
            play()
    } 
    else {
            setSound('')
            stop()
    }
}, [questionNumber, selectedAnswer, gameOver, sound, play])


useEffect(() => {
    localStorage.setItem("questionNumber", `${questionNumber}`)
    setQuestion(data[questionNumber - 1]);
    setAnswers(question ? question.incorrect_answers && [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5) : []);
    localStorage.setItem('answers', JSON.stringify(answers))
}, [data, questionNumber, question]);


useEffect(() => {
if (selectedAnswer) {
    const time1 = questionNumber === 15 ? 10000 : questionNumber < 6 ? 3000 : questionNumber < 11 ? 5000 : 8000
    const time2 = questionNumber === 15 ? 15000 : questionNumber < 6 ? 8000 : questionNumber < 11 ? 10000 : 13000
    setSelectedAnswerStyle("answer active")
    localStorage.setItem('selectedAnswerStyle', "answer active")
    //correct answer 
    if (selectedAnswer === question?.correct_answer && questionNumber < 15) {
        setTimeout(() => {
            Correct()
            questionNumber > 4 && Break()
            setSelectedAnswerStyle("answer correct")
            localStorage.setItem('selectedAnswerStyle', "answer correct")
        }, time1);
        setTimeout(() => {
            Play()
            setQuestionNumber(prev => prev + 1);
            setSelectedAnswer(null)
            localStorage.removeItem('selectedAnswer')
            setSelectedAnswerStyle("answer")
            localStorage.removeItem('selectedAnswerStyle')
        }, time2);
    } 
    //last question & correct answer
    else if (selectedAnswer === question?.correct_answer && questionNumber === 15) {
        setTimeout(() => {
            Correct()
            setSelectedAnswerStyle("answer correct")
            localStorage.setItem('selectedAnswerStyle', "answer correct")
        }, time1);
        setTimeout(() => {
            setEarned("1.000.000$")
            Victory()
            setGameOver(true)
            localStorage.setItem('gameOver', 'true')
            setQuestionNumber(1);
            localStorage.setItem("questionNumber", '1')
            setSelectedAnswer(null)
            localStorage.removeItem('selectedAnswer')
            setSelectedAnswerStyle("answer")
            localStorage.removeItem('selectedAnswerStyle')
            setUsedRemovingTwoAnswers(false)
            localStorage.setItem('usedRemovingTwoAnswers', 'false')
            setUsedFriendHelp(false)
            localStorage.setItem('usedFriendHelp', 'false')
            setUsedPublicHelp(false)
            localStorage.setItem('usedPublicHelp', 'false')
        }, time2);
        setTimeout(() => {
            setStart(false)
            localStorage.setItem("start", 'false')
            setEarned("$ 0")
            localStorage.setItem("earned", "$ 0")
            localStorage.removeItem("data")
        }, 35000);
    } 
    //wrong answer
    else {
        setTimeout(() => {
            Wrong()
            setSelectedAnswerStyle("answer wrong")
            localStorage.setItem('selectedAnswerStyle', "answer wrong")
        }, time1);
        setTimeout(() => {
            setCorrectAnswerStyle("answer correct")
            localStorage.setItem('correctAnswerStyle', "answer correct")
        }, time1);
        setTimeout(() => {
            setGameOver(true)
            localStorage.setItem('gameOver', 'true')
            setSelectedAnswer(null)
            localStorage.removeItem('selectedAnswer')
            setSelectedAnswerStyle("answer")
            localStorage.removeItem('selectedAnswerStyle')
            setCorrectAnswerStyle("answer")
            localStorage.removeItem('correctAnswerStyle')
            setQuestionNumber(1)
            localStorage.setItem("questionNumber", '1')
            setUsedRemovingTwoAnswers(false)
            localStorage.setItem('usedRemovingTwoAnswers', 'false')
            setUsedFriendHelp(false)
            localStorage.setItem('usedFriendHelp', 'false')
            setUsedPublicHelp(false)
            localStorage.setItem('usedPublicHelp', 'false')
        }, time2);
        setTimeout(() => {
            setStart(false)
            localStorage.setItem("start", 'false')
            setEarned("$ 0")
            localStorage.setItem("earned", "$ 0")
            localStorage.removeItem("data")
        }, time2 + 5000);
    }
}
}, [selectedAnswer, question])

useEffect(() => {
    questionNumber > 1 && questionNumber < 16 &&
        setEarned(MoneyList.find(moneyItem => moneyItem.id === questionNumber - 1)?.amount);
}, [questionNumber, MoneyList]);

console.log(question?.correct_answer)

return (
    <div className="App">
        <div className='main' style={backgroundStyle}>
            {!gameOver && 
            <div className='help'>
            <img 
            className={usedRemovingTwoAnswers ? "image used" : "image"}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbiSFtr8OzJa9SBmGPkCvpCQ4pbmTacOu_ZhZWLL8edXaj241wdvKN3mTagA9hZfeRCAo&usqp=CAU"
            onClick={e => removeTwoAnswers(e)}
            />
            <img 
            className={usedPublicHelp ? "image used" : "image"}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9KIabl0K-leI2493aVdXFEXfcfbfVZPPlsCDyVdvjg91jLcwt2c3p0IFxHismeUSjA&usqp=CAU"
            onClick={e => PublicHelp(e)}
            />
            <img 
            className={usedFriendHelp ? "image used" : "image"}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx8xOQDybnmDu3jMkU6_fgLzTOyWvkjHFi1XjZRZDEr63hc60C6ss98fjgw9hFDkpRWo8&usqp=CAU"
            onClick={e => friendHelp(e)}
            />
            </div>
            }
            {(gameOver && earned === "1.000.000$") 
            ? (
                <>
                    <h1 className="Text">Congratulations</h1>
                    <h1 className="Text">You earned: {earned}</h1>
                </>
            ) 
            : (gameOver && earned !== "1.000.000$") 
            ? (
                <h1 className="Text">You earned: {earned}</h1>
            )
            : (
    <div className="trivia">
        <div className="question">{question?.question}</div>
        <div className="answers">
            {answers?.map((answer: string, index: number) => (
                <div key={index}
                onClick={(e) => window.confirm('Are you sure ?') && !selectedAnswer && handleSubmit(answer, e)}
                className={selectedAnswer === answer 
                    ? selectedAnswerStyle 
                    : (selectedAnswer && answer === question?.correct_answer) 
                        ? correctAnswerStyle
                        :"answer"
                }
                >
                    {answer}
                </div>
            ))}
        </div>
        </div>
            )}
    </div>
        <div className='money'>
          <ul className='moneyList'>
            {MoneyList.map((moneyItem, index) => 
              <li key={index} className={questionNumber !== moneyItem.id ? "moneyListItem" : "moneyListItem active"}>
                <span className="moneyListItemNumber">{moneyItem.id}</span>
                <span className="moneyListItemAmount">{moneyItem.amount}</span>
              </li>
            )}
          </ul>
          <Button
          variant="secondary" 
          type="submit"
          onClick={(e) => window.confirm('Exit ?') && Leave(e)}
          >Leave</Button>
        </div>
      </div>
)
}

export default Trivia