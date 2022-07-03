import React from 'react';
import s from './style.module.less'
import CustomIcon from '@/components/CustomIcon';

export default function Empty({ desc }) {
  return (<div className={s.empty}>
    <div className={s.img} >
      <CustomIcon.empty />
    </div>
    <div>{desc || '暂无数据'}</div>
  </div>)
};