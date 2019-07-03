(function(self){
    
    self.fetch = function(url) {
        return new Promise((resolve, reject) =>{
            let req = new XMLHttpRequest()
            req.open('GET', url, true)
            req.onload = () => {
                if (req.status === 200) {
                    resolve(req.responseText)
                } else {
                    reject(new Error(req.statusText))
                }
            }
            req.onerror = () => {
                reject(new Error(req.statusText))
            }
            req.send()
        })
    }
})(typeof self !== undefined ? self : this)

