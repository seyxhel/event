import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FeedbackPage } from './pages/RegistrationPage';
import { SuccessPage } from './pages/SuccessPage';
import { ManagePage } from './pages/ManagePage';

const MANAGE_PIN = '482917';
const PIN_LENGTH = 6;

function ManagePinGate() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const validatePin = (candidate: string) => {
    if (candidate.length !== PIN_LENGTH) {
      return;
    }

    if (candidate === MANAGE_PIN) {
      setIsUnlocked(true);
      setError('');
      return;
    }

    setError('Incorrect PIN. Please try again.');
    setPin('');
  };

  const appendDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) {
      return;
    }

    const nextPin = `${pin}${digit}`;
    setPin(nextPin);
    setError('');
    validatePin(nextPin);
  };

  const clearPin = () => {
    setPin('');
    setError('');
  };

  const removeLastDigit = () => {
    setPin((current) => current.slice(0, -1));
    setError('');
  };

  useEffect(() => {
    if (isUnlocked) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (!/^\d$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeLastDigit();
        return;
      }

      event.preventDefault();
      appendDigit(event.key);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isUnlocked, pin]);

  if (isUnlocked) {
    return <ManagePage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="glass-panel w-full max-w-sm p-6 sm:p-7">
        <p className="meta-badge inline-flex">Restricted Area</p>
        <h1 className="display-font mt-3 text-3xl text-[#1f4736]">Manage Access</h1>
        <p className="mt-2 text-sm text-[#5f7568]">Enter the 6-digit PIN to open the registration management console.</p>

        <div className="mt-5 grid grid-cols-6 gap-2" aria-label="PIN digits">
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <div
              key={index}
              className={`flex h-11 items-center justify-center rounded-lg border text-xl font-semibold ${
                index < pin.length
                  ? 'border-[#3f8657] bg-[#e9f5ea] text-[#1f4736]'
                  : 'border-[#bfd3c5] bg-[#f8fbf9] text-[#8ca093]'
              }`}
            >
              {index < pin.length ? '*' : ''}
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-[#b64a4a]">{error}</p>}

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="secondary-btn py-3 text-lg"
              disabled={pin.length >= PIN_LENGTH}
            >
              {digit}
            </button>
          ))}

          <button type="button" onClick={clearPin} className="secondary-btn py-3 text-sm">
            Clear
          </button>
          <button
            type="button"
            onClick={() => appendDigit('0')}
            className="secondary-btn py-3 text-lg"
            disabled={pin.length >= PIN_LENGTH}
          >
            0
          </button>
          <button type="button" onClick={removeLastDigit} className="secondary-btn py-3 text-sm">
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="event-shell flex min-h-screen flex-col selection:bg-[#f5e9c8] selection:text-[#1d3f31]">
        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<FeedbackPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/manage" element={<ManagePinGate />} />
          </Routes>
        </main>

        <footer className="relative z-10 border-t border-[#c9dbcf]/85 bg-[#ffffff]/90 py-4 text-center text-xs tracking-wide text-[#5f7568] backdrop-blur">
          Copyright © Maptech Information Solutions Inc. All Rights Reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}