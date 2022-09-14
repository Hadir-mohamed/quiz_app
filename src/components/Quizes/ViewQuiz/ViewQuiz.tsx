import React, { useState, useRef } from "react";
import { Radio, Button,notification } from "antd";
import { Answer, Question, Quiz } from "../../../types/Quizes";
import './ViewQuiz.scss'

interface ViewQuizProps {
    selectedQuiz: Quiz
}


export default function ViewQuiz({ selectedQuiz }: ViewQuizProps) {
    const [score, calculateScore] = useState(0)
    const [answersId, setAnswersId] = useState<string[]>([])
    const answersIdRef = useRef<string[]>([])

    const handleAnswerChange = (event: any) => {
        const values = event.target.value.split("_")
        if (answersIdRef.current.includes(values[0]) === true) {
            answersIdRef.current = answersIdRef.current.filter(item => item !== values[0])
        }
        if (values[2] === "false") {
            answersIdRef.current.push(values[0])
        }
    }

    const handleSubmitAnswer = () => {
        calculateScore(selectedQuiz.questions.length -  answersIdRef.current.length)
        setAnswersId(answersIdRef.current)
        notification.success({
            message: 'Success',
            description:'Completed Quiz Successfully',
        });
    }

    return (
        <div className="quiz-content">
            <div className="quiz-header">
                <div>
                    <h3>{selectedQuiz.title}</h3>
                    <p>{selectedQuiz.description}</p>
                </div>
                <h4>Score : {score} of {selectedQuiz.questions.length}</h4>
            </div>
            <ol>
                {
                    selectedQuiz.questions.map((question: Question) =>
                        <div className="questions-list">
                            <li>{question.text}</li>
                            <Radio.Group onChange={(event) => handleAnswerChange(event)}>
                                {question.answers.map((answer: Answer) =>
                                    <Radio value={`${question.id}_${answer.id}_${answer.isTrue}`}> {answer.text} </Radio>
                                )}
                            </Radio.Group>
                            {question.id && (answersId.length > 0 || score > 0) &&
                                (answersId.includes(question.id?.toString()) === true ?
                                    <p className="wrong-feedback">{question.feedbackFalse}</p> :
                                    <p className="right-feedback">{question.feedbackTrue}</p>
                                )}
                        </div>
                    )
                }
            </ol>


            <Button type="primary" onClick={handleSubmitAnswer}>Submit Answers </Button>

        </div>
    );
};