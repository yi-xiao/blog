/**
 * Created by Administrator on 2017/4/28.
 */
var mongoose=require('mongoose');

//内容表结构
//一定要暴露出去！！！！！！！！！！！！！！！！！！
module.exports=new mongoose.Schema({
    //关联字段-分类ID
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //关联字段-作者名字
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //title
    title:String,
    //content
    content:{
        type:String,
        default:''
    },
    //description
    description:{
        type:String,
        default:''
    },
    //评论内容保存，划重点啦
    comments:{
        type:Array,
        default:[]
    }

});