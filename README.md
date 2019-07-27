## simple-fetch

此專案主旨在實現fetch polyfill源碼。

### 源碼解析
fetch源碼主要函式 有fetch, Request, Headers, Response, Body, 以下會分別說明其用途。

### fetch(input, init)
此函數共傳入兩個參數。  
input: 可直接傳入Request實例或者url字串  
init: 供使用者傳遞需要的設定參數或者變數  

步驟:

1. 返回一個promise。
2. 建立Request實例,因為要使用一些透過Request實例封裝後的參數(ex:headers)。
3. 建立XMLHttpRequest實例來進行HTTP請求, 並新增一些xhr實例的方法(ex: abort,ontimeout,setRequestHeader...等)。
4. 透過Request實例取得headers, 並使用xhr.setRequestHeader方法依序將headers添加到http首部
5. 當請求成功後,會返回Response實例, 請求失敗會拋出錯誤。

### Request(input, options)
此函數共傳入兩個參數。
input: 與fetch函式的input同一個變數  
options: 與fetch函式的init同一個變數,只是傳入Request時改參數名稱為options  

步驟:
1. 判斷input 是否為Request實例,若是則直接使用Request實例(input所傳入)的參數到當前Request函式中,若為字串則將input設定值給url
2. 設置從input Request實例或者options取得到的參數值(ex:url,credentials,headers,method,mode...等)
3. 使用Body中的_initBody方法, 此處可以使用this._initBody執行此函式,是因為在下面有使用Body.call(Request.prototype), 將上下文環境由Request.prototype所取代,所以Body函式中的方法能夠讓Request取用。

### Headers(headers)
此函數只有一個參數。  
headers: 可傳入Headers實例,物件其中一種格式  

步驟:
1. 主要是將headers參數的key/value傳入至Headers裡面定義的this.map物件中。
2. 定義了delete,get,has,set,forEach...等方法供Headers實例使用。

### Response(bodyInit, options)
此函數共傳入兩個參數。
bodyInit: 是xhr 實例執行完後的response或者responseText  
options: 一樣是xhr實例回傳的status,statusText, headers

步驟:
1. Response蠻單純的, 就是返回一些參數(ex:status,type,headers,url...等), 沒做什麼特別的操作

