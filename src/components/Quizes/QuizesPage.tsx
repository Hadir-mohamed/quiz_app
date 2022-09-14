import React, { useState, useEffect } from "react";
import { Quiz } from "../../types/Quizes.js";
import quizesObj from '../../Quizes.json';
import QuizesList from "./QuizesList/QuizesList";
import CreateQuiz from "./CreateQuiz/CreateQuiz";
import ViewQuiz from './ViewQuiz/ViewQuiz';
import "./Quizes.scss";

function QuizsPage() {
  const [QuizsList, setQuizsList] = useState<Quiz[]>([quizesObj]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
  const [editableQuiz, setEditableQuiz] = useState<Quiz>();
  const [addNewQuizForm, setAddingQuizFormIsShown] = useState(false);
  const [formIsHidden, setFormIsHidden] = useState(false);

  useEffect(() => {
    if (QuizsList.length > 0) {
      setSelectedQuiz(QuizsList[0]);
    }
  }, [QuizsList]);

  useEffect(() => {
    setAddingQuizFormIsShown(QuizsList.length === 0 ? true : false);
  }, [QuizsList]);

  function createQuiz(newQuizInfo: Quiz) {
    const newQuizs = [...QuizsList];
    newQuizs.push(newQuizInfo);
    setQuizsList(newQuizs);
  }

  function updateQuiz(Quiz: Quiz) {
    const list = [...QuizsList];
    if (editableQuiz) {
      const index = QuizsList.findIndex((Quiz) => {
        return (
          Quiz.id === editableQuiz.id
        );
      });
      list[index] = Quiz;
      setQuizsList(list);
    }
  }


  function editQuiz(Quiz: Quiz) {
    setEditableQuiz(Quiz);
  }

  function showQuizForm(isShown: boolean) {
    setAddingQuizFormIsShown(isShown);
    setFormIsHidden(false);
  }

  function hideQuizForm() {
    showQuizForm(false);
    setFormIsHidden(true);
  }

  function selectQuiz(Quiz: Quiz) {
    setSelectedQuiz(Quiz);
  }



  return (
    <section className="quizes">
      <section className="quizes-wrapper">
        <QuizesList
          quizsList={QuizsList}
          editQuiz={editQuiz}
          showQuizForm={showQuizForm}
          formIsHidden={formIsHidden}
          addNewQuizForm={addNewQuizForm}
          selectQuiz={selectQuiz}
        />
        <div className="quiz-info">
        {addNewQuizForm ? (
            <CreateQuiz
            createQuiz={createQuiz}
            editableQuiz={editableQuiz}
            hideQuizForm={hideQuizForm}
            updateQuiz={updateQuiz}
          />
        ):(
          selectedQuiz &&
          <ViewQuiz selectedQuiz={selectedQuiz} />
        )}
        
        </div>
      </section>
    </section>
  );
}

export default QuizsPage;