import React from 'react';
import { ShieldCheck, Lock, Trash2, X, AlertOctagon, HeartHandshake } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onClearData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Privacy & Clinical Safety</h3>
              <p className="text-xs text-slate-500">Your health data belongs to you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-semibold block mb-0.5">Session-Only Processing</strong>
              <p className="text-xs leading-relaxed text-slate-500">
                Medical reports you upload are processed within your active local session. We do not sell your health records, build advertising profiles, or share results with third-party brokers.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <HeartHandshake className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-semibold block mb-0.5">Patient Empowerment</strong>
              <p className="text-xs leading-relaxed text-slate-500">
                Our mission is health literacy: bridging the gap between clinical jargon and patient comprehension. Vital AI translates complex laboratory data into digestible explanations so you feel confident discussing care with your doctor.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 font-semibold block mb-0.5">Clinical Boundary & Disclaimer</strong>
              <p className="text-xs leading-relaxed text-slate-500">
                Vital AI is not a diagnostic medical device or a medical provider. It does not establish a doctor-patient relationship. Out-of-range biomarkers require clinical correlation with your full physical examination and medical history.
              </p>
            </div>
          </div>

          {/* Action to clear */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all active session reports and history?')) {
                  onClearData();
                  onClose();
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Session Data</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

