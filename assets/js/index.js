$(function() {
    // 获取用户基本信息
    getUserInfo()

    // 点击退出按钮 实现退出功能
    $('#btnLogout').on('click', function() {
        var layer = layui.layer

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //点击确定之后 do something
            // 1、清空 token
            localStorage.removeItem('token');
            // 2、跳转回登录页面
            location.href = '/login.html'

            // 关闭弹出层询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 成功执行success回调，失败执行error回调
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('faild!!')
            }
            // console.log(res);
            // 调用 renderAvatar 函数渲染用户头像
            renderAvatar(res.data)
        },
        // 无论成功失败 都会执行 complete回调
        // complete: function(res) {
        //     // console.log('111');
        //     // console.log(res);
        //     // 在 responseJSON 中拿到服务器响应回的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1、强制清空token
        //         localStorage.removeItem('token');
        //         // 2、强制跳转到登录界面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1、获取用户名称
    var name = user.nickname || user.username;
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show()
    }
    // 渲染文本头像
    else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}