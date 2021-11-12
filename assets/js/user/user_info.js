$(function() {
    var form = layui.form;
    var layer = layui.layer;

    // 自定义验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！'
            }
        }
    })

    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('falid!')
                } else {
                    console.log(res);

                    // 调用form.val() 给表单赋值
                    form.val('formUserInfo', res.data)
                }
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认重置
        e.preventDefault();
        initUserInfo()
    })

    // 监听表单数据提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log('失败');
                }
                layer.msg('更新用户信息成功！')

                // 调用父页面中的方法，重新渲染用户头像和用户信息
                // window 为当前iframe ，parent 为父页面
                window.parent.getUserInfo()
            }
        })
    })
})