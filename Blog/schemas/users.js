/**
 * Created by Administrator on 2017/4/26.
 */
var mongoose=require('mongoose');

//用户表结构
//一定要暴露出去！！！！！！！！！！！！！！！！！！
module.exports=new mongoose.Schema({
    //username
    username:String,
    //password
    password:String,
    //权限设置
    isAdmin:{
        type:Boolean,
        default:false
    }
});