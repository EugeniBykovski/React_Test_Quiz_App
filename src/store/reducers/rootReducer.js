// Это функция, которая объединяет все существующие reducers
import {combineReducers} from 'redux'
import quizReducer from './quiz'
import createReducer from './create'
import authReducer from './auth'

// сюда мы будем передавать объект конфигурации, где будут описаны все наши редюсеры
export default combineReducers({
    quiz: quizReducer, // подключаем новый state
    create: createReducer,
    auth: authReducer
})