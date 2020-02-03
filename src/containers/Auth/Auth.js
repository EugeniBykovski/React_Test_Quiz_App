import React, {Component} from 'react'
import classes from './Auth.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'
// import axios from 'axios'
import {connect} from 'react-redux'
import {auth} from '../../store/actions/auth'

class Auth extends Component {
    state = { // создаем state для валидации
        isFormValid: false,
        formControls: { // у нас будет 2 контрола на email и password
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный email',
                valid: false, // отвечает за состояние валидации данного контрола
                touched: false, // отвечает за состояние, был ли затронут данный input или нет
                validation: {
                    required: true, // требуем, чтобы ввели данный контрол
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Password',
                errorMessage: 'Введите корректный password',
                valid: false, // отвечает за состояние валидации данного контрола
                touched: false, // отвечает за состояние, был ли затронут данный input или нет
                validation: {
                    required: true, // требуем, чтобы ввели данный контрол
                    minLength: 6
                }
            }
        }
    }

    loginHandler = () => {
        this.props.auth(
            this.state.formControls.email.value, // значение email
            this.state.formControls.password.value, // значение password
            true
        )
    }

    registerHandler = () => {
        this.props.auth(
            this.state.formControls.email.value, // значение email
            this.state.formControls.password.value, // значение password
            false
        )
    }

    submitHandler = event => {
        event.preventDefault()
    }

    validateControl(value, validation) {
        if (!validation) { // если мы не передавали набор параметров, то валидировать control не нужно
            return true
        }

        // если проверка не прошла
        let isValid = true

        // добавляем проверки
        if (validation.required) {
            // будем валидировать на required
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            // будем валидировать на почту
            isValid = is.email(value) && isValid
        }

        if (validation.minLength) {
            // будем валидировать на минимальную длину данного символа строки value
            isValid = value.trim().length >= validation.minLength && isValid
        }

        return isValid
    }

    // нам не нужно мутировать определенные объекты в стэйте, нам нужно всегда пользоваться только определенной функцией setState()
    onChangeHandler = (event, controlName) => {
        // для того, чтобы state не мутировался, будем создавать копии
        const formControls = {...this.state.formControls} // получаем копию данного state
        // создаем копию нужного control
        const control = {...formControls[controlName]} // чтобы был абсолютно независимый объект

        control.value = event.target.value
        // теперь проверим валидный ли теперь наш input
        control.touched = true // как только мы попали в изменение данного input, это означает, что пользователь уже что-то ввел
        control.valid = this.validateControl(control.value, control.validation) // определяем валиден ли наш control. Передаем значение и объект конфигурации, который говорит нам то, как нужно валидировать и конфигурировать объект

        // нужно обновить локальную копию formControls по имени и задать нужный нам control, изменить состояние самого state
        formControls[controlName] = control

        // изменяем состояние, когда мы что-то вписываем в inputs. После получения всех актуальных контролов со всеми актуальными значениями и полями валидации
        let isFormValid = true

        // мы должны пробежаться по всем объектам объекта formControls и спросить у каждого контрола, валидный он или нет
        Object.keys(formControls).forEach(name => { // получаем ключи
            isFormValid = formControls[name].valid && isFormValid // если поле валидное и все время стояло в значении true, то и все isFormValid будет true
        })

        // делаем изменение state
        this.setState({
            formControls, isFormValid
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submitHandler} className={classes.AuthForm}>
                        {this.renderInputs()}

                        <Button
                            type='Success'
                            onClick={this.loginHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Войти
                        </Button>
                        <Button
                            type='primary'
                            onClick={this.registerHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}

// функция позволяет регистрироваться в системе
function mapDispatchToProps(dispatch) {
    return {
        auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
    }
}

export default connect(null, mapDispatchToProps)(Auth)