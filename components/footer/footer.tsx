import Link from "next/link";

const groups = [
  {
    title: "Explore",
    links: [
      ["Hotels", "/hotels"],
      ["Destinations", "/destinations"],
      ["Deals", "/deals"],
      ["Experiences", "/experiences"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Careers", "/careers"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Cancellation", "/cancellation"],
      ["Safety", "/safety"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Cookie Policy", "/cookies"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-booking py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)] font-black text-black">
                B
              </div>

              <span className="font-[var(--font-manrope)] text-xl font-extrabold">
                Booking<span className="text-[var(--gold-bright)]">LK</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Discover Sri Lanka with confidence.
              Find remarkable stays and unforgettable
              places wherever your journey takes you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold">
                  {group.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-[var(--muted)] transition hover:text-[var(--gold-bright)]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 BookingLK. All rights reserved.
          </p>

          <p>
            Discover Sri Lanka. Stay Your Way.
          </p>
        </div>
      </div>
    </footer>
  );
}