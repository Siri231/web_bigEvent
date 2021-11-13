$(function() {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类得列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加类别
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '在线调试',
            content: $('#dialog-add').html()
        })
    })

    // 通过委托代理的形式 为form-add 绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！');
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
            // console.log(id);
            // 发起请求获取对应分类数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })

        // 通过代理形式 绑定 form
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
    })

    // 通过代理形式 为删除绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // attr 获取属性的值
        var id = $(this).attr('data-id')

        // 提示用户是否删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功!')
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })
})