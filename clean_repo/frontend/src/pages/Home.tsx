import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ onStartDemo: () => void }> = ({ onStartDemo }) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-white p-8">
      <h1 className="text-4xl font-extrabold text-teal-800 mb-4 text-center">
        Welcome to Vital AI – Your Personal Health Insight Engine
      </h1>
      <p className="text-lg text-slate-700 max-w-2xl text-center mb-6">
        Upload a medical report and instantly receive AI‑powered biomarker analysis, doctor‑ready questions, and actionable health insights. All data is encrypted and never shared.
      </p>
      <button
        onClick={onStartDemo}
        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
      >
        Try the Demo
      </button>
    </section>
  );
};

export default Home;

