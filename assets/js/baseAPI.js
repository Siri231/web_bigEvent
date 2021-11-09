// 注意！！每次调用 $.get()、$.post()、$.ajax() 时
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中我们可以拿到Ajax提供的配置对象并更改
$.ajaxPrefilter(function(options) {
    // console.log(options.url); ///api/login
    options.url = 'http://api-breakingnews-web.itheima.net' +
        options.url
})