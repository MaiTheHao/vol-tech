import './global.scss';
import { Routes, Route } from "react-router-dom";
import { useEffect, /*useState*/ } from "react";
import APP_CONFIG from "../../config";
import LocalStorageService, { LOCAL_STORAGE_KEYS } from "../services/local-storage.service";

import { MainLayout } from '../components/layout/main-layout/MainLayout';
import HomePage from './page';
import ActivitiesPage from './activities/page';


function App() {
  // const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      LocalStorageService.set(
        LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      );

      const res = await fetch(`${APP_CONFIG.api.getFullPath("/user/me")}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)}`,
        },
      });

      const data = await res.json();
      console.log(data);
    };

    fetchUser();
  }, []);

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage/>}/>
      </Routes>
  )
}
export default App;
