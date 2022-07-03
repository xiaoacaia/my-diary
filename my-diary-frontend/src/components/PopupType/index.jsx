import { Popup } from 'antd-mobile'
import cx from 'classnames'
import { get } from '@/utils'
import { CloseOutline } from 'antd-mobile-icons'

import s from './style.module.less'

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('all');
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    (async () => {
      // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余。
      const { data: { list } } = await get('/api/type/list')
      setExpense(list.filter(i => i.type == 1))
      setIncome(list.filter(i => i.type == 2))
    })()
  }, [])

  if (ref) {
    ref.current = {
      visible: () => {
        setVisible(true)
      },
      close: () => {
        setVisible(false)
      }
    }
  };

  const choseType = (item) => {
    setActive(item.id)
    setVisible(false)
    onSelect(item)
  };

  return <Popup
    visible={visible}
    onMaskClick={() => setVisible(false)}
  >
    <div className={s.popupType}>
      <div className={s.header}>
        请选择类型
        <CloseOutline className={s.cross} onClick={() => setVisible(false)} />
      </div>
      <div className={s.content}>
        <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]: true, [s.active]: active == 'all' })}>全部类型</div>
        <div className={s.title}>支出</div>
        <div className={s.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active == item.id })} >{item.name}</p>)
          }
        </div>
        <div className={s.title}>收入</div>
        <div className={s.incomeWrap}>
          {
            income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active == item.id })} >{item.name}</p>)
          }
        </div>
      </div>
    </div>
  </Popup>
});

export default PopupType;