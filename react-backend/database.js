let mongoose = require('mongoose');

mongoose.connect('mongodb://seo:seoseo123@ds125578.mlab.com:25578/todolistdbgyo');

let db = mongoose.connection;

mongoose.Promise = global.Promise;//using Mongoose Promise

db.on('error', ()=>{
    console.log('mongoDB connection error.');
})

db.once('open', ()=>{
    console.log('mongoDB connection successfully.');
})

let Schema = mongoose.Schema;
let userSchema, dataSchema;

userSchema = new Schema({
    login : {
        type:String,
        unique:true,
        trim:true,
    }
});

dataSchema = new Schema({
    login : {
        type:String,
        required:true,
        trim:true
    },
    itemid: {
        type:String,
        required: true,
        trim: true
    },
    title:{
        type:String,
        required: true,
    },
    content:String,
    grade:String,
    due:String,
    complete:Boolean,
    alarm:Boolean
});

exports.mongoose = mongoose;
exports.colUser = mongoose.model('user', userSchema);
exports.colData = mongoose.model('data', dataSchema);