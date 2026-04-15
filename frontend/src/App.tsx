import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistrationPage } from './pages/RegistrationPage';
import { SuccessPage } from './pages/SuccessPage';
import { ManagePage } from './pages/ManagePage';
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8faf8] text-gray-900 selection:bg-green-200 selection:text-green-900">
        <main className="flex-1">
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/manage" element={<ManagePage />} />
        </Routes>
        </main>

        <footer className="border-t border-gray-200 bg-white/80 py-4 text-center text-sm text-gray-500 backdrop-blur">
          Copyright © Maptech Information Solutions Inc. All Rights Reserved.
        </footer>
      </div>
    </BrowserRouter>);

}