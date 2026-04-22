import React, { useEffect, useMemo, useState } from 'react';
import { Download, Eye, MessageSquare, Search, Star, X } from 'lucide-react';
import { apiUrl } from '../api';

type FeedbackRow = {
  id: number;
  reference: string;
  personalCompanyInfoConsent: boolean | null;
  eventSatisfaction: number;
  jobRelevance: number;
  keyTakeaways: string;
  logisticsRatings: Record<string, string>;
  logisticsAdditionalFeedback: string;
  sessionRelevance: Record<string, string>;
  sessionsAdditionalComments: string;
  overallFeedback: string;
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

const LIST_API = apiUrl('/api/manage/feedback/');
const XLSX_EXPORT_URL = apiUrl('/api/manage/export/feedback-xlsx/?theme=mint');
const XLSX_EXPORT_PIN = '05142021';
const XLSX_EXPORT_PIN_LENGTH = 8;

const SATISFACTION_LABELS: Record<string, string> = {
  '1': 'Very Dissatisfied',
  '2': 'Dissatisfied',
  '3': 'Neutral',
  '4': 'Satisfied',
  '5': 'Very Satisfied',
  na: 'N/A',
};

const SESSION_LABELS: Record<string, string> = {
  not_relevant: 'Not relevant',
  relevant: 'Relevant',
  very_relevant: 'Very relevant',
  did_not_attend: 'Did not attend',
};

const LOGISTICS_ITEM_LABELS: Record<string, string> = {
  accommodation: 'Accommodation',
  welcomeKit: 'Welcome kit',
  communication: 'Communication',
  transportation: 'Transportation',
  welcomeActivity: 'Welcome activity',
  venue: 'Venue',
  activities: 'Activities',
  closingCeremony: 'Closing ceremony',
};

const SESSION_ITEM_LABELS: Record<string, string> = {
  welcomeActivity: 'Welcome activity',
  speaker1: 'Speaker #1',
  activity1: 'Activity #1',
  speaker2: 'Speaker #2',
  activity2: 'Activity #2',
  closingActivity: 'Closing activity',
};

function excerpt(value: string, limit = 96): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '-';
  }
  return trimmed.length > limit ? `${trimmed.slice(0, limit)}...` : trimmed;
}

export function ManagePage() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportPin, setExportPin] = useState('');
  const [exportPinError, setExportPinError] = useState('');
  const [isExportPinOpen, setIsExportPinOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<FeedbackRow | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
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
    if (!isExportPinOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeExportPin();
        return;
      }

      if (!/^\d$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeLastExportDigit();
        return;
      }

      event.preventDefault();
      appendExportDigit(event.key);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isExportPinOpen, exportPin]);

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

        const response = await fetch(`${LIST_API}?${params.toString()}`);
        if (!response.ok) {
          setError('Could not load feedback records.');
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('application/json')) {
          setError(
            'API is not reachable from this frontend. Set VITE_API_BASE_URL in Railway frontend variables to the backend public URL and redeploy.'
          );
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
            hasPrevious: false,
          }
        );
      } catch (_error) {
        setError('Could not load feedback records.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, pageSize, searchTerm]);

  const averageEventSatisfaction = useMemo(() => {
    if (!rows.length) {
      return '0.0';
    }
    const total = rows.reduce((sum, row) => sum + row.eventSatisfaction, 0);
    return (total / rows.length).toFixed(1);
  }, [rows]);

  const averageJobRelevance = useMemo(() => {
    if (!rows.length) {
      return '0.0';
    }
    const total = rows.reduce((sum, row) => sum + row.jobRelevance, 0);
    return (total / rows.length).toFixed(1);
  }, [rows]);

  const withLogisticsFeedbackCount = useMemo(
    () => rows.filter((row) => row.logisticsAdditionalFeedback.trim().length > 0).length,
    [rows]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchDraft);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  const closeExportPin = () => {
    setIsExportPinOpen(false);
    setExportPin('');
    setExportPinError('');
  };

  const validateExportPin = (candidate: string) => {
    if (candidate.length !== XLSX_EXPORT_PIN_LENGTH) {
      return;
    }

    if (candidate === XLSX_EXPORT_PIN) {
      closeExportPin();
      window.location.assign(XLSX_EXPORT_URL);
      return;
    }

    setExportPinError('Incorrect PIN. Please try again.');
    setExportPin('');
  };

  const appendExportDigit = (digit: string) => {
    if (exportPin.length >= XLSX_EXPORT_PIN_LENGTH) {
      return;
    }

    const nextPin = `${exportPin}${digit}`;
    setExportPin(nextPin);
    setExportPinError('');
    validateExportPin(nextPin);
  };

  const clearExportPin = () => {
    setExportPin('');
    setExportPinError('');
  };

  const removeLastExportDigit = () => {
    setExportPin((current) => current.slice(0, -1));
    setExportPinError('');
  };

  const handleExportClick = () => {
    setIsExportPinOpen(true);
    setExportPin('');
    setExportPinError('');
  };

  return (
    <div className="min-h-screen px-3 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel section-reveal mb-6 p-4 sm:p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="meta-badge inline-flex">Admin Console</p>
              <h1 className="display-font mt-3 text-3xl text-[#1f4736] sm:text-4xl md:text-5xl">
                Feedback Management
              </h1>
              <p className="mt-2 text-sm text-[#5f7568] md:text-base">
                Review submitted feedback, inspect ratings, and export response records.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row print:hidden">
              <button
                type="button"
                onClick={handleExportClick}
                className="secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm"
              >
                <Download className="h-4 w-4" />
                Export XLSX
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 print:hidden">
          <StatCard label="Total Matching Feedback" value={pagination.total} accent="lime" />
          <StatCard label="Average Event Satisfaction" value={`${averageEventSatisfaction} / 5`} accent="gold" />
          <StatCard label="With Logistics Comments" value={withLogisticsFeedbackCount} accent="mint" />
        </section>

        <section className="glass-panel section-reveal mb-4 overflow-hidden sm:mb-5">
          <div className="border-b border-[#cadbcf]/90 p-3 sm:p-4">
            <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f8b7d]" />
                <input
                  type="text"
                  placeholder="Search comments and takeaways..."
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>

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
            </form>
          </div>

          {loading && <p className="p-6 text-[#5f7568]">Loading feedback...</p>}
          {!loading && error && <p className="p-6 text-[#b64a4a]">{error}</p>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-[0.82rem] sm:text-sm">
                <thead>
                  <tr className="border-b border-[#c8dbcf] bg-[#f1f7f2] text-[0.68rem] uppercase tracking-[0.08em] text-[#456253] sm:text-[0.72rem]">
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Ref #</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Event Satisfaction</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Job Relevance</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Logistics Feedback</th>
                    <th className="px-3 py-2.5 sm:px-5 sm:py-3">Date</th>
                    <th className="px-3 py-2.5 text-center sm:px-5 sm:py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length > 0 ? (
                    rows.map((feedback, index) => (
                      <tr
                        key={feedback.id}
                        className={`border-b border-[#d8e6dc] text-[#244c3a] transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-[#fbfdfb]' : 'bg-[#f3f8f4]'
                        } hover:bg-[#eaf3ed]`}
                      >
                        <td className="px-3 py-2.5 font-mono text-xs sm:px-5 sm:py-3 md:text-sm">
                          {feedback.reference}
                        </td>
                        <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                          <p className="font-semibold text-[#1f4736]">{feedback.eventSatisfaction} / 5</p>
                          <p className="text-xs text-[#4f6a5d]">{SATISFACTION_LABELS[String(feedback.eventSatisfaction)]}</p>
                        </td>
                        <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                          <p className="font-semibold text-[#1f4736]">{feedback.jobRelevance} / 5</p>
                          <p className="text-xs text-[#4f6a5d]">{SATISFACTION_LABELS[String(feedback.jobRelevance)]}</p>
                        </td>
                        <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                          <p>{excerpt(feedback.logisticsAdditionalFeedback, 90)}</p>
                          <p className="text-xs text-[#4f6a5d]">{excerpt(feedback.keyTakeaways, 90)}</p>
                        </td>
                        <td className="px-3 py-2.5 text-[#4f6a5d] sm:px-5 sm:py-3">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2.5 text-center sm:px-5 sm:py-3">
                          <button
                            type="button"
                            onClick={() => setSelected(feedback)}
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
                      <td colSpan={6} className="px-3 py-8 text-center text-[#5f7568] sm:px-5 sm:py-10">
                        No feedback found.
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
            Page {pagination.page} of {pagination.totalPages} | Total: {pagination.total} | Avg Job Relevance: {averageJobRelevance}/5
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
                <h2 className="display-font text-2xl text-[#1f4736] sm:text-3xl">Feedback Details</h2>
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
              <Detail
                label="Personal & Company Info Consent"
                value={
                  selected.personalCompanyInfoConsent === null
                    ? 'Not provided'
                    : selected.personalCompanyInfoConsent
                    ? 'Agree'
                    : 'Do not agree'
                }
              />
              <Detail
                label="Event Satisfaction"
                value={`${selected.eventSatisfaction} - ${SATISFACTION_LABELS[String(selected.eventSatisfaction)] || '-'}`}
              />
              <Detail
                label="Job Relevance"
                value={`${selected.jobRelevance} - ${SATISFACTION_LABELS[String(selected.jobRelevance)] || '-'}`}
              />
              <Detail label="Key Takeaways" value={selected.keyTakeaways || '-'} className="md:col-span-2" />
              <Detail
                label="Additional Logistics Feedback"
                value={selected.logisticsAdditionalFeedback || '-'}
                className="md:col-span-2"
              />
              <Detail
                label="Session Comments"
                value={selected.sessionsAdditionalComments || '-'}
                className="md:col-span-2"
              />
              <Detail label="Overall Feedback" value={selected.overallFeedback || '-'} className="md:col-span-2" />

              <RatingPanel
                title="Logistics Ratings"
                ratings={selected.logisticsRatings}
                itemLabels={LOGISTICS_ITEM_LABELS}
                valueLabels={SATISFACTION_LABELS}
              />

              <RatingPanel
                title="Session Relevance"
                ratings={selected.sessionRelevance}
                itemLabels={SESSION_ITEM_LABELS}
                valueLabels={SESSION_LABELS}
              />
            </div>
          </section>
        </div>
      )}

      {isExportPinOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1d3f30]/35 p-3 sm:p-4 backdrop-blur-[2px]"
          onClick={closeExportPin}
        >
          <section className="glass-panel w-full max-w-sm p-6 sm:p-7" onClick={(e) => e.stopPropagation()}>
            <p className="meta-badge inline-flex">Restricted Area</p>
            <h2 className="display-font mt-3 text-3xl text-[#1f4736]">Export Access</h2>
            <p className="mt-2 text-sm text-[#5f7568]">Enter the 8-digit PIN to export the XLSX file.</p>

            <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Export PIN digits">
              {Array.from({ length: XLSX_EXPORT_PIN_LENGTH }).map((_, index) => (
                <div
                  key={index}
                  className={`flex h-11 items-center justify-center rounded-lg border text-xl font-semibold ${
                    index < exportPin.length
                      ? 'border-[#3f8657] bg-[#e9f5ea] text-[#1f4736]'
                      : 'border-[#bfd3c5] bg-[#f8fbf9] text-[#8ca093]'
                  }`}
                >
                  {index < exportPin.length ? '•' : ''}
                </div>
              ))}
            </div>

            {exportPinError && <p className="mt-3 text-sm text-[#b64a4a]">{exportPinError}</p>}

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => appendExportDigit(digit)}
                  className="secondary-btn py-3 text-lg"
                  disabled={exportPin.length >= XLSX_EXPORT_PIN_LENGTH}
                >
                  {digit}
                </button>
              ))}

              <button type="button" onClick={clearExportPin} className="secondary-btn py-3 text-sm">
                Clear
              </button>
              <button
                type="button"
                onClick={() => appendExportDigit('0')}
                className="secondary-btn py-3 text-lg"
                disabled={exportPin.length >= XLSX_EXPORT_PIN_LENGTH}
              >
                0
              </button>
              <button type="button" onClick={removeLastExportDigit} className="secondary-btn py-3 text-sm">
                Delete
              </button>
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
          `,
        }}
      />
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
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
        <Star className="h-6 w-6 text-[#3f8657]" />
        {value}
      </p>
    </article>
  );
}

type DetailProps = {
  label: string;
  value: React.ReactNode;
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

type RatingPanelProps = {
  title: string;
  ratings: Record<string, string>;
  itemLabels: Record<string, string>;
  valueLabels: Record<string, string>;
};

function RatingPanel({ title, ratings, itemLabels, valueLabels }: RatingPanelProps) {
  const items = Object.entries(ratings || {});

  return (
    <article className="glass-panel-soft border p-3 sm:p-3.5 md:col-span-2">
      <p className="display-font text-lg text-[#1f4736] sm:text-xl">{title}</p>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[#5f7568]">No ratings submitted.</p>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map(([key, rawValue]) => {
            const normalizedValue = String(rawValue);
            const itemLabel = itemLabels[key] || key;
            const valueLabel = valueLabels[normalizedValue] || normalizedValue;

            return (
              <div key={`${title}-${key}`} className="rounded-lg border border-[#d7e5dc] bg-[#f8fbf9] px-2.5 py-2">
                <p className="text-sm font-semibold text-[#244c3a]">{itemLabel}</p>
                <p className="text-sm text-[#4f6a5d]">{valueLabel}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#bfd5c7] bg-[#f3f8f4] px-2.5 py-1 text-xs text-[#4f6a5d]">
        <MessageSquare className="h-3.5 w-3.5" />
        Feedback response scale summary
      </div>
    </article>
  );
}
