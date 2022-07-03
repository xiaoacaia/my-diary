import s from './style.module.less';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '@/components/CustomIcon';
import { TabBar } from 'antd-mobile'

export default function NavBar({ showNav }) {
  const [activeKey, setActiveKey] = useState('/');
  const navigateTo = useNavigate()

  const chnageTab = (path) => {
    setActiveKey(path)
    navigateTo(path)
  }

  return (
    <div>
      <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={chnageTab}>
        <TabBar.Item
          key="/"
          title="账单"
          icon={CustomIcon.bill()}
        />
        <TabBar.Item
          key="/statistic"
          title="统计"
          icon={CustomIcon.statistic()}
        />
        <TabBar.Item
          key="/user"
          title="我的"
          icon={CustomIcon.user()}
        />
      </TabBar>
    </div>
  )
};