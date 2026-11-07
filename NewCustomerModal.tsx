import React, { useState } from 'react';
import { useSupport } from '../context/SupportContext';
import type { CustomerPersona } from '../types';
import { X, UserPlus, Server } from 'lucide-react';

export const NewCustomerModal: React.FC = () => {
  const { isNewCustomerModalOpen, setIsNewCustomerModalOpen, addPersona } = useSupport();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [os, setOs] = useState('macOS Sonoma 14.5');
  const [runtime, setRuntime] = useState('Node.js v20.12 LTS');
  const [infra, setInfra] = useState('Vercel Edge & Supabase');
  const [tags, setTags] = useState('Next.js 14, Tailwind, Prisma');
  const [frustration, setFrustration] = useState(50);
  const [pastIssue, setPastIssue] = useState('Database pool exhausted during peak sales launch');
  const [pastFix, setPastFix] = useState('Set pgbouncer pool_mode = transaction with max_client_conn = 1000');
  const [notes, setNotes] = useState('Busy founder, needs quick copy-paste configs');

  if (!isNewCustomerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'CU';

    const id = `custom-${Date.now()}`;
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPersona: CustomerPersona = {
      id,
      name: name.trim(),
      role: role.trim(),
      company: company.trim() || 'Tech Ventures',
      avatarSeed: id,
      initials,
      environment: {
        os: os.trim(),
        runtime: runtime.trim(),
        infra: infra.trim(),
        additionalTags: tagArray.length > 0 ? tagArray : ['Production', 'Cloud'],
      },
      frustrationLevel: frustration,
      frustrationTrend: 'stable',
      personalityNotes: notes.trim() || 'Prefers clear answers and verified snippets.',
      pastTickets: [
        {
          id: `t-${Date.now()}`,
          ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
          title: pastIssue.trim() || 'Initial setup verification',
          status: 'resolved',
          date: 'Nov 04, 2026',
          category: 'Infrastructure',
          summary: pastIssue.trim(),
          resolution: pastFix.trim(),
          keyTakeaway: 'Verified in production environment.',
        },
      ],
      playbooks: [
        {
          issue: pastIssue.trim() || 'Config issue',
          provenFix: pastFix.trim() || 'Check status via CLI',
        },
      ],
      quickPrompts: [
        `Is our ${pastIssue.split(' ')[0] || 'service'} configuration running normally?`,
        `Can you check the logs for ${company.trim() || 'our account'}?`,
        `What fix did we apply last week for ${pastIssue.slice(0, 25)}?`,
      ],
    };

    addPersona(newPersona);
    setIsNewCustomerModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Add Custom Customer Persona</h3>
          </div>
          <button
            onClick={() => setIsNewCustomerModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Chen"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Role / Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Staff Data Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Analytics Corp"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <div className="text-[11px] font-semibold text-cyan-400 flex items-center space-x-1.5 uppercase tracking-wider">
              <Server className="w-3.5 h-3.5" />
              <span>Technical Environment & Stack</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Operating System</label>
                <input
                  type="text"
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Runtime / DB</label>
                <input
                  type="text"
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Infra Host</label>
                <input
                  type="text"
                  value={infra}
                  onChange={(e) => setInfra(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-0.5">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Docker, Redis, Snowflake"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-200 text-[11px]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400 font-medium">Initial Frustration Level</label>
              <span className="font-mono text-cyan-400 font-bold">{frustration}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={frustration}
              onChange={(e) => setFrustration(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Past Known Incident (Summary)</label>
            <input
              type="text"
              value={pastIssue}
              onChange={(e) => setPastIssue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Proven Solution Playbook</label>
            <textarea
              rows={2}
              value={pastFix}
              onChange={(e) => setPastFix(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Customer Notes / Persona Guidance</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers CLI over UI; time-sensitive"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsNewCustomerModalOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-md shadow-cyan-500/20"
            >
              Create Persona & Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
