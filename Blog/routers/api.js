/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/User');//加载数据库模板
var Category = require('../models/Category');
var Content= require('../models/Content');

//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    }
    next();
});


/*
* 注册逻辑
*   1.用户名是否为空
*   2.密码是否为空
*   3.两次密码是否一致
*       1.用户已经被注册了
*           数据库查询
*       2、用户未注册，注册成功
* */
router.post('/user/register',function(req,res,next){
    //res.render('main/login');
    //console.log(req.body);//获取客户端输入的内容
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //username是否为空
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    //password是否为空
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    //两次密码是否一致
    if(repassword==''){
        responseData.code=3;
        responseData.message='两次密码不一致';
        res.json(responseData);
        return;
    }
    /*
    * 用户名是否已经被注册,如果该用户已存在
    * */
    User.findOne({
        username:username
    }).then(function(userInfo){
        //判断用户名是否与数据库中的数据匹配，如果匹配
        if(userInfo){
            responseData.code=4;
            responseData.message='该用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //可以注册
        var user=new User({
            username:username,
            password:password
        });
       return user.save();
    }).then(function(newUserInfo){
        //console.log(newUserInfo);
        responseData.message='注册成功';
        res.json(responseData);
    });

});

//登录逻辑
router.post('/user/login',function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    //console.log(req.body);
    if(username==''||password==''){

        responseData.code=1;
        responseData.message='用户名或密码不能为空';
        res.json(responseData);

        return;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或密码错误';
            res.json(responseData);
            return;
        }

        responseData.message='登录成功';
        responseData.userInfo={//创建cookies属性
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({//设置cookies，转换成字符串
            _id:userInfo._id,
            username:userInfo.username
        }));

        res.json(responseData);
    }).then(function () {
       // console.log('有作用产生么？')
        res.render('main/index',{
            userInfo:userInfo
        })
    })
})
/*
 * 评论内容的接受处理
 * */
router.post('/comments/post',function(req,res){
    //获取内容的id
    var contentid = req.body.contentid || '';
    //console.log(contentid);
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    }

    //查询当前内容的信息
    Content.findOne({
        _id:contentid
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message='保存成功';
        responseData.data = newContent;
        res.json(responseData);
    })
})
/*
* 获取当前文章 的评论
* */
router.get('/comments', function (req,res) {
    var contentid = req.query.contentid || '';
    
    Content.findOne({
        _id:contentid
    }).then(function (content) {
        responseData.data = content;
        res.json(responseData);
    })
})

//退出逻辑
router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.render('main/login')
   // res.json(responseData);
    console.log('正常退出操作');
})

////管理员进入后台事件,错错错错错错
//router.get('/user/enter',function(req,res,next){
//    console.log('管理员进入后台操作');
//
//    res.render('admin/index',{
//        userInfo:req.userInfo
//    })
//    // res.json(responseData);
//    responseData.code=2;
//    responseData.message='33333';
//    res.json(responseData);
//    return;
//})

module.exports=router;