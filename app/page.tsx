"use client";

import { useState } from "react";

/* ---------------------------------------------------------------------------
   Survey definition. Each question `id` maps to a column in the Supabase
   `submissions` table. To add/edit questions, just edit this array.
--------------------------------------------------------------------------- */

type Question =
  | { id: string; type: "text" | "textarea"; label: string; placeholder?: string; optional?: boolean }
  | { id: string; type: "radio"; label: string; options: string[]; optional?: boolean }
  | { id: string; type: "checkbox"; label: string; options: string[]; hint?: string; optional?: boolean }
  | { id: string; type: "scale"; label: string; min: number; max: number; minLabel: string; maxLabel: string };

type Section = { num: string; title: string; note?: { heading: string; body: string }; questions: Question[] };

const SECTIONS: Section[] = [
  {
    num: "01",
    title: "About you",
    questions: [
      { id: "name", type: "text", label: "Your name", placeholder: "First name is fine", optional: true },
      {
        id: "age",
        type: "radio",
        label: "Your age",
        options: ["Under 18", "18 to 24", "25 to 34", "35 to 44", "45 or older"],
      },
      { id: "city", type: "text", label: "Which city are you in?", placeholder: "e.g. Lahore", optional: true },
      {
        id: "frequency",
        type: "radio",
        label: "How often do you wear lip products?",
        options: ["Pretty much daily", "A few times a week", "Only on occasions", "Rarely or never"],
      },
    ],
  },
  {
    num: "02",
    title: "What you use now",
    questions: [
      {
        id: "products_used",
        type: "checkbox",
        label: "Which of these do you use?",
        hint: "pick any",
        options: [
          "Matte lipstick",
          "Creamy or satin lipstick",
          "Liquid lipstick",
          "Lip gloss",
          "Tinted lip balm",
          "Plain lip balm",
          "Lip liner",
          "Lip oil",
        ],
      },
      {
        id: "spend",
        type: "radio",
        label: "What do you usually spend on one lipstick or gloss?",
        options: ["Under Rs. 500", "Rs. 500 to 1,000", "Rs. 1,000 to 2,000", "Rs. 2,000 to 3,500", "Over Rs. 3,500"],
      },
      {
        id: "buy_places",
        type: "checkbox",
        label: "Where do you usually buy lip products?",
        hint: "pick any",
        options: [
          "Daraz",
          "Instagram shops",
          "Cosmetic stores (Imtiaz, Naheed, etc.)",
          "Bagallery or Just4Girls",
          "Brand outlets",
          "From abroad",
        ],
      },
      {
        id: "fav_brands",
        type: "text",
        label: "Which lip brands do you love right now?",
        placeholder: "e.g. Medora, Maybelline, Luscious...",
        optional: true,
      },
    ],
  },
  {
    num: "03",
    title: "Your lips & the sun",
    questions: [
      {
        id: "lip_issues",
        type: "checkbox",
        label: "Have you noticed any of these with your lips?",
        hint: "pick any",
        options: [
          "Dryness or chapping",
          "Darkening or pigmentation on or around the lips",
          "Lips looking darker after being out in the sun",
          "Color fading too fast",
          "Sensitivity",
          "None of these",
        ],
      },
      {
        id: "protects_from_sun",
        type: "radio",
        label: "Do you do anything to protect your lips from the sun?",
        options: ["Yes", "No", "Never thought about it"],
      },
      {
        id: "knew_sun_damage",
        type: "radio",
        label: "Did you know lips can get sun damage and darkening, like the rest of your skin?",
        options: ["Yes, I knew", "No, I didn't", "Not sure"],
      },
    ],
  },
  {
    num: "04",
    title: "A new idea",
    note: {
      heading: "The product",
      body: "A locally-made lip range — matte lipsticks, glosses, and tinted balms — that also has SPF to help shield your lips from the sun. Made for Pakistani skin tones, at an affordable price.",
    },
    questions: [
      {
        id: "interest",
        type: "scale",
        label: "How interesting is this to you?",
        min: 1,
        max: 5,
        minLabel: "Not interested",
        maxLabel: "Very interested",
      },
      {
        id: "likelihood",
        type: "radio",
        label: "If it existed at a fair price, how likely are you to try it?",
        options: ["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"],
      },
      {
        id: "wanted_products",
        type: "checkbox",
        label: "Which of these would you actually want?",
        hint: "pick any",
        options: [
          "Matte lipstick with SPF",
          "Lip gloss with SPF",
          "Tinted lip balm with SPF",
          "Clear lip balm with SPF",
          "None of these",
        ],
      },
      {
        id: "pick_reasons",
        type: "checkbox",
        label: "What would make you pick it over your current lip product?",
        hint: "pick any",
        options: [
          "Sun protection (SPF)",
          "Shades made for our skin tones",
          "Long-lasting",
          "Hydrating",
          "Affordable price",
          "Made in Pakistan",
          "Halal or clean ingredients",
          "Cruelty-free",
          "Nothing would",
        ],
      },
      {
        id: "barriers",
        type: "checkbox",
        label: "What might stop you from buying it?",
        hint: "pick any",
        options: [
          "I don't trust new brands",
          "I'd worry about the quality",
          "SPF isn't important to me",
          "Price",
          "I'm loyal to my current brand",
          "Worried it won't match my shade",
        ],
      },
    ],
  },
  {
    num: "05",
    title: "Price",
    questions: [
      {
        id: "fair_price",
        type: "radio",
        label: "For a good-quality local SPF lipstick or gloss, a fair price would be:",
        options: ["Under Rs. 700", "Rs. 700 to 1,200", "Rs. 1,200 to 1,800", "Rs. 1,800 to 2,500", "Over Rs. 2,500"],
      },
    ],
  },
  {
    num: "06",
    title: "Last bit",
    questions: [
      {
        id: "improve_wish",
        type: "textarea",
        label: "What do you wish your current lip products did better?",
        placeholder: "Anything that bugs you...",
        optional: true,
      },
      {
        id: "contact",
        type: "text",
        label: "Want to know if this launches? Drop your Instagram or email",
        placeholder: "@yourhandle or email",
        optional: true,
      },
    ],
  },
];

type Answers = Record<string, string | number | string[]>;

export default function SurveyPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function setValue(id: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckbox(id: string, option: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [id]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <main className="page">
        <div className="thanks">
          <h2>Thank you</h2>
          <p>Your answers were saved. Really appreciate your honesty.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">2 minute survey</p>
      <h1 className="title">Your lips, your honest take</h1>
      <p className="lede">
        I&apos;m exploring a new local lip brand and I&apos;d love a few real answers. There are no
        right or wrong ones, please just say what&apos;s true for you.
      </p>

      <form onSubmit={handleSubmit}>
        {SECTIONS.map((section) => (
          <section className="section" key={section.num}>
            <h2 className="section-head">
              <span className="section-dot">●</span>
              <span className="section-num">{section.num}</span>
              {section.title}
            </h2>

            {section.questions.map((q) => (
              <div className="card" key={q.id}>
                {/* product note appears before the first question of section 04 */}
                {section.note && q.id === section.questions[0].id && (
                  <div className="product">
                    <b>{section.note.heading}</b>
                    {section.note.body}
                  </div>
                )}

                <label className="q-label">
                  {q.label}
                  {"hint" in q && q.hint && <span className="q-hint">{q.hint}</span>}
                  {"optional" in q && q.optional && <span className="q-hint">optional</span>}
                </label>

                {q.type === "text" && (
                  <input
                    className="input"
                    type="text"
                    placeholder={q.placeholder}
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.type === "textarea" && (
                  <textarea
                    className="textarea"
                    placeholder={q.placeholder}
                    value={(answers[q.id] as string) || ""}
                    onChange={(e) => setValue(q.id, e.target.value)}
                  />
                )}

                {q.type === "radio" && (
                  <div className="options">
                    {q.options.map((opt) => (
                      <label className="option" key={opt}>
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === opt}
                          onChange={() => setValue(q.id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "checkbox" && (
                  <div className="options">
                    {q.options.map((opt) => (
                      <label className="option" key={opt}>
                        <input
                          type="checkbox"
                          checked={Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt)}
                          onChange={() => toggleCheckbox(q.id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "scale" && (
                  <>
                    <div className="scale">
                      {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((n) => (
                        <button
                          type="button"
                          key={n}
                          className={`scale-btn ${answers[q.id] === n ? "active" : ""}`}
                          onClick={() => setValue(q.id, n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className="scale-labels">
                      <span>{q.minLabel}</span>
                      <span>{q.maxLabel}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>
        ))}

        <button className="submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit my answers"}
        </button>

        {status === "error" && <p className="notice error">{errorMsg}</p>}
      </form>
    </main>
  );
}
