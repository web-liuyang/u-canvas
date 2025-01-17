# u-pointer

### 介绍

消除 **uni** 中组件事件触发的[各端异性](https://doc.dcloud.net.cn/uni-app-x/component/common.html#%E7%BB%84%E4%BB%B6%E5%85%A8%E5%B1%80%E4%BA%8B%E4%BB%B6), 统一事件处理, 减轻负担

### PointerComponent

#### 事件

| **u-pointer事件名** | Uni事件名               | 描述                                   |
| ------------------- | ----------------------- | -------------------------------------- |
| @onpointerclick     | @click\|tap             | 在元素上按下并抬起触发                 |
| @onpointerdown      | @mousedown\|@touchstart | 在元素上按下触发                       |
| @onpointermove      | @mousemove\|@touchmove  | 在元素上按下并移动时触发               |
| @onpointerup        | @mouseup\|touchend      | 在元素上按下并抬起时触发               |
| @onpointercancel    | @touchcancel            | 在元素上动作被打断，如来电提醒，弹窗等 |
| @onpointerwheel     | 无                      | 鼠标滚轮                               |

### RootPointerComponent

#### 事件

此组件一般放在根节点下, 通过引入 **rootpointer** 来进行处理, 事件类型与 **PointerComponent** 保持一致.

使用方法类似于 **document.addEventListener**, 通过 **rootpointer.addEventListener** 来监听事件.

### 注意事项

1. **@onpointerclick **事件在按下后如果移动指针就不会触发, 并且如果按下超过 **300ms** 同样不会触发.

### TODO

1. [ ] @onpointerdbclick 双击事件
2. [ ] @onpointerlongclick 长按事件
