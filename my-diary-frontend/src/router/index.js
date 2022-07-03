import Login from '@/container/Login'
import Content from '@/container/Content'
import Bill from '@/container/Bill'
import Statistic from '@/container/Statistic'
import User from '@/container/User'

const routes = [
  {
    path: "/",
    component: Login
  },
  {
    path: "content",
    component: Content,
    children: [
      {
        path: "bill",
        component: Bill
      },
      {
        path: "statistic",
        component: Statistic
      },
      {
        path: "user",
        component: User
      }
    ]
  },

];

export default routes