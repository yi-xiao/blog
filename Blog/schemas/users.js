/**
 * Created by Administrator on 2017/4/26.
 */
var mongoose=require('mongoose');

//�û���ṹ
//һ��Ҫ��¶��ȥ������������������������������������
module.exports=new mongoose.Schema({
    //username
    username:String,
    //password
    password:String,
    //Ȩ������
    isAdmin:{
        type:Boolean,
        default:false
    }
});