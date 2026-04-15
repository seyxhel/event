import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistrationPage } from './pages/RegistrationPage.tsx';
import { SuccessPage } from './pages/SuccessPage.tsx';
import { ManagePage } from './pages/ManagePage.tsx';

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="event-shell flex min-h-screen flex-col selection:bg-[#f5e9c8] selection:text-[#1d3f31]">
        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/manage" element={<ManagePage />} />
          </Routes>
        </main>

        <footer className="relative z-10 border-t border-[#c9dbcf]/85 bg-[#ffffff]/90 py-4 text-center text-xs tracking-wide text-[#5f7568] backdrop-blur">
          Copyright © Maptech Information Solutions Inc. All Rights Reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}