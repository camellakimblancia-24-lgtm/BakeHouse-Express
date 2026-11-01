import { useState, type FormEvent } from 'react';
import { addWorker } from '../../api/worker';
import type { Role } from '../../types/worker';

const ROLES: Role[] = ['head_manager', 'baker', 'cashier'];

export default function AddWorkerPage() {
  const [form, setForm] = useState({ full_name: '', email: '', role: 'baker' as Role });
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await addWorker(form);
      setStatus({ type: 'ok', msg: `Invitation sent to ${form.email}.` });
      setForm({ full_name: '', email: '', role: 'baker' });
    } catch (err) {
      setStatus({ type: 'error', msg: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Add Worker</h2>
      {status && <p className={status.type === 'ok' ? 'success' : 'error'}>{status.msg}</p>}

      <label>Full name
        <input required value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
      </label>

      <label>Email
        <input type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>

      <label>Role
        <select value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>

      <button disabled={loading}>{loading ? 'Sending...' : 'Add & send invite'}</button>
    </form>
  );
}