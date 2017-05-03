/**
 * Created by Administrator on 2017/4/29.
 */
var limit = 5;//每页显示多少条
//var repage = 5;//页数
var page = 1;//当前默认第几页
var comments = [];//接收ajax返回的内容数据
/*
* 评论提交处理
* */
$('#submit').on('click',function(){
    $.ajax({
        type:'post',
        url:'/api/comments/post',
        data:{
            contentid:$('#contentid').val(),
            content:$('#text').val()
        },
        success:function(responseData){
            //console.log(responseData)
            $('#text').val('');
            comments = responseData.data.comments;
            renderComments();
        }
    })
})
/*
* 页面重载时发送ajax请求，实时获取评论
* */
$.ajax({
    url:'/api/comments',
    data:{
        contentid:$('#contentid').val(),
        content:$('#text').val()
    },
    success:function(responseData){
        //console.log(responseData)
        content:$('#text').val('');
        comments = responseData.data.comments;
        renderComments();
    }
})
/*
* 每次点击上/下一页
* */
$('#pager').delegate('a','click', function () {
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
   renderComments();
})

/*
* 获取数据后渲染在页面中
* */
function renderComments(){
    $('#count').html(comments.length);

    var pages = Math.ceil(comments.length/limit);//计算总页数
    var start = (page-1)*limit;//设置获取数据的起始位置
    var end = start+limit;//每次数据获取的结束位置

    var $ali = $('#pager li');
    if(pages==0){
        $ali.eq(1).html('0/0');
    }else{
        $ali.eq(1).html(page+'/'+pages);//当前分页/总页数
    }


    if(page<=1){
        $ali.eq(0).html('<span>没有上一页了</span>');
    }else{
        $ali.eq(0).html('<a href="javascript:;">&larr; 上一页</a>')
    }
    if(page>=pages){
        $ali.eq(2).html('<span>没有下一页了</span>');
    }else{
        $ali.eq(2).html('<a href="javascript:;">下一页 &rarr;</a>')
    }
    if(end>comments.length){
        end=comments.length;
    }

    if(comments.length==0){
        $('#all').html('<p>本文章目前还没有评论哦，快发表评论抢占沙发吧··········</p>').css('text-align','center');
    }else{
        var html='';
        for(var i=start;i<end;i++){
            html+='<div class="comments-list">'+
                '<p><span class="name">'+comments[i].username+'</span><br/>'+
                '<span class="floor">'+(i+1)+'楼</span>'+
                '<span class="time">'+formDate(comments[i].postTime)+'</span>'+
                '</p>'+
                '<p class="contents">'+comments[i].content+'</p>'+
                '</div>'
        }
        $('#all').html(html);
    }


}
/*
* 时间格式转化函数
* */
function formDate(d){
    var date1 = new Date(d);
    return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDay()+' '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}