import dayjs from 'dayjs'
import s from './style.module.less'
import Empty from '@/components/Empty'
import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon';
import PopupType from '@/components/PopupType'
import PopupAddBill from '@/components/PopupAddBill'
import PopupDate from '@/components/PopupDate'
import { DownOutline } from 'antd-mobile-icons'
import { get } from '@/utils'

export default function Bill() {
  const typeRef = useRef();
  function changeType() {
    typeRef.current && typeRef.current.visible()
  }

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [currentSelect, setCurrentSelect] = useState({});
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));

  // bill list
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1)
  // const [totalPage, setTotalPage] = useState(0)
  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?date=${currentTime}&type_id=${currentSelect.id || 'all'}&page=${page}&page_size=5`);
    // 下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    // setTotalPage(data.totalPage);
    // 上滑加载状态
    // setLoading(LOAD_STATE.success);
    // setRefreshing(REFRESH_STATE.success);
  }
  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime])

  // 添加账单
  const addRef = useRef();
  const addToggle = () => {
    addRef.current && addRef.current.visible()
  }

  const monthRef = useRef()
  const monthToggle = () => {
    monthRef.current && monthRef.current.visible()
  };

  const selectMonth = (item) => {
    setPage(1);
    setCurrentTime(item)
  }

  const refreshData = () => {
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };
  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>总支出：<b>¥ {totalExpense}</b></span>
          <span className={s.income}>总收入：<b>¥ {totalIncome}</b></span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={changeType}>
            <span className={s.title}>{currentSelect.name || '全部类型'} <DownOutline className={s.arrow} type="arrow-bottom" /></span>
          </div>
          <div className={s.right} onClick={monthToggle}>
            <span className={s.time}>{currentTime}<DownOutline className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {
          list.length ?
            <div>
              {
                list.map((item, index) => <BillItem bill={item}
                  key={index} onReload={refreshData} />)
              }
            </div>
            : <Empty />
        }
        <div className={s.add} onClick={addToggle}>
          <div className={s.addIcon}>
            <CustomIcon.addbill />
          </div>
        </div>
        <PopupType ref={typeRef} onSelect={(item) => { setPage(1); setCurrentSelect(item) }} />
        <PopupAddBill ref={addRef} onReload={refreshData} />
        <PopupDate ref={monthRef} mode={"month"} onSelect={selectMonth} />
      </div>
    </div>
  );
}