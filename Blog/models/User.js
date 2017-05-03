/**
 * Created by Administrator on 2017/4/26.
 */
var mongoose=require('mongoose');
var userSchema=require('../schemas/users');

module.exports=mongoose.model('User',userSchema);