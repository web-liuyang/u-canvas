# u-pointer

注意事项

click事件在按下后如果移动指针就不会触发
统一H5与PC的pointerdown/move/up 触发规则

TODO

双击, 长按, 事件冒泡（考虑责任链）
更新package.json 使它可以发布到 npm 上

issues

1. 触发顺序，pointerup 过后直接就触发click了，应该类似于洋葱模型
