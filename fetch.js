import { callbackify } from "util";

(function(self){

    let methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
    
    function normalizeName(name) {
        if( typeof name !== 'string') {
            name = String(name)
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
    }

    function normalizeValue(value) {
        if( typeof value !== 'string') {
            value = String(value)
        }

        return value
    }
    
    function iteratorFor(items) {

    }

    /*
    * 處理http headers
    * append - 新增
    * delete - 刪除
    * get - 查詢
    * set - 修改
    * has - 是否存在
    * forEach - 由於物件無forEach方法,所以自行實現
    * keys - 
    * values -
    * entries -
    */
    function Headers(headers) {
        this.map = {}

        if(headers instanceof Headers) {
            headers.forEach((value, name) => {
                this.append(name,value)
            })
        } else if(Array.isArray(headers)) {
            headers.forEach(header=>{
                this.append(header[0], header[1])
            })
        } else if(headers) {
            Object.getOwnPropertyNames(headers).forEach(name=>{
                this.append(name, headers[name])
            })
        }
    }

    Headers.prototype.append = function(name, value) {
      name = normalizeName(name)
      value = normalizeValue(value)
      let oldValue = this.map[name]
      // 若已經存在值，則用逗點隔開
      this.map[name] = oldValue ? oldValue + ', ' + value : value
    }

    Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)]
    }
    
    Headers.prototype.get = function(name) {
        name = normalizeName(name)
        return this.map[normalizeName(name)] ? name : null
    }

    Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value)
    }

    Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
    }

    Headers.prototype.forEach = function(callback, thisArg) {
        for(var name in this.map) {
            if(this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this)
            }
        }
    }

    // Headers.prototype.keys = function() {
    //     let item = []
    //     this.forEach(function(value, name){
    //         item.push(name)
    //     })
    //     return item
    // }
    
    function Body(){
        this.bodyUsed = false
        this._initBody = function(body) {
            this._bodyInit = body
            if(!body) {
              this._bodyText = ''
            } else {
                this._bodyText = body = Object.prototype.toString.call(body)
            }
        }
        
        
        return this
    }

    function normalizeMethod (method) {
        let upper = method.toUpperCase()
        return methods.indexOf(upper) > -1 ? upper : method
    }
    function Request (input, options) {
        options = options || {}
        let body = options.body

        //input 參數有 Resquest實例或者字串
        if(input instanceof Request) {
          if(input.bodyUsed) {
              throw new TypeError('Already read')
          }
        
          this.url = input.url
          this.credentials = input.credentials
          if(!options.headers) {
              this.headers = new Header(input.headers)
          }
          this.method = input.method
          this.mode = input.mode
          this.signal = input.signal

          if(!body && input._bodyInit != null) {
              body = input._bodyInit
              input.bodyUsed = true
          }
        } else {
            this.url = String(input)
        }
        
        this.credentials = options.credentials || this.credentials || 'same-origin'
        if(options.headers || !this.headers) {
            this.headers = new Headers(options.headers)
        }
        this.method = normalizeMethod(options.method || this.method || 'GET')
        this.mode = options.mode || this.mode || null
        this.signal = options.signal || this.signal
        // polyfill 版本不實現referer功能
        this.referrer = null
        if((this.method === 'GET' || this.method === 'HEAD')  && body ) {
            throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body)
    }

    self.fetch = function(url, init) {
        return new Promise((resolve, reject) =>{
            let request = new Request(url, init)

            if(request.signal && request.signal.aborted) {
                return reject(new DOMException('Aborted', 'AbortError'))
            }

            let xhr = new XMLHttpRequest()

            function abortXhr() {
                xhr.abort()
            }

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(new Error(xhr.statusText))
                }
            }
            
            xhr.onerror = () => {
                reject(new TypeError('Network request failed'))
            }

            xhr.ontimeout = () => {
                reject(new TypeError('Network request failed'))
            }

            xhr.onabort = () => {
                reject(new DOMException('Aborted', 'AbortError'))
            }

            xhr.open(request.method, request.url, true)

            if(request.credentials === 'include') {
                xhr.withCredentials = true
            } else if (request.credentials === 'omit') {
                xhr.withCredentials = false
            }

            if(request.signal) {
                // 執行AbortController.abort() 時會觸發
                request.signal.addEventListener('abort', abortXhr)

                xhr.onreadystatechange = () => {
                    // 請求已完成
                    if(xhr.readyState === 4) {
                        request.signal.removeEventListener('abort', abortXhr)
                    }
                }
            }

            xhr.send()
        })
    }
})(typeof self !== undefined ? self : this)

