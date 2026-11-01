import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWorkers, removeWorker, resendInvite } from '../../api/worker';
import type { Worker } from '../../types/worker';
import Modal from '../../components/ui/Modal';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [workerToRemove, setWorkerToRemove] = useState<Worker | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

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

  const onResend = async (w: Worker) => {
    setMsg('');
    setError('');
    try {
      await resendInvite(w.id);
      setMsg(`Invitation resent to ${w.email}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to resend the invitation.');
    }
  };

  const onRemove = async () => {
    if (!workerToRemove) return;

    setMsg('');
    setError('');
    setRemovingId(workerToRemove.id);
    try {
      await removeWorker(workerToRemove.id);
      setWorkers((currentWorkers) => currentWorkers.filter((worker) => worker.id !== workerToRemove.id));
      setMsg(`${workerToRemove.full_name} was removed.`);
      setWorkerToRemove(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to remove this worker.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Workers</h2>
        <Link to="/admin/workers/new">+ Add Worker</Link>
      </div>

      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading...</p> : workers.length === 0 ? <p>No workers yet.</p> : (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id}>
                <td>{w.full_name}</td>
                <td>{w.email}</td>
                <td>{w.role}</td>
                <td><span className={`badge badge-${w.status}`}>{w.status}</span></td>
                <td>
                  {w.status === 'pending' && <button type="button" onClick={() => onResend(w)}>Resend invite</button>}
                  <button
                    type="button"
                    onClick={() => setWorkerToRemove(w)}
                    disabled={removingId !== null}
                    aria-label={`Remove ${w.full_name}`}
                    className="ml-3 font-semibold text-red-700 hover:text-red-900 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {workerToRemove && (
        <Modal
          title="Remove worker?"
          onClose={() => {
            if (removingId === null) setWorkerToRemove(null);
          }}
        >
          <p className="text-sm text-brown/80">
            Remove <strong>{workerToRemove.full_name}</strong> ({workerToRemove.email}) from your workers?
            They will no longer have access to the bakery account.
          </p>
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setWorkerToRemove(null)}
              disabled={removingId !== null}
              className="rounded-lg px-4 py-2 font-semibold text-brown hover:bg-brown/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={removingId !== null}
              className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
            >
              {removingId === workerToRemove.id ? 'Removing...' : 'Remove worker'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}