import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

// Human-friendly labels + display order for each column.
const FIELDS: { key: string; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "city", label: "City" },
  { key: "frequency", label: "Wears lip products" },
  { key: "products_used", label: "Products used" },
  { key: "spend", label: "Usual spend" },
  { key: "buy_places", label: "Buys from" },
  { key: "fav_brands", label: "Favourite brands" },
  { key: "lip_issues", label: "Lip issues" },
  { key: "protects_from_sun", label: "Protects from sun" },
  { key: "knew_sun_damage", label: "Knew about sun damage" },
  { key: "interest", label: "Interest (1-5)" },
  { key: "likelihood", label: "Likely to try" },
  { key: "wanted_products", label: "Would want" },
  { key: "pick_reasons", label: "Would pick it for" },
  { key: "barriers", label: "Barriers" },
  { key: "fair_price", label: "Fair price" },
  { key: "improve_wish", label: "Wishes / improvements" },
  { key: "contact", label: "Contact" },
];

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  return String(v);
}

export default async function AdminPage() {
  const authed = isValidSession(cookies().get(SESSION_COOKIE)?.value);

  if (!authed) {
    return <LoginForm />;
  }

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="admin">
      <div className="admin-bar">
        <div>
          <h1 className="admin-title">Survey responses</h1>
          <p className="admin-count">{data?.length ?? 0} total</p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="logout" type="submit">
            Log out
          </button>
        </form>
      </div>

      {error && <p className="notice error">Could not load responses: {error.message}</p>}

      {data && data.length === 0 && <p className="admin-empty">No submissions yet.</p>}

      <div className="admin-list">
        {data?.map((row, i) => (
          <div className="admin-card" key={row.id ?? i}>
            <div className="admin-card-head">
              <span className="admin-card-name">{row.name || "Anonymous"}</span>
              <span className="admin-card-date">
                {row.created_at ? new Date(row.created_at).toLocaleString() : ""}
              </span>
            </div>
            <dl className="admin-fields">
              {FIELDS.filter((f) => f.key !== "name").map((f) => (
                <div className="admin-field" key={f.key}>
                  <dt>{f.label}</dt>
                  <dd>{formatValue(row[f.key])}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </main>
  );
}
