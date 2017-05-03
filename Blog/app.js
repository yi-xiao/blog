/**
 * Created by Administrator on 2017/4/12.
 * 应用程序的启动（入口）文件
 */
 //加载express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyParser=require('body-parser');
//加载cookies模块
var Cookies=require('cookies');
//创建APP应用
var app = express();
//
var User = require('./models/User');


//设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数，引擎名称，也是模板文件后缀，第二个参数是处理模板内容的方法
app.engine('html',swig.renderFile);

//设置模板文件存放的目录，第一个参数必须是views，第二个是目录
app.set('views','./views');

//注册所使用的模板引擎，第一个参数必须是view engine，
// 第二个参数和app.engine方法中定义的模板引擎的名称（第一个）是一致的
app.set('view engine','html');

//在开发过程中，要取消模板缓存
swig.setDefaults({cache:false});
///*
//* s首页
//* req
//* res
//* next 函数
//* */
//app.get('/index',function(req,res,next){
//    //res.send('<h1>欢迎光临我的博客首页</h1>');
//    //读取views目录下指定文件，解析并返回给客户端
//    res.render('index');
//});

//设置bodyparse
app.use(bodyParser.urlencoded({extended:true}));
//设置cookies
app.use(function(req,res,next){
    req.cookies=new Cookies(req,res);
    //console.log(req.cookies.get('userInfo'));

    //解析登录用户的cookies信息
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));

            //判断用户类型
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }
    }else{
        next();
    }

});

/*根据不同的功能划分模块*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log('数据库成功失败');
    }else{
        console.log('数据库成功连接');
        app.listen(8080);
    }
});

