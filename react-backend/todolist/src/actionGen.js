import C from './constants'
import { v4 } from 'uuid'
let setTime = 500;
// export const loginUser = (userid)=>({
//     type:C.LOGIN,
//     userid
// })
export const loginUser = (login)=>
(dispatch, getState)=>{
    setTimeout(()=>
        dispatch({
            type:C.LOGIN,
            login
        }), setTime)
}

export const initData = ()=>
(dispatch, getState)=>{
    setTimeout(()=>{
        dispatch({
            type:C.INIT_DATAS
        })
    },setTime)
}

export const addData = (login, itemid, title, content, grade, due, complete, alarm) =>
(dispatch, getState)=>{
    setTimeout(()=>
   dispatch ({
        type :C.ADD_DATA,
        login,
        itemid,
        title,
        content,
        grade,
        due,
        complete,
        alarm
    })
    ,setTime)
}

export const addNewData = (login, title, content, grade, due, complete, alarm) =>
(dispatch, getState)=>{
    setTimeout(()=>
   dispatch ({
        type :C.ADD_DATA,
        login,
        itemid:v4(),
        title,
        content,
        grade,
        due,
        complete,
        alarm
    })
    ,setTime)
}

export const deleteData = (itemid)=>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type:C.DELETE_DATA,
        itemid
    })
    , setTime)
}

export const modData = (itemid, title, content, grade, due, complete, alarm) =>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type :C.MOD_DATA,
        itemid,
        title,
        content,
        grade,
        due,
        complete,
        alarm
    })
    , setTime)
}

export const alarm = (itemid, alarm) =>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type :C.ALARM,
        itemid,
        alarm
    })
    , 0)
}

export const complete = (itemid, complete) =>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type :C.COMPLETE,
        itemid,
        complete
    })
    , setTime)
}

export const sortDatas = () =>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type :C.SORT,
    })
    , setTime)
}

export const displayView = display =>
(dispatch, getState)=>{
    setTimeout(()=>
    dispatch({
        type:"DISPLAY",
        display
    })
    , setTime)
}