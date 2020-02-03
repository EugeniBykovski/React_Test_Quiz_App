import React, {Component} from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
// import axios from '../../axios/axios-quiz'
import Loader from '../../components/UI/Loader/Loader'
import {connect} from 'react-redux'
import {fetchQuizById, quizAnswerClick, retryQuiz} from '../../store/actions/quiz'

class Quiz extends Component {
    /*
    state = {
        results: {}, // {[id]: 'Success'/'Error'}
        isFinished: false,
        activeQuestion: 0,
        answerState: null, // текущий клик пользователя {[id]: 'success'/'error'}
        quiz: [],
        loading: true
    }
    */

    /*
    onAnswerClickHandler = answerId => {
        if (this.state.answerState) { // если сейчас находится правильный ответ
            // то мы не должны выполнять данную функцию
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'Success') {
                return // чтобы мы не заходили в данную функцию и не было перемещения по вопросам
            }
        }

        // получим доступ к объекту вопроса
        const question = this.state.quiz[this.state.activeQuestion] // текущий вопрос
        const results = this.state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'Success'
            }

            this.setState({ // указываем верный ответ
                answerState: {[answerId]: 'Success'},
                results
            })

            // мы будем переключать с таймом на след. вопрос
            const timeout = window.setTimeout(() => {
                if (this.isQuizFinished()) {
                    this.setState({ // мы закончили все вопросы и нам нужно показать некоторые результаты
                        isFinished: true
                    })
                } else {
                    // если голосование не закончилось, то переключаем на другой вопрос
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }

                // сразу убираем тайм, чтобы не было утечки информации
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            // если мы ответили неправильно, то
            results[question.id] = 'Error' // записываем в объект results, что он неправильный
            // указываем неверный ответ
            this.setState({
                answerState: {[answerId]: 'Error'},
                results // results: results
            })
        }
    }
    */

    // isQuizFinished() {
    //     // если число равняется длине всего массива, то голосование закончено
    //     return this.state.activeQuestion + 1 === this.state.quiz.length
    // }

    // retryHandler = () => {
        // чтобы заново пройти тест, нам нужно все вернуть в начальное состояние
    //     this.setState({
            // activeQuestion: 0,
            // answerState: null,
            // isFinished: false,
            // results: {}
    //     })
    // }

    componentDidMount() {
        // вместо того, чтобы вызывать здесь какой-то асинхронный код, мы просто обратимся к текущим свойствам и вызовем метод, куда мы долджны передать id, который у нас сейчас есть в url адресе
        this.props.fetchQuizById(this.props.match.params.id)
    }

    // данный метод вызывается тогда, когда у нас компонент уничтожается
    componentWillUnmount() {
        this.props.retryQuiz()
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ask on all Question</h1>

                    {
                        this.props.loading || !this.props.quiz
                            ? <Loader />
                            : this.props.isFinished
                                ? <FinishedQuiz
                                    results={this.props.results}
                                    quiz={this.props.quiz}
                                    onRetry={this.props.retryQuiz}
                                />
                                : <ActiveQuiz
                                    answers={this.props.quiz[this.props.activeQuestion].answers}
                                    question={this.props.quiz[this.props.activeQuestion].question}
                                    onAnswerClick={this.props.quizAnswerClick}
                                    quizLength={this.props.quiz.length}
                                    answerNumber={this.props.activeQuestion + 1}
                                    state={this.props.answerState}
                                />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        results: state.quiz.results,
        isFinished: state.quiz.isFinished,
        activeQuestion: state.quiz.activeQuestion,
        answerState: state.quiz.answerState,
        quiz: state.quiz.quiz,
        loading: state.quiz.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // функция будет принимать в себя некоторый id и будет диспатчить actionCreator
        fetchQuizById: id => dispatch(fetchQuizById(id)),
        quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz)