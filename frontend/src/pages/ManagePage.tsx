import React, { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  Users,
  X
} from 'lucide-react';
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
  attendeeDetails: Array<{
    email: string;
    middleInitial: string;
    designation: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    viberNo: string;
    gcashNo: string;
    personalEmail: string;
  }>;
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
      } catch (_e) {
        setError('Could not load registrations.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, searchTerm, willComeFilter]);

  const confirmedCount = useMemo(() => rows.filter((row) => row.willCome).length, [rows]);
  const attendeeTotalOnPage = useMemo(
    () => rows.reduce((sum, row) => sum + (row.willCome ? row.attendeeCount : 0), 0),
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
    <div className="min-h-screen px-3 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel section-reveal mb-6 p-4 sm:p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="meta-badge inline-flex">Admin Console</p>
              <h1 className="display-font mt-3 text-3xl text-[#1f4736] sm:text-4xl md:text-5xl">
                Registration Management
              </h1>
              <p className="mt-2 text-sm text-[#5f7568] md:text-base">
                Track registrations, review attendee details, and export event records.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row print:hidden">
              <a
                href={CSV_EXPORT_URL}
                className="secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </a>
              <a
                href={PDF_EXPORT_URL}
                className="secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </a>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 print:hidden">
          <StatCard label="Total Matching Records" value={pagination.total} accent="lime" />
          <StatCard label="Attending On This Page" value={confirmedCount} accent="gold" />
          <StatCard label="Attendee Seats On Page" value={attendeeTotalOnPage} accent="mint" />
        </section>

        <section className="glass-panel section-reveal mb-4 overflow-hidden sm:mb-5">
          <div className="border-b border-[#cadbcf]/90 p-3 sm:p-4">
            <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f8b7d]" />
                <input
                  type="text"
                  placeholder="Search name, email, company..."
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="form-input pl-10"
                />
              </div>

              <label className="secondary-btn inline-flex items-center gap-2 px-3 py-2 text-sm">
                <Filter className="h-4 w-4" />
                <select
                  value={willComeFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="bg-transparent text-[#315d47] outline-none"
                >
                  <option value="all" className="bg-[#ffffff]">
                    All
                  </option>
                  <option value="true" className="bg-[#ffffff]">
                    Attending
                  </option>
                  <option value="false" className="bg-[#ffffff]">
                    Not Attending
                  </option>
                </select>
              </label>

              <label className="secondary-btn inline-flex items-center gap-2 px-3 py-2 text-sm">
                Rows
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="bg-transparent text-[#315d47] outline-none"
                >
                  <option value={10} className="bg-[#ffffff]">
                    10
                  </option>
                  <option value={20} className="bg-[#ffffff]">
                    20
                  </option>
                  <option value={50} className="bg-[#ffffff]">
                    50
                  </option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => {
                  setSearchDraft('');
                  setSearchTerm('');
                  setWillComeFilter('all');
                  setPage(1);
                }}
                className="secondary-btn px-4 py-2 text-sm"
              >
                Clear Filters
              </button>
            </form>
          </div>

          {loading && <p className="p-6 text-[#5f7568]">Loading registrations...</p>}
          {!loading && error && <p className="p-6 text-[#b64a4a]">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-[0.82rem] sm:text-sm">
                <thead>
                  <tr className="border-b border-[#c8dbcf] bg-[#f1f7f2] text-[0.68rem] uppercase tracking-[0.08em] text-[#456253] sm:text-[0.72rem]">
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Ref #</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Name</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Company</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Contact</th>
                    <th className="px-3 py-2.5 text-center sm:px-5 sm:py-3">Attending</th>
                    <th className="px-3 py-2.5 text-center sm:px-5 sm:py-3">Count</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Date</th>
                    <th className="px-3 py-2.5 text-center sm:px-5 sm:py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length > 0 ? (
                    rows.map((reg, index) => (
                      <tr
                        key={reg.id}
                        className={`border-b border-[#d8e6dc] text-[#244c3a] transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-[#fbfdfb]' : 'bg-[#f3f8f4]'
                        } hover:bg-[#eaf3ed]`}
                      >
                        <td className="px-3 py-2.5 font-mono text-xs sm:px-5 sm:py-3 md:text-sm">{reg.reference}</td>
                        <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                          <p className="font-semibold text-[#1f4736]">
                            {reg.firstName} {reg.lastName}
                          </p>
                          <p className="text-xs text-[#4f6a5d]">{reg.email}</p>
                        </td>
                        <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                          <p>{reg.companyName || '-'}</p>
                          <p className="text-xs text-[#4f6a5d]">{reg.designation || '-'}</p>
                        </td>
                        <td className="px-3 py-2.5 text-[#305643] sm:px-5 sm:py-3">{reg.mobileNo || '-'}</td>
                        <td className="px-3 py-2.5 text-center sm:px-5 sm:py-3">
                          {reg.willCome ? (
                            <span className="status-pill border-[#9cbba9] bg-[#f2f9f3] text-[#2f5f47]">
                              Yes
                            </span>
                          ) : (
                            <span className="status-pill border-[#cabba0] bg-[#fbf7ef] text-[#866a2f]">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center font-semibold text-[#1f4736] sm:px-5 sm:py-3">
                          {reg.attendeeCount}
                        </td>
                        <td className="px-3 py-2.5 text-[#4f6a5d] sm:px-5 sm:py-3">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2.5 text-center sm:px-5 sm:py-3">
                          <button
                            type="button"
                            onClick={() => setSelected(reg)}
                            className="secondary-btn inline-flex items-center justify-center p-2"
                            aria-label="View details"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-[#5f7568] sm:px-5 sm:py-10">
                        No registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-[#5f7568]">
            Page {pagination.page} of {pagination.totalPages} | Total: {pagination.total}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrevious}
              className="secondary-btn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.hasNext}
              className="secondary-btn px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d3f30]/35 p-3 sm:p-4 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
        >
          <section
            className="glass-panel max-h-[88vh] w-full max-w-4xl overflow-y-auto sm:max-h-[86vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="sticky top-0 border-b border-[#cadbcf]/90 bg-[#ffffff]/95 px-4 py-3.5 backdrop-blur sm:px-5 sm:py-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="display-font text-2xl text-[#1f4736] sm:text-3xl">Registration Details</h2>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="secondary-btn p-2"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-3 p-4 text-xs sm:gap-4 sm:p-5 sm:text-sm md:grid-cols-2 md:text-base">
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
              <Detail
                label="Company Address"
                value={selected.companyAddress}
                className="md:col-span-2"
              />

              {selected.attendeeDetails?.length > 0 && (
                <article className="glass-panel-soft border p-3 sm:p-3.5 md:col-span-2">
                  <p className="form-label text-[0.72rem] text-[#5f7568]">Additional Attendee Details</p>
                  <div className="mt-2 space-y-2 text-[#1f4736]">
                    {selected.attendeeDetails.map((attendee, index) => (
                      <div key={`${attendee.email}-${index}`} className="rounded-lg border border-[#d7e5dc] bg-[#f8fbf9] p-2.5">
                        <p className="font-semibold">
                          Attendee {index + 2}: {attendee.firstName} {attendee.lastName}
                        </p>
                        <p className="text-sm">Middle Initial: {attendee.middleInitial || '-'}</p>
                        <p className="text-sm">Designation: {attendee.designation || '-'}</p>
                        <p className="text-sm">Email: {attendee.email || '-'}</p>
                        <p className="text-sm">Personal Email: {attendee.personalEmail || '-'}</p>
                        <p className="text-sm">Mobile: {attendee.mobileNo || '-'}</p>
                        <p className="text-sm">Viber: {attendee.viberNo || '-'}</p>
                        <p className="text-sm">GCash: {attendee.gcashNo || '-'}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </section>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: white !important; }
              .glass-panel, .glass-panel-soft { box-shadow: none !important; }
            }
          `
        }}
      />
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  accent: 'lime' | 'gold' | 'mint';
};

function StatCard({ label, value, accent }: StatCardProps) {
  const accentClass =
    accent === 'gold'
      ? 'from-[#f4ead4] to-[#f8f3e7] border-[#d5be89]'
      : accent === 'mint'
      ? 'from-[#e4f1ea] to-[#f6fbf8] border-[#abc9b7]'
      : 'from-[#e9f3eb] to-[#f7fbf8] border-[#afc8b5]';

  return (
    <article className={`glass-panel-soft hover-lift section-reveal border bg-gradient-to-br p-3.5 sm:p-4 ${accentClass}`}>
      <p className="form-label text-[0.72rem] text-[#5f7568]">{label}</p>
      <p className="display-font mt-2 flex items-center gap-2 text-3xl text-[#1f4736] sm:text-4xl">
        <Users className="h-6 w-6 text-[#3f8657]" />
        {value}
      </p>
    </article>
  );
}

type DetailProps = {
  label: string;
  value: string;
  className?: string;
};

function Detail({ label, value, className = '' }: DetailProps) {
  return (
    <article className={`glass-panel-soft border p-3 sm:p-3.5 ${className}`}>
      <p className="form-label text-[0.72rem] text-[#5f7568]">{label}</p>
      <p className="mt-1 break-words text-[#1f4736]">{value || '-'}</p>
    </article>
  );
}
