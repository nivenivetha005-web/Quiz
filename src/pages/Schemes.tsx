import { useState } from "react";
import { Link } from "react-router-dom";
import { schemes } from "../data/schemes";
import { SCHEME_SECTOR_META, type SchemeSector } from "../types";

export default function Schemes() {
  const [sector, setSector] = useState<SchemeSector | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = sector === "all" ? schemes : schemes.filter((s) => s.sector === sector);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">India — Schemes, Missions & Initiatives</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Government Schemes</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Full name, purpose, ministry and visual identity for {schemes.length} major Indian initiatives — plus a dedicated "Identify the
        Initiative" recognition quiz.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/quiz/schemes" className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
          Identify the Initiative — quiz
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSector("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${sector === "all" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-line)] text-[var(--color-ink-soft)]"}`}
        >
          All sectors
        </button>
        {(Object.keys(SCHEME_SECTOR_META) as SchemeSector[]).map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${sector === s ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-line)] text-[var(--color-ink-soft)]"}`}
          >
            {SCHEME_SECTOR_META[s]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((s) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="rounded-2xl border border-[var(--color-line)] bg-white overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : s.id)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
                <div>
                  <p className="font-display font-semibold text-[var(--color-ink)]">
                    {s.shortName} <span className="text-xs font-normal text-[var(--color-ink-faint)]">({s.launchYear})</span>
                  </p>
                  <p className="text-xs text-[var(--color-ink-faint)] mt-0.5">{s.fullName}</p>
                </div>
                <span className="text-[var(--color-ink-faint)] text-sm shrink-0">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="border-t border-[var(--color-line)] p-4 pt-3 text-sm space-y-2 animate-fade">
                  <p><span className="font-medium text-[var(--color-ink)]">Ministry: </span><span className="text-[var(--color-ink-soft)]">{s.ministry}</span></p>
                  <p><span className="font-medium text-[var(--color-ink)]">Purpose: </span><span className="text-[var(--color-ink-soft)]">{s.purpose}</span></p>
                  <p><span className="font-medium text-[var(--color-ink)]">Beneficiaries: </span><span className="text-[var(--color-ink-soft)]">{s.beneficiaries}</span></p>
                  <p><span className="font-medium text-[var(--color-ink)]">Key feature: </span><span className="text-[var(--color-ink-soft)]">{s.keyFeature}</span></p>
                  <p><span className="font-medium text-[var(--color-ink)]">Why it matters: </span><span className="text-[var(--color-ink-soft)]">{s.whyItMatters}</span></p>
                  <p><span className="font-medium text-[var(--color-ink)]">Status: </span><span className="text-[var(--color-ink-soft)]">{s.status}</span></p>
                  {s.tagline && <p><span className="font-medium text-[var(--color-ink)]">Tagline: </span><span className="italic text-[var(--color-ink-soft)]">"{s.tagline}"</span></p>}
                  <div className="rounded-lg border border-dashed border-[var(--color-line)] bg-[var(--color-paper-dim)] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Visual identity</p>
                    <p className="mt-1 text-[var(--color-ink)]">{s.visualIdentity}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
