import { NavLink, Outlet } from "react-router-dom";
import { useProgress } from "../store/progress";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/learn", label: "Learn" },
  { to: "/visual", label: "Visual GK" },
  { to: "/current-affairs", label: "Current Affairs" },
  { to: "/schemes", label: "Schemes" },
  { to: "/mistakes", label: "My Mistakes" },
  { to: "/dashboard", label: "Progress" },
];

export default function Layout() {
  const streak = useProgress((s) => s.streakDays);
  const xp = useProgress((s) => s.xp);

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-paper)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-paper)]/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-ink)] font-display text-[var(--color-accent)] text-lg">
                N
              </span>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="font-display text-sm font-semibold tracking-tight text-[var(--color-ink)]">NID DAT 2027</span>
                <span className="text-[11px] text-[var(--color-ink-faint)]">Design GK Lab</span>
              </span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 text-sm scrollbar-thin overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 text-sm shrink-0">
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-[var(--color-paper-dim)] px-3 py-1 text-[var(--color-ink-soft)]">
                <span aria-hidden>🔥</span>
                <span className="font-medium tabular-nums">{streak}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[var(--color-accent)] font-medium">
                <span className="tabular-nums">{xp}</span>
                <span>XP</span>
              </div>
            </div>
          </div>
          <nav className="flex md:hidden gap-1 overflow-x-auto pb-2 scrollbar-thin text-sm -mx-1 px-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-colors ${
                    isActive ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "bg-[var(--color-paper-dim)] text-[var(--color-ink-soft)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-line)] py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-xs text-[var(--color-ink-faint)] flex flex-wrap items-center justify-between gap-2">
          <span>NID DAT 2027 — Design GK Lab. Built for recognition, connection and reasoning, not rote memorisation.</span>
          <span>Progress saved locally on this device.</span>
        </div>
      </footer>
    </div>
  );
}
