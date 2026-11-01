import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWorkers, resendInvite } from '../../api/worker';
import type { Worker } from '../../types/worker';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

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
    try {
      await resendInvite(w.id);
      setMsg(`Invitation resent to ${w.email}.`);
    } catch (e) {
      setError((e as Error).message);
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
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id}>
                <td>{w.full_name}</td>
                <td>{w.email}</td>
                <td>{w.role}</td>
                <td><span className={`badge badge-${w.status}`}>{w.status}</span></td>
                <td>{w.status === 'pending' && <button onClick={() => onResend(w)}>Resend invite</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}