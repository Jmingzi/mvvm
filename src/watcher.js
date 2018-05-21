function Watcher(vm, expression, callback) {
  this.vm = vm
  this.expression = expression
  this.callback = callback
  this.value = this.get()
}

Watcher.prototype = {
  update() {
    this.run()
  },

  run() {
    // 判断是否要触发更新
    const value = this.vm.data[this.expression]
    const oldValue = this.value
    if (oldValue !== value) {
      console.log(`${this.expression} value change !`)
      this.value = value
      this.callback.call(this.vm, value, oldValue)
    }
  },

  get() {
    Dep.target = this
    let value = this.vm.data[this.expression]
    Dep.target = null
    return value
  }
}