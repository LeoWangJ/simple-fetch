## simple-fetch

此專案主旨在實現fetch polyfill源碼。

### 源碼解析
fetch源碼主要函式 有fetch, Request, Headers, Response, Body, 以下會分別說明其用途。

### fetch(input, init)
此函數共傳入兩個參數。
input: 可直接傳入Request實例或者url字串
init: 供使用者傳遞需要的設定參數或者變數

返回一個promise
建立Request實例,因為要使用一些透過Request實例封裝後的使用者傳入的參數
建立XMLHttpRequest實例來請求資料。