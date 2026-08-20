"use server"

import { db } from "../../lib/db"
import { invoiceHistory } from "../../lib/db/schema"
import { desc } from "drizzle-orm"

export type InvoicePayload = {
  billTo: string
  securityFee: string
  deliveryFee: string
  invoiceDate: string
  time: string
  dueDate: string
  invoiceNumber: string
}

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max)
}
function fee(value: unknown) {
  const n = Number.parseFloat(String(value ?? "0"))
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 99999999) : 0
}
function normalize(data: InvoicePayload) {
  const result = {
    billTo: clean(data.billTo), securityFee: fee(data.securityFee).toFixed(2), deliveryFee: fee(data.deliveryFee).toFixed(2),
    invoiceDate: clean(data.invoiceDate, 20), time: clean(data.time, 20), dueDate: clean(data.dueDate, 20), invoiceNumber: clean(data.invoiceNumber, 80),
  }
  if (!result.billTo || !result.invoiceNumber) throw new Error("Bill To and invoice number are required")
  return result
}

export async function listInvoices() {
  const rows = await db.select().from(invoiceHistory).orderBy(desc(invoiceHistory.createdAt)).limit(8)
  return rows.map((row) => ({ ...row, invoiceData: row.invoiceData as InvoicePayload, securityFee: Number(row.securityFee), deliveryFee: Number(row.deliveryFee), total: Number(row.total) }))
}

export async function saveInvoice(data: InvoicePayload) {
  const invoice = normalize(data)
  const total = 1850 + Number(invoice.securityFee) + Number(invoice.deliveryFee)
  const [row] = await db.insert(invoiceHistory).values({ invoiceNumber: invoice.invoiceNumber, billTo: invoice.billTo, invoiceDate: invoice.invoiceDate, invoiceTime: invoice.time, dueDate: invoice.dueDate, securityFee: invoice.securityFee, deliveryFee: invoice.deliveryFee, total: total.toFixed(2), invoiceData: invoice }).returning()
  return { ...row, invoiceData: invoice, total }
}
