import { List, Input, Button, Toast } from 'antd-mobile';
import { post } from '@/utils'
import { useState } from 'react';
import CustomIcon from '@/components/CustomIcon';

import s from './style.module.less';

export default function Login() {
  const [username, setUsername] = useState('admin'); // 账号
  const [password, setPassword] = useState('123456'); // 密码

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      const { data } = await post('/api/user/login', {
        username,
        password
      });
      localStorage.setItem('token', data.token);
      window.location.href = '/content/bill';
    } catch (err) {
      Toast.show(err.msg);
    }
  };

  return (
    <div className={s.outer}>
      <div className={s.form}>
        <List>
          <List.Item prefix={<CustomIcon.user />}>
            <Input
              clearable
              type="text"
              placeholder="请输入账号"
              onChange={(value) => setUsername(value)}
            />
          </List.Item>
          <List.Item prefix={<CustomIcon.secret />}>
            <Input
              clearable
              type="password"
              placeholder="请输入密码"
              onChange={(value) => setPassword(value)}
            />
          </List.Item>
        </List>
        <Button onClick={onSubmit} block theme="primary">登录</Button>
      </div>
    </div>
  )
};