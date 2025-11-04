import React from 'react';
import { Archive, Inbox, Send } from 'lucide-react';

export default function Dashboard({ stats, archived, onRestore }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<Inbox className="text-blue-600" />} label="Surat Masuk" value={stats.incoming} />
        <StatCard icon={<Send className="text-emerald-600" />} label="Surat Keluar" value={stats.outgoing} />
        <StatCard icon={<Archive className="text-gray-700" />} label="Arsip" value={archived.length} />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium">Arsip Surat</h2>
          <p className="text-sm text-gray-500">Daftar surat yang sudah diarsipkan</p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Nomor</th>
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Perihal</th>
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {archived.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-gray-500">Belum ada arsip</td>
                </tr>
              ) : (
                archived.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-3 py-2">{m.type === 'incoming' ? 'Surat Masuk' : 'Surat Keluar'}</td>
                    <td className="px-3 py-2 font-medium">{m.number}</td>
                    <td className="px-3 py-2">{m.name}</td>
                    <td className="px-3 py-2">{m.subject}</td>
                    <td className="px-3 py-2">{m.date}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onRestore(m)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                      >
                        Pulihkan
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
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className="rounded-lg bg-gray-100 p-3">{icon}</div>
      </div>
    </div>
  );
}
