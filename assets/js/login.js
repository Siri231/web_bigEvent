$(function() {
    // 点击注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击登录链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从 layui 中获取 form 对象
    // 等同导入jQuery.js就有$ ,导入layui.all.js就有了layui对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            // value 为确认密码框的内容
            var pwd = $('#form_reg [name=pwd]').val();
            if (pwd !== value) {
                return '两次密码不一致！！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=pwd]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功！！");
            // 自动切换登录界面
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        var data = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=pwd]').val() }
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            // data: $(this).serialize(),
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})