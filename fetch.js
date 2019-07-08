(function(self){

    let methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
    
    function Headers(headers) {

    }

    function _initBody(body){
        
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
          this.url = input.url
          this.credentials = input.credentials
          if(!options.headers) {
              this.headers = new Header(input.headers)
          }
          this.method = input.method
          this.mode = input.mode
          this.signal = input.signal
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

            let xhr = new XMLHttpRequest()
            xhr.open(request.method, request.url, true)

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(new Error(xhr.statusText))
                }
            }
            xhr.onerror = () => {
                reject(new Error(xhr.statusText))
            }
            xhr.send()
        })
    }
})(typeof self !== undefined ? self : this)

