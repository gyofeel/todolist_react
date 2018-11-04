import C from './constants'

export const login = (state="", action)=>{
    switch(action.type){
        case C.LOGIN:
            return action.login
        default:
            return state
    }
}

export const data = (state={}, action)=>{
    switch(action.type){
        case C.ADD_DATA:
            return{
                login : action.login,
                itemid : action.itemid,
                title : action.title,
                content : action.content,
                grade : action.grade,
                due : action.due,
                complete : action.complete,
                alarm : action.alarm
            }
        case C.MOD_DATA:
            return (state.itemid !== action.itemid)?state:{
                ...state,
                title : action.title,
                content : action.content,
                grade : action.grade,
                due : action.due,
                complete : action.complete,
                alarm : action.alarm
            }
        case C.ALARM:
            return (state.itemid !== action.itemid)?state:{
                ...state,
                alarm: action.alarm
            }
        case C.COMPLETE:
            return (state.itemid !== action.itemid)?state:{
                ...state,
                complete: action.complete
            }
        default:
            return state
    }
}

export const datas = (state=[], action)=>{
    switch(action.type){
        case C.INIT_DATAS:
        return []
        case C.ADD_DATA:
        return [
            ...state,
            data({}, action)
        ]
        case C.MOD_DATA:
            return state.map(c=>data(c, action))
        case C.ALARM:
            return state.map(c=>data(c, action))
        case C.COMPLETE:
            return state.map(c=>data(c, action))
        case C.DELETE_DATA:
            return state.filter(c=>c.itemid !== action.itemid)   
        default:
            return state;
    }
}

export const sort = (state='', action)=>{
    return action.type;
}

export const display = (state='DISPLAY_LOGIN', action)=>{
    switch(action.type){
        case "DISPLAY":
            return action.display
        default :
            return state
    }
}
