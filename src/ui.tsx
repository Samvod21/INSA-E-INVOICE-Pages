import type { InputHTMLAttributes, ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { Status } from './data';

export const Card = ({ title, sub, right, children, className = '' }: { title?: string; sub?: string; right?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
    {(title || right) && (
      <div className="mb-3 flex items-start justify-between gap-3">
        <div><h3 className="font-semibold text-slate-900">{title}</h3>{sub && <p className="text-xs text-slate-500">{sub}</p>}</div>{right}
      </div>)}
    {children}
  </section>
);
const tone: Record<Status, string> = { Draft: 'text-slate-900', 'Form ready': 'text-emerald-700', Failed: 'text-red-700', 'Awaiting certificate': 'text-indigo-700', Sent: 'text-emerald-700', Cancelled: 'text-slate-900' };
export const StatusText = ({ s }: { s: Status }) => <span className={`text-sm font-semibold ${tone[s]}`}>{s}</span>;
const alertTone = { warn: 'bg-amber-50 text-amber-900', ok: 'bg-emerald-50 text-emerald-900', err: 'bg-red-50 text-red-900', info: 'bg-slate-100 text-slate-800' };
export const Alert = ({ tone: t, title, children }: { tone: keyof typeof alertTone; title: string; children?: ReactNode }) => (
  <div role="status" className={`rounded-xl px-4 py-3 text-sm ${alertTone[t]}`}><b>{title}</b>{children && <div className="opacity-90">{children}</div>}</div>
);
const kinds = { primary: 'border-navy bg-navy text-white', plain: 'border-slate-200 bg-white text-slate-900', danger: 'border-red-300 bg-white text-red-700' };
export const Btn = ({ to, onClick, kind = 'plain', disabled, children }: { to?: string; onClick?: () => void; kind?: keyof typeof kinds; disabled?: boolean; children: ReactNode }) => {
  const c = `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${kinds[kind]} ${disabled ? 'pointer-events-none opacity-40' : ''}`;
  return to && !disabled ? <Link to={to} className={c}>{children}</Link> : <button className={c} onClick={onClick} disabled={disabled}>{children}</button>;
};
export const Field = ({ label, hint, error, ...p }: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block text-sm">
    <span className="mb-1 block font-medium text-slate-900">{label}</span>
    <input {...p} aria-invalid={!!error} className={`w-full rounded-lg border bg-white px-3 py-2.5 ${error ? 'border-red-400' : 'border-slate-200'}`} />
    {error ? <span className="text-xs text-red-700">{error}</span> : hint && <span className="text-xs text-slate-500">{hint}</span>}
  </label>
);
export const Kv = ({ k, v }: { k: string; v: ReactNode }) => (<div><div className="text-xs text-slate-500">{k}</div><div className="text-sm font-semibold text-slate-900">{v}</div></div>);
export const Table = ({ head, rows }: { head: string[]; rows: ReactNode[][] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs text-slate-500"><tr>{head.map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-slate-100">{r.map((c, j) => <td key={j} className="px-4 py-3">{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);
export const Head = ({ eyebrow = 'CERTIFICATE SERVICES / INSA', title, sub, action }: { eyebrow?: string; title: string; sub?: string; action?: ReactNode }) => (
  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div><p className="text-[11px] font-semibold tracking-wide text-brand">{eyebrow}</p><h1 className="text-3xl font-semibold text-slate-900">{title}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div>{action}
  </div>
);
const steps = ['Merchant details', 'Systems & consent', 'Generate', 'Review form', 'Mailbox', 'Confirm email'];
export const Stepper = ({ step }: { step: number }) => (
  <ol className="mb-5 grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs md:grid-cols-6">
    {steps.map((s, i) => (
      <li key={s} className="flex items-center gap-2">
        <span className={`grid h-6 w-6 place-items-center rounded-full ${i + 1 === step ? 'bg-navy text-white' : i + 1 < step ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1 < step ? '✓' : i + 1}</span>
        <span className={i + 1 === step ? 'font-semibold text-slate-900' : 'text-slate-500'}>{s}</span>
      </li>))}
  </ol>
);
export const Stats = ({ items }: { items: string[][] }) => (
  <div className="my-5 grid gap-4 md:grid-cols-4">
    {items.map(([a, b, c]) => <Card key={a}><div className="text-sm text-slate-500">{a}</div><div className="text-3xl font-semibold text-slate-900">{b}</div><div className="text-xs text-slate-500">{c}</div></Card>)}
  </div>
);
const nav = [['/', 'Overview'], ['/requests', 'All requests'], ['/notifications', 'Notifications'], ['/settings', 'Mailbox & settings']];
export const Shell = ({ admin, children }: { admin?: boolean; children: ReactNode }) => (
  <div className="flex min-h-screen">
    <aside className={`hidden w-60 shrink-0 flex-col gap-4 p-4 md:flex ${admin ? 'bg-navy text-white' : 'border-r border-slate-200 bg-white'}`}>
      <img src="/yagoutpay-logo.png" alt="YagoutPay" className="mx-auto h-24 rounded bg-white p-1" />
      <div className="text-center text-[10px] tracking-widest opacity-60">{admin ? 'OPERATIONS CONSOLE' : 'E-RECEIPT WORKSPACE'}</div>
      <div className={`rounded-lg p-3 text-sm ${admin ? 'bg-white/10' : 'bg-surface text-slate-900'}`}>
        <b>{admin ? 'Super-admin' : 'Abay Trading PLC'}</b><div className="text-xs opacity-70">{admin ? 'Restricted access · Audited' : 'Approved merchant ✓'}</div>
      </div>
      <nav className="flex flex-col gap-1">
        {(admin ? [['/admin', 'Request operations'], ['/admin/keys', 'Key versions'], ['/admin/templates', 'Templates & configuration'], ['/admin/audit', 'Audit log']] : nav).map(([to, l]) => (
          <NavLink key={to} to={to} end={to === '/' || to === '/admin'} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? (admin ? 'bg-white/15' : 'bg-indigo-50 text-navy') : 'opacity-80'}`}>{l}</NavLink>))}
      </nav>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 text-sm">
        <span className="text-slate-500">{admin ? 'Administration' : 'E-Receipt'} / <b className="text-slate-900">INSA certificate requests</b></span>
        <span className="flex items-center gap-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">Illustrative workspace</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold">{admin ? 'MK' : 'ST'}</span>{admin ? 'Meron Kebede' : 'Selam Tesfaye'}</span>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}
        <p className="mt-8 text-xs text-slate-400">Illustrative data only · All times East Africa Time (UTC+03:00)</p></main>
    </div>
  </div>
);

export const Insa = () => (
  <div className="flex items-center gap-3">
    <img src="/insa-emblem.png" alt="INSA emblem" className="h-12 w-12 object-contain" />
    <div><b className="text-slate-900">INSA</b><div className="text-xs text-slate-500">External certificate authority</div></div>
  </div>
);
