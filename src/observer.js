function defineReactive(data, key, val) {
  observe(val)

  let dep = new Dep()

  Object.defineProperty(
    data,
    key, {
      enumerable: true,
      configurable: true,
      get() {
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
