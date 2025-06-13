import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import ContactsPage from '@/components/pages/ContactsPage';
import PipelinePage from '@/components/pages/PipelinePage';
import TasksPage from '@/components/pages/TasksPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/pipeline" replace />} />
<Route path="home" element={<HomePage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;