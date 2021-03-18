window.gos = top.gos || {};
if(!top || !top.gos || JSON.stringify(top.gos) === '{}'){
    console.error('主界面未引入js,只能使用本地事件服务，无法父子交互!')
}

if (!gos.event) {
    // console.log('渲染本地事件服务!')
    gos.event = {};
    /**
    * 事件
    * @param {*} eventType
    * @param {*} data
    */
    gos.event.eventMap = new Map()
    gos.event.emit = function (eventType, data) {
        const time = new Date().getTime();
        const event = { key: eventType, data: data, timestamp: time }
        const detail = JSON.stringify(event);
        localStorage.setItem(`gos.event.${eventType}`, detail)
    }
    gos.event.addEventListener = function (eventType, func) {
        let evtSet = gos.event.eventMap.get(eventType)
        if (!evtSet) {
            evtSet = new Set()
            gos.event.eventMap.set(eventType, evtSet)
        }
        evtSet.add(func)
    }
    gos.event.removeEventListener = function (eventType, func) {
        let evtSet = gos.event.eventMap.get(eventType)
        if (evtSet) {
            evtSet.delete(func)
        }
    }
}


const oriSetItem = localStorage.setItem;
localStorage.setItem = function (key, value) {
    //这里抛出自定义事件
    var event = new Event("setItemEvent");
    event.newValue = value;
    event.key = key;
    window.dispatchEvent(event);

    //实现原方法
    oriSetItem.apply(this, arguments);
}
window.addEventListener('setItemEvent', e => {
    var str = e.key;
    if (/^gos\.event\..{1,}$/.test(str)) {
        const data = JSON.parse(e.newValue);
        let evtSet = gos.event.eventMap.get(data.key)
        if (evtSet) {
            for (let item of evtSet.values()) {
                item(data);
            }
        }
    }
}, false)