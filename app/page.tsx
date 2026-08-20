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

function money(value: string) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDate(value: string) {
  if (!value) return "—"
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(date)
}

function ShipMark({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-label="UNIFET Shipping ship logo" role="img" className={small ? "size-12" : "size-24"}>
      <circle cx="50" cy="50" r="47" fill="#c62828" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".8" />
      <text x="50" y="19" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" letterSpacing="1">UNIFET</text>
      <text x="50" y="88" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="700" letterSpacing=".7">SHIPPING</text>
      <path d="M25 59h50l-8 9H34z" fill="#fff" />
      <path d="M38 56V37l13 19m0 0V31l13 25" fill="none" stroke="#fff" strokeWidth="2.2" />
      <path d="M32 73h36M38 77h24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 28l2 2m28-2-2 2M50 24v3" stroke="#f0b90b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TruckIllustration() {
  return (
    <svg viewBox="0 0 520 220" className="w-full max-w-[520px]" role="img" aria-label="Red UNIFET shipping truck illustration">
      <path d="M35 159h445" stroke="#c62828" strokeWidth="3" />
      <path d="M48 65h290v98H48z" fill="#c62828" />
      <path d="M338 105h75l51 45v13H338z" fill="#c62828" />
      <path d="M414 113h32l36 37h-68z" fill="#ef4444" />
      <path d="M422 120h22l24 24h-46z" fill="#dbeafe" />
      <path d="M52 76h282v13H52z" fill="#a51f25" />
      <path d="M68 103h252v40H68z" fill="#b52127" stroke="#ef6a6a" strokeWidth="1" />
      <text x="194" y="130" fill="#f0b90b" fontSize="29" textAnchor="middle" fontWeight="800" letterSpacing="3">UNIFET</text>
      <path d="M49 143h290v20H49z" fill="#941e23" />
      <path d="M338 143h77v20h-77z" fill="#9c2024" />
      <circle cx="120" cy="170" r="27" fill="#18212f" /><circle cx="120" cy="170" r="12" fill="#d9dee7" />
      <circle cx="412" cy="170" r="27" fill="#18212f" /><circle cx="412" cy="170" r="12" fill="#d9dee7" />
      <path d="M37 163h445" stroke="#667085" strokeWidth="4" />
      <path d="M338 99h-19V58h19zM353 104h10V72h-10z" fill="#c62828" />
      <path d="M72 91h90M179 91h90" stroke="#ef6a6a" strokeWidth="2" opacity=".8" />
      <path d="M35 158h18v-39H35z" fill="#a51f25" /><path d="M24 145h24v11H24z" fill="#f0b90b" />
    </svg>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-2 text-sm font-semibold text-secondary-foreground"><span>{label}</span>{children}</label>
}

function Invoice({ data }: { data: FormState }) {
  const security = money(data.securityFee)
  const delivery = money(data.deliveryFee)
  const base = 1850
  const grandTotal = base + security + delivery
  const metaDate = formatDate(data.invoiceDate)

  return (
    <article className="invoice-paper mx-auto w-full max-w-[980px] overflow-hidden border border-border bg-card text-card-foreground">
      <div className="flex flex-col gap-8 p-7 sm:p-10">
        <header className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-5">
            <ShipMark />
            <div><div className="text-4xl font-black tracking-tight text-primary">UNIFET</div><div className="text-sm font-bold tracking-[.32em] text-secondary-foreground">SHIPPING COMPANY</div><div className="mt-3 text-[10px] uppercase tracking-[.22em] text-muted-foreground">Reliable global freight solutions</div></div>
          </div>
          <div className="min-w-[260px] text-sm md:text-right">
            <div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary">Bill To:</div>
            <div className="whitespace-pre-line font-bold text-foreground">{data.billTo || "No recipient entered"}</div>
            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-left text-xs md:ml-auto md:w-fit"><span className="font-bold text-muted-foreground">Invoice #</span><span className="font-bold">{data.invoiceNumber || "—"}</span><span className="font-bold text-muted-foreground">Created</span><span>{metaDate}</span><span className="font-bold text-muted-foreground">Due Date</span><span>{formatDate(data.dueDate)}</span><span className="font-bold text-muted-foreground">Time</span><span>{data.time || "—"}</span></div>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="invoice-table w-full min-w-[680px] border-collapse"><thead><tr><th className="p-3 text-left">Invoice Date</th><th className="p-3 text-left">Meta</th><th className="p-3 text-right">Payment</th><th className="p-3 text-right">Total</th><th className="p-3 text-left">Description</th></tr></thead><tbody>
            <tr><td className="p-3">{metaDate}</td><td className="p-3">AWB</td><td className="p-3 text-right">$1,250.00</td><td className="p-3 text-right">$1,250.00</td><td className="p-3">Miami — Port handling and freight service</td></tr>
            <tr><td className="p-3"></td><td className="p-3">Price</td><td className="p-3 text-right">$600.00</td><td className="p-3 text-right">$600.00</td><td className="p-3">Bulk Tank cargo transport</td></tr>
            <tr><td className="p-3"></td><td className="p-3">Storage</td><td className="p-3 text-right">$0.00</td><td className="p-3 text-right">$0.00</td><td className="p-3">Storage and documentation</td></tr>
            <tr><td className="p-3"></td><td className="p-3">Destination</td><td className="p-3 text-right">$0.00</td><td className="p-3 text-right">$0.00</td><td className="p-3">Saudi Arabia</td></tr>
            <tr className="bg-[#fff8f8]"><td className="p-3"></td><td className="p-3 font-bold text-primary">Fee</td><td className="p-3 text-right font-bold text-primary">${security.toFixed(2)}</td><td className="p-3 text-right font-bold text-primary">${security.toFixed(2)}</td><td className="p-3">Security Fee</td></tr>
            <tr className="bg-[#fff8f8]"><td className="p-3"></td><td className="p-3 font-bold text-primary">Fee</td><td className="p-3 text-right font-bold text-primary">${delivery.toFixed(2)}</td><td className="p-3 text-right font-bold text-primary">${delivery.toFixed(2)}</td><td className="p-3">Delivery Fee</td></tr>
          </tbody></table>
        </div>

        <div className="flex flex-col items-center justify-between gap-8 border-t border-border pt-8 sm:flex-row sm:items-end">
          <div className="flex w-full flex-col items-center sm:items-start"><TruckIllustration /><div className="mt-2 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Moving your business forward</div></div>
          <div className="flex w-full max-w-[300px] flex-col gap-3"><div className="flex justify-between border-b border-border pb-2 text-sm"><span>Shipping subtotal</span><span>${base.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span>Security Fee</span><span>${security.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span>Delivery Fee</span><span>${delivery.toFixed(2)}</span></div><div className="flex justify-between border-t-2 border-primary pt-3 text-lg font-black text-primary"><span>Grand Total</span><span>${grandTotal.toFixed(2)}</span></div></div>
        </div>
        <footer className="flex items-end justify-between border-t border-border pt-6"><div><div className="font-serif text-3xl italic text-primary">Unifet</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-muted-foreground">Authorized signature</div></div><div className="flex items-center gap-3"><ShipMark small /><div className="hidden text-[10px] font-bold uppercase tracking-[.14em] text-primary sm:block">Paid &amp; verified<br />UNIFET SHIPPING</div></div></footer>
      </div>
    </article>
  )
}

export default function Home() {
  const [form, setForm] = useState<FormState>(defaults)
  const [invoice, setInvoice] = useState<FormState>(defaults)
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const total = useMemo(() => 1850 + money(form.securityFee) + money(form.deliveryFee), [form.securityFee, form.deliveryFee])

  return <main className="min-h-screen bg-background"><div className="no-print mx-auto max-w-[1180px] px-4 py-8 sm:px-8"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-primary">UNIFET / Operations</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Invoice generator</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Create a polished shipping invoice in seconds. Update the details, review the live document, then print or save it as a PDF.</p></div><div className="rounded-lg border border-border bg-card px-4 py-3 text-right shadow-sm"><div className="text-xs text-muted-foreground">Current total</div><div className="text-xl font-black text-primary">${total.toFixed(2)}</div></div></div><section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"><div className="grid gap-5 md:grid-cols-2"><FormField label="Bill To"><textarea value={form.billTo} onChange={(event) => update("billTo", event.target.value)} rows={4} className="resize-none rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none ring-primary focus:ring-2" /></FormField><div className="grid grid-cols-2 gap-4"><FormField label="Invoice date"><input type="date" value={form.invoiceDate} onChange={(event) => update("invoiceDate", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></FormField><FormField label="Time"><input type="time" value={form.time} onChange={(event) => update("time", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></FormField><FormField label="Due date"><input type="date" value={form.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></FormField><FormField label="Invoice number"><input value={form.invoiceNumber} onChange={(event) => update("invoiceNumber", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" /></FormField></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><FormField label="Security fee"><input type="number" min="0" step="0.01" value={form.securityFee} onChange={(event) => update("securityFee", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" /></FormField><FormField label="Delivery fee"><input type="number" min="0" step="0.01" value={form.deliveryFee} onChange={(event) => update("deliveryFee", event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" /></FormField></div><div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row"><button onClick={() => setInvoice(form)} className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Generate / Update Invoice</button><button onClick={() => window.print()} className="rounded-md border border-primary px-5 py-3 text-sm font-bold text-primary transition hover:bg-[#fff4f4] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Print / Save as PDF</button><button onClick={() => { setForm(defaults); setInvoice(defaults) }} className="rounded-md px-5 py-3 text-sm font-bold text-muted-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Reset Form</button></div></section></div><div className="print-area px-4 pb-12 sm:px-8"><Invoice data={invoice} /></div></main>
}
