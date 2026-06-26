import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Allowed columns. Anything not in here is ignored, so the client can't write
// arbitrary fields into the table.
const TEXT_FIELDS = [
  "name",
  "age",
  "city",
  "frequency",
  "spend",
  "fav_brands",
  "protects_from_sun",
  "knew_sun_damage",
  "likelihood",
  "fair_price",
  "improve_wish",
  "contact",
] as const;

const ARRAY_FIELDS = [
  "products_used",
  "buy_places",
  "lip_issues",
  "wanted_products",
  "pick_reasons",
  "barriers",
] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Build a clean row containing only known columns and correct types.
  const row: Record<string, unknown> = {};

  for (const key of TEXT_FIELDS) {
    const v = body[key];
    if (typeof v === "string" && v.trim() !== "") row[key] = v.trim();
  }

  for (const key of ARRAY_FIELDS) {
    const v = body[key];
    if (Array.isArray(v)) {
      const clean = v.filter((x): x is string => typeof x === "string");
      if (clean.length) row[key] = clean;
    }
  }

  // interest is a 1..5 number
  const interest = body.interest;
  if (typeof interest === "number" && interest >= 1 && interest <= 5) {
    row.interest = interest;
  }

  // Require at least something so empty submissions are rejected.
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: "Please answer at least one question." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("submissions").insert(row);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json({ error: "Could not save your answers." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
