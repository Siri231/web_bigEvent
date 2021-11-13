$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 初始化富文本编辑器
    initEditor()

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date();
        var y = dt.getFullYear()
        var m = padZero(dt.getUTCMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个参数对象，向服务器请求数据时
    // 需要将参数对象提交到服务器
    var q = {
        // 默认请求第一页数据
        pagenum: 1,
        // 默认一页显示两条数据
        pagesize: 2,
        // 文章分类的 Id
        cate_id: '',
        // 文章的发布状态，可选值有：已发布、草稿
        state: '',
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取列表数据失败！')
                }
                layer.msg('获取列表数据成功！')

                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                console.log(htmlStr);
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                // 调用模板引擎渲染分类得可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选表单
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]')
        var state = $('[name=state]');
        // 为查询参数对象中q对应的属性赋值
        q.cate_id = cate_id
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认显示那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 15],
            // 分页发生时 触发jump回调
            // 触发回调的方式：
            // 1、点击页码 
            // 2、调用 laypage.render()
            // 3、切换每页条目数
            // 使用第一种方法触发 first 为false ，第二种为 true
            jump: function(obj, first) {
                console.log(first);
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值 赋值到 q 这个查询对象上
                q.pagenum = obj.curr;
                // 把最新的每页条目数 赋值到 q 这个查询对象上
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable() //会发生死循环
                }
            }
        })
    }

    // 删除
    $('tbody').on('click', '.btn-delete', function(id) {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取文章的id
        var id = $(this).attr('data-id');
        // 询问 弹出层
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断这一页中是否还有剩余数据，如果没有，则页码值-1，之后在调用initTable() 方法
                    // 获取删除按钮的个数，知道页面上是否有剩余的数据
                    if (len === 1) {
                        // 如果len=1，证明删除完毕之后，页面上没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    $('tbody').on('click', '.btn-edit', function(id) {
        location.href = '../../../article/art_pub.html'
    })



    // 编辑
    // $('tbody').on('click', '.btn-edit', function(id) {
    //     // 定义修改分类的弹出层
    //     var indexEdit = null;
    //     indexEdit = layer.open({
    //         type: 1,
    //         area: ['600px', '250px'],
    //         title: '修改文章分类',
    //         content: $('#dialog-edit').html()
    //     })

    //     var id = $(this).attr('data-id')

    //     // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
    //     // $.ajax({
    //     //     type: 'GET',
    //     //     url: '/my/article/' + id,
    //     //     success: function(res) {
    //     //         if (res.status !== 0) {
    //     //             return layer.msg('获取数据失败！')
    //     //         }
    //     //         form.val('#form-edit', res.data)
    //     //     }
    //     // })

    //     // 通过代理的形式，为修改分类的表单绑定 submit 事件
    //     // $('body').on('submit', '#form-edit', function (e) {
    //     //     e.preventDefault();

    //     // })
    // })
})