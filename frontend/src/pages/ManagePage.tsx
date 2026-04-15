import React, { useEffect, useMemo, useState } from 'react';
import { Download, Eye, FileText, Search, Users, X } from 'lucide-react';
import { apiUrl } from '../api';

type RegistrationRow = {
  id: number;
  reference: string;
  privacyAccepted: boolean;
  email: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  designation: string;
  mobileNo: string;
  viberNo: string;
  gcashNo: string;
  personalEmail: string;
  companyName: string;
  industryType: string;
  companyAddress: string;
  companyLandline: string;
  companyEmail: string;
  bringCompanyId: boolean;
  vehicleType: string;
  willCome: boolean;
  attendeeCount: number;
  createdAt: string;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

const LIST_API = apiUrl('/api/manage/registrations/');
const CSV_EXPORT_URL = apiUrl('/api/manage/export/csv/');
const PDF_EXPORT_URL = apiUrl('/api/manage/export/pdf/');

export function ManagePage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [willComeFilter, setWillComeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<RegistrationRow | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('page_size', String(pageSize));
        if (searchTerm.trim()) {
          params.set('q', searchTerm.trim());
        }
        if (willComeFilter !== 'all') {
          params.set('will_come', willComeFilter);
        }

        const response = await fetch(`${LIST_API}?${params.toString()}`);
        if (!response.ok) {
          setError('Could not load registrations.');
          return;
        }

        const data = await response.json();
        setRows(data.results || []);
        setPagination(
          data.pagination || {
            page: 1,
            pageSize,
            total: 0,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
          }
        );
      } catch (e) {
        setError('Could not load registrations.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, searchTerm, willComeFilter]);

  const confirmedCount = useMemo(
    () => rows.filter((row) => row.willCome).length,
    [rows]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchDraft);
  };

  const handleFilterChange = (value: string) => {
    setPage(1);
    setWillComeFilter(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#d4a843] rounded-full"></span>
              Registration Management
            </h1>
            <p className="text-gray-500 mt-1 ml-5">View, filter, and review event attendees</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto print:hidden">
            <a
              href={CSV_EXPORT_URL}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4" /> CSV
            </a>
            <a
              href={PDF_EXPORT_URL}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm flex-1 sm:flex-none"
            >
              <FileText className="w-4 h-4" /> PDF
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total (filtered)</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#fdf8ed] rounded-lg">
              <Users className="w-6 h-6 text-[#d4a843]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">On this page (attending)</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, company..."
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Will Come</label>
            <select
              value={willComeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            <label className="text-sm font-medium text-gray-700 ml-2">Rows</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchDraft('');
                setSearchTerm('');
                setWillComeFilter('all');
                setPage(1);
              }}
              className="ml-auto px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>

          {loading && <p className="p-6 text-gray-500">Loading registrations...</p>}
          {!loading && error && <p className="p-6 text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref #</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Attending</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Count</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.length > 0 ? (
                    rows.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{reg.reference}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{reg.firstName} {reg.lastName}</div>
                          <div className="text-xs text-gray-500">{reg.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.companyName}</div>
                          <div className="text-xs text-gray-500">{reg.designation || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reg.mobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {reg.willCome ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">{reg.attendeeCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reg.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => setSelected(reg)}
                            className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                            aria-label="View details"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">No registrations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} | Total: {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevious}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Reference" value={selected.reference} />
              <Detail label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
              <Detail label="Privacy Accepted" value={selected.privacyAccepted ? 'Yes' : 'No'} />
              <Detail label="Will Come" value={selected.willCome ? 'Yes' : 'No'} />
              <Detail label="Attendee Count" value={String(selected.attendeeCount)} />
              <Detail label="Company ID to Bring" value={selected.bringCompanyId ? 'Yes' : 'No'} />
              <Detail label="First Name" value={selected.firstName} />
              <Detail label="Last Name" value={selected.lastName} />
              <Detail label="Middle Initial" value={selected.middleInitial} />
              <Detail label="Designation" value={selected.designation} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Personal Email" value={selected.personalEmail} />
              <Detail label="Mobile/CP No." value={selected.mobileNo} />
              <Detail label="Viber No." value={selected.viberNo} />
              <Detail label="G-Cash No." value={selected.gcashNo} />
              <Detail label="Vehicle Type" value={selected.vehicleType} />
              <Detail label="Company Name" value={selected.companyName} />
              <Detail label="Industry Type" value={selected.industryType} />
              <Detail label="Company Landline" value={selected.companyLandline} />
              <Detail label="Company Email" value={selected.companyEmail} />
              <Detail label="Company Address" value={selected.companyAddress} className="md:col-span-2" />
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background: white; }
          .shadow-sm, .shadow-md, .shadow-xl { box-shadow: none !important; }
          .border { border-color: #e5e7eb !important; }
        }
      `
        }}
      />
    </div>
  );
}

type DetailProps = {
  label: string;
  value: string;
  className?: string;
};

function Detail({ label, value, className = '' }: DetailProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-gray-50 p-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-gray-900 break-words">{value || '-'}</p>
    </div>
  );
}
