let  db = require('../db.js')
var Schema = db.Schema;
var UserSchema = new Schema({          
    title : { type: String },                    //标题
    author: {type: String},                        //作者
    class: {type: String},                        //分类
    createTime : { type: String},                      //创建时间
    abstract : { type: String},                      //摘要
    content : { type: String}                       //内容
});
// let User = db.model('User',UserSchema)

//  var user = new User({
//     username : 'shuoer',                 
//     userpwd: '123456',                           
//     userage: 27,                                
//     logindate : new Date()                      
// });
// user.save(function(err){
//     console.log('报错'+err)
// })
// console.log('查询'+User.find({}))
module.exports = db.model('User',UserSchema);

