function Compile(el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el)
    this.compileElement(this.$fragment)
    // 添加片段到节点中
    this.$el.appendChild(this.$fragment)
  }
}

Compile.prototype = {
  compileElement(el) {
    Array.from(el.childNodes).forEach(node => {
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/

      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, reg.exec(text)[1])
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compileElement(node)
      }
    })
  },

  compile(node) {
    const attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name
      let fn = this.$vm.$options.methods[attr.value]

      // 这里只处理：和@
      if (/:|@/.test(attrName)) {
        if (/@/.test(attrName)) {
          // 事件绑定的简写
          node.addEventListener(attrName.substring(1), fn.bind(this.$vm), false)
        } else {
          console.log('bind value', attrName)
          this.compileModel(node, attr.value)
        }
        // 执行完后 移除掉
        node.removeAttribute(attrName)
      }
    })
  },

  compileText(node, expression) {
    expression = expression.trim()
    let value = this.$vm[expression]
    node.textContent = typeof value === 'undefined' ? '' : value

    this.bind(node, expression, (value, oldValue) => {
      node.textContent = typeof value === 'undefined' ? '' : value
    })
  },

  compileModel(node, expression) {
    let value = this.$vm[expression]
    node.value = typeof value === 'undefined' ? '' : value

    this.bind(node, expression, (value, oldValue) => {
      node.value = typeof value === 'undefined' ? '' : value
    })
  },

  bind(node, expression, cb) {
    new Watcher(this.$vm, expression, cb)
  },

  node2Fragment(node) {
    let fragment = document.createDocumentFragment()
    let child = node.firstChild
    while (child) {
      fragment.appendChild(child)
      child = node.firstChild
    }
    return fragment
  },

  isTextNode(el) {
    return el.nodeType === 3
  },

  isElementNode(el) {
    return el.nodeType === 1
  }
}
