import React, { useEffect, useRef, useState } from 'react';

export default function Profile({ user, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', email: '', department: '', avatar: '' });
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target?.result || '' }));
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <div className="text-lg font-medium">Please login to manage your profile.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          {form.avatar ? (
            <img src={form.avatar} className="h-16 w-16 rounded-full object-cover" alt="avatar" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200" />
          )}
          <div>
            <div className="text-sm text-gray-500">Avatar</div>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
              <button
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                onClick={() => {
                  if (fileRef.current) fileRef.current.value = '';
                  setForm((f) => ({ ...f, avatar: '' }));
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Department</label>
            <input
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => onDelete()}
            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Delete account
          </button>
          <button
            onClick={() => onUpdate(form)}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
