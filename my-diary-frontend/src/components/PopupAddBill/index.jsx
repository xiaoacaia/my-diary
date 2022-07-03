import { Popup, Input, Toast, Button, Modal } from 'antd-mobile'
import cx from 'classnames'
import dayjs from 'dayjs';
import { DownOutline, TextDeletionOutline, CloseOutline } from 'antd-mobile-icons'
import { get, post } from '@/utils'
import { TypeMap } from '@/components/CustomIcon';
import PopupDate from '../PopupDate'

import s from './style.module.less';

export default forwardRef(({ detail = {}, onReload }, ref) => {
  const [visible, setVisivle] = useState(false)

  const id = detail && detail.id

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setinputNumber([...detail.amount])
      setRemark(detail.remark)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])

  if (ref) {
    ref.current = {
      visible: () => {
        setVisivle(true)
      },
      close: () => {
        setVisivle(false)
      }
    }
  };

  // store expense or income icon
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  useEffect(() => {
    async function fetchData(id) {
      const { data: { list } } = await get('/api/type/list');
      const _expense = list.filter(i => i.type == 1);
      const _income = list.filter(i => i.type == 2);
      setExpense(_expense);
      setIncome(_income);
      setCurrentType(_expense[0]);
    }
    fetchData(id)
  }, []);

  // current pay type
  const [payType, setPayType] = useState('expense')
  // current pay type specific information
  const [currentType, setCurrentType] = useState({})
  const changeType = (type) => {
    setPayType(type);
    if (type == 'expense') {
      setCurrentType(expense[0]);
    } else {
      setCurrentType(income[0]);
    }
  };

  const chooseType = (item) => {
    setCurrentType(item)
  }

  const dateRef = useRef()
  const [date, setDate] = useState(new Date())
  const handleDatePop = () => {
    dateRef.current && dateRef.current.visible()
  }
  const selectDate = (val) => {
    setDate(val)
  }

  const [remark, setRemark] = useState('')
  const [inputNumber, setinputNumber] = useState([])
  function addNumber(a) {
    inputNumber.push(a.target.innerText)
    setinputNumber([...inputNumber])
  }
  function deleteNumber() {
    inputNumber.pop()
    setinputNumber([...inputNumber])
  }
  async function addBill() {
    if (!inputNumber.length) {
      Toast.show({
        content: '请输入金额'
      })
    }
    const params = {
      amount: inputNumber.join(''),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id;
      await post('/api/bill/update', params)
      Toast.show('修改成功');
    } else {
      await post('/api/bill/add', params)
      Toast.show('添加成功');
    }
    closePopup()
  }
  async function deleteBill() {
    if (id) {
      Modal.confirm({
        title: '删除',
        content: <div style={{ margin: "12px 6px" }}>确定要删除该账单？</div>,
        onConfirm: async () => {
          console.log('Confirmed', id)
          await post('/api/bill/delete', { id })
          Toast.show('删除成功')
          closePopup()
        }
      })
    }
  }

  function closePopup() {
    setVisivle(false)
    setPayType("expense")
    setCurrentType(expense[0])
    setDate(new Date());
    setinputNumber([])
    setRemark('')
    if (onReload) onReload()
  }

  return (<Popup
    visible={visible}
    onMaskClick={closePopup}
    bodyStyle={{
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      minHeight: '40vh',
    }}
  >
    <div className={s.close}><span onClick={closePopup}><CloseOutline /></span></div>
    <div className={s.filter}>
      <div className={s.type}>
        <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
        <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
      </div>
      <div className={s.time} onClick={handleDatePop}>{dayjs(date).format('MM-DD')} <DownOutline type="arrow-bottom" /></div>
    </div>
    <div className={s.money}>
      <span className={s.sufix}>¥</span>
      <span className={s.amount}>{inputNumber}</span>
    </div>
    {id ? <div className={s.deleteButton}><Button size='mini' color='danger' onClick={deleteBill}>删除</Button></div> : ''}
    <div className={s.typeWarp}>
      <div className={s.typeBody}>
        {
          (payType == 'expense' ? expense : income).map(item => <div onClick={() => chooseType(item)} key={item.id} className={s.typeItem}>
            <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
              {TypeMap[item.id]()}
            </span>
            <span>{item.name}</span>
          </div>)
        }
      </div>
    </div>
    <div className={s.remark} >
      <Input value={remark} onChange={v => setRemark(v)} placeholder='请输入备注信息' clearable />
    </div>
    <div className={s.keyBoard}>
      <div onClick={addNumber}>1</div>
      <div onClick={addNumber}>2</div>
      <div onClick={addNumber}>3</div>
      <div onClick={deleteNumber}><TextDeletionOutline /></div>
      <div onClick={addNumber}>4</div>
      <div onClick={addNumber}>5</div>
      <div onClick={addNumber}>6</div>
      <div className={s.confirm} onClick={addBill}>确定</div>
      <div onClick={addNumber}>7</div>
      <div onClick={addNumber}>8</div>
      <div onClick={addNumber}>9</div>
      <div className={s.zero} onClick={addNumber}>0</div>
    </div>
    <PopupDate ref={dateRef} onSelect={selectDate} />
  </Popup>)
})