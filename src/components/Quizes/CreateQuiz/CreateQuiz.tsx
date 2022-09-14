import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, notification, Radio } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { Answer, Question, Quiz } from "../../../types/Quizes";
import "./CreateQuiz.scss";

const { TextArea } = Input;
interface CreateQuizProps {
    createQuiz: Function;
    editableQuiz: Quiz | undefined;
    hideQuizForm: Function;
    updateQuiz: Function;
}

function CreateQuiz({
    createQuiz,
    editableQuiz,
    hideQuizForm,
    updateQuiz,
}: CreateQuizProps) {
    const quizDefaultValues = {
        created: "",
        description: "",
        modified: "",
        questions: [{ text: "", answers: [{ text: "", isTrue: false }] }],
        title: "",
        url: "",
        score: null,
    }
    const quizValues = useRef<Quiz>(quizDefaultValues)
    const [form] = Form.useForm();
    const { validateFields } = form;
    const [answerCount, incrementAnswerCount] = useState<number>(1);
    const [questionsCount, incrementQuestionsCount] = useState<number>(1);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (editableQuiz && Object.entries(editableQuiz).length !== 0) {
            
            quizValues.current = editableQuiz;
            setQuestions(editableQuiz.questions)
        }
        else {
            quizValues.current = quizDefaultValues
            setQuestions(quizDefaultValues.questions)
        }
    }, [editableQuiz])

    const handleFieldChange = (e: any) => {
        quizValues.current = { ...quizValues.current, [e.target.id]: e.target.value }
    }

    const handleIncrementQuestion = (count: number) => {
        const currentQuestion = [...questions];
        incrementQuestionsCount(count)
        currentQuestion.push({ text: "", answers: [{ text: "", isTrue: false }] })
        setQuestions(currentQuestion)
    }

    const handleIncrementAnswer = (count: number) => {
        const currentQuestion = [...questions];
        incrementAnswerCount(count)
        currentQuestion[count - 1].answers.push({ text: "", isTrue: false })
        setQuestions(currentQuestion)
    }

    const handleQuestionChange = (event: any, questionIndex: number, answerIndex: number | undefined) => {
        let currentQuestions = [...quizValues.current.questions];
        if (currentQuestions[questionIndex] === undefined) {
            currentQuestions[questionIndex] = {
                text: '',
                answers: []
            }
        } 
        if (answerIndex === undefined) {
            currentQuestions[questionIndex] = { ...currentQuestions[questionIndex], [event.target.id.split('_')[1]]: event.target.value, "id": currentQuestions[questionIndex].id || Math.floor(Math.random() * 100) };
        } else {
            let questionAnswers: Answer[] = currentQuestions[questionIndex].answers;
            questionAnswers[answerIndex] = { ...questionAnswers[answerIndex], "id": questionAnswers[answerIndex] ? questionAnswers[answerIndex].id : Math.floor(Math.random() * 100), [event.target.id.split('_')[1]]: event.target.value }
            currentQuestions[questionIndex].answers = [...questionAnswers]
        }

        quizValues.current = { ...quizValues.current, questions: currentQuestions }
    }

    function getDateNow() {
        let d = new Date(),
            dformat = [d.getMonth() + 1,
            d.getDate(),
            d.getFullYear()].join('-') + ' ' +
                [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
        return dformat;
    }

    function submitQuiz() {
        const notEditMode = !editableQuiz ||
            Object.entries(editableQuiz).length === 0
        validateFields()
            .then(async () => {
                if (
                    notEditMode
                ) {
                    quizValues.current.created = getDateNow();
                    quizValues.current.id = quizValues.current.id ? quizValues.current.id : Math.floor(Math.random() * 100);
                    createQuiz(quizValues.current);
                } else {
                    quizValues.current.modified = getDateNow();
                    updateQuiz(quizValues.current);
                }
                notification.success({
                    message: 'Success',
                    description:
                        (notEditMode ? 'Quiz Added Successfully' : 'Quiz Edited Successfully'),
                });
            })
            .then(() => {
                hideQuizForm();
            });
    }
    return (
        questions && questions.length > 0 ? (
            <div className="quiz-form">
                <h3>Add / Edit Quiz</h3>

                <Form
                    form={form}
                    onFinish={submitQuiz}
                    autoComplete="off"
                >
                    <>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                { required: true, message: "Please input your Quiz title!" },
                            ]}
                            initialValue={editableQuiz?.title}
                        >
                            <Input placeholder="Title" onChange={(e) => handleFieldChange(e)} />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                { required: true, message: "Please input your quiz description !" },
                            ]}
                            initialValue={editableQuiz?.description}
                        >
                            <TextArea placeholder="Description" onChange={(e) => handleFieldChange(e)}>
                            </TextArea>
                        </Form.Item>
                    </>
                    <div>
                        <h4>Add Question</h4>
                        <div className="questions-wrapper">
                            <div>
                                {questions.map((question, questionIndex) => (
                                    <div>
                                        <Form.Item
                                            label="Question"
                                            initialValue={question.text}
                                            name={[`question${questionIndex}`, 'text']}
                                            rules={[
                                                { required: true, message: "Please input your Question!" },
                                            ]}
                                        >
                                            <Input placeholder="Question" onChange={(e) =>
                                                handleQuestionChange(e, questionIndex, undefined)
                                            } />
                                        </Form.Item>
                                        <Form.Item
                                            label="Wrong Feedback"
                                            name={[`question${questionIndex}`, 'feedbackFalse']}
                                            initialValue={question.feedbackFalse}
                                            rules={[
                                                { required: true, message: "Please input wrong feedback!" },
                                            ]}
                                        >
                                            <Input placeholder="Wrong Feedback" onChange={(e) => handleQuestionChange(e, questionIndex, undefined)} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Right Feedback"
                                            name={[`question${questionIndex}`, 'feedbackTrue']}
                                            initialValue={question.feedbackTrue}
                                        >
                                            <Input placeholder="Right Feedback" onChange={(e) => handleQuestionChange(e, questionIndex, undefined)} />
                                        </Form.Item>
                                        <div className="answers-wrapper">
                                            <div>
                                                {
                                                    question.answers.map((answer, answerIndex) => (
                                                        <div>
                                                            <Form.Item
                                                                label={`Text`}
                                                                name={[`answer${answerIndex}${questionIndex}`, "text"]}
                                                                initialValue={answer.text}
                                                                rules={[
                                                                    { required: true, message: "Please input your answer text!" },
                                                                ]}
                                                            >
                                                                <Input placeholder="Answer" onChange={(e) => handleQuestionChange(e, questionIndex, answerIndex)} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label="Is Correct"
                                                                name={[`answer${answerIndex}${questionIndex}`, "isTrue"]}
                                                                initialValue={answer.isTrue || false}
                                                                rules={[
                                                                    { required: true, message: "Please input your answer value !" },
                                                                ]}
                                                            >
                                                                <Radio.Group onChange={(e) => handleQuestionChange(e, questionIndex, answerIndex)}>
                                                                    <Radio value={true} id={`answer${answerIndex}${questionIndex}_isTrue_true`} > True </Radio>
                                                                    <Radio value={false} id={`answer${answerIndex}${questionIndex}_isTrue_true`}> False </Radio>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </div>

                                                    ))
                                                }
                                            </div>
                                            {answerCount <= 3 && <PlusCircleFilled onClick={() => handleIncrementAnswer(questionIndex + 1)} />}
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            {<PlusCircleFilled onClick={() => handleIncrementQuestion(questionsCount + 1)} />}
                        </div>

                    </div>
                    <Form.Item className="btns-wrapper">
                        <Button data-testid="cancel" type="default" onClick={() => hideQuizForm()}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {!editableQuiz || Object.entries(editableQuiz).length === 0
                                ? "Create"
                                : "Edit"}
                        </Button>{" "}
                    </Form.Item>
                </Form>
            </div>
        ) : (
            <span />
        )
    );
}

export default CreateQuiz;