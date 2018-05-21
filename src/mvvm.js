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
  Object.keys(this.data).forEach(key => _proxy(this, key))

  observe(this.data)
  this.$compile = new Compile(options.el, this)

  return this
}