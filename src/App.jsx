import React, { useState } from 'react';
import ProgressBar from './ProgressBar'; // Import the ProgressBar component
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './App.css';

const quizData = [
  { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Processor Unit', 'Central Personal Unit'], correctAnswer: 'Central Processing Unit' },
  { question: 'Which programming language is known as the "mother of all languages?"', options: ['C', 'Java', 'Assembly', 'Fortran'], correctAnswer: 'C' },
  { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High-level Text Markup Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language' },
  { question: 'Which company developed the first computer mouse?', options: ['IBM', 'Microsoft', 'Xerox', 'Apple'], correctAnswer: 'Xerox' },
  { question: 'What is the purpose of CSS in web development?', options: ['Color and Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets'], correctAnswer: 'Cascading Style Sheets' },
];

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;

    setAnswers([...answers, { question: currentQuestion + 1, answer: selectedAnswer, isCorrect }]);

    if (isCorrect) {
      setScore({ ...score, correct: score.correct + 1 });
    } else {
      setScore({ ...score, wrong: score.wrong + 1 });
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setScore({ correct: 0, wrong: 0 });
    setShowResult(false);
    setAnswers([]);
  };

  const downloadResults = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quiz Results');

    worksheet.columns = [
      { header: 'Question', key: 'question', width: 10 },
      { header: 'Answer', key: 'answer', width: 30 },
      { header: 'Is Correct', key: 'isCorrect', width: 15 },
    ];

    answers.forEach((answer) => {
      worksheet.addRow({
        question: answer.question,
        answer: answer.answer,
        isCorrect: answer.isCorrect ? 'Yes' : 'No',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'quiz_results.xlsx');
  };

  return (
    <div className="app-container">
      <ProgressBar totalQuestions={quizData.length} currentQuestion={currentQuestion + 1} />
      {showResult ? (
        <div className="result-container">
          <h2>Quiz Result</h2>
          <p>Correct Answers: {score.correct}</p>
          <p>Wrong Answers: {score.wrong}</p>
          <button className="btn" onClick={handleTryAgain} style={{ marginRight: "6px" }}>
            Try Again
          </button>
          <button className="btn" onClick={downloadResults} style={{ marginLeft: "6px" }}>
            Download Results
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h2>Computer Quiz</h2>
          <p className="question-number">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
          <p className="question-text">{quizData[currentQuestion].question}</p>
          <div className="options-container">
            {quizData[currentQuestion].options.map((option, index) => (
              <button key={index} className="option-btn" onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
