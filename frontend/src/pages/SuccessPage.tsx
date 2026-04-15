import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Camera, Calendar, Hash, User, Mail } from 'lucide-react';
import { ScrollFadeBanner } from '../components/ScrollFadeBanner';

const BANNER_URL = '/WhatsApp_Image_2026-04-15_at_14.57.21.jpg';

export function SuccessPage() {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState('');
  const state = location.state as {
    firstName?: string;
    lastName?: string;
    email?: string;
    refNumber?: string;
  } | null;
  const fullName =
  state?.firstName && state?.lastName ?
  `${state.firstName} ${state.lastName}` :
  'Guest';
  const email = state?.email || 'Not provided';
  const refNumber = state?.refNumber || 'MAP-XXXX-XXXX';
  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  }, []);
  return (
    <div className="min-h-screen pb-20 flex flex-col items-center bg-[#f8faf8]">
      <ScrollFadeBanner
        src={BANNER_URL}
        alt="The Cybersecurity Implementation Journey"
        maxHeightClassName="max-h-[20vh]"
        maxHeightVh={20}
        fadeDistance={260}
        className="mb-12"
      />

      <div className="max-w-2xl w-full px-4 sm:px-6 mt-6 relative z-10 mb-6">
        <div className="rounded-2xl border border-[#d8e8cf] bg-white/95 shadow-lg backdrop-blur px-5 py-4 md:px-6 md:py-5 text-center">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-700">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Date</p>
              <p className="mt-1 font-semibold">May 12, 2026, Tuesday</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Venue</p>
              <p className="mt-1 font-semibold">Oasis Manila</p>
              <p className="text-xs text-gray-500">Aurora Blvd, San Juan City</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Event Time</p>
              <p className="mt-1 font-semibold">9:00 AM - 5:00 PM</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#d4a843]">Registration Starts</p>
              <p className="mt-1 font-semibold">8:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full px-4 sm:px-6 mt-2 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.5
          }}
          className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d4a843] via-green-500 to-[#d4a843]"></div>

          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{
                scale: 0
              }}
              animate={{
                scale: 1
              }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 200
              }}>
              
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-600 text-lg max-w-lg">
              Thank you for registering for{' '}
              <strong className="text-gray-900">
                The Cybersecurity Implementation Journey: From Framework to
                Reality
              </strong>{' '}
              on May 12, 2026.
            </p>
          </div>

          {/* Important Instruction Box */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.5
            }}
            className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 flex flex-col items-center text-center">
            
            <Camera className="w-8 h-8 text-green-600 mb-3" />
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Important Next Step
            </h2>
            <p className="text-gray-900 font-semibold">
              Please take a screenshot of this page.
            </p>
            <p className="text-gray-600 text-sm mt-1">
              You must present this screenshot before entering the event.
            </p>
          </motion.div>

          {/* Registration Details Summary */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Registration Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-[#d4a843] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Reference Number
                  </p>
                  <p className="text-gray-900 font-mono font-bold tracking-wide">
                    {refNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#d4a843] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Registrant Name
                  </p>
                  <p className="text-gray-900 font-medium">{fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#d4a843] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Email Address
                  </p>
                  <p className="text-gray-900">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#d4a843] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Registration Date
                  </p>
                  <p className="text-gray-900 text-sm">{currentDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors flex items-center gap-2 hover:underline underline-offset-4">
              
              Register Another Person
            </Link>
          </div>
        </motion.div>
      </div>
    </div>);

}