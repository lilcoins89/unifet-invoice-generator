import { NextResponse } from "next/server"

export async function POST() {
  if (!process.env.BANNERBEAR_API_KEY || !process.env.BANNERBEAR_TEMPLATE_UID) {
    return NextResponse.json({ message: "Bannerbear is not configured. Use Print / Save PDF as the primary export." }, { status: 200 })
  }

  return NextResponse.json({ message: "Bannerbear export is configured but needs a template mapping before it can generate this invoice." }, { status: 501 })
}
