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
    .catch((err)=>{
      console.log(err)
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
