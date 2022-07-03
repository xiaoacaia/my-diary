import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { List } from 'antd-mobile'
import { get } from '@/utils';
import CustomIcon, { TypeMap } from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill'

import s from './style.module.less';

const BillItem = ({ bill, onReload }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // 根据 bill 计算当日总支出和收入
  useEffect(() => {
    const _income = bill.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  const [detail, setDetail] = useState({});
  const addRef = useRef();
  const goToDetail = async (item) => {
    const { data } = await get(`/api/bill/detail?id=${item.id}`);
    setDetail(data);
    addRef.current && addRef.current.visible()
  };


  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{bill.date}</div>
      <div className={s.money}>
        <span>
          <span className={s.img}><CustomIcon.outcome /></span>
          <span>¥{expense.toFixed(2)}</span>
        </span>
        <span>
          <span className={s.img}><CustomIcon.income /></span>
          <span>¥{income.toFixed(2)}</span>
        </span>
      </div>
    </div>
    <List>
      {bill && bill.bills.sort((a, b) => b.date - a.date).map(item =>
        <List.Item
          className={s.bill}
          key={item.id}
          arrow={false}
          onClick={() => goToDetail(item)}
          prefix={
            <>
              <span className={s.itemIcon}>{TypeMap[item.type_id]()}</span>
              <span>{item.type_name}</span>
            </>
          }
          description={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
        >
          <span className={s.itemAmount} style={{ color: item.pay_type == 2 ? 'red' : '#15927f' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>
        </List.Item>
      )}
    </List>
    <PopupAddBill ref={addRef} detail={detail} onReload={onReload} />
  </div >
};

export default BillItem

