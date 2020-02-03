import React, {Component} from 'react'
import classes from './Drawer.module.css'
import {NavLink} from 'react-router-dom'
import Backdrop from '../../UI/Backdrop/Backdrop'

// const links = [
//     {to: '/', label: 'Список', exact: true}, // из теории роутинга - такая страница будет считываться даже, если там будет какой-то префикс (а нам нужно указать, что нам нужно только точное совпадение)
//     {to: '/auth', label: 'Авторизация', exact: false},
//     {to: '/quiz-creator', label: 'Создать тест', exact: false},
// ]

class Drawer extends Component {
    clickHandler = () => {
        this.props.onClose()
    }

    renderLinks(links) {
        return links.map((link, index) => {
            return (
                <li key={index}>
                    <NavLink
                        to={link.to}
                        exact={link.exact}
                        activeClassName={classes.active}
                        onClick={this.clickHandler}
                    >
                        {link.label}
                    </NavLink>
                </li>
            )
        })
    }

    render() {
        const cls = [classes.Drawer]

        if (!this.props.isOpen) { // если меню закрыто
            cls.push(classes.close) // то в массив классов мы положим close
        }

        const links = [
            {to: '/', label: 'Список', exact: true} // из теории роутинга - такая страница будет считываться даже, если там будет какой-то префикс (а нам нужно указать, что нам нужно только точное совпадение)
        ]

        if (this.props.isAuthenticated) {
            links.push({to: '/quiz-creator', label: 'Создать тест', exact: false})
            links.push({to: '/logout', label: 'Выйти', exact: false})
        } else {
            links.push({to: '/auth', label: 'Авторизация', exact: false})
        }

        return (
            <React.Fragment>
                <nav className={cls.join(' ')}>
                    <ul>
                        {this.renderLinks(links)}
                    </ul>
                </nav>
                { this.props.isOpen ? <Backdrop onClick={this.props.onClose}/> : null }
            </React.Fragment>
        )
    }
}

export default Drawer