import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// создаем store для redux
import {createStore, compose, applyMiddleware} from 'redux'
// компонент Провайдер, чтобы redux поддерживался в нашем приложении
import {Provider} from 'react-redux'
import rootReducer from './store/reducers/rootReducer'
// компонент redux-thunk
import thunk from 'redux-thunk'

// подключаем redux devtools
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

// сформируем store
const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();

