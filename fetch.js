(function(self){

    let methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
    function normalizeMethod (method) {
        let upper = method.toUpperCase()
        return methods.indexOf(upper) > -1 ? upper : method
    }
    function Request (input, options) {
        options = options || {}
        
        //input 參數有 Resquest實例或者字串
        if(input instanceof Request) {

        } else {
            this.url = String(input)
        }

        this.method = normalizeMethod(options.method || this.method || 'GET')
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

