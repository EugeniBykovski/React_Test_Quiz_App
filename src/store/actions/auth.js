import axios from 'axios'
import {AUTH_SUCCESS, AUTH_LOGOUT} from './actionTypes'

export function auth(email, password, isLogin) {
    // возвращаем асинхронный dispatch, поскольку будем делать запрос к серверу
    return async dispatch => {
        const authData = {
            email, password,
            returnSecureToken: true
        }

        // определим какой именно запрос нам нужно делать? на регистрацию или авторизацию
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_et8p9LSqffPxZi7nU-37H0Cga96ZVyE'

        if (isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_et8p9LSqffPxZi7nU-37H0Cga96ZVyE'
        }

        /*
        Auth:
        wfm@mail.ru
        12345678

        Log:
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_et8p9LSqffPxZi7nU-37H0Cga96ZVyE'

        Pass:
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_et8p9LSqffPxZi7nU-37H0Cga96ZVyE'
        */

        // теперь axios будет делать запрос по некоторому url с параметрами auth.data
        const response = await axios.post(url, authData)
        const data = response.data
        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

        // ! Для того, чтобы как-то поддерживать сессию в реакт приложениях, нам нужно данный token, который мы получили от сервера, положить в localStorage

        localStorage.setItem('token', data.idToken)
        localStorage.setItem('userId', data.localId) // заносим локальный id пользователя
        localStorage.setItem('expirationDate', expirationDate) // нужно еще обработать expirationDate

        // мы можем отдиспатчить новое событие
        dispatch(authSuccess(data.idToken))
        dispatch(autoLogout(data.expiresIn))
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout() {
    // нужно после всего очистить наш localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationDate')

    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))

            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token))
                dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}