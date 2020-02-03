// здесь лежит новый instance axios, который задан с базовым url, который мы можем конфигурировать

import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-a6cdd.firebaseio.com/'
})