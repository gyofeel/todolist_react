import {createStore, combineReducers} from 'redux'
import {login, datas, sort, display} from './reducers'

const store = createStore(combineReducers({login, datas, sort, display}),
(localStorage['redux-store'])?JSON.parse(localStorage['redux-store']):{})

store.subscribe(()=>{
    localStoreage['redux-store'] = JSON.stringify(store.getState())
})

console.log(store.getState())