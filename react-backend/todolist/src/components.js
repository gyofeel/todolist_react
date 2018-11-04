import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {v4} from 'uuid';
import {displayView, loginUser, addData, modData, alarm, complete, sortDatas, initData, deleteData, addNewData} from './actionGen'

export const Head =({store})=>{
    let {display, login, datas} = store.getState();
    console.log(login);
    // fetch('/data').then(res=>res.json()).then(data=>console.log(data))
    const logout = e =>{
        let _alarmArr = datas.filter((el)=>el.login===login)
        console.log(datas);
        console.log(_alarmArr);
        fetch('/updatealldata',{
            method:'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                alarmArr : _alarmArr
            })
        }).then(res=>res.json()).then((data)=>{
            store.dispatch(displayView('DISPLAY_LOGIN'))
            store.dispatch(loginUser(''))
            store.dispatch(initData())
        })
    }

    return (
        <div className ="div-head">
            <h1>To Do List</h1>
            <div>
            <p style={(display!=='DISPLAY_LOGIN')?{display:"block"}:{display:"none"}}>{login}님</p>
            <button style={(display!=='DISPLAY_LOGIN')?{display:"block"}:{display:"none"}} className="button logout" onClick={logout} type="button"><span>logout</span></button>
            </div>
        </div>
    )
}

//Body Component
export class Body extends Component{
    constructor(props){
        super(props);
        this.sortedDatas='';
        this.judgeDue = this.judgeDue.bind(this);
        this.clickDataAdd = this.clickDataAdd.bind(this);
        this.sortFunc = this.sortFunc.bind(this);
        this.updateAlarmData = this.updateAlarmData.bind(this);
    }

    componentWillMount(){
        const {store} = this.props;
        const {datas} = store.getState();
        console.log(datas)
        datas.map(d=>{
            let late = this.judgeDue(d.due)
            this.updateAlarmData(late, d.itemid);
        })
    }

    judgeDue(due){
        let splitDue = due.split('-').map(el=>parseInt(el));
        let today = new Date();
        let dueday = new Date(splitDue[0], splitDue[1]-1, splitDue[2]);
        if(dueday<today) return true
        else return false;
    }

    clickDataAdd(){
        const {store} = this.props;
        store.dispatch(displayView('DISPLAY_ADD'))
    }


    sortFunc(datas){
        console.log(datas);
        let temp = datas.sort((a, b)=>{
            let ag = a.grade, bg = b.grade;
            if(ag!=='A'&&ag!=='B'&&ag!=='C'&&ag!=='완료') ag='X'
            else if(ag==='완료') ag='Z'
            if(bg!=='A'&&bg!=='B'&&bg!=='C'&&bg!=='완료') bg='X'
            else if(bg==='완료') bg='Z'
            if(ag<bg) return -1;
        })
        console.log(temp);
        return temp
    }

    updateAlarmData(late, itemid){
        const {store} = this.props;
        if(late){
            store.dispatch(alarm(itemid, late))
        }else{
            store.dispatch(alarm(itemid, late))
        }
        
    }

    render(){
        const {store} = this.props;
        let {datas, display} = store.getState();
        this.sortedDatas = this.sortFunc(datas);
        return (
            <div className ="div-body"  style={(display!=='DISPLAY_LOGIN')?{display:"block"}:{display:"none"}}>
                {(this.sortedDatas.length === 0) ?
                    <h3 className='noData'>할 일을 추가하세요!</h3>:
                    this.sortedDatas.map(data=>{
                        return (<Data key={data.itemid}
                            store={store}
                            {...data}
                            onAdd={()=>{
                                store.dispatch(display('DISPLAY_ADD'))
                            }}
                            onDelete={()=>{
                                store.dispatch(deleteData(data.itemid))
                                fetch('/deletedata', {
                                    method:'post',
                                    headers: {'Content-Type':'application/json'},
                                    body:JSON.stringify({
                                        "itemid":data.itemid
                                    })
                                }).then(res=>res.json()).then((data)=>{
                                })
                            }}
                            onModify={()=>{
                                store.dispatch(displayView('DISPLAY_MOD_'+data.itemid))
                            }}
                            onComplete={()=>{
                                store.dispatch(complete(data.itemid, true))
                                fetch('/updatedata', {
                                    method:'post',
                                    headers:{'Content-Type':'application/json'},
                                    body:JSON.stringify({
                                        "login":store.getState().login,
                                        "itemid":data.itemid,
                                        "title":data.title,
                                        "content":data.content,
                                        "grade":"완료",
                                        "due":data.due,
                                        "complete":true,
                                        "alarm":data.alarm
                                    })
                                })
                                .then(res=>res.json()).then((d)=>{
                                    store.dispatch(modData(data.itemid, data.title, data.content, "완료", data.due, true, data.alarm))
                                })
                            }}
                            onAlarm={(alarm)=>{
                                store.dispatch(alarm(data.itemid, alarm))
                            }}
                        />)})}
                    <section className='data add' onClick={this.clickDataAdd}>+</section>
            </div>
        )
    }
}

//Data Component
export const Data =({key, login, title, content, grade, due, complete, alarm, onAdd, onDelete, onModify, onComplete, onAlarm})=>{
    return (
        <div className='data'>
        <div className='div-titleandcontent'>
            <h3 className="data-title">{title}</h3>
            <p className="data-content">{content}</p>
        </div>
        <div className='div-gradduebutton'>
            <div className='div-grade' style={(grade==='완료')?{color:'green'}:{}}><p>{grade}</p></div>
            <div className='div-due' style={(alarm)?{backgroundColor:'red',color:'white'}:{color:'black'}}><p>{due}</p></div>
            <div className='div-data-button'>
                <button className="button delete" onClick={onDelete}>삭제</button>
                <button className="button modify" onClick={onModify} style={(grade==='완료')?{display:'none'}:{display:'inline'}}>수정</button>
                <button className="button complete" onClick={onComplete} style={(grade==='완료')?{display:'none'}:{display:'inline'}}>완료</button>
            </div>
        </div>
        </div>
    )
}

//AddForm Component
export class AddForm extends Component {

    constructor(props){
        super(props);
        this._grade='';
        this.beforeRendering = true;
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.change = this.change.bind(this);
        this.judgeDue = this.judgeDue.bind(this);
        this.updateAlarmData = this.updateAlarmData.bind(this);
    }

    componentDidMount(){
        this.beforeRendering = false;
    }
    
    judgeDue(due){
        let splitDue = due.split('-').map(el=>parseInt(el));
        let today = new Date();
        let dueday = new Date(splitDue[0], splitDue[1]-1, splitDue[2]);
        if(dueday<today) return true
        else return false;
    }

    updateAlarmData(late, itemid){
        const {store} = this.props;
        if(late){
            store.dispatch(alarm(itemid, late))
        }else{
            store.dispatch(alarm(itemid, late))
        }
    }

    submit(e) {
        const {store} = this.props;
        let {login, display} = store.getState();
        const {_title, _content, _year, _month, _day, _A, _B, _C} = this.refs;
        e.preventDefault();
        _A.checked = false;
        _B.checked = false;
        _C.checked = false;

        if(display==="DISPLAY_ADD"){
            fetch('/savedata',{
                method:'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({
                    "login":login,
                    "itemid":v4(),
                    "title":_title.value,
                    "content":_content.value,
                    "grade":this._grade,
                    "due":_year.value+'-'+((parseInt(_month.value)<10)?('0'+parseInt(_month.value)):(_month.value))+'-'+((parseInt(_day.value)<10)?('0'+parseInt(_day.value)):(_day.value)),
                    "complete":false,
                    "alarm":false
                })
            }).then(res=>res.json()).then((data)=>{
                console.log('addForm')
                console.log(data);
                store.dispatch(addData(data.login, data.itemid, data.title, data.content, data.grade, data.due, data.complete, data.alarm))
                store.dispatch(displayView('DISPLAY_MAIN'))
                _title.value = ''
                _content.value = ''
                _year.value = ''
                _month.value = ''
                _day.value = ''
                let late = this.judgeDue(data.due)
                this.updateAlarmData(late, data.itemid);
                setTimeout(()=>{window.location.reload();}, 1000)
            })
        } else{
            let itemid = display.split('_')[2]
            let data = store.getState().datas.find((el)=>el.itemid === itemid)
            fetch('/updatedata', {
                method:'post',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    "login":login,
                    "itemid":itemid,
                    "title":_title.value,
                    "content":_content.value,
                    "grade":this._grade,
                    "due":_year.value+'-'+_month.value+'-'+_day.value,
                    "complete":data.complete,
                    "alarm":data.alarm
                })
            })
            .then(res=>res.json()).then((d)=>{
                if(d.success){
                    store.dispatch(modData(itemid, _title.value, _content.value, this._grade, _year.value+'-'+_month.value+'-'+_day.value, data.complete, data.alarm))
                    store.dispatch(displayView('DISPLAY_MAIN'))
                    _title.value = ''
                    _content.value = ''
                    _year.value = ''
                    _month.value = ''
                    _day.value = ''
                    let late = this.judgeDue(data.due)
                    this.updateAlarmData(late, data.itemid);
                    setTimeout(()=>{window.location.reload();}, 1000)
                } else{
                }
            })
        }
    }

    cancel(e){
        const {store} = this.props;
        const {_title, _content, _year, _month, _day} = this.refs;
        e.preventDefault();
        store.dispatch(displayView('DISPLAY_MAIN'))
        _title.value = ''
        _content.value = ''
        _year.value = ''
        _month.value = ''
        _day.value = ''
    }

    change(e){
        const val = e.target.value;
        this._grade = val;
    }

    render(){
        const {store} = this.props;
        let {display} = store.getState();
        const {_title, _content, _year, _month, _day} = this.refs;
        let splitDisplay = display.split('_');
        if(this.beforeRendering===false){
            _title.value = ''
            _content.value = ''
            _year.value = ''
            _month.value = ''
            _day.value = ''
            if(splitDisplay[1]==='MOD'){
                let itemid = splitDisplay[2];
                let data = store.getState().datas.find((el)=>el.itemid === itemid)
                _title.value = data.title;
                _content.value = data.content;
                _year.value = data.due.split('-')[0];
                _month.value = data.due.split('-')[1];
                _day.value = data.due.split('-')[2];
            }
        }
        return(
            <form className = "form-add" onSubmit={this.submit} style={(display==='DISPLAY_ADD'||splitDisplay[1]==='MOD')?{display:"block"}:{display:"none"}}>
            {/* <form className = "form-add" onSubmit={submit}> */}
                <h1>ADD To Do</h1>
                <div className="mat-div">
                    <label className="mat-label">제목:</label>
                    <input className="mat-input title" id="title" type="text" ref="_title" required/>
                </div>
                <div className="mat-div">
                    <label className="mat-label">내용:</label>
                    <input className="mat-input content" id="content" type="text" ref="_content" required/>
                </div>
                <div className="div-radio">
                <legend>우선순위 :</legend>
                    <fieldset className="fieldset-radio">
                    <div>
                        <div>
                            <input className="input-radio" name='radio' id="A" value="A" type="radio" ref="_A" onChange={this.change.bind(this)} />
                            <label className="mat-label">A</label>
                        </div>
                        <div>
                            <input className="input-radio" name='radio' id="B" value="B" type="radio" ref="_B" onChange={this.change.bind(this)} />
                            <label className="mat-label">B</label>
                        </div>
                        <div>
                            <input className="input-radio" name='radio' id="C" value="C" type="radio" ref="_C" onChange={this.change.bind(this)} />
                            <label className="mat-label">C</label>
                        </div>
                        </div>
                    </fieldset>
                </div>
                <legend>마감기한 :</legend>
                <div className="div-due">
                    <div className="mat-div">
                        <input className="mat-input y" id="year" type="text" pattern="\d{3,4}"ref="_year"/>
                        <label className="mat-label">년</label>
                    </div>
                    <div className="mat-div">
                        <input className="mat-input m" id="month" type="text" pattern="\d{1,2}" ref="_month"/>
                        <label  className="mat-label">월</label>
                    </div>
                    <div className="mat-div">
                        <input className="mat-input d" id="day" type="text" pattern="\d{1,2}" ref="_day"/>
                        <label className="mat-label">일</label>
                    </div>
                </div>
                <div className="div-cancelsubmit">
                <button className="button cancel" onClick={this.cancel} type="button"><span>취소</span></button>
                <button className="button save" type="submit"><span>저장</span></button>
                </div>
    </form>
        )
    }
}

export const LoginForm =({store})=>{
    let {display} = store.getState();

    let _name;
    let _nameValue;
    const submit = e =>{
        e.preventDefault();
        _nameValue = _name.value
        console.log(_nameValue)

        fetch('/user', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
                "login":_nameValue
            })
        }).then(res=>res.json()).then((data)=>{
            store.dispatch(loginUser(data.login))
            store.dispatch(displayView('DISPLAY_MAIN'))
        })

        fetch('/getdata', {
            method:'post',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                "login":_nameValue
            })
        }).then(res=>res.json()).then((d)=>{
            if(d.exist){
                console.log(d);
                store.dispatch(initData())
                d.data.map((el)=>{
                    console.log(el);
                    let {login, itemid, title, content, grade, due, complete, alarm} = el
                    console.log(alarm);
                    store.dispatch(addData(login, itemid, title, content, grade, due, complete, alarm))
                    console.log(store.getState())
                })
            }
        })

    }
    
    return (
        <div className="div-form" style={(display=='DISPLAY_LOGIN')?{display:"block"}:{display:"none"}}>
            <form className = "form-login" onSubmit={submit}>
            <h1>To Do List</h1>
            <legend><p>이름을 입력하세요.</p><br/>(최초 접속 시, 계정이 생성됩니다.)</legend>
                    <div className="mat-div login">
                    {/* <label className="mat-label login">이름 : </label> */}
                    <input className="mat-input login" id="name" type="text" ref={input=>_name = input} required/>
                    <button className="button login" type="submit"><span>Go!</span></button>
                </div>
            </form>
        </div>
    )
}