import React, { useState } from 'react';
import { Biomarker, BiomarkerStatus } from '../types/medical';
import { BiomarkerCard } from './BiomarkerCard';
import { Search, Filter, LayoutGrid, List, CheckCircle2, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
  onAddQuestion?: (questionText: string, context: string) => void;
}

export const BiomarkerTable: React.FC<BiomarkerTableProps> = ({ biomarkers, onAddQuestion }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'out_of_range' | BiomarkerStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Counts
  const totalCount = biomarkers.length;
  const normalCount = biomarkers.filter((b) => b.status === 'normal').length;
  const highCount = biomarkers.filter((b) => b.status === 'high').length;
  const lowCount = biomarkers.filter((b) => b.status === 'low').length;
  const criticalCount = biomarkers.filter((b) => b.status === 'critical').length;
  const outOfRangeCount = highCount + lowCount + criticalCount;

  // Filtered biomarkers
  const filtered = biomarkers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'out_of_range') return b.status !== 'normal';
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium block opacity-75">All Biomarkers</span>
          <span className="text-2xl font-bold tracking-tight">{totalCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('normal')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'normal'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow'
              : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center space-x-1 text-xs font-semibold mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">{normalCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('out_of_range')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'out_of_range' || statusFilter === 'high' || statusFilter === 'low'
              ? 'bg-amber-600 text-white border-amber-600 shadow'
              : 'bg-amber-50/50 text-amber-900 border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center space-x-1 text-xs font-semibold mb-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Out of Range</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">{outOfRangeCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter('critical')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'critical'
              ? 'bg-rose-600 text-white border-rose-600 shadow'
              : 'bg-rose-50/50 text-rose-900 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center space-x-1 text-xs font-semibold mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Critical Attention</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">{criticalCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search biomarker, organ system, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        {/* Status Filters and View Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition ${statusFilter === 'all' ? 'bg-white shadow text-slate-900' : 'hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('out_of_range')}
              className={`px-2.5 py-1 rounded-md transition ${statusFilter === 'out_of_range' ? 'bg-white shadow text-amber-800' : 'hover:text-slate-900'}`}
            >
              Out of Range ({outOfRangeCount})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-2.5 py-1 rounded-md transition ${statusFilter === 'normal' ? 'bg-white shadow text-emerald-800' : 'hover:text-slate-900'}`}
            >
              Normal ({normalCount})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white text-teal-700 shadow' : 'text-slate-500 hover:text-slate-900'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-white text-teal-700 shadow' : 'text-slate-500 hover:text-slate-900'}`}
              title="Dense Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Biomarkers Rendering */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No biomarkers match your criteria</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or filter tags.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-3 text-xs text-teal-600 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((biomarker) => (
            <BiomarkerCard
              key={biomarker.id}
              biomarker={biomarker}
              onAddQuestion={onAddQuestion}
            />
          ))}
        </div>
      ) : (
        /* Dense Clinical Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Biomarker</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Your Result</th>
                  <th className="px-4 py-3">Standard Range</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Key Takeaway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{b.name}</td>
                    <td className="px-4 py-3 text-slate-500">{b.category}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {b.value} <span className="text-[10px] text-slate-400">{b.unit}</span>
                      {b.confidence < 0.8 && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                          ⚠️ {Math.round(b.confidence * 100)}%
                        </span>
                      )}                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{b.referenceRange.text}</td>
                    <td className="px-4 py-3">
                      {b.status === 'normal' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Normal</span>
                        </span>
                      )}
                      {b.status === 'high' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>High</span>
                        </span>
                      )}
                      {b.status === 'low' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800">
                          <ArrowDownRight className="w-3 h-3" />
                          <span>Low</span>
                        </span>
                      )}
                      {b.status === 'critical' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Critical</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{b.simpleExplanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

