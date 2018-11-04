import {createStore, combineReducers, applyMiddleware} from 'redux'
import {login, datas, sort, display} from './reducers'
import stateData from './initialState'
import thunk from 'redux-thunk'

const logger = store => next => action => {
    let result
    console.groupCollapsed('디스패칭', action.type)
    console.log('이전 상태', store.getState())
    console.log('액션', action)
    result = next(action)
    console.log('다음 상태', store.getState())
    console.groupEnd()
    return result
}

const saver = store => next => action => {
    let result = next(action)
    localStorage['redux-store'] = JSON.stringify(store.getState())
    return result
}

const middleware = server =>[
    logger, saver, thunk
]

const storeFactory = (server=false, initialState=stateData) =>
    applyMiddleware(...middleware(server))(createStore)(
        combineReducers({login, datas, sort, display})
        ,(localStorage['redux-store'])?
            JSON.parse(localStorage['redux-store']) : 
            stateData
    )

export default storeFactory