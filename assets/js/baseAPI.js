// 注意！！每次调用 $.get()、$.post()、$.ajax() 时
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中我们可以拿到Ajax提供的配置对象并更改
$.ajaxPrefilter(function(options) {
    // console.log(options.url); ///api/login
    options.url = 'http://api-breakingnews-web.itheima.net' +
        options.url

    if (options.url.indexOf('/my/') !== -1) {
        // 统一为有权限的接口设置headers请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // 在 responseJSON 中拿到服务器响应回的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token');
            // 2、强制跳转到登录界面
            location.href = '/login.html'
        }
    }

})