import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Containers } from './pages/Containers';
import { Images } from './pages/Images';
import { Volumes } from './pages/Volumes';
import { Networks } from './pages/Networks';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/containers" element={<Containers />} />
          <Route path="/images" element={<Images />} />
          <Route path="/volumes" element={<Volumes />} />
          <Route path="/networks" element={<Networks />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};
