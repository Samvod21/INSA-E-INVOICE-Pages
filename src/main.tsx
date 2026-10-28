import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { AdminDetail, Audit, Keys, Renew, Settings, Templates } from './more';
import { Admin, Detail, Notifications, Overview, RequestsPage, Wizard } from './pages';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><Routes>
    <Route path="/" element={<Overview />} />
    <Route path="/requests" element={<RequestsPage />} />
    <Route path="/requests/new/:step" element={<Wizard />} />
    <Route path="/requests/:id" element={<Detail />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/admin/requests/:id" element={<AdminDetail />} />
    <Route path="/admin/keys" element={<Keys />} />
    <Route path="/admin/templates" element={<Templates />} />
    <Route path="/admin/audit" element={<Audit />} />
    <Route path="/renew" element={<Renew />} />
    <Route path="/settings" element={<Settings />} />
  </Routes></BrowserRouter></React.StrictMode>);
