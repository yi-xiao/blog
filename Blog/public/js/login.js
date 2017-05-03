/**
 * Created by Administrator on 2017/4/26.
 */
$(function(){
    var $login=$('#login');
    var $register=$('#register');
    var $state=$('#state');

    $register.hide();
    //切换面板
    $login.find('a.register').click(function(){
        $login.hide();
        $register.show();
    });

    $register.find('a.login').click(function(){
        $login.show();
        $register.hide();
    });

    //注册面板
    $register.find('a.btn').click(function () {
       // 通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$register.find('[name="username"]').val(),
                password:$register.find('[name="password"]').val(),
                repassword:$register.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result){
                console.log(result);
            }
        });
    });
    //登录面板
    $login.find('a.btn').click(function () {
        // 通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$login.find('[name="name"]').val(),
                password:$login.find('[name="pwd"]').val()
            },
            dataType:'json',
            success:function(result){

                //console.log(result);
                if(!result.code){
                    $login.find('.warning').hide();
                   // $state.find('.navbar-text').html(result.userInfo.username+',欢迎你!'+'<a calss="logout">[退出]</a>');
                    //window.location.reload();
                    window.location.href='/';
                }else{
                    $login.find('.warning').show().html(result.message);
                }

            }
        });
    });
    //退出
    $state.find('a.logout').click(function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
   /* //进入后台 多余多余多余多余
    $state.find('a.enter').click(function(){
        $.ajax({
            url:'/api/user/enter',
            success:function(result){
                console.log(result);
            }
        })
    })*/
})