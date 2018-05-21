function _proxy(vm, key) {
  Object.defineProperty(
    vm,
    key, {
      get() {
        return vm.data[key]
      },
      set(newVal) {
        vm.data[key] = newVal
      }
    }
  )
}

function Mvvm(options) {
  this.$options = options
  this.data = options.data

  // 代理this.data，避免在组件中 通过this.data.name 访问name
  // 目的是简写
  Object.keys(this.data).forEach(key => _proxy(this, key))

  // 添加监听
  observe(this.data)

  // 编译模版
  this.$compile = new Compile(options.el, this)

  return this
}