import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ReportUploader } from './components/ReportUploader';
import { ReportDashboard } from './components/ReportDashboard';
import { PrivacyModal } from './components/PrivacyModal';
import { MedicalGlossary } from './components/MedicalGlossary';
import { MedicalReport } from './types/medical';
import { uploadReportFile } from './services/api';
import { ConsentModal } from './components/ConsentModal';
import Home from './pages/Home';

export const App: React.FC = () => {
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showHome, setShowHome] = useState(true);

  const handleReportLoaded = (report: MedicalReport) => {
    setActiveReport(report);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startDemo = () => setShowHome(false);

  const handleFileUpload = async (file: File) => {
    setPendingFile(file);
    setConsentOpen(true);
  };

  const acceptConsent = async () => {
    setConsentOpen(false);
    if (!pendingFile) return;
    setIsLoading(true);
    try {
      const parsedReport = await uploadReportFile(pendingFile);
      setActiveReport(parsedReport);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('File parsing failed:', err);
      alert('Could not parse the medical report. Please verify file integrity or try another sample.');
    } finally {
      setIsLoading(false);
      setPendingFile(null);
    }
  };

  const declineConsent = () => {
    setConsentOpen(false);
    setPendingFile(null);
    alert('You declined data consent. Upload cannot proceed.');
  };

  const handleClearSession = () => {
    setActiveReport(null);
    setShowHome(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Navbar
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenGlossary={() => setGlossaryOpen(true)}
        activeReportTitle={activeReport?.title}
        onReset={() => setActiveReport(null)}
      />

      <DisclaimerBanner />

      <main className="flex-1 pb-16">
        {showHome && !activeReport ? (
          <Home onStartDemo={startDemo} />
        ) : !activeReport ? (
          <ReportUploader
            onReportLoaded={handleReportLoaded}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
          />
        ) : (
          <ReportDashboard
            report={activeReport}
            onBack={() => setActiveReport(null)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Vital AI. For educational and health-literacy purposes only.</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-slate-900 hover:underline">
              Privacy &amp; Safeguards
            </button>
            <span>•</span>
            <span className="text-slate-400">HIPAA-Aligned Privacy Architecture</span>
          </div>
        </div>
      </footer>

      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        onClearData={handleClearSession}
      />

      <MedicalGlossary isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      <ConsentModal isOpen={consentOpen} onAccept={acceptConsent} onDecline={declineConsent} />
    </div>
  );
};

export default App;
