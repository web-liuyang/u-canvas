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

[ ] 解决在客户端上绘制错误 Possible Unhandled Promise Rejection:
[ ] roundRect 不支持iOS/Android端
[ ] Image 需要在 onload 中进行绘制, 要不然绘制不上去

[ ] 提 issue: workspace 无法导入组件


记：

1. 当前坐标系是屏幕坐标系，即 0,0 在左上角
2. 所有图形的方法应该都获取的是基于自身（local）的数据，如果想要转化成全局（global）的数据，应该通过某种方法。

### Bug

[√] canvas 用户拖动操作，等待了 按下的时间后才触发
[ ] packages - u-canvas-components 里使用 u-canvas 没有被热更新
[ ] Matrix 基点尚未确定，图形的基点应该是在左上角

### Issue

[√] Path2D 绘制原点与 Context 绘制原点不一致. 8748
[√] uni.createCanvasContextAsync 在 IOS 上报错. 14065
[ ] putImageData 无法绘制自定义的ImageData. 15053
[ ] options 名称被编译器占用. 15107
[ ] 设置别名后 无法导入类型. 15105

[ ] clearRect iOS在矩形区域比较大时，有卡顿性能不好
[ ] 客户端 父级触摸事件会触发两次，在嵌套的情况下. 9901 -> 14285
[ ] h5 无法触发 tap事件
[ ] @/u-canvas 可以访问类型与值，@u-canvas不可以访问类型，但可以访问值
[ ] .uvue 后缀只能导出Type，导出Interface不可以用
[ ] packages 热更新, 暂时通过更新vite-config来重启服务

roundRect/strokeText 文档错误

