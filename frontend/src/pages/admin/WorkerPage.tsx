import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Trash2 } from 'lucide-react';
import { listWorkers, removeWorker } from '../../api/workers';
import type { Worker } from '../../api/workers';
import { ROLE_LABELS } from '../../types/roles';
import AddWorkerModal from './AddWorkerModal';

export default function WorkersPage({ initialAddModalOpen = false }: { initialAddModalOpen?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [workerToRemove, setWorkerToRemove] = useState<Worker | null>(null);
  const [showAddModal, setShowAddModal] = useState(initialAddModalOpen);

  useEffect(() => {
    let cancelled = false
    listWorkers()
      .then((data) => {
        if (!cancelled) setWorkers(data)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, []);

  const onConfirmRemove = async () => {
    if (!workerToRemove) return;
    const w = workerToRemove;
    setMsg('');
    setError('');
    setRemovingId(w.id);
    try {
      await removeWorker(w.id);
      setWorkers((prev) => prev.filter((x) => x.id !== w.id));
      setMsg(`${w.first_name} ${w.last_name} has been removed.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRemovingId(null);
      setWorkerToRemove(null);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    if (location.pathname === '/admin/workers/new') {
      navigate('/admin/workers', { replace: true });
    }
  };

  const onWorkerAdded = async () => {
    setShowAddModal(false);
    if (location.pathname === '/admin/workers/new') {
      navigate('/admin/workers', { replace: true });
    }
    setMsg('Worker added successfully.');
    setError('');
    try {
      setWorkers(await listWorkers());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Worker was added, but the list could not be refreshed.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brown">Worker's List</h1>
          {!loading && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brown/70">
              <span className="font-semibold text-brown">{workers.length} {workers.length === 1 ? 'worker' : 'workers'}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brown px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-brown/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
        >
          + Add Worker
        </button>
      </div>

      {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{msg}</p>}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">{error}</p>}

      {loading ? (
        <p className="rounded-2xl bg-white/60 p-8 text-center text-sm text-brown/65 ring-1 ring-brown/10">Loading workers...</p>
      ) : workers.length === 0 && !error ? (
        <div className="rounded-2xl bg-white/60 px-6 py-12 text-center shadow-sm ring-1 ring-brown/10">
          <h2 className="text-lg font-bold text-brown">No workers yet</h2>
          <p className="mt-1 text-sm text-brown/65">Add a worker to invite them to your bakery team.</p>
          <button type="button" onClick={() => setShowAddModal(true)} className="mt-5 inline-flex rounded-xl bg-brown px-4 py-2.5 text-sm font-semibold text-cream hover:bg-brown/90">
            Add your first worker
          </button>
        </div>
      ) : workers.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {workers.map((w) => {
            const initials = `${w.first_name} ${w.last_name}`
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join('')
              .toUpperCase();

            return (
              <article key={w.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brown/10 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-brown ring-4 ring-amber-50" aria-hidden="true">
                      {initials || '?'}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-brown">{`${w.first_name} ${w.last_name}`}</h2>
                      <p className="mt-1 text-sm text-brown/65">{ROLE_LABELS[w.role]}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-brown/10 bg-[#fbf8f2] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brown/55">Email</p>
                  <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-brown">
                    <Mail size={16} className="shrink-0 text-brown/60" aria-hidden="true" />
                    <span className="truncate">{w.email}</span>
                  </p>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setWorkerToRemove(w)}
                      disabled={removingId !== null}
                      className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {workerToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-brown">Remove worker?</h2>
            <p className="mt-2 text-sm text-brown/70">
              <span className="font-semibold text-brown">{`${workerToRemove.first_name} ${workerToRemove.last_name}`}</span> will lose access to
              BakeHouse Express. This can't be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setWorkerToRemove(null)}
                disabled={removingId !== null}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-brown hover:bg-amber-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmRemove}
                disabled={removingId !== null}
                className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {removingId ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && <AddWorkerModal onClose={closeAddModal} onSuccess={onWorkerAdded} />}
    </section>
  );
}