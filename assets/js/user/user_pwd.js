$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // value 即为新密码
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(val) {
            if (val !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('faild!')
                }
                layer.msg('success!')
                console.log(res);

                // 重置表单
                // 使用 jQuery对象 无法调用reset方法                // 将jQuery对象转换成dom元素 $('.layui-form')[0]
                // 将jQuery对象转换成dom元素 $('.layui-form')[0]
                $('.layui-form')[0].reset();
            }
        })
    })
})