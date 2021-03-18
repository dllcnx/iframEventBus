兼顾了ifram父子交互总线与页面内部事件总线。利用了localStorage的事件监听特性封装。
```
    // 发送事件
    gos.event.emit('test', { key: 'parent' })

    // 接收事件
    gos.event.addEventListener('test', () => {
            console.log('接收到事件。');
    })
```