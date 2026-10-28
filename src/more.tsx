import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { requests } from './data';
import { Alert, Btn, Card, Field, Head, Insa, Kv, Shell, StatusText, Table } from './ui';

const sel = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm';
const Check = ({ v, set, children }: { v: boolean; set: (b: boolean) => void; children: ReactNode }) => (
    <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={v} onChange={e => set(e.target.checked)} />{children}</label>);

export const Confirm = ({ title, warn, ack, label, danger, reason = true }: { title: string; warn: string; ack: string; label: string; danger?: boolean; reason?: boolean }) => {
    const [r, setR] = useState(''); const [c, setC] = useState(false); const [done, setDone] = useState(false);
    return (<Card title={title} sub="Confirmation panel · no action has been taken">
        <Alert tone="warn" title="Please confirm">{warn}</Alert>
        <div className="mt-3 space-y-3">
            {reason && <Field label="Reason *" value={r} onChange={e => setR(e.target.value)} placeholder="Enter a specific reason" />}
            <Check v={c} set={setC}>{ack}</Check>
            {done ? <Alert tone="ok" title="Recorded">Actor, reason, version and timestamp were added to the immutable audit log (demo).</Alert>
                : <Btn kind={danger ? 'danger' : 'primary'} disabled={(reason && !r.trim()) || !c} onClick={() => setDone(true)}>{label}</Btn>}
        </div></Card>);
};

export function AdminDetail() {
    const r = requests.find(x => x.id === useParams().id) ?? requests[0];
    return (<Shell admin>
        <Head eyebrow="OPERATIONS / INSA" title={`${r.id} · Request detail`} sub={`Abay Trading PLC · ${r.sys} · ${r.branch} · ${r.type} request`} action={<StatusText s={r.status} />} />
        <Alert tone="info" title="Read-only input snapshot · Access recorded">You are viewing the exact version submitted on 24 Oct 2026. Submitted input cannot be edited in place.</Alert>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="space-y-5 md:col-span-2">
                <Card title="Immutable input snapshot" sub="Snapshot v1 · Captured 24 Oct 2026, 10:03 EAT"><div className="grid grid-cols-2 gap-4">
                    <Kv k="Organization" v="Abay Trading PLC" /><Kv k="TIN" v="1234567890" /><Kv k="Organization address" v="Bole Road, Woreda 03, Addis Ababa" /><Kv k="Country / region" v="ET / Addis Ababa" />
                    <Kv k="Contact" v="Selam Tesfaye · +251 911 234 567" /><Kv k="Email" v="finance@abaytrading.example" /><Kv k="System ID" v={r.sys} /><Kv k="Custody consent" v="Accepted · Selam Tesfaye · 24 Oct 2026, 10:03 EAT" /></div></Card>
                <Card title="Versions & generation checks"><Table head={['Artifact', 'Version / reference', 'Check']} rows={[['Encrypted key', `key_${r.sys}_v1 · RSA 2048`, 'Passed'], ['CSR', 'v1 · Subject & signature verified', 'Passed'], ['Word / records PDF', 'v1 · Platform preview template v1', 'Passed'], ['Configuration / email', 'CNF v1 / email v1', 'Passed']].map(x => [x[0], x[1], <b className="text-emerald-700">{x[2]}</b>])} />
                    <p className="mt-3 break-all font-mono text-xs text-slate-500">CSR SHA-256 7F2A91BC440D8E73AA1650CE39EF82681803 4A9071CA2F5086 13A09BCC4267E1</p></Card>
                <Card title="Email delivery record" sub="Attempt 1 · Provider acceptance only"><div className="grid grid-cols-2 gap-4"><Kv k="Provider message ID" v="gmx-1048-20261024-101208" /><Kv k="Accepted" v="24 Oct 2026 · 10:12:08 EAT" /><Kv k="Sender / merchant CC" v="finance@abaytrading.example" /><Kv k="Recipient / subject" v="ica@insa.gov.et / Certificate Request for E-Invoice" /></div>
                    <div className="mt-3 flex flex-wrap gap-2"><Btn>Download request.docx</Btn><Btn>Download csr.pem</Btn></div></Card>
                <Card title="Failure & retry context"><p className="text-sm">A transient failure retries up to 3 times with exponential backoff. Expired OAuth pauses recovery until the mailbox is reconnected; CSR validation blockers cannot be retried as email.</p>
                    <div className="mt-3 flex gap-2"><Btn disabled>Retry delivery</Btn><Btn to="/admin/requests/REQ-1046">View related REQ-1046 →</Btn></div></Card>
            </div>
            <div className="space-y-5">
                <Confirm title="Resend request?" warn="Creates another email. The provider already accepted attempt 1." ack="I approve resending the current validated artifacts." label="Confirm resend" />
                <Confirm title="Cancel request?" warn="Stops future retries and sends. Accepted emails cannot be recalled." ack="I understand that accepted emails cannot be recalled." label="Confirm cancel" danger />
                <Card title="Immutable timeline"><ol className="space-y-2 text-sm">{['Admin access recorded', 'Awaiting certificate', 'Sent · provider accepted', 'Merchant approved send', 'Form ready', 'Key / CSR generated', 'Consent and snapshot', 'Request created'].map(t => <li key={t}>✓ {t}</li>)}</ol></Card>
            </div>
        </div>
    </Shell>);
}

const keys = [['key_B0360155CA_v1', 'B0360155CA', '24 Oct · 10:04', 'REQ-1048 · Awaiting'], ['key_B0360155CA_v2', 'B0360155CA', '24 Oct · 11:20', 'REQ-1051 · Renewal draft'], ['key_B0360155CB_v1', 'B0360155CB', '23 Oct · 14:30', 'REQ-1046 · Failed delivery'], ['key_B0360155CB_v2', 'B0360155CB', '24 Oct · 10:04', 'REQ-1049 · Form ready'], ['key_B0360155CC_v1', 'B0360155CC', '15 Oct · 09:10', 'REQ-1047 · Awaiting'], ['key_B0360155CC_v2', 'B0360155CC', '24 Oct · 10:04', 'REQ-1050 · CSR blocked']];
export function Keys() {
    const [i, setI] = useState(0); const k = keys[i];
    return (<Shell admin>
        <Head eyebrow="OPERATIONS / INSA" title="Key versions" sub="Manage encrypted key references and retention — never the private-key material itself." />
        <Alert tone="info" title="New requests never overwrite existing keys">Each System ID receives a separate versioned RSA key. Existing versions remain encrypted until an authorized administrator explicitly retires them. No private-key export is available.</Alert>
        <Card className="mt-5" title="Encrypted key inventory" sub="References and metadata only">
            <Table head={['Key reference', 'System ID', 'Size', 'Created', 'Linked request / status', 'Action']} rows={keys.map((x, n) => [<b className="text-slate-900">{x[0]}</b>, x[1], 'RSA 2048', x[2], x[3], <button className="font-semibold text-navy" onClick={() => setI(n)}>Inspect →</button>])} /></Card>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Card title="Selected key reference" right={<span className="text-xs">Retained</span>}><div className="grid grid-cols-2 gap-4"><Kv k="Reference" v={k[0]} /><Kv k="Algorithm" v="RSA 2048" /><Kv k="Linked request" v={k[3]} /><Kv k="Created" v={`${k[2]} EAT`} /><Kv k="Custody" v="Encrypted · YagoutPay-managed storage" /></div>
                <p className="mt-3 text-xs text-slate-500">A newer version does not retire an older one automatically. No plaintext key, master key material or credential can be viewed here.</p></Card>
            <Confirm key={k[0]} title={`Retire key ${k[0]}?`} warn={`Retirement makes this version unavailable for future platform use. ${k[3]} may still be waiting on INSA. It does not revoke an issued certificate or delete history.`} ack={`I have reviewed the impact and intend to retire ${k[0]} only.`} label="Confirm retirement" danger />
        </div>
    </Shell>);
}

export function Templates() {
    const [ok, setOk] = useState(false);
    const F = ({ l, v, h }: { l: string; v: string; h?: string }) => <Field label={l} defaultValue={v} hint={h} />;
    return (<Shell admin>
        <Head eyebrow="OPERATIONS / INSA" title="Templates & configuration" sub="Version-controlled generation and delivery policies. Updates apply to new generations, not historical submissions." />
        <Alert tone="info" title="Protected configuration surface">Only allowlisted substitutions are permitted in the CNF template. Fixed header constraints and generation directives cannot be replaced by merchant input. Master key material is never shown.</Alert>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="space-y-5 md:col-span-2">
                <Card title="Generation templates" sub="Uploads create a new immutable version after validation.">
                    <div className="space-y-3 text-sm"><div><b className="text-slate-900">request_config_v1.cnf</b><div className="text-xs text-slate-500">CNF v1 · Active</div><div className="mt-2 flex gap-2"><Btn>Upload CNF version</Btn><Btn>Validate template</Btn></div></div>
                        <div className="border-t border-slate-100 pt-3"><b className="text-slate-900">platform_request_preview_v1.docx</b><div className="text-xs text-slate-500">Word v1 · Platform preview template · not the official INSA form</div><div className="mt-2"><Btn>Upload Word template</Btn></div></div></div>
                    <div className="mt-3"><Alert tone="warn" title="Official template not supplied">Replace the preview with the verified official template when available.</Alert></div></Card>
                <Card title="Email template" sub="Template v1 · batch-configured subject and body wording"><div className="space-y-3">
                    <F l="Recipient *" v="ica@insa.gov.et" /><F l="Subject *" v="Certificate Request for E-Invoice" />
                    <label className="block text-sm"><span className="mb-1 block font-medium text-slate-900">Body *</span><textarea className={`${sel} h-40`} defaultValue={'Dear Admin,\n\nThis is a test certificate request for E-Invoice.\n\nPlease find attached:\nRequest Form; CSR File.\n\nRegards,\n{name},\n{organization},\n{contact}'} /><span className="text-xs text-slate-500">Allowed parameters: {'{name}'}, {'{organization}'}, {'{contact}'}.</span></label>
                    <Alert tone="warn" title="Test wording is intentional in this version">Merchants will see it exactly as configured. Changing it creates a new audited template version.</Alert></div></Card>
                <Card title="Output and attachment policy"><div className="grid grid-cols-2 gap-4"><F l="Request form attachment *" v="Word (.docx) · Default" /><F l="CSR output *" v="PEM (.pem)" /></div>
                    <p className="mt-3 text-xs text-slate-500">Emails contain exactly the Word request form and matching CSR PEM. A PDF records copy is generated but never attached. Private keys and config files are never attached.</p></Card>
            </div>
            <div className="space-y-5">
                <Card title="Cryptography & validation"><div className="space-y-3"><F l="RSA key size *" v="2048 bits" /><div className="grid grid-cols-2 gap-3"><F l="TIN length *" v="10" /><F l="System ID length *" v="10" /></div><p className="text-xs text-slate-500">Policy changes apply to new generations only.</p></div></Card>
                <Card title="Delivery & waiting"><div className="space-y-3"><F l="Maximum transient retries *" v="3" /><F l="Retry strategy *" v="Exponential backoff" /><F l="Awaiting-certificate alert *" v="5 business days" /></div></Card>
                <Card title="Batch policy"><Kv k="Submission mode" v="Independent submissions · Default" /><div className="mt-3"><Alert tone="warn" title="Batching pending confirmation">Do not enable multi-system email until INSA explicitly confirms support.</Alert></div></Card>
                <Card title="Update controls"><div className="space-y-3"><F l="Change reason *" v="" /><Check v={ok} set={setOk}>I reviewed template validation and the effect on future requests.</Check><Btn kind="primary" disabled={!ok}>Save new configuration version</Btn></div></Card>
            </div>
        </div>
        <Card className="mt-5" title="Version history & audit entries"><Table head={['Artifact / policy', 'Version', 'Updated · EAT', 'Actor', 'Audited change']} rows={[['CNF template', 'v1 · Active', '24 Oct 2026 · 09:00', 'Meron Kebede', 'Initial validated allowlist template'], ['Word template', 'v1 · Preview', '24 Oct 2026 · 09:04', 'Meron Kebede', 'Platform preview uploaded; official file pending'], ['Email template', 'v1 · Active', '24 Oct 2026 · 09:08', 'Meron Kebede', 'Configured test wording retained'], ['Generation / delivery policy', 'v1 · Active', '24 Oct 2026 · 09:12', 'Meron Kebede', 'RSA 2048 · retries 3 · wait 5 days']]} /></Card>
    </Shell>);
}

const ev = [['24 Oct · 11:06:12', 'ADM-07 · Super-admin', 'REQ-1048', 'ADMIN_ACCESS'], ['24 Oct · 10:18:00', 'MRC-01 · Merchant', 'REQ-1049', 'DOWNLOAD_PDF'], ['24 Oct · 10:12:09', 'SYS · Platform', 'REQ-1048', 'AWAITING_CERTIFICATE'], ['24 Oct · 10:12:08', 'MRC-01 · Merchant', 'REQ-1048', 'SEND · accepted'], ['24 Oct · 10:05:00', 'SYS · Platform', 'REQ-1049', 'FORM_READY'], ['24 Oct · 10:04:32', 'SYS · Platform', 'REQ-1048', 'CSR_GENERATED'], ['24 Oct · 10:04:16', 'SYS · Platform', 'REQ-1048', 'KEY_GENERATED'], ['24 Oct · 10:03:12', 'MRC-01 · Merchant', 'REQ-1048', 'CONSENT_ACCEPTED'], ['24 Oct · 10:02:41', 'MRC-01 · Merchant', 'REQ-1048', 'EDIT · draft input'], ['24 Oct · 10:02:00', 'MRC-01 · Merchant', 'REQ-1048', 'CREATE'], ['22 Oct · 11:30:00', 'MRC-01 · Merchant', 'REQ-1045', 'RESEND · approved'], ['21 Oct · 16:12:00', 'MRC-01 · Merchant', 'REQ-1044', 'CANCEL']];
export function Audit() {
    const [a, setA] = useState(''); const [q, setQ] = useState(''); const [i, setI] = useState(0);
    const rows = ev.filter(e => (!a || e[3] === a) && e[2].toLowerCase().includes(q.toLowerCase())); const e = rows[i] ?? rows[0];
    return (<Shell admin>
        <Head eyebrow="OPERATIONS / INSA" title="Immutable audit log" sub="Read-only operational evidence for creation, generation, sends, delivery, access and artifact downloads." action={<Btn>Export audit records</Btn>} />
        <Alert tone="ok" title="Append-only · Integrity verified">Events cannot be edited or deleted from this console. Audit details exclude personal field values, private keys, tokens and secrets.</Alert>
        <Card className="mt-5" title="Audit events" sub="All times EAT · illustrative lifecycle events">
            <div className="mb-4 grid gap-3 md:grid-cols-2"><input aria-label="Request ID" className={sel} placeholder="Filter by request ID…" value={q} onChange={x => { setQ(x.target.value); setI(0); }} />
                <select aria-label="Action" className={sel} value={a} onChange={x => { setA(x.target.value); setI(0); }}><option value="">All actions</option>{ev.map(x => x[3]).map(x => <option key={x}>{x}</option>)}</select></div>
            <Table head={['Timestamp · EAT', 'Actor / role', 'Request ID', 'Action', 'Integrity', 'Detail']} rows={rows.map((x, n) => [x[0], x[1], x[2], <code className="text-xs">{x[3]}</code>, <b className="text-emerald-700">Verified</b>, <button className="font-semibold text-navy" onClick={() => setI(n)}>View event →</button>])} />
            <p className="mt-3 text-xs text-slate-500">Showing {rows.length} of {ev.length} events</p></Card>
        {e && <div className="mt-5 grid gap-5 md:grid-cols-3"><Card className="md:col-span-2" title={`Event detail · ${e[3]}`} sub="Selected event · immutable"><div className="grid grid-cols-2 gap-4"><Kv k="Event reference" v="EVT-20261024-0006" /><Kv k="Actor" v={e[1]} /><Kv k="Request" v={e[2]} /><Kv k="Timestamp" v={`${e[0]} EAT`} /><Kv k="Data minimized" v="Scope only; no personal field values, keys or credentials in this payload." /></div></Card>
            <Card title="Integrity evidence" right={<span className="text-xs">Read-only</span>}><Kv k="Event chain" v="Linked · Verified" /><div className="mt-3"><Kv k="Hash" v={<code className="break-all text-xs">3AC9B2F77D6D8854E2BA7907DA4C52E7894271A</code>} /></div></Card></div>}
    </Shell>);
}

export function Renew() {
    const go = useNavigate(); const [type, setType] = useState('Renewal'); const [reuse, setReuse] = useState(true); const [reason, setReason] = useState('Prepare a new certificate request using the current merchant details.');
    return (<Shell>
        <Head title="Renew or reissue a request" sub="Create a fresh request from an existing snapshot. Existing keys are never overwritten." />
        <Alert tone="info" title="Request type is internal metadata">Renewal or reissue is tracked by YagoutPay only; it is not added to the official request form. All normal generation and explicit email approval steps still apply.</Alert>
        <div className="mt-5 grid gap-5 md:grid-cols-3"><div className="space-y-5 md:col-span-2">
            <Card title="Choose a starting point"><div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm"><span className="mb-1 block font-medium text-slate-900">Request type *</span><select className={sel} value={type} onChange={e => setType(e.target.value)}><option>Renewal</option><option>Reissue</option></select></label>
                <label className="block text-sm"><span className="mb-1 block font-medium text-slate-900">Reuse request snapshot *</span><select className={sel}>{requests.slice(0, 4).map(r => <option key={r.id}>{r.id} · {r.sys}</option>)}</select></label></div>
                <div className="mt-4 space-y-4"><Field label="System ID / establishment" defaultValue="B0360155CA · Head office" /><Field label="Reason *" value={reason} onChange={e => setReason(e.target.value)} hint="For a replacement request, select Reissue and record the reason. Neither option asserts that INSA has issued a certificate." /></div></Card>
            <Card title="Reused merchant information" right={<span className="text-xs text-amber-700">Review required</span>}><div className="grid grid-cols-2 gap-4"><Kv k="Organization / TIN" v="Abay Trading PLC / 1234567890" /><Kv k="Contact" v="Selam Tesfaye" /><Kv k="Email / telephone" v="finance@abaytrading.example / +251 911 234 567" /><Kv k="Country / region / locality" v="ET / Addis Ababa / Addis Ababa" /></div>
                <div className="mt-3"><Check v={reuse} set={setReuse}><span className="font-medium text-slate-900">Reuse these details in draft REQ-1051</span></Check></div></Card>
            <Card title="New key version, separate history"><Table head={['Key reference', 'Version', 'Purpose', 'Retention']} rows={[['key_B0360155CA_v1', 'v1', 'Linked to REQ-1048', <b>Retained</b>], ['key_B0360155CA_v2', 'v2 · planned', 'New draft REQ-1051', 'Created after consent']]} />
                <p className="mt-3 text-xs text-slate-500">The existing v1 key stays in encrypted custody until an authorized administrator explicitly retires it.</p></Card></div>
            <div className="space-y-5"><Card title="Available in this release"><p className="text-sm">Reuse a snapshot, select Renewal or Reissue, generate a new key version, and send after explicit review.</p><p className="mt-3 text-xs text-slate-500"><b>Not available yet:</b> issued-certificate storage, expiry tracking and expiry reminders (follow-up release).</p></Card>
                <Alert tone="warn" title="Consent required again">Continue to system selection and explicitly authorize encrypted key custody for the new version before generation.</Alert></div></div>
        <div className="mt-6 flex justify-between"><Btn to="/requests">Back</Btn><div className="flex gap-2"><Btn>Save draft</Btn><Btn kind="primary" disabled={!reuse || !reason.trim()} onClick={() => go('/requests/new/2')}>→ Create {type.toLowerCase()} draft</Btn></div></div>
    </Shell>);
}

export function Settings() {
    const [tab, setTab] = useState('Mailbox'); const [revoke, setRevoke] = useState(false);
    return (<Shell>
        <Head title="Mailbox & settings" sub="Manage your send-only connection and review the merchant profile used to prefill requests." />
        <div className="mb-5 flex gap-2">{['Mailbox', 'Merchant profile', 'Request preferences'].map(t => <Btn key={t} kind={t === tab ? 'primary' : 'plain'} onClick={() => setTab(t)}>{t}</Btn>)}</div>
        {tab === 'Mailbox' && <div className="grid gap-5 md:grid-cols-3"><div className="space-y-5 md:col-span-2">
            <Card title="Google Workspace mailbox" right={<span className="text-xs text-emerald-700">Connected</span>}><div className="grid grid-cols-2 gap-4"><Kv k="Connected account" v="finance@abaytrading.example" /><Kv k="Connected by" v="Selam Tesfaye" /><Kv k="Connected on" v="24 Oct 2026 · 10:06 EAT" /><Kv k="Access scope" v="Send email only · No inbox reading requested" /></div>
                <div className="mt-3 flex gap-2"><Btn>Reconnect mailbox</Btn><Btn kind="danger" onClick={() => setRevoke(true)}>Revoke connection…</Btn></div></Card>
            {revoke && <Confirm reason={false} title="Revoke mailbox connection?" warn="Future sending will stop. Unsent requests and retries using this mailbox will pause. Accepted messages cannot be recalled." ack="I understand that future sends from this mailbox will stop." label="Confirm revoke" danger />}
            <Card title="Platform sender fallback"><div className="grid grid-cols-2 gap-4"><Kv k="From" v="E-Receipt <requests@yagoutpay.example>" /><Kv k="Reply-To / merchant CC" v="finance@abaytrading.example" /></div>
                <p className="mt-3 text-xs text-slate-500">An explicit alternative when no mailbox is available. It never spoofs your merchant From address and still requires approval for each request.</p></Card></div>
            <MerchantCard /></div>}
        {tab === 'Merchant profile' && <MerchantCard />}
        {tab === 'Request preferences' && <Card title="Request preferences" sub="Managed by YagoutPay super-admin"><div className="grid grid-cols-2 gap-4"><Kv k="Submission mode" v="One submission per System ID" /><Kv k="Attachment format" v="Word (.docx) + CSR PEM" /><Kv k="Waiting alert" v="5 business days" /><Kv k="Key size" v="RSA 2048" /></div></Card>}
        <div className="mt-5 text-sm text-slate-500"><Link className="font-semibold text-navy" to="/requests">← Back to all requests</Link></div>
    </Shell>);
}
const MerchantCard = () => (<div className="space-y-5"><Card title="Merchant profile" right={<span className="text-xs text-emerald-700">Approved</span>}><div className="space-y-3">
    <Kv k="Registered organization" v="Abay Trading PLC" /><Kv k="TIN" v="1234567890" /><Kv k="Contact" v="Selam Tesfaye" /><Kv k="Email" v="finance@abaytrading.example" /><Kv k="Telephone" v="+251 911 234 567" /><Kv k="Address" v="Bole Road, Woreda 03, Addis Ababa" /></div></Card>
    <Alert tone="info" title="Request snapshots stay unchanged">Profile changes only prefill future drafts. Submitted requests keep their exact original snapshot and version history.</Alert><Card><Insa /></Card></div>);
