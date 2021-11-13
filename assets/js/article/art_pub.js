$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                console.log(res);
                layer.msg('获取文章分类成功！');
                // 调用模板引擎，渲染分下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // ！！！！！
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的点击按钮，绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // console.log(e);
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断是否选择文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 1、定义文章发布状态
    var art_state = '已发布'

    $('#btSave2').on('click', function() {
        art_state = '草稿'
    })

    // 表单 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 2、基于form表单 快速创建一个formData对象
        var fd = new FormData($(this)[0]);
        // 3、将文章的发布状态 art_state 存到 fd 中
        fd.append('state', art_state);
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // });

        // 4、将封面裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function(blob) {
                // 得到文件对象后，进行后续的操作
                // 5、将文件对象存储到 fd 中
                fd.append('cover_img', blob);
                // 6、发起Ajax数据请求
                publishArticle(fd)
                console.log(fd);
            });
    })

    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：若向服务器提交的是formData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败！')
                }
                layer.msg('发布成功！')
                location.href = '../../../article/art_list.html'
            }
        })
    }
})