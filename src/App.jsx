import PoseDetect from './pages/PoseDetect'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import Landing from './pages/Landing'
import Page_Not_Found from './pages/404'
import './index.css'

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/pose",
        element: <PoseDetect />,
      }
    ],
  },
  {
    path: "/*",
    element: <Page_Not_Found />,
  },
]);
function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
