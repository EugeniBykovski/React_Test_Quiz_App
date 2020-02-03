import React from 'react'
import classes from './Input.module.css'

// реализовываем функцию, которая проверяет, есть ли у нас ошибка в input сейчас или нет
function isInvalid({valid, touched, shouldValidate}) { // проверяем здесь не валидный ли контрол?
    return !valid && shouldValidate && touched // если он не валидный и, если мы должны его валидировать и, если мы уже его потрогали, то это означает, что он у нас уже не валидный
}

const Input = props => {
    // создадим специальное свойство, которое будет определлять какого типа у нас ьудет данный input
    const inputType = props.type || 'text'
    const cls = [classes.Input]
    const htmlFor = `${inputType}-${Math.random()}`

    if (isInvalid(props)) {
        cls.push(classes.invalid)
    }

    return (
        <div className={cls.join(' ')}>
            <label htmlFor={htmlFor}>{props.label}</label>
            <input
                type={inputType}
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
            />

            { // такакя же проверка и для span
                isInvalid(props)
                    ? <span>{props.errorMessage || 'Введите верное значение'}</span>
                    : null
            }
        </div>
    )
}

export default Input