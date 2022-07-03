import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  BrowserRouter,
} from "react-router-dom"
import './index.css'

// 【严格模式】StrictMode 引发的组件重复执行
// https://juejin.cn/post/7082017599650807821
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
