import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {DataProvider} from './context/DataContext';
import {AdminAuthProvider} from './context/AdminAuthContext';
import App from './App.tsx';
import DashboardApp from './dashboard/DashboardApp';
import DashboardLogin from './dashboard/DashboardLogin';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/dashboard/login" element={<DashboardLogin />} />
            <Route path="/dashboard/*" element={<DashboardApp />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </AdminAuthProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
);
