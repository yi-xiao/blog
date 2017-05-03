/**
 * Created by Administrator on 2017/4/28.
 */
var mongoose=require('mongoose');
var contentSchema=require('../schemas/content');

module.exports=mongoose.model('Content',contentSchema);