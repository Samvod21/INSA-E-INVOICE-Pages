import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { Admin, Detail, Notifications, Overview, RequestsPage, Wizard } from './pages';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><Routes>
    <Route path="/" element={<Overview />} />
    <Route path="/requests" element={<RequestsPage />} />
    <Route path="/requests/new/:step" element={<Wizard />} />
    <Route path="/requests/:id" element={<Detail />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/admin" element={<Admin />} />
  </Routes></BrowserRouter></React.StrictMode>);
