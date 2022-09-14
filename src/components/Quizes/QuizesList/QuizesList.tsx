import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Quiz } from "../../../types/Quizes";
import "./QuizesList.scss";

function Quizes({
  quizsList,
  editQuiz,
  showQuizForm,
  formIsHidden,
  addNewQuizForm,
  selectQuiz,
  selectedQuizId,
}: any) {
  const [buttonIsHidden, setButtonIsHidden] = useState(false);
  const [Quizs, setQuizs] = useState<Quiz[]>([]);;

  useEffect(() => {
    if (formIsHidden) {
      setButtonIsHidden(false);
      showQuizForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formIsHidden]);

  useEffect(() => {
    setQuizs(quizsList)
  }, [quizsList]);

  function addNewQuiz() {
    showQuizForm(true);
    setButtonIsHidden(true);
    editQuiz({});
  }

  function handleQuizEditing(Quiz: Quiz | {}) {
    setButtonIsHidden(true);
    showQuizForm(true);
    editQuiz(Quiz);
  }

  function handleSelectQuiz(Quiz: Quiz) {
    selectQuiz(Quiz);
  }

  return (
    <aside className="quizes-list">
      <header>Quizs</header>
      <section>
        <ul>
          {Quizs.map((Quiz: Quiz) => (
            <li
              onClick={() => handleSelectQuiz(Quiz)}
              key={Quiz.id}
              className={`${Quiz.id === selectedQuizId ? "selected" : ""}`}
            >
              <span>{Quiz.title}</span>
              <span>
                {!buttonIsHidden && (
                  <EditOutlined onClick={() => handleQuizEditing(Quiz)} />
                )}
              </span>
            </li>
          ))}
        </ul>
        {!buttonIsHidden && !addNewQuizForm && (
          <Button type="primary" onClick={addNewQuiz}>
            Add Quiz
          </Button>
        )}
      </section>
    </aside>
  );
}

export default Quizes;