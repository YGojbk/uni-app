import {
  isPlainObject
} from 'uni-shared'

import {
  V_FOR,
  B_STYLE
} from '../../constants'

function setResult (data, k, v) {
  data[k] = v
}

function diffObject (newObj, oldObj, every = true) {
  let result, key, cur, old
  for (key in newObj) {
    cur = newObj[key]
    old = oldObj[key]
    if (old !== cur) {
      if (!every) {
        return newObj
      }
      setResult(result || (result = Object.create(null)), key, cur)
    }
  }
  return result
}

function diffArray (newArr, oldArr) {
  const newLen = newArr.length
  if (newLen !== oldArr.length) {
    return newArr
  }
  if (isPlainObject(newArr[0])) {
    for (let i = 0; i < newLen; i++) {
      if (diffObject(newArr[i], oldArr[i], false)) {
        return newArr
      }
    }
  } else {
    for (let i = 0; i < newLen; i++) {
      if (newArr[i] !== oldArr[i]) {
        return newArr
      }
    }
  }
}

function diffElmData (newObj, oldObj) {
  let result, key, cur, old
  for (key in newObj) {
    cur = newObj[key]
    old = oldObj[key]
    if (old !== cur) {
      if (key === B_STYLE && isPlainObject(cur) && isPlainObject(old)) {
        const style = diffObject(cur, old)
        style && setResult(result || (result = Object.create(null)), B_STYLE, style)
      } else if (key === V_FOR && Array.isArray(cur) && Array.isArray(old)) {
        const vFor = diffArray(cur, old)
        vFor && setResult(result || (result = Object.create(null)), V_FOR, vFor)
      } else {
        setResult(result || (result = Object.create(null)), key, cur)
      }
    }
  }
  return result
}

export function diff (newData, oldData, result) {
  let id, cur, old
  for (id in newData) {
    cur = newData[id]
    old = oldData[id]
    if (!old) {
      setResult(result, id, cur)
      continue
    }
    const idObj = diffElmData(cur, old)
    idObj && setResult(result, id, idObj)
  }
  return result
}