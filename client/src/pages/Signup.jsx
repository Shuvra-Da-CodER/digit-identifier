import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch {
      setError('Failed to create an account. Please try again.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PersonAddIcon className="text-zinc-50" />
          <h1 className="text-2xl font-semibold text-zinc-50">Create Account</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950 border border-red-800 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-zinc-800 rounded px-4 py-2 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-zinc-800 rounded px-4 py-2 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-zinc-400 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-zinc-800 rounded px-4 py-2 text-zinc-50 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 text-zinc-950 py-2 rounded font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-50 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
