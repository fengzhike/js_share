let express = require('express')
let mongoose = require('mongoose')
let router = express.Router()
let User = require('../mongoose/userSchema.js')
var sd = require('silly-datetime');
router.post('/', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.json({ result: true, value: req.body })
    })
    //添加方法
router.post('/insert', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*")
        let obj = req.body
        var user = new User({
            title: obj.title,
            author: obj.author,
            class: obj.class,
            createTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            abstract:obj.abstract,
            content:obj.content
        });
        let re = res
        user.save(function(err, res) {
            if (err) {
                re.json({ result: false, value: err })
            } else {
                re.json({ result: true, value: true })
            }
        })
    })
    //查询方法
router.post('/query', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    let re = res
    let obj = req.body
    if(obj.type == 'index'){
        User.find({}).sort({'_id':-1}).exec((err, val)=>{
            if (err) {
                re.json({result:false,value:false,message:err})
            } else {
                re.json({ result: true, value: val })
            }
        })
    }else{
        User.find({class:obj.type}).sort({'_id':-1}).exec((err, val)=>{
            if (err) {
                re.json({result:false,value:false,message:err})
            } else {
                re.json({ result: true, value: val })
            }
        })
    } 
})
//查询单条记录
router.post('/queryById',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    let re = res
    let obj = req.body
    if(!obj.id){
        res.json({result:false,value:false,error:{message:'参数不正确！'}})
    }else{
        User.findOne({_id:obj.id},(err,val)=>{
            if(err){
                re.json({result:false,value:false,message:err})
            }else{
                re.json({ result: true, value: val })
            }
        })
    }
})
//删除单条记录
router.post('/delete',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    let re = res
    let obj = req.body
    if(!obj.id){
        res.json({result:false,value:false,error:{message:'参数不正确！'}})
    }else{
        User.remove({_id:obj.id},(err,val)=>{
            if(err){
                re.json({result:false,value:false,message:err})
            }else{
                re.json({ result: true, value: val })
            }
        })
    }
})
//更新单条记录
router.post('/update',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    let re = res
    let obj = req.body
    if(!obj.id){
        res.json({result:false,value:false,error:{message:'参数不正确！'}})
    }else{
        User.findOne({_id:obj.id},(err,val)=>{
            if(err){
                re.json({result:false,value:false,message:err})
            }
            let data = val
            data.title = obj.title
            data.author = obj.author
            data.class = obj.class
            data.createTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
            data.abstract = obj.abstract
            data.content = obj.content
            data.save((err,val)=>{
                if(err){
                    re.json({result:false,value:false,message:err})
                }else{
                    re.json({ result: true, value: val })
                }
            })
        })
    }
})
//登陆（没做任何操作随便填都可以进去）
router.post('/login',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    let re = res
    let obj = req.body
    if(!obj.user || !obj.password){
        res.json({result:false,value:false,error:{message:'用户名或者密码错误'}})
    }else{
        res.json({result:true,value:true})
        /*User.find({_id:obj.id},(err,val)=>{
            if(err){
                re.json({result:false,value:false,message:err})
            }else{
                re.json({ result: true, value: val })
            }
        })*/
    }
})
module.exports = router
