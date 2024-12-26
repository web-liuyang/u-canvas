### TODO

[√] Interaction Canvas
[√] Matrix
[√] 重构属性为可写
[√] Renderer
[√] 图形结构调整
[√] 样式
    [√] 继承
[ ] Graphic
    [ ] Event
    [√] AABB. 文字与图片的aabb需要通过某种方法计算，图片/文字暂时无法知道大小
    [√] hitTest 文字与图片的aabb需要通过某种方法计算，图片/文字暂时无法知道大小

[ ] Finger Event Stop
[ ] 全局事件代理

记：

1. 当前坐标系是屏幕坐标系，即 0,0 在左上角
2. 所有图形的方法应该都获取的是基于自身（local）的数据，如果想要转化成全局（global）的数据，应该通过某种方法。

### Bug

[√] canvas 用户拖动操作，等待了 按下的时间后才触发
[ ] packages - u-canvas-components 里使用 u-canvas 没有被热更新
[ ] Matrix 基点尚未确定，图形的基点应该是在左上角


### Issue

[√] Path2D绘制时 基点在 ios 上与 web 不一致
[ ] uni.createCanvasContextAsync 在 IOS 上报错 - 正在修复
[ ] clearRect iOS在矩形区域比较大时，有卡顿性能不好
[ ] 客户端 父级触摸事件会触发两次，在嵌套的情况下 - 正在修复
[ ] h5 无法触发 tap事件
[ ] @/u-canvas 可以访问类型与值，@u-canvas不可以访问类型，但可以访问值
[ ] .uvue 后缀只能导出Type，导出Interface不可以用
[ ] packages 热更新, 暂时通过更新vite-config来重启服务

roundRect/strokeText 文档错误
