/**
 * Created by Administrator on 2017/4/26.
 */
var express = require('express');
var router = express.Router();
//引入用户模型
var User = require('../models/User');
//引入分类模型
var Category = require('../models/Category');
//引入内容模型
var Content = require('../models/Content');

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入此系统');
        return;
    }
    next();
});

/*首页*/
router.get('/',function(req,res,next){
    //res.send('admin-66666');
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});
/*＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊*/
/*
* 用户管理
* */
router.get('/user',function(req,res,next){
    /*
    * 从数据库获取所有的用户数据
    *
    * limit(number)：限制从数据库获取数据的数目
    *
    * skip(number)：忽略数据的数目
    *
    * 每页显示数目
    * */
    var page=Number(req.query.page || 1);//页数
    var limit=5;//每页条数
    //var skip=(page-1)*limit;//起始位置
    var pagers=0;//设置总分页数

    User.count().then(function(count){
        //console.log(count);//获取全部数据的总数
        pagers = Math.ceil(count/limit);
        page = Math.min(page,pagers);
        page = Math.max(page,1);

        var skip=(page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            //console.log(users);
            res.render('admin/user_list',{
                userInfo:req.userInfo,
                users:users,
                pagers:pagers,
                count:count,
                limit:limit,
                page:page
            });
        });

    });


});
/*
* 分类管理
*
* 首页
* */
router.get('/category',function(req,res,next){
    //res.render('admin/category_index',{
    //    userInfo:req.userInfo
    //});
    var page=Number(req.query.page || 1);//页数
    var limit=5;//每页条数
    //var skip=(page-1)*limit;//起始位置
    var pagers=0;//设置总分页数

    Category.count().then(function(count){
        //console.log(count);//获取全部数据的总数
        pagers = Math.ceil(count/limit);
        page = Math.min(page,pagers);
        page = Math.max(page,1);

        var skip=(page-1)*limit;

       //可以选择按修改时间排序，1：升序，-1：降序，sort()
        Category.find().limit(limit).skip(skip).then(function(categories){
            //console.log(users);
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                pagers:pagers,
                count:count,
                limit:limit,
                page:page
            });
        });

    });
})
/*
* 分类添加
* */
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
});

/*
 * 分类保存
 * */
router.post('/category/add',function(req,res){
    /*res.render('admin/category_add',{
        userInfo:req.userInfo
    });*/
    //console.log(req.body);
    //res.send('999');
    var name=req.body.name || '';
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空',
            url:'/admin/category'
        });
        return;
    }
    //判断分类是否已经存在
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //已存在该分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'该分类已经存在',
                url:'/admin/category'
            })
            return Promise.reject();
        }else{
            //可以添加该分类,保存该分类在数据库
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"添加成功！3s后自动跳转回分类首页",
            url:'/admin/category'
        });
    });
});

/*
* 分类修改内容获取
* */
router.get('/category/edit', function (req,res) {
    var id=req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类不存在',
                url:'/admin/category'
            })
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })
})
/*
 * 分类修改内容保存
 * */

router.post('/category/edit', function (req,res) {
    //获取要修改的分类的ID
    var id=req.query.id || '';
    var name=req.body.name || '';
    //获取要修改的分类信息
    Category.findOne({
        _id:id,
    }).then(function(category){

        if(!category){
           // console.log('1');
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'oh,分类不存在',
                url:'/admin/category'
            });
            return Promise.reject();
        }else{
            //如果内容没有修改
            //console.log('2');
            if(name==category.name){
                console.log('没修改，成功');
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else if(name==''){
                //console.log('为空');
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'注意，名字为空会报错',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //修改的内容并不存在
                //console.log('内容可被修改');
                return Category.findOne({
                    _id:{$ne:id},//what the fuck？？？查询数据库中ID不同的项是否存在相同的名称
                    name:name
                });
            }

        }
    }).then(function(sameCategory){

        if(sameCategory){
            //console.log('内容已经存在');
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'ohoh,分类已经存在',
                url:'/admin/category'
            });
            return Promise.reject();
        }else{
           return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function(){
        //console.log('成功');
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    });
});
/*
 * 分类删除
 * */

router.get('/category/delete',function(req,res){
    var id=req.query.id;
    //console.log(id);
    Category.remove({
        _id:id
    }).then(function () {
        //console.log('rellary?');
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功，该数据已经不存在了~~~',
            url:'/admin/category'
        })
    })
});

/*
*退出后台，返回普通页面,错错错错错错
* */
//router.get('/logout',function(req,res){
//    console.log('退出后台操作');
//    res.render('main/login',{
//        //userInfo:req.userInfo
//    })
//})

/*＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊*/
//内容管理首页
router.get('/content', function (req,res) {
    var page=Number(req.query.page || 1);//页数
    var limit=5;//每页条数
    //var skip=(page-1)*limit;//起始位置
    var pagers=0;//设置总分页数

    Content.count().then(function(count){
        //console.log(count);//获取全部数据的总数
        pagers = Math.ceil(count/limit);
        page = Math.min(page,pagers);
        page = Math.max(page,1);

        var skip=(page-1)*limit;

        //可以选择按修改时间排序，1：升序，-1：降序，sort()↓↓↓↓↓↓↓↓
        //populate()  ???????????
        Content.find().limit(limit).skip(skip).sort({_id:-1}).populate(['category','user']).then(function(contents){
            //console.log(contents);
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                pagers:pagers,
                count:count,
                limit:limit,
                page:page
            })
        });

    });

})

//内容添加
router.get('/content/add', function (req,res) {
    /*
    * 先解决分类，从数据库获取分类信息
    * */
    Category.find().then(function (categories) {
       // console.log(categories);
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })

})

/*
* save
* */
router.post('/content/add', function (req,res) {
    console.log(req.body)
    if(req.body.category==''|| req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'抱歉，内容分类或标题不允许为空！'
        })
        return;
    }
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function (rs) {
            if(rs){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'添加成功',
                    url:'/admin/content'
                })
            }
        })
})

/*
* 内容修改
* */
router.get('/content/edit',function(req,res){

        var id = req.query.id || '';
        var categories = [];

        Category.find().then(function (rs) {
            categories = rs;
            console.log('start')
            return Content.findOne({
                _id: id
            }).populate('category');
        }).then(function (contents) {
            console.log('step')
                if(!contents){
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        message:'出错了，指定内容不存在~~~~~~',
                        url:'/admin/content'
                    });
                    return Promise.reject();
                }else {
                    //先查找到分类信息，在继续进行内容获取
                    // console.log(contents);//获取选中ID的全部信息
                    console.log(contents.category._id);
                    res.render('admin/content_edit', {
                        userInfo: req.userInfo,
                        categories: categories,
                        contents: contents
                    })
                }
            })
})
/*
* 保存修改的内容
* */
router.post('/content/edit', function (req,res) {
    var id = req.query.id || '';
    //console.log(id);
    if(req.body.category==''|| req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'抱歉，内容分类或标题不允许为空！'
        })
        return;
    }
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容已经被成功修改！',
            url:'/admin/content'
        })
    })
})

/*
 * 内容删除
 * */

router.get('/content/delete',function(req,res){
    var id=req.query.id || '';
    //console.log(id);
    Content.remove({
        _id:id
    }).then(function () {
        //console.log('rellary?');
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功，该数据已经不存在了~~~',
            url:'/admin/content'
        })
    })
});
module.exports=router;