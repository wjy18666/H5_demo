//	简单对象合并
const merge = (def, opt) => {
  let obj = def;
  for (key in opt) {
    if (opt.hasOwnProperty(key)) {
      obj[key] = opt[key]
    }
  }

  return obj
}

//	深克隆
const deepClone = (source, dest) => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  dest = dest || (source.constructor === Array ? [] : {})
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object') {
        dest[key] = source[key].constructor === Array ? [] : {}
        deepClone(source[key], dest[key])
      } else {
        dest[key] = source[key]
      }
    }
  }
  return dest
}

//  读取localStorage
const getStorageItem = (key) => {
  return JSON.parse(window.localStorage.getItem(key))
}

//  读取localStorage
const setStorageItem = (key, val) => {
  window.localStorage.setItem(key, JSON.stringify(val))
}

//  删除
const removeStoreItem = (key) => {
  window.localStorage.removeItem(key)
}

//  禁止中文输入
const stopChinese = (val) => {
  return val.replace(/[\u4E00-\u9FA5]/gi, '')
}

//  事件绑定兼容
const addHandle = (dom, type, fn) => {
  if (document.addEventListener) {
    dom.addEventListener(type, fn, false)
  } else if (document.attachEvent) {
    dom.attachEvent('on' + type, fn)
  } else {
    let oldDomFun = dom['on'] + type
    dom['on' + type] = function() {
      oldDomFun()
      fn && fn()
    }
  }
}

//  事件解绑
const removeHandle = (dom, type, fn) => {
  if (document.removeEventListener) {
    dom.removeEventListener(type, fn)
  } else if (document.detachEvent) {
    dom.detachEvent('on' + type, fn)
  } else {
    dom['on' + type] = null
  }
}

//	获取个浏览器私有前缀
const getCssPrefix = () => {
  let styles = window.getComputedStyle(document.documentElement, '');
  let core = (
    Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms|o)-/) || (styles.OLink === '' && ['', 'o'])
  )[1];
  return '-' + core + '-';
}
//  判断浏览器前缀
const getBowserPrefix = () => {
  let prefix = {
    '-webkit-': 'webkit',
    '-moz-': 'moz',
    '-ms-': 'ms',
    '-o-': 'o'
  }

  return prefix[getCssPrefix()]
}

export {
	merge,
	deepClone,
	getStorageItem,
	setStorageItem,
	removeStoreItem,
	getBowserPrefix,
}