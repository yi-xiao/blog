/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content= require('../models/Content');
var User= require('../models/User');

var data;
/*
* �м���ķ���������ͨ������
* */
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[],
    }
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    })
})
router.get('/',function(req,res,next){
    //console.log(req.userInfo);

        data.category=req.query.category||'';

        data.page=Number(req.query.page || '');
        data.limit=6;
        data.count=0;
        data.pager=0;

    var where={};//����ɸѡ������ʵ�ְ����಻ͬ��ʾ��Ӧ����
    if(data.category){
        where.category=data.category
    }

        //console.log(categories);

    Content.where(where).count().then(function (count) {
        data.count=count;
        //��ҳ��
        data.pager=Math.ceil(data.count/data.limit);
        //pageȡֵ
        data.page=Math.min(data.page,data.pager);
        data.page=Math.max(data.page,1);

        var skip=(data.page-1)*data.limit;



        return Content.where(where).find().limit(data.limit).skip(skip).sort({addTime:-1}).populate(['category','user']);
    }).then(function (contents) {
        data.contents=contents;
        //console.log(contents)
        res.render('main/index',data);
    })

});

/*
* �Ķ�ȫ��
* */
router.get('/views', function (req,res) {
    var contentId = req.query.contentId || '';
    Content.findOne({
        _id:contentId
    }).populate(['category','user']).then(function (contents) {
        data.contents = contents;
        //console.log(contents)
        contents.views++;
        contents.save();
        res.render('main/views',data)
    })

})


/*
* ��¼��Ⱦ��¼/ע�����
* */
router.get('/logon', function (req,res) {
    res.render('main/login')
})
module.exports=router;