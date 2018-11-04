const db = require('./database');

exports.readUser = (login)=>{
    return new Promise((resolve, reject)=>{
        db.colUser.find({
            login: login
        }).exec((err, result)=>{
            if(err){reject(false);}
            if(result){
                resolve(result);
            }else reject(false);
        })
    })
}

exports.saveUser = (login)=>{
        let newData = new db.colUser({
            login,
        });
      
        return newData;
};

exports.readData = (login)=>{
    return new Promise((resolve, reject)=>{
        db.colData.find({
            login: login
        }).exec((err, result)=>{
            if(err){reject(false);}
            if(result){
                resolve(result);
            } else reject(false);
        });
    });
}

exports.saveData = (login, itemid, title, content, grade, due='-', complete='false', alarm='false')=>{
    let newData = new db.colData({
            login,
            itemid,
            title,
            content,
            grade,
            due,
            complete,
            alarm
        });
    return newData;
};

exports.updateData = (login, itemid, title, content, grade, due, complete, alarm)=>{
    return new Promise((resolve, reject)=>{
        db.colData.findOne({
            login:login,
            itemid:itemid
        }).exec((err, result)=>{
            if(err){reject(err.message);}
            if(result){
                db.colData.update({
                    login:login,
                    itemid:itemid
                }, {
                    $set:{
                        title,
                        content,
                        grade,
                        due,
                        complete,
                        alarm
                    }
                }, {
                        multi:true
                    },(err)=>{
                        if(err){reject(false);}
                        else{
                            resolve(true);
                        }
                });
            }
        })
    });
};

exports.updateAlarmData = (login, itemid, alarm)=>{
    return new Promise((resolve, reject)=>{
        db.colData.findOne({
            login:login,
            itemid:itemid
        }).exec((err, result)=>{
            if(err){reject(err.message);}
            if(result){
                db.colData.update({
                    login:login,
                    itemid:itemid
                }, {
                    $set:{
                        alarm
                    }
                }, {
                        multi:true
                    },(err)=>{
                        if(err){reject(false);}
                        else{
                            resolve(true);
                        }
                });
            }
        })
    });
};

exports.deleteData = (itemid)=>{
    return new Promise((resolve, reject)=>{
        db.colData.remove({
            itemid:itemid
        }, (err)=>{
            if(!err){
                resolve(true);
            }else{
                reject(false);
            }
        })
        
        // .exec((err, result)=>{
        //     console.log(result);
        //     if(err){reject(false);}
        //     if(result){
        //         result.remove((err, result)=>{
        //             if(err) reject(false);
        //             else{
        //                 resolve(true);
        //             }
        //         });
        //     }
        // });
    });
}