import PoseDetect from './pages/PoseDetect';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Landing from './pages/Landing';
import Page_Not_Found from './pages/404';
import './index.css';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import PoseDetector from './util/poseDetector';
import { PoseDetectorContext } from './context/poseDetectorContext';

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
  const poseDetector = useRef(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    const loadModel = async () => {
      if (!poseDetector.current) {
        poseDetector.current = new PoseDetector();
        console.log("loading model")
        await poseDetector.current.loadModel();
        console.log("model loaded")
      }
      setLoaded(true);
    }
    loadModel();

  }, []);


  return (
    <>
      <PoseDetectorContext.Provider value={{ poseDetector: poseDetector, loaded: loaded }}>
        <RouterProvider router={router} />
      </PoseDetectorContext.Provider>
    </>
  )
}

export default App
