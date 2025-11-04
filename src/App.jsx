import React, { useEffect, useMemo, useState } from 'react';
import Navigation from './components/Navigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import MailCenter from './components/MailCenter.jsx';
import Profile from './components/Profile.jsx';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const STORAGE_KEYS = {
  user: 'orgmail:user',
  incoming: 'orgmail:incoming',
  outgoing: 'orgmail:outgoing',
  archived: 'orgmail:archived',
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [archived, setArchived] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const u = localStorage.getItem(STORAGE_KEYS.user);
      if (u) setUser(JSON.parse(u));
      const i = localStorage.getItem(STORAGE_KEYS.incoming);
      if (i) setIncoming(JSON.parse(i));
      const o = localStorage.getItem(STORAGE_KEYS.outgoing);
      if (o) setOutgoing(JSON.parse(o));
      const a = localStorage.getItem(STORAGE_KEYS.archived);
      if (a) setArchived(JSON.parse(a));
    } catch (e) {
      console.warn('Failed to parse local data');
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.incoming, JSON.stringify(incoming));
  }, [incoming]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.outgoing, JSON.stringify(outgoing));
  }, [outgoing]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.archived, JSON.stringify(archived));
  }, [archived]);
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.user);
  }, [user]);

  const stats = useMemo(
    () => ({ incoming: incoming.length, outgoing: outgoing.length }),
    [incoming.length, outgoing.length]
  );

  const handleAddMail = (payload) => {
    const item = { ...payload, id: uid() };
    if (payload.type === 'incoming') setIncoming((arr) => [item, ...arr]);
    else setOutgoing((arr) => [item, ...arr]);
  };

  const handleArchive = (mail) => {
    if (mail.type === 'incoming') setIncoming((arr) => arr.filter((m) => m.id !== mail.id));
    else setOutgoing((arr) => arr.filter((m) => m.id !== mail.id));
    setArchived((arr) => [{ ...mail }, ...arr]);
  };

  const handleRestore = (mail) => {
    setArchived((arr) => arr.filter((m) => m.id !== mail.id));
    if (mail.type === 'incoming') setIncoming((arr) => [mail, ...arr]);
    else setOutgoing((arr) => [mail, ...arr]);
  };

  const handleLogin = ({ email, password }) => {
    // Simple demo auth: store user with email; password not validated here
    setUser({ name: email.split('@')[0], email, department: 'General' });
  };

  const handleSignup = ({ name, email, department }) => {
    setUser({ name, email, department });
  };

  const handleLogout = () => setUser(null);

  const handleProfileUpdate = (data) => setUser((u) => ({ ...(u || {}), ...data }));

  const handleDeleteAccount = () => {
    setUser(null);
    // Optional: clear mails owned by user - keeping data for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation
        current={page}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {page === 'dashboard' && (
        <Dashboard stats={stats} archived={archived} onRestore={handleRestore} />
      )}

      {page === 'surat-masuk' && (
        <MailCenter type="incoming" mails={incoming} onAdd={handleAddMail} onArchive={handleArchive} />
      )}

      {page === 'surat-keluar' && (
        <MailCenter type="outgoing" mails={outgoing} onAdd={handleAddMail} onArchive={handleArchive} />
      )}

      {page === 'profile' && (
        <Profile user={user} onUpdate={handleProfileUpdate} onDelete={handleDeleteAccount} />
      )}

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} OrgMail — Simple mail management dashboard
      </footer>
    </div>
  );
}
