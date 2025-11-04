import React, { useState, useEffect } from 'react';
import { Home, Inbox, Send, User, LogIn, LogOut } from 'lucide-react';

function AuthModal({ open, mode = 'login', onClose, onLogin, onSignup }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsSignup(mode === 'signup');
    setError('');
    setForm({ name: '', email: '', password: '' });
  }, [mode, open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || (isSignup && !form.name)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignup) {
      onSignup({
        name: form.name,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        department: 'General',
      });
    } else {
      onLogin({ email: form.email.trim().toLowerCase(), password: form.password });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">Close</button>
        </div>
        <div className="mb-4 flex gap-2 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${!isSignup ? 'bg-white shadow font-medium' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${isSignup ? 'bg-white shadow font-medium' : ''}`}
          >
            Sign up
          </button>
        </div>
        {error && (
          <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</div>
        )}
        <form onSubmit={submit} className="space-y-3">
          {isSignup && (
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {isSignup ? 'Create account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Navigation({ current, onNavigate, user, onLogout, onLogin, onSignup }) {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">📬</div>
            <span className="text-lg font-semibold">OrgMail</span>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <NavButton icon={<Home size={16} />} label="Dashboard" active={current === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavButton icon={<Inbox size={16} />} label="Surat Masuk" active={current === 'surat-masuk'} onClick={() => onNavigate('surat-masuk')} />
            <NavButton icon={<Send size={16} />} label="Surat Keluar" active={current === 'surat-keluar'} onClick={() => onNavigate('surat-keluar')} />
            <NavButton icon={<User size={16} />} label="Profile" active={current === 'profile'} onClick={() => onNavigate('profile')} />
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden text-sm text-gray-600 md:block">Hi, {user.name.split(' ')[0]}</div>
                <button onClick={onLogout} className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                <LogIn size={16} /> Login / Sign up
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={(payload) => {
          onLogin(payload);
          setAuthOpen(false);
        }}
        onSignup={(payload) => {
          onSignup(payload);
          setAuthOpen(false);
        }}
      />
    </>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
        active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
