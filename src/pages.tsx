import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { requests, systems } from './data';
import type { Req } from './data';
import { Alert, Btn, Card, Field, Head, Insa, Kv, Shell, Stats, StatusText, Stepper, Table } from './ui';

const to = (r: Req) => r.action === 'Continue' ? '/requests/new/1' : r.action === 'Review' ? '/requests/new/4' : r.action === 'Fix CSR' ? '/requests/new/3' : `/requests/${r.id}`;
const ReqTable = ({ rows, admin }: { rows: Req[]; admin?: boolean }) => (
  <Table head={['Request ID', ...(admin ? ['Merchant'] : []), 'System ID / branch', 'Type', 'Updated', 'Status', 'Action']}
    rows={rows.map(r => [<b className="text-slate-900">{r.id}</b>, ...(admin ? ['Abay Trading PLC'] : []),
      <div>{r.sys}<div className="text-xs text-slate-500">{r.branch}</div></div>, r.type, r.updated, <StatusText s={r.status} />,
      <Link className="font-semibold text-navy hover:underline" to={to(r)}>{r.action} →</Link>])} />
);

export function Overview() {
  return (<Shell>
    <Head title="Certificate requests, simplified." sub="Prepare and send your INSA E-Invoicing request securely, without terminal commands." action={<Btn kind="primary" to="/requests/new/1">+ New request</Btn>} />
    <Alert tone="warn" title="2 requests need your attention">Reconnect your mailbox for REQ-1046. REQ-1047 has been awaiting INSA for more than 5 business days.</Alert>
    <Stats items={[['Total requests', '24', 'Across all approved systems'], ['Awaiting certificate', '14', '1 past the waiting threshold'], ['Drafts & form-ready', '5', '3 drafts · 2 ready for review'], ['Failed submissions', '2', 'Review and safely recover']]} />
    <div className="grid gap-5 md:grid-cols-3">
      <div className="space-y-5 md:col-span-2">
        <Card title="Recent requests" sub="Each System ID is submitted independently." right={<Link className="text-sm font-semibold text-navy hover:underline" to="/requests">View all requests →</Link>}><ReqTable rows={requests.slice(0, 4)} /></Card>
        <Card title="Start the right request"><div className="grid gap-4 text-sm md:grid-cols-3">
          {[['New', 'First certificate request for a system.'], ['Renewal', 'Reuse details and create a new key version.'], ['Reissue', 'Replace a previous request with a new key.']].map(([t, d]) => (
            <div key={t}><b className="text-slate-900">{t}</b><p className="text-slate-500">{d}</p><Link className="font-semibold text-navy hover:underline" to="/requests/new/1">Start request →</Link></div>))}
        </div></Card>
      </div>
      <div className="space-y-5">
        <Card title="Ready when you are"><p className="mb-2 text-sm">Abay Trading PLC and 3 MoR System IDs are approved. Your merchant details are prefilled.</p>
          <ol className="list-decimal pl-5 text-xs text-slate-500"><li>Confirm merchant details</li><li>Choose systems & accept custody</li><li>Generate keys, CSR and form</li><li>Review and explicitly send</li></ol></Card>
        <Card><Insa /><p className="mt-3 text-xs text-slate-500">YagoutPay prepares and sends your request. INSA reviews and issues certificates outside this workspace.</p></Card>
        <Alert tone="info" title="No command line needed">Keys remain encrypted with YagoutPay. Private keys are never emailed or downloadable.</Alert>
      </div>
    </div>
  </Shell>);
}

export function Requests({ admin }: { admin?: boolean }) {
  const [q, setQ] = useState(''); const [st, setSt] = useState(''); const [ty, setTy] = useState('');
  const rows = requests.filter(r => (r.id + r.sys + r.branch).toLowerCase().includes(q.toLowerCase()) && (!st || r.status === st) && (!ty || r.type === ty));
  const c = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm';
  return (<>
    <Head eyebrow={admin ? 'OPERATIONS / INSA' : undefined} title={admin ? 'Request operations' : 'All certificate requests'} sub="Find drafts, review delivery, and manage each system's submission."
      action={admin ? <Btn>Export operations list</Btn> : <Btn kind="primary" to="/requests/new/1">+ New request</Btn>} />
    <Card>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input aria-label="Search requests" className={c} placeholder="Search ID or branch…" value={q} onChange={e => setQ(e.target.value)} />
        <select aria-label="Status" className={c} value={st} onChange={e => setSt(e.target.value)}><option value="">All statuses</option>{['Draft', 'Form ready', 'Failed', 'Awaiting certificate', 'Sent', 'Cancelled'].map(s => <option key={s}>{s}</option>)}</select>
        <select aria-label="Type" className={c} value={ty} onChange={e => setTy(e.target.value)}><option value="">All types</option>{['New', 'Renewal', 'Reissue'].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      {rows.length ? <ReqTable rows={rows} admin={admin} /> : <Alert tone="info" title="No matching requests">Clear the filters and try again. Your other requests are kept.</Alert>}
      <p className="mt-3 text-xs text-slate-500">Showing {rows.length} of 24 requests</p>
    </Card>
  </>);
}
export const RequestsPage = () => <Shell><Requests /></Shell>;

export function Admin() {
  return (<Shell admin>
    <Alert tone="info" title="Privileged access is audited">Opening snapshots, downloading artifacts, resending and cancelling create immutable audit events. No private key material is accessible here.</Alert>
    <Stats items={[['Requests · all merchants', '24', 'Illustrative dataset'], ['Awaiting external authority', '14', '1 over 5 business days'], ['Failed / blocked', '2', 'Mailbox recovery and CSR validation'], ['Ready for merchant review', '2', 'No automatic submission']]} />
    <Requests admin />
  </Shell>);
}

const safe = /^[^\u0000-\u001f\u007f=\[\]$#;\\]*$/;
const fields: [string, string, string?][] = [['org', 'Registered organization name *'], ['tin', 'Tax identification number (TIN) *', 'Exactly 10 digits.'], ['country', 'Country code *'], ['region', 'Region *'], ['city', 'Locality / city *'], ['addr', 'Organization address *'], ['name', 'Contact full name *'], ['phone', 'Telephone *'], ['caddr', 'Contact address *'], ['email', 'Email address *', 'Used for merchant CC and replies when a platform sender is selected.']];

export function Wizard() {
  const step = Number(useParams().step) || 1; const go = useNavigate();
  const [f, setF] = useState<Record<string, string>>({ org: 'Abay Trading PLC', tin: '1234567890', country: 'ET', region: 'Addis Ababa', city: 'Addis Ababa', addr: 'Bole Road, Woreda 03, Addis Ababa', name: 'Selam Tesfaye', phone: '+251 911 234 567', caddr: 'Bole Road, Woreda 03, Addis Ababa, Ethiopia', email: 'finance@abaytrading.example' });
  const [tried, setTried] = useState(false); const [sel, setSel] = useState(systems.map(s => s[1]));
  const [consent, setConsent] = useState(false); const [fallback, setFallback] = useState(false); const [ok, setOk] = useState(false);
  const err = (k: string): string | undefined => {
    const v = f[k].trim();
    if (!v) return 'This field is required.';
    if (!safe.test(v)) return 'Control characters, line breaks and configuration characters are not allowed.';
    if (k === 'tin' && !/^\d{10}$/.test(v)) return 'Enter exactly 10 digits.';
    if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'A valid contact email is required.';
    if (k === 'country' && !/^[A-Z]{2}$/.test(v)) return 'Use a 2-letter country code.';
    return undefined;
  };
  const path = (n: number) => `/requests/new/${n}`;
  const Nav = ({ next, label = 'Continue', disabled, onNext }: { next?: number; label?: string; disabled?: boolean; onNext?: () => void }) => (
    <div className="mt-6 flex justify-between"><Btn to={step > 1 ? path(step - 1) : '/requests'}>{step > 1 ? 'Back' : 'Cancel request'}</Btn>
      <div className="flex gap-2"><Btn>Save draft</Btn><Btn kind="primary" disabled={disabled} to={next ? path(next) : undefined} onClick={onNext}>→ {label}</Btn></div></div>);
  const Check = ({ v, set, children }: { v: boolean; set: (b: boolean) => void; children: string }) => (
    <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={v} onChange={e => set(e.target.checked)} /><span className="font-medium text-slate-900">{children}</span></label>);
  const titles = ['Confirm merchant & contact details', 'Choose systems. Keep control.', 'Generation results', 'Review your prepared form', 'Choose how your request is sent', 'Review email. Approve this system.'];
  return (<Shell>
    <Head title={titles[step - 1]} sub={step === 1 ? 'New request · Draft REQ-1048 · Profile values are prefilled and editable for this request.' : 'REQ-1048 · B0360155CA · Head office'} />
    <Stepper step={step} />
    {step === 1 && (<>
      <Alert tone="ok" title="Prerequisites verified">Abay Trading PLC is an approved merchant. Only approved MoR source records are available in the next step.</Alert>
      <Card className="mt-5" title="Organization & primary contact" sub="Required fields are marked with *. Changes apply to the request snapshot, not your merchant profile.">
        <div className="grid gap-4 md:grid-cols-2">{fields.map(([k, l, h]) => <Field key={k} label={l} hint={h} value={f[k]} error={tried ? err(k) : undefined} onChange={e => setF({ ...f, [k]: e.target.value })} />)}</div>
      </Card>
      <Nav label="Continue to systems" onNext={() => fields.some(([k]) => err(k)) ? setTried(true) : go(path(2))} />
    </>)}
    {step === 2 && (<>
      <Card title="Approved source records" sub="Source number, System Number and System ID refer to the same identifier." right={<span className="text-xs">{sel.length} selected</span>}>
        <Table head={['Selection', 'Branch / establishment', 'System ID', 'Approval', 'Independent request']} rows={systems.map(([b, id, r]) => [
          <input aria-label={`Select ${id}`} type="checkbox" checked={sel.includes(id)} onChange={e => setSel(e.target.checked ? [...sel, id] : sel.filter(x => x !== id))} />, b, id, <b className="text-emerald-700">Approved</b>, r])} />
      </Card>
      <Card className="mt-5" title="One key and CSR per System ID" sub="Security and generation consent">
        <div className="mb-4 grid grid-cols-3 gap-4"><Kv k="Key size" v="RSA 2048" /><Kv k="Isolation" v="1 key + 1 CSR / System ID" /><Kv k="Custody" v="Encrypted by YagoutPay" /></div>
        <Check v={consent} set={setConsent}>I authorize YagoutPay to generate and securely hold the private key for each selected System ID. *</Check>
        <p className="mb-3 ml-6 text-xs text-slate-500">Keys are encrypted in YagoutPay custody, cannot be downloaded, and are never included in email attachments.</p>
        {!consent && <Alert tone="warn" title="Acceptance required">Select the consent above to enable Generate. Your acceptance and the request snapshot are recorded in the audit log.</Alert>}
      </Card>
      <Alert tone="info" title="Independent by default">One submission per System ID. Multi-system batching is pending confirmation from INSA.</Alert>
      <Nav next={3} label={`Generate for ${sel.length} systems`} disabled={!consent || !sel.length} />
    </>)}
    {step === 3 && (<>
      <Alert tone="warn" title="2 systems are form-ready. 1 system needs attention.">Completed requests are preserved. REQ-1050 is blocked by CSR validation and will not be sent.</Alert>
      <Card className="mt-5" title="Per-system generation" sub="DRAFT → KEY_GENERATED → CSR_GENERATED → FORM_READY">
        <Table head={['Request / System ID', 'Key generated', 'CSR generated', 'Form ready', 'Result']} rows={[
          ['REQ-1048 / B0360155CA', '✓ RSA 2048', '✓ Validated', '✓ Word + PDF', <b className="text-emerald-700">Form ready</b>],
          ['REQ-1049 / B0360155CB', '✓ RSA 2048', '✓ Validated', '✓ Word + PDF', <b className="text-emerald-700">Form ready</b>],
          ['REQ-1050 / B0360155CC', '✓ RSA 2048', '× DN mismatch', 'Not generated', <b className="text-red-700">Failed</b>]]} />
      </Card>
      <Card className="mt-5" title="REQ-1048 · Security & subject checks" sub="Key reference only, never key material">
        <div className="space-y-3"><Kv k="Key reference" v="key_B0360155CA_v1 · RSA 2048 bits" />
          <Kv k="Validated subject" v={<code className="text-xs break-all bg-slate-50 p-1 rounded border border-slate-200 block">C=ET, ST=Addis Ababa, L=Addis Ababa, O=Abay Trading PLC, OU=Head office, serialNumber=B0360155CA, CN=1234567890</code>} />
          <Kv k="CSR SHA-256 fingerprint" v={<code className="text-xs break-all bg-slate-50 p-1 rounded border border-slate-200 block">7F:2A:91:BC:44:0D:8E:73:AA:16:50:CE:39:EF:82:68:18:03:4A:90:71:CA:2F:50:86:13:A0:9B:CC:42:67:E1</code>} /></div>
      </Card>
      <div className="mt-5"><Alert tone="err" title="REQ-1050 · CSR validation blocker">The generated CSR subject did not match the approved System ID B0360155CC. Correct the snapshot and regenerate only this system.</Alert></div>
      <Nav next={4} label="Review REQ-1048" />
    </>)}
    {step === 4 && (<>
      <Alert tone="info" title="Prepared platform preview — not an official INSA template">The official Word template was not supplied. This preview shows the prepared request data and attachments.</Alert>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2" title="Request form · Page 1 of 1"><div className="space-y-4 rounded-lg border border-slate-200 p-6 text-sm">
          <Insa /><h2 className="text-2xl font-semibold text-slate-900">E-Invoicing Certificate Request</h2><p className="text-xs text-slate-500">Prepared 24 October 2026 · Reference REQ-1048</p>
          <h3 className="font-semibold text-slate-900">Organization information</h3>
          <div className="grid grid-cols-2 gap-3"><Kv k="Registered organization" v={f.org} /><Kv k="TIN" v={f.tin} /><Kv k="Country" v={f.country} /><Kv k="Region / locality" v={`${f.region} / ${f.city}`} /><Kv k="Address" v={f.addr} /></div>
          <h3 className="font-semibold text-slate-900">Contact information</h3>
          <div className="grid grid-cols-2 gap-3"><Kv k="Full name" v={f.name} /><Kv k="Telephone / email" v={`${f.phone} / ${f.email}`} /><Kv k="Contact address" v={f.caddr} /></div>
          <Table head={['Branch / establishment', 'System ID']} rows={[['Head office · Addis Ababa', 'B0360155CA']]} />
        </div></Card>
        <div className="space-y-5">
          <Card title="Ready for review"><Kv k="Request / internal type" v="REQ-1048 · New" /><p className="mt-2 text-xs text-slate-500">Editing subject data after CSR generation invalidates the CSR and form; you must regenerate and review again.</p><div className="mt-3"><Btn to={path(1)}>Edit request details</Btn></div></Card>
          <Card title="Prepared files"><ul className="space-y-3 text-sm">{[['request_REQ-1048.docx', 'Word · 42 KB · Email attachment'], ['csr_B0360155CA.pem', 'PEM · 1.1 KB · Email attachment'], ['request_REQ-1048.pdf', 'PDF · 68 KB · Records only']].map(([n, d]) => <li key={n}><b className="text-slate-900">{n}</b><div className="text-xs text-slate-500">{d}</div></li>)}</ul></Card>
          <Card title="Signed or stamped copy" sub="Optional replacement"><Btn>Upload replacement .docx</Btn></Card>
        </div>
      </div>
      <Nav next={5} label="Continue to mailbox" />
    </>)}
    {step === 5 && (<>
      <div className="grid gap-5 md:grid-cols-2">{[['Gmail', 'Send from your connected Google mailbox. YagoutPay requests permission to send email, not read your inbox.', 'Connect Gmail'], ['Microsoft 365', 'Authorize your Microsoft 365 mailbox for send-only access. Your organization may require admin consent.', 'Connect Microsoft 365']].map(([t, d, b]) => (
        <Card key={t} title={t}><p className="mb-3 text-sm">{d}</p><Btn kind={t === 'Gmail' ? 'primary' : 'plain'}>{b}</Btn></Card>))}</div>
      <Card className="mt-5"><Insa /><p className="mt-2 text-xs text-slate-500">Connecting a mailbox does not send a request. You will review the recipient, template text and attachments before approving each email.</p></Card>
      <Card className="mt-5" title="Connected mailbox" right={<span className="text-xs text-emerald-700">Connected</span>}>
        <div className="grid grid-cols-2 gap-4"><Kv k="Provider" v="Google Workspace" /><Kv k="Mailbox" v="finance@abaytrading.example" /><Kv k="Permission" v="Send email only · Inbox reading not requested" /></div></Card>
      <Card className="mt-5" title="Alternative: YagoutPay-controlled sender"><Check v={fallback} set={setFallback}>Use the platform sender instead</Check>
        <div className="mt-3 grid grid-cols-2 gap-4"><Kv k="From" v="E-Receipt <requests@yagoutpay.example>" /><Kv k="Reply-To and CC" v={f.email} /></div></Card>
      <Nav next={6} label="Review email" />
    </>)}
    {step === 6 && (<>
      <Alert tone="warn" title="Configured template contains test wording">The email below preserves “This is a test certificate request for E-Invoice.” Review it before approving; contact an administrator if it is not appropriate.</Alert>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2" title="Email preview" right={<span className="text-xs">Not sent</span>}>
          <div className="space-y-3 text-sm"><Kv k="From" v={fallback ? 'E-Receipt <requests@yagoutpay.example>' : `${f.name} <${f.email}>`} /><Kv k="To" v="ica@insa.gov.et" /><Kv k="CC · merchant copy" v={f.email} /><Kv k="Subject" v="Certificate Request for E-Invoice" />
            <div className="whitespace-pre-line border-t border-slate-100 pt-3">{`Dear Admin,\n\nThis is a test certificate request for E-Invoice.\n\nPlease find attached:\nRequest Form; CSR File.\n\nRegards,\n${f.name},\n${f.org},\n${f.email} · ${f.phone}`}</div>
            <div className="border-t border-slate-100 pt-3"><b className="text-slate-900">Attachments · Exactly 2 files</b><p>request_REQ-1048.docx · csr_B0360155CA.pem</p></div></div></Card>
        <div className="space-y-5"><Card title="Pre-send safety" right={<span className="text-xs text-emerald-700">Passed</span>}>
          <ul className="space-y-1 text-sm">{['Word + CSR allowlist', 'Private-key text detection', 'CSR signature / subject', 'Attachment hashes fixed', 'Recipients verified'].map(c => <li key={c} className="flex justify-between"><span>{c}</span><b className="text-emerald-700">Passed</b></li>)}</ul>
          <p className="mt-3 text-xs text-slate-500">Idempotency: REQ-1048 / send / v1. Repeated clicks reuse the same attempt.</p></Card>
          <Card title="Other selected systems"><p className="text-xs">REQ-1049 · Form ready · separate review required</p><p className="text-xs">REQ-1050 · CSR validation failed · sending blocked</p></Card></div>
      </div>
      <Card className="mt-5" title="Explicit submission approval"><Check v={ok} set={setOk}>I have reviewed this email and authorize sending the form and CSR for B0360155CA to INSA. *</Check>
        <p className="mb-3 ml-6 text-xs text-slate-500">Approval applies only to REQ-1048 and its current artifact versions.</p>
        <div className="flex justify-between"><Btn to={path(4)}>Back to form</Btn><Btn kind="primary" disabled={!ok} onClick={() => go('/requests/REQ-1045')}>Approve & send request</Btn></div></Card>
    </>)}
  </Shell>);
}

export function Detail() {
  const r = requests.find(x => x.id === useParams().id) ?? requests[0]; const failed = r.status === 'Failed';
  return (<Shell>
    <Head title={r.id} sub={`Abay Trading PLC · ${r.branch} · ${r.sys} · ${r.type} request`} action={<StatusText s={r.status} />} />
    {failed ? <Alert tone="err" title="Sending paused. Your generated files are safe.">3 transient retries were exhausted and the Google authorization expired. Reconnect the mailbox, then explicitly resume. No provider message ID exists.</Alert>
      : <Alert tone="ok" title="Your provider accepted the email — not a certificate approval">Certificate review and issuance happen externally; no certificate has been issued in this workspace.</Alert>}
    <Stats items={[['Current status', r.status, 'Waiting on the external authority'], ['Sent at', failed ? 'Not sent' : '24 Oct 2026 · 10:12 EAT', 'Provider accepted'], ['Reminder threshold', '5 business days', 'Configurable waiting notification'], ['System ID', r.sys, r.branch]]} />
    <div className="grid gap-5 md:grid-cols-3">
      <Card className="md:col-span-2" title="Email delivery record" sub="Immutable submitted snapshot · Send attempt 1"><div className="grid grid-cols-2 gap-4">
        <Kv k="Provider" v="Google Workspace" /><Kv k="Provider message ID" v={failed ? 'None' : 'gmx-1048-20261024-101208'} /><Kv k="From / CC" v="finance@abaytrading.example" /><Kv k="Recipient / subject" v="ica@insa.gov.et / Certificate Request for E-Invoice" /></div></Card>
      <div className="space-y-5">
        <Card title="Activity timeline"><ol className="space-y-2 text-sm">{['Awaiting certificate', 'Sent · provider accepted', 'Send explicitly approved', 'Form ready', 'Key and CSR generated', 'Draft created'].map(t => <li key={t}>✓ {t}</li>)}</ol></Card>
        <Card><Insa /><p className="mt-3 text-xs text-slate-500">Certificate approval and issuance are not part of this release. Follow up with INSA using your request details.</p></Card>
      </div>
    </div>
    <Card className="mt-5" title="Request actions"><div className="flex flex-wrap gap-2">{failed && <Btn kind="primary">Reconnect Google mailbox</Btn>}<Btn>Resend…</Btn><Btn kind="danger">Cancel request…</Btn></div>
      <p className="mt-3 text-xs text-slate-500">Resend requires a reason and explicit confirmation and creates a new audited attempt. Cancel cannot recall an accepted email.</p></Card>
  </Shell>);
}

export function Notifications() {
  const [read, setRead] = useState(false);
  const items = [['⏰', 'INSA response is overdue', 'B0360155CC · Awaiting certificate since 15 Oct. The 5-business-day threshold has passed.', 'REQ-1047'], ['⚠', 'Reconnect your mailbox to recover', 'B0360155CB · Transient retries exhausted; OAuth authorization has expired.', 'REQ-1046'], ['✉', 'Request email accepted by provider', 'B0360155CA · Now awaiting the external authority. This is not certificate issuance.', 'REQ-1048'], ['⛔', 'CSR validation needs attention', 'B0360155CC · The CSR subject did not match the approved System ID.', 'REQ-1050'], ['📄', 'Your form is ready to review', 'B0360155CB · No email has been sent.', 'REQ-1049']];
  return (<Shell>
    <Head title="Notifications" sub="Actionable updates for your request preparation and delivery — not certificate approvals." action={<Btn onClick={() => setRead(true)}>Mark all as read</Btn>} />
    <div className="space-y-3">{items.map(([i, t, d, id]) => (
      <Card key={id}><div className="flex gap-3"><span className="text-xl">{i}</span><div><b className="text-slate-900">{t}{!read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand" />}</b><p className="text-sm text-slate-500">{d}</p><Link className="text-sm font-semibold text-navy hover:underline" to={`/requests/${id}`}>Open {id} →</Link></div></div></Card>))}</div>
  </Shell>);
}
