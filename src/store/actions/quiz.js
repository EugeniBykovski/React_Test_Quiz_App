// здесь реализованы все наши actionCreators, которые нужны нам для тестов
import axios from '../../axios/axios-quiz'
import {
    FETCH_QUIZES_ERROR,
    FETCH_QUIZES_START,
    FETCH_QUIZES_SUCCESS,
    FETCH_QUIZ_SUCCESS,
    QUIZ_SET_STATE,
    FINISH_QUIZ,
    QUIZ_NEXT_QUESTION,
    QUIZ_RETRY
} from './actionTypes'

export function fetchQuizes() {
    return async dispatch => {
        // функция, когда мы начали что-то загружать
        dispatch(fetchQuizesStart())

        // будем дублировать ту логику, которая у нас была до этого
        try {
            // появился некий ответ от сервера
            const response = await axios.get('/quizes.json')
            const quizes = []

            // делаем map, чтобы преобразовать формат данных в тот формат, который нам нужен для реакт компонента. Для этого пробежимся по ключам данного объекта и будем получать id каждого объекта и индекс
            Object.keys(response.data).forEach((key, index) => {
                // теперь на каждой итерации будем класть новый объект
                quizes.push({
                    id: key,
                    name: `Тест №${index + 1}`
                })
            })

            // изменяем состояние нашей страницы
            // this.setState({
            //     quizes, loading: false // как только закончится загрузка
            // })

            // теперь сюда передадим те параметры, которые сформировали
            dispatch(fetchQuizesSuccess(quizes))
        } catch (e) {
            // если произошла ошибка, то будем dispatch новый actionCreator
            dispatch(fetchQuizesError(e))
        }
    }
}

export function fetchQuizById(quizId) {
    // функция возвращает некоторый асинхронный код, где мы будем описывать логику по загрузке определенного теста по id
    return async dispatch => {
        dispatch(fetchQuizesStart()) // изменяет state на loading: true

        try {
            const response = await axios.get(`/quizes/${quizId}.json`)
            const quiz = response.data

            // this.setState({
            //     quiz,
            //     loading: false
            // })

            // передаем тот тест, который мы получили
            dispatch(fetchQuizSuccess(quiz))
        } catch (e) {
            // для обработки ошибки в дальнейшем
            dispatch(fetchQuizesError(e)) // этот метод останавливает загрузку и добавляет некоторый параметр error
        }
    }
}

export function fetchQuizSuccess(quiz) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz
    }
}

export function fetchQuizesStart() {
    return {
        type: FETCH_QUIZES_START
    }
}

export function fetchQuizesSuccess(quizes) {
    return {
        type: FETCH_QUIZES_SUCCESS,
        quizes
    }
}

export function fetchQuizesError(e) {
    return {
        type: FETCH_QUIZES_ERROR,
        error: e
    }
}

export function quizSetState(answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState, results
    }
}

export function finishQuiz() {
    return {
        type: FINISH_QUIZ
    }
}

export function quizNextQuestion(number) {
    return {
        type: QUIZ_NEXT_QUESTION,
        number
    }
}

export function retryQuiz() {
    return {
        type: QUIZ_RETRY
    }
}

export function quizAnswerClick(answerId) {
    // данный метод асинхронный
    return (dispatch, getState) => {
        // с помощью второго параметра - функции getState(), мы можем получить нужный нам state
        const state = getState().quiz // берем поле, которое отвечает за тесты

        if (state.answerState) { // если сейчас находится правильный ответ
            // то мы не должны выполнять данную функцию
            const key = Object.keys(state.answerState)[0]
            if (state.answerState[key] === 'Success') {
                return // чтобы мы не заходили в данную функцию и не было перемещения по вопросам
            }
        }

        // получим доступ к объекту вопроса
        const question = state.quiz[state.activeQuestion] // текущий вопрос
        const results = state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'Success'
            }

            dispatch(quizSetState({[answerId]: 'Success'}, results))

            // this.setState({ // указываем верный ответ
            //     answerState: {[answerId]: 'Success'},
            //     results
            // })

            // мы будем переключать с таймом на след. вопрос
            const timeout = window.setTimeout(() => {
                if (isQuizFinished(state)) {
                    dispatch(finishQuiz())

                    // this.setState({ // мы закончили все вопросы и нам нужно показать некоторые результаты
                    //     isFinished: true
                    // })
                } else {
                    // если голосование не закончилось, то переключаем на другой вопрос
                    // this.setState({
                    //     activeQuestion: this.state.activeQuestion + 1,
                    //     answerState: null
                    // })
                    dispatch(quizNextQuestion(state.activeQuestion + 1))
                }

                // сразу убираем тайм, чтобы не было утечки информации
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            // если мы ответили неправильно, то
            results[question.id] = 'Error' // записываем в объект results, что он неправильный
            dispatch(quizSetState({[answerId]: 'Error'}, results))

            // указываем неверный ответ
            // this.setState({
            //     answerState: {[answerId]: 'Error'},
            //     results // results: results
            // })
        }
    }
}

function isQuizFinished(state) {
    return state.activeQuestion + 1 === state.quiz.length
}