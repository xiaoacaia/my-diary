import {
  Route,
  Routes,
  useLocation
} from "react-router-dom"
import routes from '@/router';
import NavBar from '@/components/NavBar';

function App() {
  const { pathname } = useLocation()
  const needNav = ['/', '/statistic', '/user']
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname])
  return (

    // <div style={{ display: "flex", flexDirection: "column", height: "97vh", margin: 0, padding: 0 }}>
    //   <div style={{ flex: 1 }}>
    //     <Routes>
    //       {
    //         routes.map(route => <Route key={route.path} path={route.path} element={<route.component />} />)
    //       }
    //     </Routes>
    //   </div>
    //   <div style={{ flex: 0 }}>
    //     <NavBar showNav={showNav} />
    //   </div>
    // </div>
    <div className="App">
      <Routes>
        {
          routes.map(route => {
            if (!route.children) {
              return <Route key={route.path} path={route.path} element={<route.component />} />
            } else {
              return (<Route key={route.path} path={route.path} element={<route.component />} >
                {route.children.map(childrenRoute => <Route key={childrenRoute.path} path={childrenRoute.path} element={<childrenRoute.component />} />)}
              </Route>)
            }
          })
        }
      </Routes>
    </div>
  );
}

export default App

