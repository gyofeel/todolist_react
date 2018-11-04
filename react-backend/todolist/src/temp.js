//AddForm Component
// export const AddForm =({store})=>{
//     let _title, _content, _grade, _year, _month, _day
//     let _A, _B, _C
//     let {login, display} = store.getState();
//     let splitDisplay = display.split('_');
//     let modValue;
//     if(splitDisplay[1]==='MOD'){
//         let itemid = splitDisplay[2];
//         let data = store.getState().datas.find((el)=>el.itemid === itemid)
//         modValue = data
//     }

//     const submit = e =>{
//         e.preventDefault();
//         _A.checked = false;
//         _B.checked = false;
//         _C.checked = false;
//         console.log('submit')
//         fetch('/savedata',{
//             method:'post',
//             headers: {'Content-Type':'application/json'},
//             body:JSON.stringify({
//                 "login":login,
//                 "itemid":v4(),
//                 "title":_title.value,
//                 "content":_content.value,
//                 "grade":_grade,
//                 "due":_year.value+'-'+_month.value+'-'+_day.value,
//                 "complete":false,
//                 "alarm":false
//             })
//         }).then(res=>res.json()).then((data)=>{
//             console.log('addForm')
//             console.log(data);
//             store.dispatch(addData(data.userid, data.itemid, data.title, data.content, data.grade, data.due, data.complete, data.alarm))
//             store.dispatch(displayView('DISPLAY_MAIN'))
//             _title.value = ''
//             _content.value = ''
//             _year.value = ''
//             _month.value = ''
//             _day.value = ''
//         })
//     }

//     const cancel = e =>{
//         e.preventDefault();
//         console.log('cancel')
//         store.dispatch(displayView('DISPLAY_MAIN'))
//         _title.value = ''
//         _content.value = ''
//         _year.value = ''
//         _month.value = ''
//         _day.value = ''
//     }

//     const change = e =>{
//         const val = e.target.value;
//         console.log(val);
//         _grade = val;
//     }
    
//     const onload = e =>{
//         alert('aaa');
//     }

//     return (
//         <form className = "form-add" onSubmit={submit} style={(display==='DISPLAY_ADD'||splitDisplay[1]==='MOD')?{display:"block"}:{display:"none"}}>
//                 {/* <form className = "form-add" onSubmit={submit}> */}
//                     <div className="mat-div">
//                         <label className="mat-label">제목</label>
//                         <input className="mat-input" id="title" type="text" Onload={onload} ref={input=>_title = input} required/>
//                     </div>
//                     <div className="mat-div">
//                         <label className="mat-label">내용</label>
//                         <input className="mat-input" id="content" type="text" ref={input=>_content = input} required/>
//                     </div>
//                     <div className="div-radio">
//                     <legend>우선순위</legend>
//                         <fieldset>
//                             <div>
//                                 <input className="input-radio" name='radio' id="A" value="A" type="radio" ref={input=>_A=input} onChange={change.bind(this)} />
//                                 <label className="mat-label">A</label>
//                             </div>
//                             <div>
//                                 <input className="input-radio" name='radio' id="B" value="B" type="radio" ref={input=>_B=input} onChange={change.bind(this)} />
//                                 <label className="mat-label">B</label>
//                             </div>
//                             <div>
//                                 <input className="input-radio" name='radio' id="C" value="C" type="radio" ref={input=>_C=input} onChange={change.bind(this)} />
//                                 <label className="mat-label">C</label>
//                             </div>
//                         </fieldset>
//                     </div>
//                     <div className="div-due">
//                         <div className="mat-div">
//                             <input className="mat-input" id="year" type="text" ref={input=>_year=input} editable/>
//                             <label className="mat-label">년</label>
//                         </div>
//                         <div className="mat-div">
//                             <input className="mat-input" id="month" type="text" ref={input=>_month=input}/>
//                             <label  className="mat-label">월</label>
//                         </div>
//                         <div className="mat-div">
//                             <input className="mat-input" id="day" type="text" ref={input=>_day=input}/>
//                             <label className="mat-label">일</label>
//                         </div>
//                     </div>
//                     <button className="button cancel" onClick={cancel} type="button"><span>취소</span></button>
//                     <button className="button" type="submit"><span>저장</span></button>
//         </form>
//     )
// }

export const Body =({store})=>{
    let {datas, display} = store.getState()
    console.log(datas);
    let sortedDatas = sortFunc(datas);

    const judgeDue = (due)=>{
        let splitDue = due.split('-').map(el=>parseInt(el));
        let today = new Date();
        let dueday = new Date(splitDue[0], splitDue[1]-1, splitDue[2]);
        if(dueday<today) return true
        else return false;
    }

    const clickDataAdd = ()=>{
        store.dispatch(displayView('DISPLAY_ADD'))
    }

    // console.log(datas);
    return (
        <div className ="div-body"  style={(display!=='DISPLAY_LOGIN')?{display:"block"}:{display:"none"}}>
            {(sortedDatas.length === 0) ?
                <h3>일정이 없습니다.</h3>:
                sortedDatas.map(data=>{
                    let late = judgeDue(data.due);
                    return (<Data key={data.itemid}
                        {...data}
                        // onAdd={(login, title, content, grade, due, complete, alarm)=>{
                        //     store.dispatch(addData(login, title, content, grade, due, complete, alarm))
                        // }}
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
                        // onModyfy={(login ,itemid, title, content, grade, due, complete, alarm)=>{
                        //     store.dispatch(modData(title, content, grade, due, complete, alarm))
                        // }}
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
                                if(d.success){
                                } else{
                                }
                            })
                        }}
                        onAlarm={(alarm)=>{
                            store.dispatch(alarm(data.itemid, alarm))
                        }}
                    />)})}
                <section className='data add' onClick={clickDataAdd}></section>
        </div>
    )
}




//====


let express = require('express');
let router = express.Router();
let crud = require('../crud')

/* GET home page. */
router.post('/data', (req, res, next)=>{
  let {login} = req.body;
  console.log(login);
  res.json([{
  	id: 1,
  	username: "samsepi0l"
  }, {
  	id: 2,
  	username: "D0loresH4ze"
  }]);
});

router.post('/user', (req, res, next)=>{
  let {login} = req.body;
  let _login;
  crud.readUser(login)
  .then((v)=>{
    _login = v[0].login;
    res.json({
      login : _login
    })
  })
  .catch((v)=>{
    console.log(login);
    let newData = crud.saveUser(login)
    console.log(newData);
    newData.save()
    .then((v)=>{
      _login = v.login;
      res.json({
        login:_login
      })
    })
    .catch(()=>{
      console.log('wow')
    })
  })
});


router.post('/getdata', (req, res, next)=>{
  let {login} = req.body;
  crud.readData(login)
  .then((v)=>{
    res.json({
      data:v,
      exist : true
    })
  })
  .catch((v)=>{
    res.json({
      exist : false
    })
  })
});

router.post('/savedata', (req, res, next)=>{
  let {login, itemid, title, content, grade, due, complete, alarm} = req.body;
  let newData = crud.saveData(login, itemid, title, content, grade, due, complete, alarm)
  newData.save()
  .then((v)=>{
    console.log(v);
    res.json(v)
  })
});

router.post('/deletedata', (req, res, next)=>{
  let {itemid} = req.body;
  console.log(itemid);
  crud.deleteData(itemid)
  .then((v)=>{
    console.log('delete success')
    res.json({
      success : true
    })
  })
  .catch((v)=>{
    res.json({
      success : false
    })
  })
})

router.post('/updatedata', (req, res, next)=>{
  let {login, itemid, title, content, grade, due, complete, alarm} = req.body

  crud.updateData(login, itemid, title, content, grade, due, complete, alarm)
  .then((v)=>{
    res.json({
      success : true
    })
  })
  .catch((v)=>{
    res.json({
      success : false
    })
  })
})

router.post('/updatealldata', (req, res, next)=>{
  let {alarmArr} = req.body
console.log(alarmArr);
  alarmArr.map(el=>{
    crud.updateAlarmData(el.login, el.itemid, el.alarm)
  })

  res.json({
    success:true
  })
})

module.exports = router;
