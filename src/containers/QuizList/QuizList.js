import React, {Component} from 'react'
import classes from './QuizList.module.css'
import {NavLink} from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
// import axios from '../../axios/axios-quiz'
import {connect} from 'react-redux'
import {fetchQuizes} from '../../store/actions/quiz'

// здесь мы грузим с сервера набор тех тестов, которые есть в нашем приложении

class QuizList extends Component {
    // формируем state, где будем хранить список всех наших тестов
    // state = {
    //     quizes: [],
    //     loading: true
    // }

    // мы будем обращаться к массиву всех тестов, которые у нас есть в приложении, которые мы далее будем забирать с backend
    renderQuizes() {
        return this.props.quizes.map(quiz => {
            return (
                <li
                    key={quiz.id}
                >
                    <NavLink to={'/quiz/' + quiz.id}>
                        {quiz.name}
                    </NavLink>
                </li>
            )
        })
    }

    // делаем get запрос к базе данных
    // componentDidMount() {
    //     axios.get('https://react-quiz-a6cdd.firebaseio.com/quiz.json').then(response => {
    //         console.log(response);
    //     })
    // }

    async componentDidMount() { // код грузит нам все наши тесты
        this.props.fetchQuizes()
        /*
        оборачиваем все в блок try, чтобы отловить ошибку
        try {
            const response = await axios.get('/quizes.json')
            const quizes = []

        делаем map, чтобы преобразовать формат данных в тот формат, который нам нужен для реакт компонента. Для этого пробежимся по ключам данного объекта и будем получать id каждого объекта и индекс
            Object.keys(response.data).forEach((key, index) => {
                теперь на каждой итерации будем класть новый объект
                quizes.push({
                    id: key,
                    name: `Тест №${index + 1}`
                })
            })

            изменяем состояние нашей страницы
            this.setState({
                quizes, loading: false // как только закончится загрузка
            })
        } catch (e) {
            console.log(e);
        }
        */
    }

    // * Теперь в коде не осталось никакой логики. Все, что мы здесь делаем, это отрисовываем какие-то элементы, на основе того, что нам прилетело с сервера

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Список тестов</h1>

                    {this.props.loading && this.props.quizes.length !== 0
                            ? <Loader />
                            : <ul>
                                {this.renderQuizes()}
                              </ul>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { // возвращаем параметры, которые описали в начальном state
        quizes: state.quiz.quizes,
        loading: state.quiz.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // здесь будем говорить компоненту о том, что ему нужно загрузить какой-то набор тестов
        fetchQuizes: () => dispatch(fetchQuizes())
    }
}

// передаем компонент, который мы хотим обернуть и чтобы он взаимодействовал со store
export default connect(mapStateToProps, mapDispatchToProps)(QuizList)