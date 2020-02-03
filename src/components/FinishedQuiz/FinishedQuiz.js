import React from 'react'
import classes from './FinishedQuiz.module.css'
import Button from '../UI/Button/Button'
import {Link} from 'react-router-dom' // это просто навигационная ссылка, она оборачивает другие компоненты и позволяет делать навигацию с чуть меньшим функционалом

const FinishedQuiz = props => {
    const successCount = Object.keys(props.results).reduce((total, key) => {
        if (props.results[key] === 'Success') {
            total++
        }

        return total
    }, 0)

    return (
        <div className={classes.FinishedQuiz}>
            <ul>
                {
                    props.quiz.map((quizItem, index) => {
                        const cls = [
                            'fa',
                            props.results[quizItem.id] === 'Error' ? 'fa-times' : 'fa-check',
                            classes[props.results[quizItem.id]]
                        ]

                        return (
                            <li
                                key={index}
                            >
                                <strong>{index + 1}</strong>.&nbsp;
                                {quizItem.question}
                                <i className={cls.join(' ')}/>
                            </li>
                        )
                    })
                }
            </ul>

            <p>Правильно {successCount} из {props.quiz.length}</p>

            <div>
                <Button onClick={props.onRetry} type="primary">Repeat</Button>
                <Link to={'/'}>
                    <Button type="Success">Перейти в список тестов</Button>
                </Link>
            </div>
        </div>
    )
}

export default FinishedQuiz