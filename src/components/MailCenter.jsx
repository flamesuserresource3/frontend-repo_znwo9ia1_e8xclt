import React, { useMemo, useRef, useState } from 'react';
import { Plus, Archive, Image as ImageIcon } from 'lucide-react';

export default function MailCenter({ type, mails, onAdd, onArchive }) {
  const [form, setForm] = useState({ number: '', name: '', subject: '', date: '', notes: '', image: '' });
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

  const title = type === 'incoming' ? 'Surat Masuk' : 'Surat Keluar';

  const resetForm = () => {
    setForm({ number: '', name: '', subject: '', date: '', notes: '', image: '' });
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.number || !form.name || !form.subject || !form.date) return;
    onAdd({ ...form, type });
    resetForm();
  };

  const rows = useMemo(() => mails.sort((a, b) => (a.date < b.date ? 1 : -1)), [mails]);

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f) => ({ ...f, image: ev.target?.result || '' }));
      setPreview(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">Kelola {title.toLowerCase()} organisasi Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 lg:col-span-1">
          <h2 className="mb-3 text-lg font-medium">Tambah {title}</h2>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Nomor Surat</label>
              <input
                value={form.number}
                onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="e.g. 001/ORG/2025"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nama</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Nama pengirim/penerima"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Perihal</label>
              <input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Perihal surat"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tanggal</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Gambar (opsional)</label>
              <div className="flex items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
                <div className="text-xs text-gray-500">.jpg, .png</div>
              </div>
              {preview && (
                <img src={preview} alt="preview" className="mt-2 h-24 w-24 rounded-md object-cover" />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Catatan</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Catatan tambahan"
              />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              <Plus size={16} /> Tambah {title}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Daftar {title}</h2>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2">Gambar</th>
                    <th className="px-3 py-2">Nomor</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Perihal</th>
                    <th className="px-3 py-2">Tanggal</th>
                    <th className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                    </tr>
                  ) : (
                    rows.map((m) => (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-2">
                          {m.image ? (
                            <img src={m.image} alt={m.subject} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-500">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 font-medium">{m.number}</td>
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2">{m.subject}</td>
                        <td className="px-3 py-2">{m.date}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => onArchive(m)}
                            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                          >
                            <Archive size={14} /> Arsipkan
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
