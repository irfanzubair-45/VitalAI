import React, { useState } from 'react';
import { BookOpen, Search, X, ExternalLink } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  everydayAnalogy: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Reference Range (Interval)',
    category: 'General Lab Terms',
    definition: 'The expected bracket of values found in 95% of a healthy population. Results outside this bracket are not necessarily an illness.',
    everydayAnalogy: 'Think of shoe sizes: standard sizes fit most people comfortably, but wearing a size outside that bracket is just a variation, not broken feet.'
  },
  {
    term: 'Hemoglobin (Hgb)',
    category: 'Complete Blood Count',
    definition: 'An iron-containing protein inside red blood cells that captures oxygen in the lungs and delivers it to cells throughout the body.',
    everydayAnalogy: 'Like delivery trucks carrying oxygen fuel across the highway system of your blood vessels.'
  },
  {
    term: 'Hematocrit (Hct)',
    category: 'Complete Blood Count',
    definition: 'The proportion or percentage of your total blood volume that consists of red blood cells.',
    everydayAnalogy: 'If blood were vegetable soup, hematocrit is the percentage of the bowl taken up by carrots and potatoes versus broth.'
  },
  {
    term: 'MCV (Mean Corpuscular Volume)',
    category: 'Complete Blood Count',
    definition: 'The average physical volume or size of an individual red blood cell. Low values (microcytic) often reflect iron deficiency.',
    everydayAnalogy: 'Measuring whether delivery vans are compact hatchbacks or standard box trucks.'
  },
  {
    term: 'Creatinine',
    category: 'Kidney Function',
    definition: 'A natural chemical waste product generated from daily muscle wear and tear that healthy kidneys constantly filter into urine.',
    everydayAnalogy: 'Like coffee grounds in a drip filter: healthy filter paper clears grounds steadily without clogging.'
  },
  {
    term: 'eGFR (estimated Glomerular Filtration Rate)',
    category: 'Kidney Function',
    definition: 'An estimate of how many milliliters of blood your kidneys clean each minute, calculated using blood creatinine, age, and sex.',
    everydayAnalogy: 'The gallon-per-minute water purification rate of your home water filtration system.'
  },
  {
    term: 'LDL Cholesterol',
    category: 'Lipids & Heart',
    definition: 'Low-Density Lipoprotein. Often termed "bad cholesterol" because excess particles can infiltrate and oxidize inside arterial linings.',
    everydayAnalogy: 'Freight carriers that drop off packages. If too many arrive without being unpacked, they clutter the hallway.'
  },
  {
    term: 'HDL Cholesterol',
    category: 'Lipids & Heart',
    definition: 'High-Density Lipoprotein. Nicknamed "good cholesterol" because it gathers excess circulating cholesterol and brings it back to the liver.',
    everydayAnalogy: 'The recycling cleanup crew that sweeps up leftovers and clears pathways.'
  },
  {
    term: 'Triglycerides',
    category: 'Lipids & Heart',
    definition: 'The most common storage form of fat in the body, synthesized when you consume more calories than your body burns immediately.',
    everydayAnalogy: 'Energy stored in a battery backup bank for future workouts or fasting periods.'
  },
  {
    term: 'ALT (Alanine Aminotransferase)',
    category: 'Liver Function',
    definition: 'An intracellular enzyme primarily concentrated within hepatocytes (liver cells). Elevated blood levels suggest liver cell irritation.',
    everydayAnalogy: 'A gentle smoke detector for liver cell stress. It sounds an early alert when cells are working overtime.'
  },
  {
    term: 'BUN (Blood Urea Nitrogen)',
    category: 'Kidney Function',
    definition: 'A metabolic waste product formed when dietary protein is metabolized in the liver, then filtered out by kidneys.',
    everydayAnalogy: 'Ash residue left in a wood-burning fireplace after logs are burned for warmth.'
  },
  {
    term: 'Fasting Blood Glucose',
    category: 'Metabolism',
    definition: 'The concentration of simple sugar (glucose) dissolved in blood plasma after fasting for 8 to 12 hours.',
    everydayAnalogy: 'The baseline electrical voltage running through the grid when all heavy appliances are idle.'
  }
];

interface MedicalGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalGlossary: React.FC<MedicalGlossaryProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Medical Terminology Dictionary</h3>
              <p className="text-xs text-slate-500">Everyday explanations for clinical terms & lab biomarkers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medical terms (e.g. Creatinine, LDL, Reference Range)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              autoFocus
            />
          </div>
        </div>

        {/* Term List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching terms found. Try searching for a different keyword.
            </div>
          ) : (
            filtered.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{t.term}</h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.definition}</p>
                <div className="pt-2 border-t border-slate-200/60 flex items-start space-x-2 text-xs text-teal-900 bg-teal-50/50 p-2 rounded-lg">
                  <span className="font-semibold text-teal-800 shrink-0">Simple Analogy:</span>
                  <span>{t.everydayAnalogy}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} terms available</span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Close Dictionary
          </button>
        </div>
      </div>
    </div>
  );
};

