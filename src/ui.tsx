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
export const StatusText = ({ s }: { s: Status }) => <span className={`text-sm font-semibold ${tone[s] ?? 'text-slate-900'}`}>{s}</span>;
const alertTone = { warn: 'bg-amber-50 text-amber-900 border border-amber-200/60', ok: 'bg-emerald-50 text-emerald-900 border border-emerald-200/60', err: 'bg-red-50 text-red-900 border border-red-200/60', info: 'bg-slate-100 text-slate-800 border border-slate-200/60' };

export const Alert = ({ tone: t, title, children }: { tone: keyof typeof alertTone; title: string; children?: ReactNode }) => (
  <div role="status" className={`rounded-xl px-4 py-3 text-sm ${alertTone[t]}`}><b className="font-semibold">{title}</b>{children && <div className="mt-1 opacity-90 leading-relaxed">{children}</div>}</div>
);

const kinds = {
  primary: 'border-navy bg-navy text-white hover:opacity-90 active:scale-[0.99]',
  plain: 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99]',
  danger: 'border-red-300 bg-white text-red-700 hover:bg-red-50 active:scale-[0.99]'
};

export const Btn = ({ to, onClick, kind = 'plain', disabled, children }: { to?: string; onClick?: () => void; kind?: keyof typeof kinds; disabled?: boolean; children: ReactNode }) => {
  const c = `inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all select-none ${kinds[kind]} ${disabled ? 'pointer-events-none opacity-40' : ''}`;
  return to && !disabled ? <Link to={to} className={c}>{children}</Link> : <button type="button" className={c} onClick={onClick} disabled={disabled}>{children}</button>;
};

export const Field = ({ label, hint, error, ...p }: { label: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block text-sm">
    <span className="mb-1 block font-medium text-slate-900">{label}</span>
    <input {...p} aria-invalid={!!error} className={`w-full rounded-lg border bg-white px-3 py-2.5 transition-colors ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-navy'}`} />
    {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
  </label>
);

export const Kv = ({ k, v }: { k: string; v: ReactNode }) => (<div><div className="text-xs text-slate-500">{k}</div><div className="text-sm font-semibold text-slate-900 wrap-break-word">{v}</div></div>);
export const Table = ({ head, rows }: { head: string[]; rows: ReactNode[][] }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-xs text-slate-500"><tr>{head.map(h => <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">{r.map((c, j) => <td key={j} className="px-4 py-3 align-middle">{c}</td>)}</tr>)}</tbody>
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
      <li key={s} className="flex items-center gap-2 min-w-0">
        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${i + 1 === step ? 'bg-navy text-white' : i + 1 < step ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1 < step ? '✓' : i + 1}</span>
        <span className={`truncate ${i + 1 === step ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>{s}</span>
      </li>))}
  </ol>
);

export const Stats = ({ items }: { items: string[][] }) => (
  <div className="my-5 grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
    {items.map(([a, b, c]) => <Card key={a}><div className="text-sm text-slate-500">{a}</div><div className="text-2xl sm:text-3xl font-semibold text-slate-900 my-1">{b}</div><div className="text-xs text-slate-500">{c}</div></Card>)}
  </div>
);

const nav = [['/', 'Overview'], ['/requests', 'All requests'], ['/notifications', 'Notifications']];
export const Shell = ({ admin, children }: { admin?: boolean; children: ReactNode }) => (
  <div className="flex min-h-screen">
    <aside className={`hidden w-60 shrink-0 flex-col gap-4 p-4 md:flex ${admin ? 'bg-navy text-white' : 'border-r border-slate-200 bg-white'}`}>
      <img src="/yagoutpay-logo.png" alt="YagoutPay" className="mx-auto h-24 object-contain rounded bg-white p-1" />
      <div className="text-center text-[10px] tracking-widest opacity-60 font-semibold">{admin ? 'OPERATIONS CONSOLE' : 'E-RECEIPT WORKSPACE'}</div>
      <div className={`rounded-lg p-3 text-sm ${admin ? 'bg-white/10 text-white' : 'bg-surface text-slate-900 border border-slate-200/60'}`}>
        <b>{admin ? 'Super-admin' : 'Abay Trading PLC'}</b><div className="text-xs opacity-70">{admin ? 'Restricted access · Audited' : 'Approved merchant ✓'}</div>
      </div>
      <nav className="flex flex-col gap-1">
        {(admin ? [['/admin', 'Request operations']] : nav).map(([to, l]) => (
          <NavLink key={to} to={to} end={to === '/' || to === '/admin'} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? (admin ? 'bg-white/15 text-white font-semibold' : 'bg-indigo-50 text-navy font-semibold') : (admin ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}`}>{l}</NavLink>))}
      </nav>
    </aside>
    <div className="min-w-0 flex-1 flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 truncate mr-2">{admin ? 'Administration' : 'E-Receipt'} / <b className="text-slate-900">INSA certificate requests</b></span>
          <span className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Illustrative workspace</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{admin ? 'MK' : 'ST'}</span>
            <span className="hidden sm:inline font-medium text-slate-700">{admin ? 'Meron Kebede' : 'Selam Tesfaye'}</span>
          </span>
        </div>
        {/* Mobile navigation header */}
        <nav className="mt-2 flex gap-1 border-t border-slate-100 pt-2 md:hidden">
          {(admin ? [['/admin', 'Operations']] : [['/', 'Overview'], ['/requests', 'Requests'], ['/notifications', 'Notifications']]).map(([to, l]) => (
            <NavLink key={to} to={to} end={to === '/' || to === '/admin'} className={({ isActive }) => `rounded px-2.5 py-1 text-xs font-medium transition-colors ${isActive ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{l}</NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 flex-1">{children}
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
