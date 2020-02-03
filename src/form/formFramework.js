// создаем собственный framework
export function createControl(config, validation) {
    return {
        ...config,
        validation,
        valid: !validation, // если мы передали какой-то набор правил валидации, то начальное значение будет false
        touched: false,
        value: ''
    }
}

export function validate(value, validation = null) {
    if (!validation) { // если у нас нет параметров validation
        return true // то возвращаем true
    }

    // если же нет, то:
    let isValid = true

    if (validation.required) { // если есть такое требование к валидации
        isValid = value.trim() !== '' && isValid
    }

    return isValid
}

export function validateForm(formControls) {
    let isFormValid = true

    // нужно пробежаться по всему объекту formControls и спросить, если у нас валидны все контролы (элементы) данной формы, то вся форма у нас будет валидная
    for (let control in formControls) {
        if (formControls.hasOwnProperty(control)) {
            isFormValid = formControls[control].valid && isFormValid
        }
    }

    return isFormValid
}