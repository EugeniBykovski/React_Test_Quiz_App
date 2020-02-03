import React from 'react'
import classes from './Button.module.css'

const Button = props => {
    const cls = [
        // массив будет принимать в себя 2 класса
        classes.Button, // относится к кнопке
        classes[props.type] // определяет цвет данной кнопки (тип)
    ]

    return (
        <button
            onClick={props.onClick}
            className={cls.join(' ')}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )
}

export default Button