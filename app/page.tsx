"use client"

import { useMemo, useState } from "react"

type FormState = {
  billTo: string
  securityFee: string
  deliveryFee: string
  invoiceDate: string
  time: string
  dueDate: string
  invoiceNumber: string
}

const defaults: FormState = {
  billTo: "NEXA FREIGHT LLC\n1450 NW 87th Avenue\nMiami, FL 33172",
  securityFee: "31.00",
  deliveryFee: "5.00",
  invoiceDate: "2026-05-18",
  time: "10:30",
  dueDate: "2026-05-21",
  invoiceNumber: "AWB18534781",
}

const BASE_TOTAL = 1850
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function amount(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function formatDate(value: string) {
  if (!value) return "—"
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(date)
}

function ShipMark({ small = false }: { small?: boolean }) {
  return <svg viewBox="0 0 100 100" aria-label="UNIFET Shipping logo" role="img" className={small ? "size-12" : "size-24"}><circle cx="50" cy="50" r="47" fill="#c62828" /><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".8" /><text x="50" y="19" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" letterSpacing="1">UNIFET</text><text x="50" y="88" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="700" letterSpacing=".7">SHIPPING</text><path d="M25 59h50l-8 9H34z" fill="#fff" /><path d="M38 56V37l13 19m0 0V31l13 25" fill="none" stroke="#fff" strokeWidth="2.2" /><path d="M32 73h36M38 77h24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><path d="M34 28l2 2m28-2-2 2M50 24v3" stroke="#f0b90b" strokeWidth="2" strokeLinecap="round" /></svg>
}

function TruckIllustration() {
  return <svg viewBox="0 0 520 220" className="w-full max-w-[520px]" role="img" aria-label="UNIFET shipping truck"><path d="M35 159h445" stroke="#c62828" strokeWidth="3" /><path d="M48 65h290v98H48z" fill="#c62828" /><path d="M338 105h75l51 45v13H338z" fill="#c62828" /><path d="M414 113h32l36 37h-68z" fill="#ef4444" /><path d="M422 120h22l24 24h-46z" fill="#dbeafe" /><path d="M52 76h282v13H52z" fill="#a51f25" /><path d="M68 103h252v40H68z" fill="#b52127" stroke="#ef6a6a" strokeWidth="1" /><text x="194" y="130" fill="#f0b90b" fontSize="29" textAnchor="middle" fontWeight="800" letterSpacing="3">UNIFET</text><path d="M49 143h290v20H49z" fill="#941e23" /><path d="M338 143h77v20h-77z" fill="#9c2024" /><circle cx="120" cy="170" r="27" fill="#18212f" /><circle cx="120" cy="170" r="12" fill="#d9dee7" /><circle cx="412" cy="170" r="27" fill="#18212f" /><circle cx="412" cy="170" r="12" fill="#d9dee7" /><path d="M37 163h445" stroke="#667085" strokeWidth="4" /></svg>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-2 text-sm font-semibold text-secondary-foreground"><span>{label}</span>{children}{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</label>
}

function Invoice({ data }: { data: FormState }) {
  const security = amount(data.securityFee)
  const delivery = amount(data.deliveryFee)
  const total = BASE_TOTAL + security + delivery
  return <article className="invoice-paper mx-auto w-full max-w-[980px] overflow-hidden border border-border bg-card text-card-foreground"><div className="flex flex-col gap-8 p-7 sm:p-10"><header className="flex flex-col justify-between gap-8 md:flex-row"><div className="flex items-center gap-5"><ShipMark /><div><div className="text-4xl font-black tracking-tight text-primary">UNIFET</div><div className="text-sm font-bold tracking-[.32em] text-secondary-foreground">SHIPPING COMPANY</div><div className="mt-3 text-[10px] uppercase tracking-[.22em] text-muted-foreground">Reliable global freight solutions</div></div></div><div className="min-w-[260px] text-sm md:text-right"><div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary">Bill To:</div><div className="whitespace-pre-line font-bold text-foreground">{data.billTo || "No recipient entered"}</div><div className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-left text-xs md:ml-auto md:w-fit"><span className="font-bold text-muted-foreground">Invoice #</span><span className="font-bold">{data.invoiceNumber || "—"}</span><span className="font-bold text-muted-foreground">Created</span><span>{formatDate(data.invoiceDate)}</span><span className="font-bold text-muted-foreground">Due Date</span><span>{formatDate(data.dueDate)}</span><span className="font-bold text-muted-foreground">Time</span><span>{data.time || "—"}</span></div></div></header><div className="overflow-x-auto"><table className="invoice-table w-full min-w-[680px] border-collapse"><thead><tr><th className="p-3 text-left">Invoice Date</th><th className="p-3 text-left">Meta</th><th className="p-3 text-right">Payment</th><th className="p-3 text-right">Total</th><th className="p-3 text-left">Description</th></tr></thead><tbody>{[["AWB",1250,"Miami — Port handling and freight service"],["Price",600,"Bulk Tank cargo transport"],["Storage",0,"Storage and documentation"],["Destination",0,"Saudi Arabia"],["Fee",security,"Security Fee"],["Fee",delivery,"Delivery Fee"]].map(([meta, value, description], index) => <tr key={`${meta}-${index}`} className={meta === "Fee" ? "bg-[#fff8f8]" : ""}><td className="p-3">{index === 0 ? formatDate(data.invoiceDate) : ""}</td><td className={meta === "Fee" ? "p-3 font-bold text-primary" : "p-3"}>{meta}</td><td className={meta === "Fee" ? "p-3 text-right font-bold text-primary" : "p-3 text-right"}>{currency.format(Number(value))}</td><td className={meta === "Fee" ? "p-3 text-right font-bold text-primary" : "p-3 text-right"}>{currency.format(Number(value))}</td><td className="p-3">{description}</td></tr>)}</tbody></table></div><div className="flex flex-col items-center justify-between gap-8 border-t border-border pt-8 sm:flex-row sm:items-end"><div className="flex w-full flex-col items-center sm:items-start"><TruckIllustration /><div className="mt-2 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Moving your business forward</div></div><div className="flex w-full max-w-[300px] flex-col gap-3"><div className="flex justify-between border-b border-border pb-2 text-sm"><span>Shipping subtotal</span><span>{currency.format(BASE_TOTAL)}</span></div><div className="flex justify-between text-sm"><span>Security Fee</span><span>{currency.format(security)}</span></div><div className="flex justify-between text-sm"><span>Delivery Fee</span><span>{currency.format(delivery)}</span></div><div className="flex justify-between border-t-2 border-primary pt-3 text-lg font-black text-primary"><span>Grand Total</span><span>{currency.format(total)}</span></div></div></div><footer className="flex items-end justify-between border-t border-border pt-6"><div><div className="font-serif text-3xl italic text-primary">Unifet</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-muted-foreground">Authorized signature</div></div><div className="flex items-center gap-3"><ShipMark small /><div className="hidden text-[10px] font-bold uppercase tracking-[.14em] text-primary sm:block">Paid &amp; verified<br />UNIFET SHIPPING</div></div></footer></div></article>
}

export default function Home() {
  const [form, setForm] = useState<FormState>(defaults)
  const [invoice, setInvoice] = useState<FormState>(defaults)
  const [bannerbearStatus, setBannerbearStatus] = useState("Optional export")
  const total = useMemo(() => BASE_TOTAL + amount(form.securityFee) + amount(form.deliveryFee), [form.securityFee, form.deliveryFee])
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const reset = () => { if (window.confirm("Reset the invoice form to the default details?")) { setForm(defaults); setInvoice(defaults) } }
  async function exportBannerbear() { setBannerbearStatus("Preparing export…"); const response = await fetch("/api/bannerbear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(invoice) }); const result = await response.json(); setBannerbearStatus(result.message || (response.ok ? "Export ready" : "Export unavailable")); if (result.url) window.open(result.url, "_blank", "noopener,noreferrer") }
  return <main className="min-h-screen bg-background"><div className="no-print mx-auto max-w-[1180px] px-4 py-8 sm:px-8"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-primary">UNIFET / Operations</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Invoice generator</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Create, review, and export a polished shipping invoice. Your total updates as you edit each charge.</p></div><div className="rounded-lg border border-border bg-card px-4 py-3 text-right shadow-sm"><div className="text-xs text-muted-foreground">Total amount</div><div className="text-xl font-black text-primary">{currency.format(total)}</div></div></div><section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"><div className="grid gap-5 md:grid-cols-2"><Field label="Bill To"><textarea aria-label="Bill To" value={form.billTo} onChange={(event) => update("billTo", event.target.value)} rows={4} className="resize-none rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-primary focus:ring-2" /></Field><div className="grid grid-cols-2 gap-4"><Field label="Invoice date"><input aria-label="Invoice date" type="date" value={form.invoiceDate} onChange={(event) => update("invoiceDate", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field><Field label="Time"><input aria-label="Time" type="time" value={form.time} onChange={(event) => update("time", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field><Field label="Due date"><input aria-label="Due date" type="date" value={form.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field><Field label="Invoice number"><input aria-label="Invoice number" value={form.invoiceNumber} onChange={(event) => update("invoiceNumber", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field></div><Field label="Security fee" hint="Use 0 if no security charge applies."><input aria-label="Security fee" min="0" step="0.01" inputMode="decimal" type="number" value={form.securityFee} onChange={(event) => update("securityFee", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field><Field label="Delivery fee"><input aria-label="Delivery fee" min="0" step="0.01" inputMode="decimal" type="number" value={form.deliveryFee} onChange={(event) => update("deliveryFee", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></Field><Field label="Total amount" hint="Automatically calculated from the shipping subtotal and fees."><input aria-label="Total amount" readOnly value={currency.format(total)} className="cursor-not-allowed rounded-md border border-primary/30 bg-muted px-3 py-2 text-sm font-bold text-primary outline-none" /></Field></div><div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5"><button type="button" onClick={() => setInvoice(form)} className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90">Generate / Update Invoice</button><button type="button" onClick={() => window.print()} className="rounded-md border border-border bg-secondary px-5 py-3 text-sm font-bold text-secondary-foreground transition hover:bg-muted">Print / Save PDF</button><button type="button" onClick={exportBannerbear} className="rounded-md border border-border bg-background px-5 py-3 text-sm font-bold text-secondary-foreground transition hover:bg-muted">Optional image export</button><button type="button" onClick={reset} className="rounded-md px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">Reset</button><span className="text-xs text-muted-foreground" role="status">{bannerbearStatus}</span></div></section></div><div className="print-area px-4 pb-10 sm:px-8"><Invoice data={invoice} /></div></main>
}
