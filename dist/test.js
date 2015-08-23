/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	
	var base64 = __webpack_require__(8)
	var ieee754 = __webpack_require__(9)
	var isArray = __webpack_require__(10)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  this.length = 0
	  this.parent = undefined
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var firstByte
	  var secondByte
	  var thirdByte
	  var fourthByte
	  var bytesPerSequence
	  var tempCodePoint
	  var codePoint
	  var res = []
	  var i = start
	
	  for (; i < end; i += bytesPerSequence) {
	    firstByte = buf[i]
	    codePoint = 0xFFFD
	
	    if (firstByte > 0xEF) {
	      bytesPerSequence = 4
	    } else if (firstByte > 0xDF) {
	      bytesPerSequence = 3
	    } else if (firstByte > 0xBF) {
	      bytesPerSequence = 2
	    } else {
	      bytesPerSequence = 1
	    }
	
	    if (i + bytesPerSequence <= end) {
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === 0xFFFD) {
	      // we generated an invalid codePoint so make sure to only advance by 1 byte
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	  }
	
	  return String.fromCharCode.apply(String, res)
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, Buffer) {(function (global, module) {
	
	  var exports = module.exports;
	
	  /**
	   * Exports.
	   */
	
	  module.exports = expect;
	  expect.Assertion = Assertion;
	
	  /**
	   * Exports version.
	   */
	
	  expect.version = '0.3.1';
	
	  /**
	   * Possible assertion flags.
	   */
	
	  var flags = {
	      not: ['to', 'be', 'have', 'include', 'only']
	    , to: ['be', 'have', 'include', 'only', 'not']
	    , only: ['have']
	    , have: ['own']
	    , be: ['an']
	  };
	
	  function expect (obj) {
	    return new Assertion(obj);
	  }
	
	  /**
	   * Constructor
	   *
	   * @api private
	   */
	
	  function Assertion (obj, flag, parent) {
	    this.obj = obj;
	    this.flags = {};
	
	    if (undefined != parent) {
	      this.flags[flag] = true;
	
	      for (var i in parent.flags) {
	        if (parent.flags.hasOwnProperty(i)) {
	          this.flags[i] = true;
	        }
	      }
	    }
	
	    var $flags = flag ? flags[flag] : keys(flags)
	      , self = this;
	
	    if ($flags) {
	      for (var i = 0, l = $flags.length; i < l; i++) {
	        // avoid recursion
	        if (this.flags[$flags[i]]) continue;
	
	        var name = $flags[i]
	          , assertion = new Assertion(this.obj, name, this)
	
	        if ('function' == typeof Assertion.prototype[name]) {
	          // clone the function, make sure we dont touch the prot reference
	          var old = this[name];
	          this[name] = function () {
	            return old.apply(self, arguments);
	          };
	
	          for (var fn in Assertion.prototype) {
	            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
	              this[name][fn] = bind(assertion[fn], assertion);
	            }
	          }
	        } else {
	          this[name] = assertion;
	        }
	      }
	    }
	  }
	
	  /**
	   * Performs an assertion
	   *
	   * @api private
	   */
	
	  Assertion.prototype.assert = function (truth, msg, error, expected) {
	    var msg = this.flags.not ? error : msg
	      , ok = this.flags.not ? !truth : truth
	      , err;
	
	    if (!ok) {
	      err = new Error(msg.call(this));
	      if (arguments.length > 3) {
	        err.actual = this.obj;
	        err.expected = expected;
	        err.showDiff = true;
	      }
	      throw err;
	    }
	
	    this.and = new Assertion(this.obj);
	  };
	
	  /**
	   * Check if the value is truthy
	   *
	   * @api public
	   */
	
	  Assertion.prototype.ok = function () {
	    this.assert(
	        !!this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
	      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
	  };
	
	  /**
	   * Creates an anonymous function which calls fn with arguments.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.withArgs = function() {
	    expect(this.obj).to.be.a('function');
	    var fn = this.obj;
	    var args = Array.prototype.slice.call(arguments);
	    return expect(function() { fn.apply(null, args); });
	  };
	
	  /**
	   * Assert that the function throws.
	   *
	   * @param {Function|RegExp} callback, or regexp to match error string against
	   * @api public
	   */
	
	  Assertion.prototype.throwError =
	  Assertion.prototype.throwException = function (fn) {
	    expect(this.obj).to.be.a('function');
	
	    var thrown = false
	      , not = this.flags.not;
	
	    try {
	      this.obj();
	    } catch (e) {
	      if (isRegExp(fn)) {
	        var subject = 'string' == typeof e ? e : e.message;
	        if (not) {
	          expect(subject).to.not.match(fn);
	        } else {
	          expect(subject).to.match(fn);
	        }
	      } else if ('function' == typeof fn) {
	        fn(e);
	      }
	      thrown = true;
	    }
	
	    if (isRegExp(fn) && not) {
	      // in the presence of a matcher, ensure the `not` only applies to
	      // the matching.
	      this.flags.not = false;
	    }
	
	    var name = this.obj.name || 'fn';
	    this.assert(
	        thrown
	      , function(){ return 'expected ' + name + ' to throw an exception' }
	      , function(){ return 'expected ' + name + ' not to throw an exception' });
	  };
	
	  /**
	   * Checks if the array is empty.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.empty = function () {
	    var expectation;
	
	    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
	      if ('number' == typeof this.obj.length) {
	        expectation = !this.obj.length;
	      } else {
	        expectation = !keys(this.obj).length;
	      }
	    } else {
	      if ('string' != typeof this.obj) {
	        expect(this.obj).to.be.an('object');
	      }
	
	      expect(this.obj).to.have.property('length');
	      expectation = !this.obj.length;
	    }
	
	    this.assert(
	        expectation
	      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
	    return this;
	  };
	
	  /**
	   * Checks if the obj exactly equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.be =
	  Assertion.prototype.equal = function (obj) {
	    this.assert(
	        obj === this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
	    return this;
	  };
	
	  /**
	   * Checks if the obj sortof equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.eql = function (obj) {
	    this.assert(
	        expect.eql(this.obj, obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
	      , obj);
	    return this;
	  };
	
	  /**
	   * Assert within start to finish (inclusive).
	   *
	   * @param {Number} start
	   * @param {Number} finish
	   * @api public
	   */
	
	  Assertion.prototype.within = function (start, finish) {
	    var range = start + '..' + finish;
	    this.assert(
	        this.obj >= start && this.obj <= finish
	      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
	    return this;
	  };
	
	  /**
	   * Assert typeof / instance of
	   *
	   * @api public
	   */
	
	  Assertion.prototype.a =
	  Assertion.prototype.an = function (type) {
	    if ('string' == typeof type) {
	      // proper english in error msg
	      var n = /^[aeiou]/.test(type) ? 'n' : '';
	
	      // typeof with support for 'array'
	      this.assert(
	          'array' == type ? isArray(this.obj) :
	            'regexp' == type ? isRegExp(this.obj) :
	              'object' == type
	                ? 'object' == typeof this.obj && null !== this.obj
	                : type == typeof this.obj
	        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
	    } else {
	      // instanceof
	      var name = type.name || 'supplied constructor';
	      this.assert(
	          this.obj instanceof type
	        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
	    }
	
	    return this;
	  };
	
	  /**
	   * Assert numeric value above _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.greaterThan =
	  Assertion.prototype.above = function (n) {
	    this.assert(
	        this.obj > n
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
	    return this;
	  };
	
	  /**
	   * Assert numeric value below _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.lessThan =
	  Assertion.prototype.below = function (n) {
	    this.assert(
	        this.obj < n
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
	    return this;
	  };
	
	  /**
	   * Assert string value matches _regexp_.
	   *
	   * @param {RegExp} regexp
	   * @api public
	   */
	
	  Assertion.prototype.match = function (regexp) {
	    this.assert(
	        regexp.exec(this.obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
	      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
	    return this;
	  };
	
	  /**
	   * Assert property "length" exists and has value of _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.length = function (n) {
	    expect(this.obj).to.have.property('length');
	    var len = this.obj.length;
	    this.assert(
	        n == len
	      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
	      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
	    return this;
	  };
	
	  /**
	   * Assert property _name_ exists, with optional _val_.
	   *
	   * @param {String} name
	   * @param {Mixed} val
	   * @api public
	   */
	
	  Assertion.prototype.property = function (name, val) {
	    if (this.flags.own) {
	      this.assert(
	          Object.prototype.hasOwnProperty.call(this.obj, name)
	        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
	      return this;
	    }
	
	    if (this.flags.not && undefined !== val) {
	      if (undefined === this.obj[name]) {
	        throw new Error(i(this.obj) + ' has no property ' + i(name));
	      }
	    } else {
	      var hasProp;
	      try {
	        hasProp = name in this.obj
	      } catch (e) {
	        hasProp = undefined !== this.obj[name]
	      }
	
	      this.assert(
	          hasProp
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
	    }
	
	    if (undefined !== val) {
	      this.assert(
	          val === this.obj[name]
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
	          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
	          + ' of ' + i(val) });
	    }
	
	    this.obj = this.obj[name];
	    return this;
	  };
	
	  /**
	   * Assert that the array contains _obj_ or string contains _obj_.
	   *
	   * @param {Mixed} obj|string
	   * @api public
	   */
	
	  Assertion.prototype.string =
	  Assertion.prototype.contain = function (obj) {
	    if ('string' == typeof this.obj) {
	      this.assert(
	          ~this.obj.indexOf(obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    } else {
	      this.assert(
	          ~indexOf(this.obj, obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    }
	    return this;
	  };
	
	  /**
	   * Assert exact keys or inclusion of keys by using
	   * the `.own` modifier.
	   *
	   * @param {Array|String ...} keys
	   * @api public
	   */
	
	  Assertion.prototype.key =
	  Assertion.prototype.keys = function ($keys) {
	    var str
	      , ok = true;
	
	    $keys = isArray($keys)
	      ? $keys
	      : Array.prototype.slice.call(arguments);
	
	    if (!$keys.length) throw new Error('keys required');
	
	    var actual = keys(this.obj)
	      , len = $keys.length;
	
	    // Inclusion
	    ok = every($keys, function (key) {
	      return ~indexOf(actual, key);
	    });
	
	    // Strict
	    if (!this.flags.not && this.flags.only) {
	      ok = ok && $keys.length == actual.length;
	    }
	
	    // Key string
	    if (len > 1) {
	      $keys = map($keys, function (key) {
	        return i(key);
	      });
	      var last = $keys.pop();
	      str = $keys.join(', ') + ', and ' + last;
	    } else {
	      str = i($keys[0]);
	    }
	
	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;
	
	    // Have / include
	    str = (!this.flags.only ? 'include ' : 'only have ') + str;
	
	    // Assertion
	    this.assert(
	        ok
	      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
	      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });
	
	    return this;
	  };
	
	  /**
	   * Assert a failure.
	   *
	   * @param {String ...} custom message
	   * @api public
	   */
	  Assertion.prototype.fail = function (msg) {
	    var error = function() { return msg || "explicit failure"; }
	    this.assert(false, error, error);
	    return this;
	  };
	
	  /**
	   * Function bind implementation.
	   */
	
	  function bind (fn, scope) {
	    return function () {
	      return fn.apply(scope, arguments);
	    }
	  }
	
	  /**
	   * Array every compatibility
	   *
	   * @see bit.ly/5Fq1N2
	   * @api public
	   */
	
	  function every (arr, fn, thisObj) {
	    var scope = thisObj || global;
	    for (var i = 0, j = arr.length; i < j; ++i) {
	      if (!fn.call(scope, arr[i], i, arr)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * Array indexOf compatibility.
	   *
	   * @see bit.ly/a5Dxa2
	   * @api public
	   */
	
	  function indexOf (arr, o, i) {
	    if (Array.prototype.indexOf) {
	      return Array.prototype.indexOf.call(arr, o, i);
	    }
	
	    if (arr.length === undefined) {
	      return -1;
	    }
	
	    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
	        ; i < j && arr[i] !== o; i++);
	
	    return j <= i ? -1 : i;
	  }
	
	  // https://gist.github.com/1044128/
	  var getOuterHTML = function(element) {
	    if ('outerHTML' in element) return element.outerHTML;
	    var ns = "http://www.w3.org/1999/xhtml";
	    var container = document.createElementNS(ns, '_');
	    var xmlSerializer = new XMLSerializer();
	    var html;
	    if (document.xmlVersion) {
	      return xmlSerializer.serializeToString(element);
	    } else {
	      container.appendChild(element.cloneNode(false));
	      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
	      container.innerHTML = '';
	      return html;
	    }
	  };
	
	  // Returns true if object is a DOM element.
	  var isDOMElement = function (object) {
	    if (typeof HTMLElement === 'object') {
	      return object instanceof HTMLElement;
	    } else {
	      return object &&
	        typeof object === 'object' &&
	        object.nodeType === 1 &&
	        typeof object.nodeName === 'string';
	    }
	  };
	
	  /**
	   * Inspects an object.
	   *
	   * @see taken from node.js `util` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  function i (obj, showHidden, depth) {
	    var seen = [];
	
	    function stylize (str) {
	      return str;
	    }
	
	    function format (value, recurseTimes) {
	      // Provide a hook for user-specified inspect functions.
	      // Check that value is an object with an inspect function on it
	      if (value && typeof value.inspect === 'function' &&
	          // Filter out the util module, it's inspect function is special
	          value !== exports &&
	          // Also filter out any prototype objects using the circular check.
	          !(value.constructor && value.constructor.prototype === value)) {
	        return value.inspect(recurseTimes);
	      }
	
	      // Primitive types cannot have properties
	      switch (typeof value) {
	        case 'undefined':
	          return stylize('undefined', 'undefined');
	
	        case 'string':
	          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
	                                                   .replace(/'/g, "\\'")
	                                                   .replace(/\\"/g, '"') + '\'';
	          return stylize(simple, 'string');
	
	        case 'number':
	          return stylize('' + value, 'number');
	
	        case 'boolean':
	          return stylize('' + value, 'boolean');
	      }
	      // For some reason typeof null is "object", so special case here.
	      if (value === null) {
	        return stylize('null', 'null');
	      }
	
	      if (isDOMElement(value)) {
	        return getOuterHTML(value);
	      }
	
	      // Look up the keys of the object.
	      var visible_keys = keys(value);
	      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;
	
	      // Functions without properties can be shortcutted.
	      if (typeof value === 'function' && $keys.length === 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          var name = value.name ? ': ' + value.name : '';
	          return stylize('[Function' + name + ']', 'special');
	        }
	      }
	
	      // Dates without properties can be shortcutted
	      if (isDate(value) && $keys.length === 0) {
	        return stylize(value.toUTCString(), 'date');
	      }
	      
	      // Error objects can be shortcutted
	      if (value instanceof Error) {
	        return stylize("["+value.toString()+"]", 'Error');
	      }
	
	      var base, type, braces;
	      // Determine the object type
	      if (isArray(value)) {
	        type = 'Array';
	        braces = ['[', ']'];
	      } else {
	        type = 'Object';
	        braces = ['{', '}'];
	      }
	
	      // Make functions say that they are functions
	      if (typeof value === 'function') {
	        var n = value.name ? ': ' + value.name : '';
	        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	      } else {
	        base = '';
	      }
	
	      // Make dates with properties first say the date
	      if (isDate(value)) {
	        base = ' ' + value.toUTCString();
	      }
	
	      if ($keys.length === 0) {
	        return braces[0] + base + braces[1];
	      }
	
	      if (recurseTimes < 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          return stylize('[Object]', 'special');
	        }
	      }
	
	      seen.push(value);
	
	      var output = map($keys, function (key) {
	        var name, str;
	        if (value.__lookupGetter__) {
	          if (value.__lookupGetter__(key)) {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Getter/Setter]', 'special');
	            } else {
	              str = stylize('[Getter]', 'special');
	            }
	          } else {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Setter]', 'special');
	            }
	          }
	        }
	        if (indexOf(visible_keys, key) < 0) {
	          name = '[' + key + ']';
	        }
	        if (!str) {
	          if (indexOf(seen, value[key]) < 0) {
	            if (recurseTimes === null) {
	              str = format(value[key]);
	            } else {
	              str = format(value[key], recurseTimes - 1);
	            }
	            if (str.indexOf('\n') > -1) {
	              if (isArray(value)) {
	                str = map(str.split('\n'), function (line) {
	                  return '  ' + line;
	                }).join('\n').substr(2);
	              } else {
	                str = '\n' + map(str.split('\n'), function (line) {
	                  return '   ' + line;
	                }).join('\n');
	              }
	            }
	          } else {
	            str = stylize('[Circular]', 'special');
	          }
	        }
	        if (typeof name === 'undefined') {
	          if (type === 'Array' && key.match(/^\d+$/)) {
	            return str;
	          }
	          name = json.stringify('' + key);
	          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	            name = name.substr(1, name.length - 2);
	            name = stylize(name, 'name');
	          } else {
	            name = name.replace(/'/g, "\\'")
	                       .replace(/\\"/g, '"')
	                       .replace(/(^"|"$)/g, "'");
	            name = stylize(name, 'string');
	          }
	        }
	
	        return name + ': ' + str;
	      });
	
	      seen.pop();
	
	      var numLinesEst = 0;
	      var length = reduce(output, function (prev, cur) {
	        numLinesEst++;
	        if (indexOf(cur, '\n') >= 0) numLinesEst++;
	        return prev + cur.length + 1;
	      }, 0);
	
	      if (length > 50) {
	        output = braces[0] +
	                 (base === '' ? '' : base + '\n ') +
	                 ' ' +
	                 output.join(',\n  ') +
	                 ' ' +
	                 braces[1];
	
	      } else {
	        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	      }
	
	      return output;
	    }
	    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	  }
	
	  expect.stringify = i;
	
	  function isArray (ar) {
	    return Object.prototype.toString.call(ar) === '[object Array]';
	  }
	
	  function isRegExp(re) {
	    var s;
	    try {
	      s = '' + re;
	    } catch (e) {
	      return false;
	    }
	
	    return re instanceof RegExp || // easy case
	           // duck-type for context-switching evalcx case
	           typeof(re) === 'function' &&
	           re.constructor.name === 'RegExp' &&
	           re.compile &&
	           re.test &&
	           re.exec &&
	           s.match(/^\/.*\/[gim]{0,3}$/);
	  }
	
	  function isDate(d) {
	    return d instanceof Date;
	  }
	
	  function keys (obj) {
	    if (Object.keys) {
	      return Object.keys(obj);
	    }
	
	    var keys = [];
	
	    for (var i in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, i)) {
	        keys.push(i);
	      }
	    }
	
	    return keys;
	  }
	
	  function map (arr, mapper, that) {
	    if (Array.prototype.map) {
	      return Array.prototype.map.call(arr, mapper, that);
	    }
	
	    var other= new Array(arr.length);
	
	    for (var i= 0, n = arr.length; i<n; i++)
	      if (i in arr)
	        other[i] = mapper.call(that, arr[i], i, arr);
	
	    return other;
	  }
	
	  function reduce (arr, fun) {
	    if (Array.prototype.reduce) {
	      return Array.prototype.reduce.apply(
	          arr
	        , Array.prototype.slice.call(arguments, 1)
	      );
	    }
	
	    var len = +this.length;
	
	    if (typeof fun !== "function")
	      throw new TypeError();
	
	    // no value to return if no initial value and an empty array
	    if (len === 0 && arguments.length === 1)
	      throw new TypeError();
	
	    var i = 0;
	    if (arguments.length >= 2) {
	      var rv = arguments[1];
	    } else {
	      do {
	        if (i in this) {
	          rv = this[i++];
	          break;
	        }
	
	        // if array contains no values, no initial value to return
	        if (++i >= len)
	          throw new TypeError();
	      } while (true);
	    }
	
	    for (; i < len; i++) {
	      if (i in this)
	        rv = fun.call(null, rv, this[i], i, this);
	    }
	
	    return rv;
	  }
	
	  /**
	   * Asserts deep equality
	   *
	   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  expect.eql = function eql(actual, expected) {
	    // 7.1. All identical values are equivalent, as determined by ===.
	    if (actual === expected) {
	      return true;
	    } else if ('undefined' != typeof Buffer
	      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	      if (actual.length != expected.length) return false;
	
	      for (var i = 0; i < actual.length; i++) {
	        if (actual[i] !== expected[i]) return false;
	      }
	
	      return true;
	
	      // 7.2. If the expected value is a Date object, the actual value is
	      // equivalent if it is also a Date object that refers to the same time.
	    } else if (actual instanceof Date && expected instanceof Date) {
	      return actual.getTime() === expected.getTime();
	
	      // 7.3. Other pairs that do not both pass typeof value == "object",
	      // equivalence is determined by ==.
	    } else if (typeof actual != 'object' && typeof expected != 'object') {
	      return actual == expected;
	    // If both are regular expression use the special `regExpEquiv` method
	    // to determine equivalence.
	    } else if (isRegExp(actual) && isRegExp(expected)) {
	      return regExpEquiv(actual, expected);
	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical "prototype" property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	    } else {
	      return objEquiv(actual, expected);
	    }
	  };
	
	  function isUndefinedOrNull (value) {
	    return value === null || value === undefined;
	  }
	
	  function isArguments (object) {
	    return Object.prototype.toString.call(object) == '[object Arguments]';
	  }
	
	  function regExpEquiv (a, b) {
	    return a.source === b.source && a.global === b.global &&
	           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
	  }
	
	  function objEquiv (a, b) {
	    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	      return false;
	    // an identical "prototype" property.
	    if (a.prototype !== b.prototype) return false;
	    //~~~I've managed to break Object.keys through screwy arguments passing.
	    //   Converting to array solves the problem.
	    if (isArguments(a)) {
	      if (!isArguments(b)) {
	        return false;
	      }
	      a = pSlice.call(a);
	      b = pSlice.call(b);
	      return expect.eql(a, b);
	    }
	    try{
	      var ka = keys(a),
	        kb = keys(b),
	        key, i;
	    } catch (e) {//happens when one is a string literal and the other isn't
	      return false;
	    }
	    // having the same number of owned properties (keys incorporates hasOwnProperty)
	    if (ka.length != kb.length)
	      return false;
	    //the same set of keys (although not necessarily the same order),
	    ka.sort();
	    kb.sort();
	    //~~~cheap key test
	    for (i = ka.length - 1; i >= 0; i--) {
	      if (ka[i] != kb[i])
	        return false;
	    }
	    //equivalent values for every corresponding key, and
	    //~~~possibly expensive deep test
	    for (i = ka.length - 1; i >= 0; i--) {
	      key = ka[i];
	      if (!expect.eql(a[key], b[key]))
	         return false;
	    }
	    return true;
	  }
	
	  var json = (function () {
	    "use strict";
	
	    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
	      return {
	          parse: nativeJSON.parse
	        , stringify: nativeJSON.stringify
	      }
	    }
	
	    var JSON = {};
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    function date(d, key) {
	      return isFinite(d.valueOf()) ?
	          d.getUTCFullYear()     + '-' +
	          f(d.getUTCMonth() + 1) + '-' +
	          f(d.getUTCDate())      + 'T' +
	          f(d.getUTCHours())     + ':' +
	          f(d.getUTCMinutes())   + ':' +
	          f(d.getUTCSeconds())   + 'Z' : null;
	    }
	
	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;
	
	
	    function quote(string) {
	
	  // If the string contains no control characters, no quote characters, and no
	  // backslash characters, then we can safely slap some quotes around it.
	  // Otherwise we must also replace the offending characters with safe escape
	  // sequences.
	
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }
	
	
	    function str(key, holder) {
	
	  // Produce a string from holder[key].
	
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];
	
	  // If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value instanceof Date) {
	            value = date(key);
	        }
	
	  // If we were called with a replacer function, then call the replacer to
	  // obtain a replacement value.
	
	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	
	  // What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	
	        case 'number':
	
	  // JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	
	  // If the value is a boolean or null, convert it to a string. Note:
	  // typeof null does not produce 'null'. The case is included here in
	  // the remote chance that this gets fixed someday.
	
	            return String(value);
	
	  // If the type is 'object', we might be dealing with an object or an array or
	  // null.
	
	        case 'object':
	
	  // Due to a specification blunder in ECMAScript, typeof null is 'object',
	  // so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	  // Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	  // Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	  // The value is an array. Stringify every element. Use null as a placeholder
	  // for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	
	  // Join all of the elements together, separated with commas, and wrap them in
	  // brackets.
	
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	
	  // If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	
	  // Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	
	  // Join all of the member texts together, separated with commas,
	  // and wrap them in braces.
	
	            v = partial.length === 0 ? '{}' : gap ?
	                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	                '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }
	
	  // If the JSON object does not yet have a stringify method, give it one.
	
	    JSON.stringify = function (value, replacer, space) {
	
	  // The stringify method takes a value and an optional replacer, and an optional
	  // space parameter, and returns a JSON text. The replacer can be a function
	  // that can replace values, or an array of strings that will select the keys.
	  // A default replacer method can be provided. Use of the space parameter can
	  // produce text that is more easily readable.
	
	        var i;
	        gap = '';
	        indent = '';
	
	  // If the space parameter is a number, make an indent string containing that
	  // many spaces.
	
	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }
	
	  // If the space parameter is a string, it will be used as the indent string.
	
	        } else if (typeof space === 'string') {
	            indent = space;
	        }
	
	  // If there is a replacer, it must be a function or an array.
	  // Otherwise, throw an error.
	
	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                typeof replacer.length !== 'number')) {
	            throw new Error('JSON.stringify');
	        }
	
	  // Make a fake root object containing our value under the key of ''.
	  // Return the result of stringifying the value.
	
	        return str('', {'': value});
	    };
	
	  // If the JSON object does not yet have a parse method, give it one.
	
	    JSON.parse = function (text, reviver) {
	    // The parse method takes a text and an optional reviver function, and returns
	    // a JavaScript value if the text is a valid JSON text.
	
	        var j;
	
	        function walk(holder, key) {
	
	    // The walk method is used to recursively walk the resulting structure so
	    // that modifications can be made.
	
	            var k, v, value = holder[key];
	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }
	
	
	    // Parsing happens in four stages. In the first stage, we replace certain
	    // Unicode characters with escape sequences. JavaScript handles many characters
	    // incorrectly, either silently deleting them, or treating them as line endings.
	
	        text = String(text);
	        cx.lastIndex = 0;
	        if (cx.test(text)) {
	            text = text.replace(cx, function (a) {
	                return '\\u' +
	                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            });
	        }
	
	    // In the second stage, we run the text against regular expressions that look
	    // for non-JSON patterns. We are especially concerned with '()' and 'new'
	    // because they can cause invocation, and '=' because it can cause mutation.
	    // But just to be safe, we want to reject all unexpected forms.
	
	    // We split the second stage into 4 regexp operations in order to work around
	    // crippling inefficiencies in IE's and Safari's regexp engines. First we
	    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	    // replace all simple value tokens with ']' characters. Third, we delete all
	    // open brackets that follow a colon or comma or that begin the text. Finally,
	    // we look to see that the remaining characters are only whitespace or ']' or
	    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	        if (/^[\],:{}\s]*$/
	                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
	    // In the third stage we use the eval function to compile the text into a
	    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	    // in JavaScript: it can begin a block or an object literal. We wrap the text
	    // in parens to eliminate the ambiguity.
	
	            j = eval('(' + text + ')');
	
	    // In the optional fourth stage, we recursively walk the new structure, passing
	    // each name/value pair to a reviver function for possible transformation.
	
	            return typeof reviver === 'function' ?
	                walk({'': j}, '') : j;
	        }
	
	    // If the text is not JSON parseable, then a SyntaxError is thrown.
	
	        throw new SyntaxError('JSON.parse');
	    };
	
	    return JSON;
	  })();
	
	  if ('undefined' != typeof window) {
	    window.expect = module.exports;
	  }
	
	})(
	    this
	  ,  true ? module : {exports: {}}
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module), __webpack_require__(1).Buffer))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	"èr":"二贰",
	"shí":"十时实蚀",
	"yǐ":"乙已以蚁倚",
	"yī":"一衣医依伊揖壹",
	"chǎng,ān,hàn":"厂",
	"dīng,zhēng":"丁",
	"qī":"七戚欺漆柒凄嘁",
	"bǔ,bo":"卜",
	"rén":"人仁",
	"rù":"入褥",
	"jiǔ":"九久酒玖灸韭",
	"ér":"儿而",
	"bā":"八巴疤叭芭捌笆",
	"jǐ,jī":"几",
	"le,liǎo":"了",
	"lì":"力历厉立励利例栗粒吏沥荔俐莉砾雳痢",
	"dāo":"刀",
	"nǎi":"乃奶",
	"sān":"三叁",
	"yòu":"又右幼诱佑",
	"yú":"于余鱼娱渔榆愚隅逾舆",
	"shì":"士示世市式势事侍饰试视柿是适室逝释誓拭恃嗜",
	"gān,gàn":"干",
	"gōng":"工弓公功攻宫恭躬",
	"kuī":"亏盔窥",
	"tǔ":"土",
	"cùn":"寸",
	"dà,dài,tài":"大",
	"cái":"才材财裁",
	"xià":"下夏",
	"zhàng":"丈仗帐胀障杖账",
	"yǔ,yù,yú":"与",
	"shàng,shǎng":"上",
	"wàn,mò":"万",
	"kǒu":"口",
	"xiǎo":"小晓",
	"jīn":"巾斤今金津筋襟",
	"shān":"山删衫珊",
	"qiān":"千迁牵谦签",
	"qǐ":"乞企启起",
	"chuān":"川穿",
	"gè,gě":"个各",
	"sháo":"勺芍",
	"yì":"亿义艺忆议亦异役译易疫益谊意毅翼屹抑邑绎奕逸肄溢",
	"jí":"及吉级极即急疾集籍棘辑嫉",
	"fán":"凡烦矾樊",
	"xī":"夕西吸希析牺息悉惜稀锡溪熄膝昔晰犀熙嬉蟋",
	"wán":"丸完玩顽",
	"me,mó,ma,yāo":"么",
	"guǎng,ān":"广",
	"wáng,wú":"亡",
	"mén":"门们",
	"shī":"尸失师诗狮施湿虱",
	"zhī":"之支汁芝肢脂蜘",
	"jǐ":"己挤脊",
	"zǐ":"子紫姊籽滓",
	"wèi":"卫未位味畏胃喂慰谓猬蔚魏",
	"yě":"也冶野",
	"nǚ,rǔ":"女",
	"rèn":"刃认韧纫",
	"fēi":"飞非啡",
	"xí":"习席袭媳",
	"mǎ":"马码玛",
	"chā,chá,chǎ":"叉",
	"fēng":"丰封疯峰锋蜂枫",
	"xiāng":"乡香箱厢湘镶",
	"jǐng":"井警阱",
	"wáng,wàng":"王",
	"kāi":"开揩",
	"tiān":"天添",
	"wú":"无吴芜梧蜈",
	"fū,fú":"夫",
	"zhuān":"专砖",
	"yuán":"元园原圆援缘源袁猿辕",
	"yún":"云匀耘",
	"zhā,zā,zhá":"扎",
	"mù":"木目牧墓幕暮慕沐募睦穆",
	"wǔ":"五午伍武侮舞捂鹉",
	"tīng":"厅听",
	"bù,fǒu":"不",
	"qū,ōu":"区",
	"quǎn":"犬",
	"tài":"太态泰汰",
	"yǒu":"友",
	"chē,jū":"车",
	"pǐ":"匹",
	"yóu":"尤由邮犹油游",
	"jù":"巨拒具俱剧距惧锯聚炬",
	"yá":"牙芽崖蚜涯衙",
	"bǐ":"比彼笔鄙匕秕",
	"jiē":"皆阶接街秸",
	"hù":"互户护沪",
	"qiè,qiē":"切",
	"wǎ,wà":"瓦",
	"zhǐ":"止旨址纸指趾",
	"tún,zhūn":"屯",
	"shǎo,shào":"少",
	"rì":"日",
	"zhōng,zhòng":"中",
	"gāng":"冈刚纲缸肛",
	"nèi,nà":"内",
	"bèi":"贝备倍辈狈惫焙",
	"shuǐ":"水",
	"jiàn,xiàn":"见",
	"niú":"牛",
	"shǒu":"手守首",
	"máo":"毛矛茅锚",
	"qì":"气弃汽器迄泣",
	"shēng":"升生声牲笙甥",
	"cháng,zhǎng":"长",
	"shén,shí":"什",
	"piàn,piān":"片",
	"pú,pū":"仆",
	"huà,huā":"化",
	"bì":"币必毕闭毙碧蔽弊避壁庇蓖痹璧",
	"chóu,qiú":"仇",
	"zhuǎ,zhǎo":"爪",
	"jǐn,jìn":"仅",
	"réng":"仍",
	"fù,fǔ":"父",
	"cóng,zòng":"从",
	"fǎn":"反返",
	"jiè":"介戒届界借诫",
	"xiōng":"凶兄胸匈汹",
	"fēn,fèn":"分",
	"fá":"乏伐罚阀筏",
	"cāng":"仓苍舱沧",
	"yuè":"月阅悦跃越岳粤",
	"shì,zhī":"氏",
	"wù":"勿务物误悟雾坞晤",
	"qiàn":"欠歉",
	"fēng,fěng":"风",
	"dān":"丹耽",
	"wū":"乌污呜屋巫诬",
	"fèng":"凤奉",
	"gōu,gòu":"勾",
	"wén":"文闻蚊",
	"liù,lù":"六",
	"huǒ":"火伙",
	"fāng":"方芳",
	"dǒu,dòu":"斗",
	"wèi,wéi":"为",
	"dìng":"订定锭",
	"jì":"计记技忌际季剂迹既继寄绩妓荠寂鲫冀",
	"xīn":"心辛欣新薪锌",
	"chǐ,chě":"尺",
	"yǐn":"引饮蚓瘾",
	"chǒu":"丑",
	"kǒng":"孔恐",
	"duì":"队对",
	"bàn":"办半扮伴瓣绊",
	"yǔ,yú":"予",
	"yǔn":"允陨",
	"quàn":"劝",
	"shū":"书叔殊梳舒疏输蔬抒枢淑",
	"shuāng":"双霜",
	"yù":"玉育狱浴预域欲遇御裕愈誉芋郁喻寓豫",
	"huàn":"幻换唤患宦涣焕痪",
	"kān":"刊堪勘",
	"mò":"末沫漠墨默茉陌寞",
	"jī":"击饥圾机肌鸡积基激讥叽唧畸箕",
	"dǎ,dá":"打",
	"qiǎo":"巧",
	"zhèng,zhēng":"正症挣",
	"pū":"扑",
	"bā,pá":"扒",
	"gān":"甘肝竿柑",
	"qù":"去",
	"rēng":"扔",
	"gǔ":"古谷股鼓",
	"běn":"本",
	"jié,jiē":"节结",
	"shù,shú,zhú":"术",
	"bǐng":"丙柄饼秉禀",
	"kě,kè":"可",
	"zuǒ":"左",
	"bù":"布步怖部埠",
	"shí,dàn":"石",
	"lóng":"龙聋隆咙胧窿",
	"yà":"轧亚讶",
	"miè":"灭蔑",
	"píng":"平评凭瓶萍坪",
	"dōng":"东冬",
	"kǎ,qiǎ":"卡",
	"běi,bèi":"北",
	"yè":"业页夜液谒腋",
	"jiù":"旧救就舅臼疚",
	"shuài":"帅蟀",
	"guī":"归规闺硅瑰",
	"zhàn,zhān":"占",
	"dàn":"旦但诞淡蛋氮",
	"qiě,jū":"且",
	"yè,xié":"叶",
	"jiǎ":"甲钾",
	"dīng":"叮盯",
	"shēn":"申伸身深呻绅",
	"hào,háo":"号",
	"diàn":"电店垫殿玷淀惦奠",
	"tián":"田甜恬",
	"shǐ":"史使始驶矢屎",
	"zhī,zhǐ":"只",
	"yāng":"央殃秧鸯",
	"diāo":"叼雕刁碉",
	"jiào":"叫轿较窖酵",
	"lìng":"另",
	"dāo,tāo":"叨",
	"sì":"四寺饲肆",
	"tàn":"叹炭探碳",
	"qiū":"丘秋蚯",
	"hé":"禾河荷盒",
	"fù":"付负妇附咐赴复傅富腹覆赋缚",
	"dài":"代带贷怠袋逮戴",
	"xiān":"仙先掀锨",
	"yí":"仪宜姨移遗夷胰",
	"bái":"白",
	"zǎi,zǐ,zī":"仔",
	"chì":"斥赤翅",
	"tā":"他它塌",
	"guā":"瓜刮",
	"hū":"乎呼忽",
	"cóng":"丛",
	"lìng,líng,lǐng":"令",
	"yòng":"用",
	"shuǎi":"甩",
	"yìn":"印",
	"lè,yuè":"乐",
	"jù,gōu":"句",
	"cōng":"匆葱聪囱",
	"fàn":"犯饭泛范贩",
	"cè":"册厕测策",
	"wài":"外",
	"chù,chǔ":"处",
	"niǎo":"鸟",
	"bāo":"包胞苞褒",
	"zhǔ":"主煮嘱拄",
	"shǎn":"闪陕",
	"lán":"兰拦栏蓝篮澜",
	"tóu,tou":"头",
	"huì":"汇绘贿惠慧讳诲晦秽",
	"hàn":"汉旱捍悍焊撼翰憾",
	"tǎo":"讨",
	"xué":"穴学",
	"xiě":"写",
	"níng,nìng,zhù":"宁",
	"ràng":"让",
	"lǐ":"礼李里理鲤",
	"xùn":"训讯迅汛驯逊殉",
	"yǒng":"永咏泳勇蛹踊",
	"mín":"民",
	"chū":"出初",
	"ní":"尼",
	"sī":"司丝私斯撕嘶",
	"liáo":"辽疗僚聊寥嘹缭",
	"jiā":"加佳嘉枷",
	"nú":"奴",
	"zhào,shào":"召",
	"biān":"边编鞭蝙",
	"pí":"皮疲脾啤",
	"yùn":"孕运韵酝蕴",
	"fā,fà":"发",
	"shèng":"圣胜剩",
	"tái,tāi":"台苔",
	"jiū":"纠究揪鸠",
	"mǔ":"母亩牡拇姆",
	"káng,gāng":"扛",
	"xíng":"刑形型邢",
	"dòng":"动冻栋洞",
	"kǎo":"考烤拷",
	"kòu":"扣寇",
	"tuō":"托拖脱",
	"lǎo":"老",
	"gǒng":"巩汞拱",
	"zhí":"执直侄值职植",
	"kuò":"扩阔廓",
	"yáng":"扬阳杨洋",
	"dì,de":"地",
	"sǎo,sào":"扫",
	"chǎng,cháng":"场",
	"ěr":"耳尔饵",
	"máng":"芒忙盲茫",
	"xiǔ":"朽",
	"pǔ,pò,pō,piáo":"朴",
	"quán":"权全泉拳痊",
	"guò,guo,guō":"过",
	"chén":"臣尘辰沉陈晨忱",
	"zài":"再在",
	"xié":"协胁斜携鞋谐",
	"yā,yà":"压",
	"yàn":"厌艳宴验雁焰砚唁谚堰",
	"yǒu,yòu":"有",
	"cún":"存",
	"bǎi":"百摆",
	"kuā,kuà":"夸",
	"jiàng":"匠酱",
	"duó":"夺踱",
	"huī":"灰挥恢辉徽",
	"dá":"达",
	"sǐ":"死",
	"liè":"列劣烈猎",
	"guǐ":"轨鬼诡",
	"xié,yá,yé,yú,xú":"邪",
	"jiá,jiā,gā,xiá":"夹",
	"chéng":"成呈诚承城程惩橙",
	"mài":"迈麦卖",
	"huà,huá":"划",
	"zhì":"至志帜制质治致秩智置挚掷窒滞稚",
	"cǐ":"此",
	"zhēn":"贞针侦珍真斟榛",
	"jiān":"尖奸歼坚肩艰兼煎",
	"guāng":"光",
	"dāng,dàng":"当",
	"zǎo":"早枣澡蚤藻",
	"tù,tǔ":"吐",
	"xià,hè":"吓",
	"chóng":"虫崇",
	"tuán":"团",
	"tóng,tòng":"同",
	"qū,qǔ":"曲",
	"diào":"吊钓掉",
	"yīn":"因阴音姻茵",
	"chī":"吃嗤痴",
	"ma,má,mǎ":"吗",
	"yǔ":"屿宇羽",
	"fān":"帆翻",
	"huí":"回茴蛔",
	"qǐ,kǎi":"岂",
	"zé":"则责",
	"suì":"岁碎穗祟遂隧",
	"ròu":"肉",
	"zhū,shú":"朱",
	"wǎng":"网往枉",
	"nián":"年",
	"diū":"丢",
	"shé":"舌",
	"zhú":"竹逐烛",
	"qiáo":"乔侨桥瞧荞憔",
	"wěi":"伟伪苇纬萎",
	"chuán,zhuàn":"传",
	"pāng":"乓",
	"pīng":"乒",
	"xiū,xǔ":"休",
	"fú":"伏扶俘浮符幅福凫芙袱辐蝠",
	"yōu":"优忧悠幽",
	"yán":"延严言岩炎沿盐颜阎蜒檐",
	"jiàn":"件建荐贱剑健舰践鉴键箭涧",
	"rèn,rén":"任",
	"huá,huà,huā":"华",
	"jià,jiè,jie":"价",
	"shāng":"伤商",
	"fèn,bīn":"份",
	"fǎng":"仿访纺",
	"yǎng,áng":"仰",
	"zì":"自字",
	"xiě,xuè":"血",
	"xiàng":"向项象像橡",
	"sì,shì":"似",
	"hòu":"后厚候",
	"zhōu":"舟州周洲",
	"háng,xíng":"行",
	"huì,kuài":"会",
	"shā":"杀纱杉砂",
	"hé,gě":"合",
	"zhào":"兆赵照罩",
	"zhòng":"众仲",
	"yé":"爷",
	"sǎn":"伞",
	"chuàng,chuāng":"创",
	"duǒ":"朵躲",
	"wēi":"危威微偎薇巍",
	"xún":"旬寻巡询循",
	"zá":"杂砸",
	"míng":"名明鸣铭螟",
	"duō":"多哆",
	"zhēng":"争征睁筝蒸怔狰",
	"sè":"色涩瑟",
	"zhuàng":"壮状撞",
	"chōng,chòng":"冲",
	"bīng":"冰兵",
	"zhuāng":"庄装妆桩",
	"qìng":"庆",
	"liú":"刘留流榴琉硫瘤",
	"qí,jì,zī,zhāi":"齐",
	"cì":"次赐",
	"jiāo":"交郊浇娇骄胶椒焦蕉礁",
	"chǎn":"产铲阐",
	"wàng":"妄忘旺望",
	"chōng":"充",
	"wèn":"问",
	"chuǎng":"闯",
	"yáng,xiáng":"羊",
	"bìng,bīng":"并",
	"dēng":"灯登蹬",
	"mǐ":"米",
	"guān":"关官棺",
	"hàn,hán":"汗",
	"jué":"决绝掘诀爵",
	"jiāng":"江姜僵缰",
	"tāng,shāng":"汤",
	"chí":"池驰迟持弛",
	"xīng,xìng":"兴",
	"zhái":"宅",
	"ān":"安氨庵鞍",
	"jiǎng":"讲奖桨蒋",
	"jūn":"军均君钧",
	"xǔ,hǔ":"许",
	"fěng":"讽",
	"lùn,lún":"论",
	"nóng":"农浓脓",
	"shè":"设社舍涉赦",
	"nà,nǎ,nèi,nā":"那",
	"jìn,jǐn":"尽",
	"dǎo":"导岛蹈捣祷",
	"sūn,xùn":"孙",
	"zhèn":"阵振震镇",
	"shōu":"收",
	"fáng":"防妨房肪",
	"rú":"如儒蠕",
	"mā":"妈",
	"xì,hū":"戏",
	"hǎo,hào":"好",
	"tā,jiě":"她",
	"guān,guàn":"观冠",
	"huān":"欢",
	"hóng,gōng":"红",
	"mǎi":"买",
	"xiān,qiàn":"纤",
	"jì,jǐ":"纪济",
	"yuē,yāo":"约",
	"shòu":"寿受授售兽瘦",
	"nòng,lòng":"弄",
	"jìn":"进近晋浸",
	"wéi":"违围唯维桅",
	"yuǎn,yuàn":"远",
	"tūn":"吞",
	"tán":"坛谈痰昙谭潭檀",
	"fǔ":"抚斧府俯辅腐甫脯",
	"huài,pēi,pī,péi":"坏",
	"rǎo":"扰",
	"pī":"批披坯霹",
	"zhǎo":"找沼",
	"chě":"扯",
	"zǒu":"走",
	"chāo":"抄钞超",
	"bà":"坝爸霸",
	"gòng":"贡",
	"zhé,shé,zhē":"折",
	"qiǎng,qiāng,chēng":"抢",
	"zhuā":"抓",
	"xiào":"孝笑效哮啸",
	"pāo":"抛",
	"tóu":"投",
	"kàng":"抗炕",
	"fén":"坟焚",
	"kēng":"坑",
	"dǒu":"抖陡蚪",
	"ké,qiào":"壳",
	"fāng,fáng":"坊",
	"niǔ":"扭纽钮",
	"kuài":"块快筷",
	"bǎ,bà":"把",
	"bào":"报抱爆豹",
	"jié":"劫杰洁捷截竭",
	"què":"却确鹊",
	"huā":"花",
	"fēn":"芬吩纷氛",
	"qín":"芹琴禽勤秦擒",
	"láo":"劳牢",
	"lú":"芦炉卢庐颅",
	"gān,gǎn":"杆",
	"kè":"克刻客课",
	"sū,sù":"苏",
	"dù":"杜渡妒镀",
	"gàng,gāng":"杠",
	"cūn":"村",
	"qiú":"求球囚",
	"xìng":"杏幸性姓",
	"gèng,gēng":"更",
	"liǎng":"两",
	"lì,lí":"丽",
	"shù":"束述树竖恕庶墅漱",
	"dòu":"豆逗痘",
	"hái,huán":"还",
	"fǒu,pǐ":"否",
	"lái":"来莱",
	"lián":"连怜帘莲联廉镰",
	"xiàn,xuán":"县",
	"zhù,chú":"助",
	"dāi":"呆",
	"kuàng":"旷况矿框眶",
	"ya,yā":"呀",
	"zú":"足族",
	"dūn":"吨蹲墩",
	"kùn":"困",
	"nán":"男",
	"chǎo,chāo":"吵",
	"yuán,yún,yùn":"员",
	"chuàn":"串",
	"chuī":"吹炊",
	"ba,bā":"吧",
	"hǒu":"吼",
	"gǎng":"岗",
	"bié,biè":"别",
	"dīng,dìng":"钉",
	"gào":"告",
	"wǒ":"我",
	"luàn":"乱",
	"tū":"秃突凸",
	"xiù":"秀袖绣锈嗅",
	"gū,gù":"估",
	"měi":"每美",
	"hé,hē,hè":"何",
	"tǐ,tī,bèn":"体",
	"bó,bǎi,bà":"伯",
	"zuò":"作坐座做",
	"líng":"伶灵铃陵零龄玲凌菱蛉翎",
	"dī":"低堤滴",
	"yòng,yōng":"佣",
	"nǐ":"你拟",
	"zhù":"住注驻柱祝铸贮蛀",
	"zào":"皂灶造燥躁噪",
	"fó,fú,bì,bó":"佛",
	"chè":"彻撤澈",
	"tuǒ":"妥椭",
	"lín":"邻林临琳磷鳞",
	"hán":"含寒函涵韩",
	"chà":"岔衩",
	"cháng":"肠尝常偿",
	"dù,dǔ":"肚",
	"guī,jūn,qiū":"龟",
	"miǎn":"免勉娩冕缅",
	"jiǎo,jué":"角",
	"kuáng":"狂",
	"tiáo,tiāo":"条",
	"luǎn":"卵",
	"yíng":"迎盈营蝇赢荧莹萤",
	"xì,jì":"系",
	"chuáng":"床",
	"kù":"库裤酷",
	"yìng,yīng":"应",
	"lěng":"冷",
	"zhè,zhèi":"这",
	"xù":"序叙绪续絮蓄旭恤酗婿",
	"xián":"闲贤弦咸衔嫌涎舷",
	"jiān,jiàn":"间监",
	"pàn":"判盼叛畔",
	"mēn,mèn":"闷",
	"wāng":"汪",
	"dì,tì,tuí":"弟",
	"shā,shà":"沙",
	"shà,shā":"煞",
	"càn":"灿",
	"wò":"沃卧握",
	"méi,mò":"没",
	"gōu":"沟钩",
	"shěn,chén":"沈",
	"huái":"怀槐徊淮",
	"sòng":"宋送诵颂讼",
	"hóng":"宏虹洪鸿",
	"qióng":"穷琼",
	"zāi":"灾栽",
	"liáng":"良梁粮粱",
	"zhèng":"证郑政",
	"bǔ":"补捕哺",
	"sù":"诉肃素速塑粟溯",
	"shí,zhì":"识",
	"cí":"词辞慈磁祠瓷雌",
	"zhěn":"诊枕疹",
	"niào,suī":"尿",
	"céng":"层",
	"jú":"局菊橘",
	"wěi,yǐ":"尾",
	"zhāng":"张章彰樟",
	"gǎi":"改",
	"lù":"陆录鹿路赂",
	"ē,ā":"阿",
	"zǔ":"阻组祖诅",
	"miào":"妙庙",
	"yāo":"妖腰邀夭吆",
	"nǔ":"努",
	"jìn,jìng":"劲",
	"rěn":"忍",
	"qū":"驱屈岖蛆躯",
	"chún":"纯唇醇",
	"nà":"纳钠捺",
	"bó":"驳脖博搏膊舶渤",
	"zòng,zǒng":"纵",
	"wén,wèn":"纹",
	"lǘ":"驴",
	"huán":"环",
	"qīng":"青轻倾清蜻氢卿",
	"xiàn":"现限线宪陷馅羡献腺",
	"biǎo":"表",
	"mǒ,mò,mā":"抹",
	"lǒng":"拢垄",
	"dān,dàn,dǎn":"担",
	"bá":"拔跋",
	"jiǎn":"拣茧俭捡检减剪简柬碱",
	"tǎn":"坦毯袒",
	"chōu":"抽",
	"yā":"押鸦鸭",
	"guǎi":"拐",
	"pāi":"拍",
	"zhě":"者",
	"dǐng":"顶鼎",
	"yōng":"拥庸",
	"chāi,cā":"拆",
	"dǐ":"抵",
	"jū,gōu":"拘",
	"lā":"垃",
	"lā,lá":"拉",
	"bàn,pàn":"拌",
	"zhāo":"招昭",
	"pō":"坡泼颇",
	"bō":"拨波玻菠播",
	"zé,zhái":"择",
	"tái":"抬",
	"qí,jī":"其奇",
	"qǔ":"取娶",
	"kǔ":"苦",
	"mào":"茂贸帽貌",
	"ruò,rě":"若",
	"miáo":"苗描瞄",
	"píng,pēng":"苹",
	"yīng":"英樱鹰莺婴缨鹦",
	"qié":"茄",
	"jīng":"茎京经惊晶睛精荆兢鲸",
	"zhī,qí":"枝",
	"bēi":"杯悲碑卑",
	"guì,jǔ":"柜",
	"bǎn":"板版",
	"sōng":"松",
	"qiāng":"枪腔",
	"gòu":"构购够垢",
	"sàng,sāng":"丧",
	"huà":"画话桦",
	"huò":"或货获祸惑霍",
	"cì,cī":"刺",
	"yǔ,yù":"雨语",
	"bēn,bèn":"奔",
	"fèn":"奋粪愤忿",
	"hōng":"轰烘",
	"qī,qì":"妻",
	"ōu":"欧殴鸥",
	"qǐng":"顷请",
	"zhuǎn,zhuàn,zhuǎi":"转",
	"zhǎn":"斩盏展",
	"ruǎn":"软",
	"lún":"轮仑伦沦",
	"dào":"到盗悼道稻",
	"chǐ":"齿耻侈",
	"kěn":"肯垦恳啃",
	"hǔ":"虎",
	"xiē,suò":"些",
	"lǔ":"虏鲁卤",
	"shèn":"肾渗慎",
	"shàng":"尚",
	"guǒ":"果裹",
	"kūn":"昆坤",
	"guó":"国",
	"chāng":"昌猖",
	"chàng":"畅唱",
	"diǎn":"典点碘",
	"gù":"固故顾雇",
	"áng":"昂",
	"zhōng":"忠终钟盅衷",
	"ne,ní":"呢",
	"àn":"岸按案暗",
	"tiě,tiē,tiè,":"帖",
	"luó":"罗萝锣箩骡螺逻",
	"kǎi":"凯慨",
	"lǐng,líng":"岭",
	"bài":"败拜",
	"tú":"图徒途涂屠",
	"chuí":"垂锤捶",
	"zhī,zhì":"知织",
	"guāi":"乖",
	"gǎn":"秆赶敢感橄",
	"hé,hè,huó,huò,hú":"和",
	"gòng,gōng":"供共",
	"wěi,wēi":"委",
	"cè,zè,zhāi":"侧",
	"pèi":"佩配沛",
	"pò,pǎi":"迫",
	"de,dì,dí":"的",
	"pá":"爬",
	"suǒ":"所索锁琐",
	"jìng":"径竞竟敬静境镜靖",
	"mìng":"命",
	"cǎi,cài":"采",
	"niàn":"念",
	"tān":"贪摊滩瘫",
	"rǔ":"乳辱",
	"pín":"贫",
	"fū":"肤麸孵敷",
	"fèi":"肺废沸费吠",
	"zhǒng":"肿",
	"péng":"朋棚蓬膨硼鹏澎篷",
	"fú,fù":"服",
	"féi":"肥",
	"hūn":"昏婚荤",
	"tù":"兔",
	"hú":"狐胡壶湖蝴弧葫",
	"gǒu":"狗苟",
	"bǎo":"饱宝保",
	"xiǎng":"享响想",
	"biàn":"变遍辨辩辫",
	"dǐ,de":"底",
	"jìng,chēng":"净",
	"fàng":"放",
	"nào":"闹",
	"zhá":"闸铡",
	"juàn,juǎn":"卷",
	"quàn,xuàn":"券",
	"dān,shàn,chán":"单",
	"chǎo":"炒",
	"qiǎn,jiān":"浅",
	"fǎ":"法",
	"xiè,yì":"泄",
	"lèi":"泪类",
	"zhān":"沾粘毡瞻",
	"pō,bó":"泊",
	"pào,pāo":"泡",
	"xiè":"泻卸屑械谢懈蟹",
	"ní,nì":"泥",
	"zé,shì":"泽",
	"pà":"怕帕",
	"guài":"怪",
	"zōng":"宗棕踪",
	"shěn":"审婶",
	"zhòu":"宙昼皱骤咒",
	"kōng,kòng,kǒng":"空",
	"láng,làng":"郎",
	"chèn":"衬趁",
	"gāi":"该",
	"xiáng,yáng":"详",
	"lì,dài":"隶",
	"jū":"居鞠驹",
	"shuā,shuà":"刷",
	"mèng":"孟梦",
	"gū":"孤姑辜咕沽菇箍",
	"jiàng,xiáng":"降",
	"mèi":"妹昧媚",
	"jiě":"姐",
	"jià":"驾架嫁稼",
	"cān,shēn,cēn,sān":"参",
	"liàn":"练炼恋链",
	"xì":"细隙",
	"shào":"绍哨",
	"tuó":"驼驮鸵",
	"guàn":"贯惯灌罐",
	"zòu":"奏揍",
	"chūn":"春椿",
	"bāng":"帮邦梆",
	"dú,dài":"毒",
	"guà":"挂卦褂",
	"kuǎ":"垮",
	"kuà,kū":"挎",
	"náo":"挠",
	"dǎng,dàng":"挡",
	"shuān":"拴栓",
	"tǐng":"挺艇",
	"kuò,guā":"括",
	"shí,shè":"拾",
	"tiāo,tiǎo":"挑",
	"wā":"挖蛙洼",
	"pīn":"拼",
	"shèn,shén":"甚",
	"mǒu":"某",
	"nuó":"挪",
	"gé":"革阁格隔",
	"xiàng,hàng":"巷",
	"cǎo":"草",
	"chá":"茶察茬",
	"dàng":"荡档",
	"huāng":"荒慌",
	"róng":"荣绒容熔融茸蓉溶榕",
	"nán,nā":"南",
	"biāo":"标彪膘",
	"yào":"药耀",
	"kū":"枯哭窟",
	"xiāng,xiàng":"相",
	"chá,zhā":"查",
	"liǔ":"柳",
	"bǎi,bó,bò":"柏",
	"yào,yāo":"要",
	"wāi":"歪",
	"yán,yàn":"研",
	"lí":"厘狸离犁梨璃黎漓篱",
	"qì,qiè":"砌",
	"miàn":"面",
	"kǎn":"砍坎",
	"shuǎ":"耍",
	"nài":"耐奈",
	"cán":"残蚕惭",
	"zhàn":"战站栈绽蘸",
	"bèi,bēi":"背",
	"lǎn":"览懒揽缆榄",
	"shěng,xǐng":"省",
	"xiāo,xuē":"削",
	"zhǎ":"眨",
	"hǒng,hōng,hòng":"哄",
	"xiǎn":"显险",
	"mào,mò":"冒",
	"yǎ,yā":"哑",
	"yìng":"映硬",
	"zuó":"昨",
	"xīng":"星腥猩",
	"pā":"趴",
	"guì":"贵桂跪刽",
	"sī,sāi":"思",
	"xiā":"虾瞎",
	"mǎ,mā,mà":"蚂",
	"suī":"虽",
	"pǐn":"品",
	"mà":"骂",
	"huá,huā":"哗",
	"yè,yàn,yān":"咽",
	"zán,zǎ":"咱",
	"hā,hǎ,hà":"哈",
	"yǎo":"咬舀",
	"nǎ,něi,na,né":"哪",
	"hāi,ké":"咳",
	"xiá":"峡狭霞匣侠暇辖",
	"gǔ,gū":"骨",
	"gāng,gàng":"钢",
	"tiē":"贴",
	"yào,yuè":"钥",
	"kàn,kān":"看",
	"jǔ":"矩举",
	"zěn":"怎",
	"xuǎn":"选癣",
	"zhòng,zhǒng,chóng":"种",
	"miǎo":"秒渺藐",
	"kē":"科棵颗磕蝌",
	"biàn,pián":"便",
	"zhòng,chóng":"重",
	"liǎ":"俩",
	"duàn":"段断缎锻",
	"cù":"促醋簇",
	"shùn":"顺瞬",
	"xiū":"修羞",
	"sú":"俗",
	"qīn":"侵钦",
	"xìn,shēn":"信",
	"huáng":"皇黄煌凰惶蝗蟥",
	"zhuī,duī":"追",
	"jùn":"俊峻骏竣",
	"dài,dāi":"待",
	"xū":"须虚需",
	"hěn":"很狠",
	"dùn":"盾顿钝",
	"lǜ":"律虑滤氯",
	"pén":"盆",
	"shí,sì,yì":"食",
	"dǎn":"胆",
	"táo":"逃桃陶萄淘",
	"pàng":"胖",
	"mài,mò":"脉",
	"dú":"独牍",
	"jiǎo":"狡饺绞脚搅",
	"yuàn":"怨院愿",
	"ráo":"饶",
	"wān":"弯湾豌",
	"āi":"哀哎埃",
	"jiāng,jiàng":"将浆",
	"tíng":"亭庭停蜓廷",
	"liàng":"亮谅辆晾",
	"dù,duó":"度",
	"chuāng":"疮窗",
	"qīn,qìng":"亲",
	"zī":"姿资滋咨",
	"dì":"帝递第蒂缔",
	"chà,chā,chāi,cī":"差",
	"yǎng":"养氧痒",
	"qián":"前钱钳潜黔",
	"mí":"迷谜靡",
	"nì":"逆昵匿腻",
	"zhà,zhá":"炸",
	"zǒng":"总",
	"làn":"烂滥",
	"pào,páo,bāo":"炮",
	"tì":"剃惕替屉涕",
	"sǎ,xǐ":"洒",
	"zhuó":"浊啄灼茁卓酌",
	"xǐ,xiǎn":"洗",
	"qià":"洽恰",
	"pài":"派湃",
	"huó":"活",
	"rǎn":"染",
	"héng":"恒衡",
	"hún":"浑魂",
	"nǎo":"恼脑",
	"jué,jiào":"觉",
	"hèn":"恨",
	"xuān":"宣轩喧",
	"qiè":"窃怯",
	"biǎn,piān":"扁",
	"ǎo":"袄",
	"shén":"神",
	"shuō,shuì,yuè":"说",
	"tuì":"退蜕",
	"chú":"除厨锄雏橱",
	"méi":"眉梅煤霉玫枚媒楣",
	"hái":"孩",
	"wá":"娃",
	"lǎo,mǔ":"姥",
	"nù":"怒",
	"hè":"贺赫褐鹤",
	"róu":"柔揉蹂",
	"bǎng":"绑膀",
	"lěi":"垒蕾儡",
	"rào":"绕",
	"gěi,jǐ":"给",
	"luò":"骆洛",
	"luò,lào":"络",
	"tǒng":"统桶筒捅",
	"gēng":"耕羹",
	"hào":"耗浩",
	"bān":"班般斑搬扳颁",
	"zhū":"珠株诸猪蛛",
	"lāo":"捞",
	"fěi":"匪诽",
	"zǎi,zài":"载",
	"mái,mán":"埋",
	"shāo,shào":"捎稍",
	"zhuō":"捉桌拙",
	"niē":"捏",
	"kǔn":"捆",
	"dū,dōu":"都",
	"sǔn":"损笋",
	"juān":"捐鹃",
	"zhé":"哲辙",
	"rè":"热",
	"wǎn":"挽晚碗惋婉",
	"ái,āi":"挨",
	"mò,mù":"莫",
	"è,wù,ě,wū":"恶",
	"tóng":"桐铜童彤瞳",
	"xiào,jiào":"校",
	"hé,hú":"核",
	"yàng":"样漾",
	"gēn":"根跟",
	"gē":"哥鸽割歌戈",
	"chǔ":"础储楚",
	"pò":"破魄",
	"tào":"套",
	"chái":"柴豺",
	"dǎng":"党",
	"mián":"眠绵棉",
	"shài":"晒",
	"jǐn":"紧锦谨",
	"yūn,yùn":"晕",
	"huàng,huǎng":"晃",
	"shǎng":"晌赏",
	"ēn":"恩",
	"ài,āi":"唉",
	"ā,á,ǎ,à,a":"啊",
	"bà,ba,pí":"罢",
	"zéi":"贼",
	"tiě":"铁",
	"zuàn,zuān":"钻",
	"qiān,yán":"铅",
	"quē":"缺",
	"tè":"特",
	"chéng,shèng":"乘",
	"dí":"敌笛涤嘀嫡",
	"zū":"租",
	"chèng":"秤",
	"mì,bì":"秘泌",
	"chēng,chèn,chèng":"称",
	"tòu":"透",
	"zhài":"债寨",
	"dào,dǎo":"倒",
	"tǎng,cháng":"倘",
	"chàng,chāng":"倡",
	"juàn":"倦绢眷",
	"chòu,xiù":"臭",
	"shè,yè,yì":"射",
	"xú":"徐",
	"háng":"航杭",
	"ná":"拿",
	"wēng":"翁嗡",
	"diē":"爹跌",
	"ài":"爱碍艾隘",
	"gē,gé":"胳搁",
	"cuì":"脆翠悴粹",
	"zàng":"脏葬",
	"láng":"狼廊琅榔",
	"féng":"逢",
	"è":"饿扼遏愕噩鳄",
	"shuāi,cuī":"衰",
	"gāo":"高糕羔篙",
	"zhǔn":"准",
	"bìng":"病",
	"téng":"疼腾誊藤",
	"liáng,liàng":"凉量",
	"táng":"唐堂塘膛糖棠搪",
	"pōu":"剖",
	"chù,xù":"畜",
	"páng,bàng":"旁磅",
	"lǚ":"旅屡吕侣铝缕履",
	"fěn":"粉",
	"liào":"料镣",
	"shāo":"烧",
	"yān":"烟淹",
	"tāo":"涛掏滔",
	"lào":"涝酪",
	"zhè":"浙蔗",
	"xiāo":"消宵销萧硝箫嚣",
	"hǎi":"海",
	"zhǎng,zhàng":"涨",
	"làng":"浪",
	"rùn":"润闰",
	"tàng":"烫",
	"yǒng,chōng":"涌",
	"huǐ":"悔毁",
	"qiāo,qiǎo":"悄",
	"hài":"害亥骇",
	"jiā,jia,jie":"家",
	"kuān":"宽",
	"bīn":"宾滨彬缤濒",
	"zhǎi":"窄",
	"lǎng":"朗",
	"dú,dòu":"读",
	"zǎi":"宰",
	"shàn,shān":"扇",
	"shān,shàn":"苫",
	"wà":"袜",
	"xiáng":"祥翔",
	"shuí":"谁",
	"páo":"袍咆",
	"bèi,pī":"被",
	"tiáo,diào,zhōu":"调",
	"yuān":"冤鸳渊",
	"bō,bāo":"剥",
	"ruò":"弱",
	"péi":"陪培赔",
	"niáng":"娘",
	"tōng":"通",
	"néng,nài":"能",
	"nán,nàn,nuó":"难",
	"sāng":"桑",
	"pěng":"捧",
	"dǔ":"堵赌睹",
	"yǎn":"掩眼演衍",
	"duī":"堆",
	"pái,pǎi":"排",
	"tuī":"推",
	"jiào,jiāo":"教",
	"lüè":"掠略",
	"jù,jū":"据",
	"kòng":"控",
	"zhù,zhuó,zhe":"著",
	"jūn,jùn":"菌",
	"lè,lēi":"勒",
	"méng":"萌盟檬朦",
	"cài":"菜",
	"tī":"梯踢剔",
	"shāo,sào":"梢",
	"fù,pì":"副",
	"piào,piāo":"票",
	"shuǎng":"爽",
	"shèng,chéng":"盛",
	"què,qiāo,qiǎo":"雀",
	"xuě":"雪",
	"chí,shi":"匙",
	"xuán":"悬玄漩",
	"mī,mí":"眯",
	"la,lā":"啦",
	"shé,yí":"蛇",
	"lèi,léi,lěi":"累",
	"zhǎn,chán":"崭",
	"quān,juàn,juān":"圈",
	"yín":"银吟淫",
	"bèn":"笨",
	"lóng,lǒng":"笼",
	"mǐn":"敏皿闽悯",
	"nín":"您",
	"ǒu":"偶藕",
	"tōu":"偷",
	"piān":"偏篇翩",
	"dé,děi,de":"得",
	"jiǎ,jià":"假",
	"pán":"盘",
	"chuán":"船",
	"cǎi":"彩睬踩",
	"lǐng":"领",
	"liǎn":"脸敛",
	"māo,máo":"猫",
	"měng":"猛锰",
	"cāi":"猜",
	"háo":"毫豪壕嚎",
	"má":"麻",
	"guǎn":"馆管",
	"còu":"凑",
	"hén":"痕",
	"kāng":"康糠慷",
	"xuán,xuàn":"旋",
	"zhe,zhuó,zháo,zhāo":"着",
	"lǜ,shuài":"率",
	"gài,gě,hé":"盖",
	"cū":"粗",
	"lín,lìn":"淋",
	"qú,jù":"渠",
	"jiàn,jiān":"渐溅",
	"hùn,hún":"混",
	"pó":"婆",
	"qíng":"情晴擎",
	"cǎn":"惨",
	"sù,xiǔ,xiù":"宿",
	"yáo":"窑谣摇遥肴姚",
	"móu":"谋",
	"mì":"密蜜觅",
	"huǎng":"谎恍幌",
	"tán,dàn":"弹",
	"suí":"随",
	"yǐn,yìn":"隐",
	"jǐng,gěng":"颈",
	"shéng":"绳",
	"qí":"骑棋旗歧祈脐畦崎鳍",
	"chóu":"绸酬筹稠愁畴",
	"lǜ,lù":"绿",
	"dā":"搭",
	"kuǎn":"款",
	"tǎ":"塔",
	"qū,cù":"趋",
	"tí,dī,dǐ":"提",
	"jiē,qì":"揭",
	"xǐ":"喜徙",
	"sōu":"搜艘",
	"chā":"插",
	"lǒu,lōu":"搂",
	"qī,jī":"期",
	"rě":"惹",
	"sàn,sǎn":"散",
	"dǒng":"董懂",
	"gě,gé":"葛",
	"pú":"葡菩蒲",
	"zhāo,cháo":"朝",
	"luò,là,lào":"落",
	"kuí":"葵魁",
	"bàng":"棒傍谤",
	"yǐ,yī":"椅",
	"sēn":"森",
	"gùn,hùn":"棍",
	"bī":"逼",
	"zhí,shi":"殖",
	"xià,shà":"厦",
	"liè,liě":"裂",
	"xióng":"雄熊",
	"zàn":"暂赞",
	"yǎ":"雅",
	"chǎng":"敞",
	"zhǎng":"掌",
	"shǔ":"暑鼠薯黍蜀署曙",
	"zuì":"最罪醉",
	"hǎn":"喊罕",
	"jǐng,yǐng":"景",
	"lǎ":"喇",
	"pēn,pèn":"喷",
	"pǎo,páo":"跑",
	"chuǎn":"喘",
	"hē,hè,yè":"喝",
	"hóu":"喉猴",
	"pù,pū":"铺",
	"hēi":"黑",
	"guō":"锅郭",
	"ruì":"锐瑞",
	"duǎn":"短",
	"é":"鹅额讹俄",
	"děng":"等",
	"kuāng":"筐",
	"shuì":"税睡",
	"zhù,zhú":"筑",
	"shāi":"筛",
	"dá,dā":"答",
	"ào":"傲澳懊",
	"pái":"牌徘",
	"bǎo,bǔ,pù":"堡",
	"ào,yù":"奥",
	"fān,pān":"番",
	"là,xī":"腊",
	"huá":"猾滑",
	"rán":"然燃",
	"chán":"馋缠蝉",
	"mán":"蛮馒",
	"tòng":"痛",
	"shàn":"善擅膳赡",
	"zūn":"尊遵",
	"pǔ":"普谱圃浦",
	"gǎng,jiǎng":"港",
	"céng,zēng":"曾",
	"wēn":"温瘟",
	"kě":"渴",
	"zhā":"渣",
	"duò":"惰舵跺",
	"gài":"溉概丐钙",
	"kuì":"愧",
	"yú,tōu":"愉",
	"wō":"窝蜗",
	"cuàn":"窜篡",
	"qún":"裙群",
	"qiáng,qiǎng,jiàng":"强",
	"shǔ,zhǔ":"属",
	"zhōu,yù":"粥",
	"sǎo":"嫂",
	"huǎn":"缓",
	"piàn":"骗",
	"mō":"摸",
	"shè,niè":"摄",
	"tián,zhèn":"填",
	"gǎo":"搞稿镐",
	"suàn":"蒜算",
	"méng,mēng,měng":"蒙",
	"jìn,jīn":"禁",
	"lóu":"楼娄",
	"lài":"赖癞",
	"lù,liù":"碌",
	"pèng":"碰",
	"léi":"雷",
	"báo":"雹",
	"dū":"督",
	"nuǎn":"暖",
	"xiē":"歇楔蝎",
	"kuà":"跨胯",
	"tiào,táo":"跳",
	"é,yǐ":"蛾",
	"sǎng":"嗓",
	"qiǎn":"遣谴",
	"cuò":"错挫措锉",
	"ǎi":"矮蔼",
	"shǎ":"傻",
	"cuī":"催摧崔",
	"tuǐ":"腿",
	"chù":"触矗",
	"jiě,jiè,xiè":"解",
	"shù,shǔ,shuò":"数",
	"mǎn":"满",
	"liū,liù":"溜",
	"gǔn":"滚",
	"sāi,sài,sè":"塞",
	"pì,bì":"辟",
	"dié":"叠蝶谍碟",
	"fèng,féng":"缝",
	"qiáng":"墙",
	"piě,piē":"撇",
	"zhāi":"摘斋",
	"shuāi":"摔",
	"mó,mú":"模",
	"bǎng,bàng":"榜",
	"zhà":"榨乍诈",
	"niàng":"酿",
	"zāo":"遭糟",
	"suān":"酸",
	"shang,cháng":"裳",
	"sòu":"嗽",
	"là":"蜡辣",
	"qiāo":"锹敲跷",
	"zhuàn":"赚撰",
	"wěn":"稳吻紊",
	"bí":"鼻荸",
	"mó":"膜魔馍摹蘑",
	"xiān,xiǎn":"鲜",
	"yí,nǐ":"疑",
	"gāo,gào":"膏",
	"zhē":"遮",
	"duān":"端",
	"màn":"漫慢曼幔",
	"piāo,piào,piǎo":"漂",
	"lòu":"漏陋",
	"sài":"赛",
	"nèn":"嫩",
	"dèng":"凳邓瞪",
	"suō,sù":"缩",
	"qù,cù":"趣",
	"sā,sǎ":"撒",
	"tàng,tāng":"趟",
	"chēng":"撑",
	"zēng":"增憎",
	"cáo":"槽曹",
	"héng,hèng":"横",
	"piāo":"飘",
	"mán,mén":"瞒",
	"tí":"题蹄啼",
	"yǐng":"影颖",
	"bào,pù":"暴",
	"tà":"踏蹋",
	"kào":"靠铐",
	"pì":"僻屁譬",
	"tǎng":"躺",
	"dé":"德",
	"mó,mā":"摩",
	"shú":"熟秫赎",
	"hú,hū,hù":"糊",
	"pī,pǐ":"劈",
	"cháo":"潮巢",
	"cāo":"操糙",
	"yàn,yān":"燕",
	"diān":"颠掂",
	"báo,bó,bò":"薄",
	"cān":"餐",
	"xǐng":"醒",
	"zhěng":"整拯",
	"zuǐ":"嘴",
	"zèng":"赠",
	"mó,mò":"磨",
	"níng":"凝狞柠",
	"jiǎo,zhuó":"缴",
	"cā":"擦",
	"cáng,zàng":"藏",
	"fán,pó":"繁",
	"bì,bei":"臂",
	"bèng":"蹦泵",
	"pān":"攀潘",
	"chàn,zhàn":"颤",
	"jiāng,qiáng":"疆",
	"rǎng":"壤攘",
	"jiáo,jué,jiào":"嚼",
	"rǎng,rāng":"嚷",
	"chǔn":"蠢",
	"lù,lòu":"露",
	"náng,nāng":"囊",
	"dǎi":"歹",
	"rǒng":"冗",
	"hāng,bèn":"夯",
	"āo,wā":"凹",
	"féng,píng":"冯",
	"yū":"迂淤",
	"xū,yù":"吁",
	"lèi,lē":"肋",
	"kōu":"抠",
	"lūn,lún":"抡",
	"jiè,gài":"芥",
	"xīn,xìn":"芯",
	"chā,chà":"杈",
	"xiāo,xiào":"肖",
	"zhī,zī":"吱",
	"ǒu,ōu,òu":"呕",
	"nà,nè":"呐",
	"qiàng,qiāng":"呛",
	"tún,dùn":"囤",
	"kēng,háng":"吭",
	"shǔn":"吮",
	"diàn,tián":"佃",
	"sì,cì":"伺",
	"zhǒu":"肘帚",
	"diàn,tián,shèng":"甸",
	"páo,bào":"刨",
	"lìn":"吝赁躏",
	"duì,ruì,yuè":"兑",
	"zhuì":"坠缀赘",
	"kē,kě":"坷",
	"tuò,tà,zhí":"拓",
	"fú,bì":"拂",
	"nǐng,níng,nìng":"拧",
	"ào,ǎo,niù":"拗",
	"kē,hē":"苛",
	"yān,yǎn":"奄",
	"hē,a,kē":"呵",
	"gā,kā":"咖",
	"biǎn":"贬匾",
	"jiǎo,yáo":"侥",
	"chà,shā":"刹",
	"āng":"肮",
	"wèng":"瓮",
	"nüè,yào":"疟",
	"páng":"庞螃",
	"máng,méng":"氓",
	"gē,yì":"疙",
	"jǔ,jù":"沮",
	"zú,cù":"卒",
	"nìng":"泞",
	"chǒng":"宠",
	"wǎn,yuān":"宛",
	"mí,mǐ":"弥",
	"qì,qiè,xiè":"契",
	"xié,jiā":"挟",
	"duò,duǒ":"垛",
	"jiá":"荚颊",
	"zhà,shān,shi,cè":"栅",
	"bó,bèi":"勃",
	"zhóu,zhòu":"轴",
	"nüè":"虐",
	"liē,liě,lié,lie":"咧",
	"dǔn":"盹",
	"xūn":"勋",
	"yo,yō":"哟",
	"mī":"咪",
	"qiào,xiào":"俏",
	"hóu,hòu":"侯",
	"pēi":"胚",
	"tāi":"胎",
	"luán":"峦",
	"sà":"飒萨",
	"shuò":"烁",
	"xuàn":"炫",
	"píng,bǐng":"屏",
	"nà,nuó":"娜",
	"pá,bà":"耙",
	"gěng":"埂耿梗",
	"niè":"聂镊孽",
	"mǎng":"莽",
	"qī,xī":"栖",
	"jiǎ,gǔ":"贾",
	"chěng":"逞",
	"pēng":"砰烹",
	"láo,lào":"唠",
	"bàng,bèng":"蚌",
	"gōng,zhōng":"蚣",
	"li,lǐ,lī":"哩",
	"suō":"唆梭嗦",
	"hēng":"哼",
	"zāng":"赃",
	"qiào":"峭窍撬",
	"mǎo":"铆",
	"ǎn":"俺",
	"sǒng":"耸",
	"juè,jué":"倔",
	"yīn,yān,yǐn":"殷",
	"guàng":"逛",
	"něi":"馁",
	"wō,guō":"涡",
	"lào,luò":"烙",
	"nuò":"诺懦糯",
	"zhūn":"谆",
	"niǎn,niē":"捻",
	"qiā":"掐",
	"yè,yē":"掖",
	"chān,xiān,càn,shǎn":"掺",
	"dǎn,shàn":"掸",
	"fēi,fěi":"菲",
	"qián,gān":"乾",
	"shē":"奢赊",
	"shuò,shí":"硕",
	"luō,luó,luo":"啰",
	"shá":"啥",
	"hǔ,xià":"唬",
	"tuò":"唾",
	"bēng":"崩",
	"dāng,chēng":"铛",
	"xiǎn,xǐ":"铣",
	"jiǎo,jiáo":"矫",
	"tiáo":"笤",
	"kuǐ,guī":"傀",
	"xìn":"衅",
	"dōu":"兜",
	"jì,zhài":"祭",
	"xiáo":"淆",
	"tǎng,chǎng":"淌",
	"chún,zhūn":"淳",
	"shuàn":"涮",
	"dāng":"裆",
	"wèi,yù":"尉",
	"duò,huī":"堕",
	"chuò,chāo":"绰",
	"bēng,běng,bèng":"绷",
	"zōng,zèng":"综",
	"zhuó,zuó":"琢",
	"chuǎi,chuài,chuāi,tuán,zhuī":"揣",
	"péng,bāng":"彭",
	"chān":"搀",
	"cuō":"搓",
	"sāo":"搔",
	"yē":"椰",
	"zhuī,chuí":"椎",
	"léng,lēng,líng":"棱",
	"hān":"酣憨",
	"sū":"酥",
	"záo":"凿",
	"qiào,qiáo":"翘",
	"zhā,chā":"喳",
	"bǒ":"跛",
	"há,gé":"蛤",
	"qiàn,kàn":"嵌",
	"bāi":"掰",
	"yān,ā":"腌",
	"wàn":"腕",
	"dūn,duì":"敦",
	"kuì,huì":"溃",
	"jiǒng":"窘",
	"sāo,sǎo":"骚",
	"pìn":"聘",
	"bǎ":"靶",
	"xuē":"靴薛",
	"hāo":"蒿",
	"léng":"楞",
	"kǎi,jiē":"楷",
	"pín,bīn":"频",
	"zhuī":"锥",
	"tuí":"颓",
	"sāi":"腮",
	"liú,liù":"馏",
	"nì,niào":"溺",
	"qǐn":"寝",
	"luǒ":"裸",
	"miù":"谬",
	"jiǎo,chāo":"剿",
	"áo,āo":"熬",
	"niān":"蔫",
	"màn,wàn":"蔓",
	"chá,chā":"碴",
	"xūn,xùn":"熏",
	"tiǎn":"舔",
	"sēng":"僧",
	"da,dá":"瘩",
	"guǎ":"寡",
	"tuì,tùn":"褪",
	"niǎn":"撵碾",
	"liáo,liāo":"撩",
	"cuō,zuǒ":"撮",
	"ruǐ":"蕊",
	"cháo,zhāo":"嘲",
	"biē":"憋鳖",
	"hēi,mò":"嘿",
	"zhuàng,chuáng":"幢",
	"jī,qǐ":"稽",
	"lǒu":"篓",
	"lǐn":"凛檩",
	"biě,biē":"瘪",
	"liáo,lào,lǎo":"潦",
	"chéng,dèng":"澄",
	"lèi,léi":"擂",
	"piáo":"瓢",
	"shà":"霎",
	"mò,má":"蟆",
	"qué":"瘸",
	"liáo,liǎo":"燎",
	"liào,liǎo":"瞭",
	"sào,sāo":"臊",
	"mí,méi":"糜",
	"ái":"癌",
	"tún":"臀",
	"huò,huō,huá":"豁",
	"pù,bào":"瀑",
	"chuō":"戳",
	"zǎn,cuán":"攒",
	"cèng":"蹭",
	"bò,bǒ":"簸",
	"bó,bù":"簿",
	"bìn":"鬓",
	"suǐ":"髓",
	"ráng":"瓤",
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	// 带音标字符。
	module.exports = {
	  "ā": "a1",
	  "á": "a2",
	  "ǎ": "a3",
	  "à": "a4",
	  "ē": "e1",
	  "é": "e2",
	  "ě": "e3",
	  "è": "e4",
	  "ō": "o1",
	  "ó": "o2",
	  "ǒ": "o3",
	  "ò": "o4",
	  "ī": "i1",
	  "í": "i2",
	  "ǐ": "i3",
	  "ì": "i4",
	  "ū": "u1",
	  "ú": "u2",
	  "ǔ": "u3",
	  "ù": "u4",
	  "ü": "v0",
	  "ǘ": "v2",
	  "ǚ": "v3",
	  "ǜ": "v4",
	  "ń": "n2",
	  "ň": "n3",
	  "": "m2",
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {"use strict";
	
	var isNode = typeof process === "object" &&
	  process.toString() === "[object process]";
	
	// 分词模块
	var jieba;
	var PHRASES_DICT;
	var PINYIN_DICT;
	
	
	// 解压拼音库。
	// @param {Object} dict_combo, 压缩的拼音库。
	// @param {Object} 解压的拼音库。
	function buildPinyinCache(dict_combo){
	  var hans;
	  var uncomboed = {};
	
	  for(var py in dict_combo){
	    hans = dict_combo[py];
	    for(var i = 0, han, l = hans.length; i < l; i++){
	      han = hans.charCodeAt(i);
	      if(!uncomboed.hasOwnProperty(han)){
	        uncomboed[han] = py;
	      }else{
	        uncomboed[han] += "," + py;
	      }
	    }
	  }
	
	  return uncomboed;
	}
	
	function segment(hans) {
	  try {
	    jieba = jieba || module["require"]("nodejieba");
	  } catch (ex) {
	    console.error();
	    console.error("    Segment need nodejieba, please run '$ npm install nodejieba'.");
	    console.error("    分词需要使用 nodejieba 模块，请运行 '$ npm install nodejieba' 并确保安装完成。");
	    console.error();
	    throw ex;
	  }
	  // 词语拼音库。
	  PHRASES_DICT = PHRASES_DICT || module["require"]("./phrases-dict");
	  return jieba.cut(hans);
	}
	if(isNode){
	  // 拼音词库，node 版无需使用压缩合并的拼音库。
	  PINYIN_DICT = module["require"]("./dict-zi");
	}else{
	  PINYIN_DICT = buildPinyinCache(__webpack_require__(4));
	}
	
	
	// 声母表。
	var INITIALS = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
	// 韵母表。
	//var FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
	var PINYIN_STYLE = {
	  NORMAL: 0,  // 普通风格，不带音标。
	  TONE: 1,    // 标准风格，音标在韵母的第一个字母上。
	  TONE2: 2,   // 声调中拼音之后，使用数字 1~4 标识。
	  INITIALS: 3,// 仅需要声母部分。
	  FIRST_LETTER: 4, // 仅保留首字母。
	};
	// 带音标字符。
	var PHONETIC_SYMBOL = __webpack_require__(5);
	var re_phonetic_symbol_source = "";
	for(var k in PHONETIC_SYMBOL){
	    re_phonetic_symbol_source += k;
	}
	var RE_PHONETIC_SYMBOL = new RegExp("([" + re_phonetic_symbol_source + "])", "g");
	var RE_TONE2 = /([aeoiuvnm])([0-4])$/;
	var DEFAULT_OPTIONS = {
	  style: PINYIN_STYLE.TONE, // 风格
	  segment: false, // 分词。
	  heteronym: false, // 多音字
	};
	
	
	// 将 more 的属性值，覆盖 origin 中已有的属性。
	// @param {Object} origin.
	// @param {Object} more.
	// @return 返回新的对象。
	function extend(origin, more){
	  var obj = {};
	  for(var k in origin){
	    if(more.hasOwnProperty(k)){
	      obj[k] = more[k];
	    }else{
	      obj[k] = origin[k];
	    }
	  }
	  return obj;
	}
	
	// 修改拼音词库表中的格式。
	// @param {String} pinyin, 单个拼音。
	// @param {PINYIN_STYLE} style, 拼音风格。
	// @return {String}
	function toFixed(pinyin, style){
	  var tone = ""; // 声调。
	  switch(style){
	  case PINYIN_STYLE.INITIALS:
	    return initials(pinyin);
	
	  case PINYIN_STYLE.FIRST_LETTER:
	    var first_letter = pinyin.charAt(0);
	    if(PHONETIC_SYMBOL.hasOwnProperty(first_letter)){
	      first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
	    }
	    return first_letter;
	
	  case PINYIN_STYLE.NORMAL:
	    return pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1_phonetic){
	      return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
	    });
	
	  case PINYIN_STYLE.TONE2:
	    var py = pinyin.replace(RE_PHONETIC_SYMBOL, function($0, $1){
	      // 声调数值。
	      tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");
	
	      return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
	    });
	    return py + tone;
	
	  case PINYIN_STYLE.TONE:
	  default:
	    return pinyin;
	  }
	}
	
	// 单字拼音转换。
	// @param {String} han, 单个汉字
	// @return {Array} 返回拼音列表，多音字会有多个拼音项。
	function single_pinyin(han, options){
	
	  if(typeof han !== "string"){
	    return [];
	  }
	  if(han.length !== 1){
	    return single_pinyin(han.charAt(0), options);
	  }
	
	  var hanCode = han.charCodeAt(0);
	
	  if(!PINYIN_DICT[hanCode]){
	    return [han];
	  }
	
	  var pys = PINYIN_DICT[hanCode].split(",");
	  if(!options.heteronym){
	    return [toFixed(pys[0], options.style)];
	  }
	
	  // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
	  var py_cached = {};
	  var pinyins = [];
	  for(var i = 0, py, l = pys.length; i < l; i++){
	    py = toFixed(pys[i], options.style);
	    if(py_cached.hasOwnProperty(py)){
	      continue;
	    }
	    py_cached[py] = py;
	
	    pinyins.push(py);
	  }
	  return pinyins;
	}
	
	// 词语注音
	// @param {String} phrases, 指定的词组。
	// @param {Object} options, 选项。
	// @return {Array}
	function phrases_pinyin(phrases, options){
	  var py = [];
	  if(PHRASES_DICT.hasOwnProperty(phrases)){
	    //! copy pinyin result.
	    PHRASES_DICT[phrases].forEach(function(item, idx){
	      py[idx] = [];
	      if (options.heteronym){
	        item.forEach(function(py_item, py_index){
	          py[idx][py_index] = toFixed(py_item, options.style);
	        });
	      } else {
	        py[idx][0] = toFixed(item[0], options.style);
	      }
	    });
	  }else{
	    for(var i = 0, l = phrases.length; i < l; i++){
	      py.push(single_pinyin(phrases[i], options));
	    }
	  }
	  return py;
	}
	
	// @param {String} hans 要转为拼音的目标字符串（汉字）。
	// @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
	// @return {Array} 返回的拼音列表。
	function pinyin(hans, options){
	
	  if(typeof hans !== "string"){
	    return [];
	  }
	
	  options = extend(DEFAULT_OPTIONS, options || {});
	
	  var phrases = isNode && options.segment ? segment(hans) : hans;
	  var pys = [];
	
	  for(var i = 0, nohans = "", firstCharCode, words, l = phrases.length; i < l; i++){
	
	    words = phrases[i];
	    firstCharCode = words.charCodeAt(0);
	
	    if(PINYIN_DICT[firstCharCode]){
	
	      // ends of non-chinese words.
	      if(nohans.length > 0){
	        pys.push([nohans]);
	        nohans = ""; // reset non-chinese words.
	      }
	
	      if(words.length === 1){
	          pys.push(single_pinyin(words, options));
	      }else{
	        pys = pys.concat(phrases_pinyin(words, options));
	      }
	
	    }else{
	      nohans += words;
	    }
	  }
	
	  // 清理最后的非中文字符串。
	  if(nohans.length > 0){
	    pys.push([nohans]);
	    nohans = ""; // reset non-chinese words.
	  }
	  return pys;
	}
	
	
	// 格式化为声母(Initials)、韵母(Finals)。
	// @param {String}
	// @return {String}
	function initials(pinyin) {
	  for (var i = 0, l = INITIALS.length; i < l; i++){
	    if (pinyin.indexOf(INITIALS[i]) === 0) {
	      return INITIALS[i];
	    }
	  }
	  return "";
	}
	
	pinyin.STYLE_NORMAL = PINYIN_STYLE.NORMAL;
	pinyin.STYLE_TONE = PINYIN_STYLE.TONE;
	pinyin.STYLE_TONE2 = PINYIN_STYLE.TONE2;
	pinyin.STYLE_INITIALS = PINYIN_STYLE.INITIALS;
	pinyin.STYLE_FIRST_LETTER = PINYIN_STYLE.FIRST_LETTER;
	
	module.exports = pinyin;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(2)(module)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var expect = __webpack_require__(3);
	var pinyin = __webpack_require__(6);
	
	function deepEquals(a, b){
	  if (a === b) { return true; }
	  var typeA = Object.prototype.toString.call(a);
	  var typeB = Object.prototype.toString.call(b);
	  if (typeA !== typeB) { return false; }
	  var eq = true;
	  var re_blank = /\s{2,}/;
	  var s_blank = " ";
	  switch (typeA) {
	  case "[object String]":
	  case "[object Number]":
	  case "[object Boolean]":
	    return a === b;
	  case "[object RegExp]":
	    return a.source === b.source &&
	      a.ignoreCase === b.ignoreCase &&
	      a.multiline === b.multiline &&
	      a.global === b.global;
	  case "[object Object]":
	    for (var k in a){
	      if (!a.hasOwnProperty(k)){ continue; }
	      if (!b.hasOwnProperty(k)){ return false; }
	      eq = eq && deepEquals(a[k], b[k]);
	    }
	    if (!eq){ return false; }
	    for (var k in b){
	      if (!b.hasOwnProperty(k)) { continue; }
	      if (!a.hasOwnProperty(k)) { return false; }
	    }
	    return true;
	  case "[object Array]":
	    if (a.length !== b.length) { return false; }
	    for (var i = 0, l = a.length; i < l; i++) {
	      eq = eq && deepEquals(a[i], b[i]);
	    }
	    return eq;
	  case "[object Function]":
	    return a.toString().replace(re_blank, s_blank) ===
	      b.toString().replace(re_blank, s_blank);
	  default:
	    throw new Error("Not support type " + typeA);
	  }
	}
	
	
	var cases = [
	
	  // 单音字
	  [ "我", {
	    STYLE_NORMAL:       [["wo"]],
	    STYLE_TONE:         [["wǒ"]],
	    STYLE_TONE2:        [["wo3"]],
	    STYLE_INITIALS:     [[""]],
	    STYLE_FIRST_LETTER: [["w"]],
	  } ],
	
	  // 多音字
	  [ "中", {
	    STYLE_NORMAL:       [["zhong"]],
	    STYLE_TONE:         [["zhōng", "zhòng"]],
	    STYLE_TONE2:        [["zhong1", "zhong4"]],
	    STYLE_INITIALS:     [["zh"]],
	    STYLE_FIRST_LETTER: [["z"]],
	  } ],
	
	  // 元音字
	  ["爱", {
	    STYLE_NORMAL:       [["ai"]],
	    STYLE_TONE:         [["ài"]],
	    STYLE_TONE2:        [["ai4"]],
	    STYLE_INITIALS:     [[""]],
	    STYLE_FIRST_LETTER: [["a"]],
	  } ],
	  ["啊", {
	    STYLE_NORMAL:       [["a"]],
	    STYLE_TONE:         [["ā", "á", "ǎ", "à", "a"]],
	    STYLE_TONE2:        [["a1", "a2", "a3", "a4", "a"]],
	    STYLE_INITIALS:     [[""]],
	    STYLE_FIRST_LETTER: [["a"]],
	  } ],
	
	  // 单音词
	  [ "我是谁", {
	    STYLE_NORMAL:       [["wo"], ["shi"], ["shui"]],
	    STYLE_TONE:         [["wǒ"], ["shì"], ["shuí"]],
	    STYLE_TONE2:        [["wo3"], ["shi4"], ["shui2"]],
	    STYLE_INITIALS:     [[""], ["sh"], ["sh"]],
	    STYLE_FIRST_LETTER: [["w"], ["s"], ["s"]],
	  } ],
	
	  // 多音词
	  [ "中国", {
	    STYLE_NORMAL:       [["zhong"], ["guo"]],
	    STYLE_TONE:         [["zhōng", "zhòng"], ["guó"]],
	    STYLE_TONE2:        [["zhong1", "zhong4"], ["guo2"]],
	    STYLE_INITIALS:     [["zh"], ["g"]],
	    STYLE_FIRST_LETTER: [["z"], ["g"]],
	  } ],
	  [ "重心", {
	    STYLE_NORMAL:       [["zhong", "chong"], ["xin"]],
	    STYLE_TONE:         [["zhòng", "chóng"], ["xīn"]],
	    STYLE_TONE2:        [["zhong4", "chong2"], ["xin1"]],
	    STYLE_INITIALS:     [["zh", "ch"], ["x"]],
	    STYLE_FIRST_LETTER: [["z", "c"], ["x"]],
	  } ],
	
	  // 英文
	  [ "a", {
	    STYLE_NORMAL:       [["a"]],
	    STYLE_TONE:         [["a"]],
	    STYLE_TONE2:        [["a"]],
	    STYLE_INITIALS:     [["a"]],
	    STYLE_FIRST_LETTER: [["a"]],
	  } ],
	  [ "aa", {
	    STYLE_NORMAL:       [["aa"]],
	    STYLE_TONE:         [["aa"]],
	    STYLE_TONE2:        [["aa"]],
	    STYLE_INITIALS:     [["aa"]],
	    STYLE_FIRST_LETTER: [["aa"]],
	  } ],
	  [ "a a", {
	    STYLE_NORMAL:       [["a a"]],
	    STYLE_TONE:         [["a a"]],
	    STYLE_TONE2:        [["a a"]],
	    STYLE_INITIALS:     [["a a"]],
	    STYLE_FIRST_LETTER: [["a a"]],
	  } ],
	
	  // 中英混合
	  [ "拼音(pinyin)", {
	    STYLE_NORMAL:       [["pin"], ["yin"], ["(pinyin)"]],
	    STYLE_TONE:         [["pīn"], ["yīn"], ["(pinyin)"]],
	    STYLE_TONE2:        [["pin1"], ["yin1"], ["(pinyin)"]],
	    STYLE_INITIALS:     [["p"], [""], ["(pinyin)"]],
	    STYLE_FIRST_LETTER: [["p"], ["y"], ["(pinyin)"]],
	  } ],
	
	  // 中英混合，多音字
	  [ "中国(china)", {
	    STYLE_NORMAL:       [["zhong"], ["guo"], ["(china)"]],
	    STYLE_TONE:         [["zhōng", "zhòng"], ["guó"], ["(china)"]],
	    STYLE_TONE2:        [["zhong1", "zhong4"], ["guo2"], ["(china)"]],
	    STYLE_INITIALS:     [["zh"], ["g"], ["(china)"]],
	    STYLE_FIRST_LETTER: [["z"], ["g"], ["(china)"]],
	  } ],
	];
	
	describe("pinyin", function() {
	
	  function makeTest(han, opt, style){
	    var py = opt[style];
	    var single_pinyin = [];
	    for(var i = 0, l = py.length; i < l; i++){
	      single_pinyin[i] = [py[i][0]];
	    }
	    var _py = pinyin(han, {style: pinyin[style]});
	    it("pinyin(\"" + han + "\", " + style + ") : " +
	      JSON.stringify(_py) + " === " + JSON.stringify(single_pinyin), function() {
	
	      expect(deepEquals(_py, single_pinyin)).to.equal(true);
	    });
	    var _py2 = pinyin(han, {style: pinyin[style], heteronym: true});
	    it("pinyin(\"" + han + "\", " + style + ",heteronym) : " +
	      JSON.stringify(_py2) + " === " + JSON.stringify(py), function() {
	
	      if(!deepEquals(_py2, py)){
	      console.log(_py2, py, style, pinyin[style]);
	      }
	      expect(deepEquals(_py2, py)).to.equal(true);
	    });
	  }
	
	  for (var i = 0, han, opt, l = cases.length; i < l; i++) {
	    han = cases[i][0];
	    opt = cases[i][1];
	    for(var style in opt){
	      makeTest(han, opt, style);
	    }
	  }
	});


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 9 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * toString
	 */
	
	var str = Object.prototype.toString;
	
	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */
	
	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map