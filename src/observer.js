function defineReactive(data, key, val) {
  observe(val)

  let dep = new Dep()

  Object.defineProperty(
    data,
    key, {
      enumerable: true,
      configurable: true,
      get() {
        // 添加订阅者
        // 初始化模版编译的时候，会去new Watcher，从而触发get调用
        // 并将当前watcher实例赋值给Dep.target
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        console.log(`key ${key} change, val: ${newVal}`)
        val = newVal
        dep.notify()
      }
    }
  )
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }

  Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
}
