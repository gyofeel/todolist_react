import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import storeFactory from './storeFactory'

const store = storeFactory()

window.React = React
window.store = store

const render = ()=>
ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root')
)

store.subscribe(render)
render()
