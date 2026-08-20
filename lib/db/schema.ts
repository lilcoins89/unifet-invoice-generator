import { bigint, jsonb, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const invoiceHistory = pgTable("invoice_history", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  invoiceNumber: text("invoice_number").notNull(),
  billTo: text("bill_to").notNull(),
  invoiceDate: text("invoice_date").notNull(),
  invoiceTime: text("invoice_time").notNull(),
  dueDate: text("due_date").notNull(),
  securityFee: numeric("security_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  deliveryFee: numeric("delivery_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  invoiceData: jsonb("invoice_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type InvoiceHistory = typeof invoiceHistory.$inferSelect
