import { useState, type FormEvent } from 'react';
import { addWorker } from '../../api/worker';
import Modal from '../../components/ui/Modal';
import { ROLE_LABELS, type Role } from '../../types/roles';

const ROLES: Role[] = ['admin', 'baker', 'cashier'];
const MIN_PASSWORD_LENGTH = 8;

export default function AddWorkerModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'baker' as Role,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }

    setLoading(true);
    try {
      await addWorker({
        email: form.email,
        password: form.password,
        role: form.role,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send the invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Hire A Worker!" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm font-semibold text-brown">
            First name
            <input
              required
              autoFocus
              autoComplete="given-name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="Enter first name"
              className="w-full rounded-2xl bg-white px-4 py-3 font-normal ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-2 focus:ring-brown/30"
            />
          </label>

          <label className="block space-y-2 text-sm font-semibold text-brown">
            Last name
            <input
              required
              autoComplete="family-name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Enter last name"
              className="w-full rounded-2xl bg-white px-4 py-3 font-normal ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-2 focus:ring-brown/30"
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm font-semibold text-brown">
          Email
          <input
            type="email"
            required
            autoComplete="off"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter their email address"
            className="w-full rounded-2xl bg-white px-4 py-3 font-normal ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-2 focus:ring-brown/30"
          />
        </label>

        <label className="block space-y-2 text-sm font-semibold text-brown">
          Password
          <input
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Create a password (min. 8 characters)"
            className="w-full rounded-2xl bg-white px-4 py-3 font-normal ring-1 ring-brown/10 outline-none placeholder:text-brown/40 focus:ring-2 focus:ring-brown/30"
          />
        </label>

        <label className="block space-y-2 text-sm font-semibold text-brown">
          Role
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="w-full rounded-2xl bg-white px-4 py-3 font-normal text-brown ring-1 ring-brown/10 outline-none focus:ring-2 focus:ring-brown/30"
          >
            {ROLES.map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
          </select>
        </label>

        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-brown transition hover:bg-brown/5 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brown px-6 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-brown/90 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Adding worker...' : 'Add Worker'}
          </button>
        </div>
      </form>
    </Modal>
  );
}