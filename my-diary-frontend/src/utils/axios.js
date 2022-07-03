import axios from 'axios'
import { Toast } from 'antd-mobile'

const MODE = import.meta.env.MODE // 环境变量
console.log("MODE", MODE)

axios.defaults.baseURL = MODE == 'development' ? 'http://127.0.1:8080' : 'http://127.0.1:8080'
// axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {
      window.location.href = '/login'
    }
    if (res.data.code == 413) {
      Toast.show('图片不得超过 50kb')
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
