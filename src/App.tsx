import React, { useState } from "react";
import { fetchQuizQuestions } from "./API";
// Components :
import Question from "./components/Question";
// Types :
import { QuestionState, Difficulty } from "./API";
// Styles : 
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const total_questions = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      total_questions,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    // This fct will be run only if the game isn't over :
    if (!gameOver) {
      // Users answer :
      const answer = e.currentTarget.value;
      // Check answer against correct answer :
      const correct = questions[number].correct_answer === answer;
      // Add score :
      if (correct) setScore(prev => prev + 1);
      // Save answer in the array for user answers :
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUserAnswers((prev) => [...prev, answerObject])
    }
  };

  const NextQuestion = () => {
    // Move to the next question if not the last question :
    const nextQuestion = number + 1;
    // last question :
    if (nextQuestion === total_questions) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion)
    }
  };

  return (
    <>
    <GlobalStyle />
    <Wrapper className="App">
      <h1> My Quiz </h1>
      {gameOver || userAnswers.length === total_questions ? (
        <button className="start" onClick={startQuiz}>
          Start Test
        </button>
      ) : null}

      {!gameOver ? <p className="score">Score :{score}</p> : null}
      {loading && <p>Loading Questions...</p>}
      {!loading && !gameOver && (
        <Question
          questionNumber={number + 1}
          totalQuestions={total_questions}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver &&
      !loading &&
      userAnswers.length === number + 1 &&
      number !== total_questions - 1 ? (
        <button className="next" onClick={NextQuestion}>
          Next Question
        </button>
      ) : null}
    </Wrapper>
    </>
  );
};

export default App;
