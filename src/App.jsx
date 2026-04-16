import { useEffect, useState } from "react";
import { Agentation } from "agentation";
import MovingHeader from "./MovingHeader.jsx";

const ACCENT = "#b8956a";

const DARK = {
  bg: "#0f0d0b",
  text: "#e8e3db",
  dim: "#8a8279",
  muted: "#5a5249",
  border: "rgba(232, 227, 219, 0.14)",
};

const LIGHT = {
  bg: "#f5f2ec",
  text: "#1a1814",
  dim: "#6b6359",
  muted: "#a8a093",
  border: "rgba(26, 24, 20, 0.12)",
};

const TABS = [
  { id: "building", label: "Building" },
  { id: "built", label: "Built" },
  { id: "someday", label: "Someday" },
  { id: "consuming", label: "Consuming" },
  { id: "interests", label: "Interests" },
];

const BUILDING = {
  "At Headway": [
    {
      title: "Clenge",
      role: "Engineering Manager",
      blurb: "Leading the CLient ENGagEment team behind the core tools 70k+ providers serving 2MM patients use daily — home, calendar, telehealth, messaging, and patient outcome measures.",
    },
    {
      title: "Eddy",
      role: "Individual contributor",
      blurb: (
        <>
          Building{" "}
          <a
            href="https://x.com/rnaud/status/2043755080516518342"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#B8956A", textDecoration: "underline" }}
          >
            Headway's own agent harness
          </a>
          {" "}— plugged into everything to help every team move faster towards making mental healthcare accessible for everyone.
        </>
      ),
    },
  ],
  "For Myself": [
    {
      title: "Crunchtime",
      role: "Commitment device app",
      blurb: "Started as a bet among friends to get a six-pack in a couple of months. Turned into an app that serves as a coordination and commitment device for us to push each other to be healthier.",
    },
    {
      title: "Fermentation Sleeve",
      role: "3d-printed ferment jar sleeves",
      blurb: "Modular, aesthetic 3d-printed sleeves for Weck 905 jars — designed for long ferments like miso and fish sauce.",
    },
  ],
};

const BUILT = {
  "In my career": [
    {
      title: "Lyft",
      role: "Location geocode snapping",
      blurb: "Led location geocode snapping at Lyft Business concierge — drove ~$1M+ in yearly margin by reducing wait times and improving ride profitability.",
    },
    {
      title: "Credit Karma",
      role: "Credit score refresh infra",
      blurb: "Led credit score refresh infra revamp that supported 100M+ members refreshes daily, built Identity Monitoring and Credit Lock from scratch, and started the Canadian internship program scaling from 0 to ~15 interns/quarter.",
    },
    {
      title: "The Coterie",
      role: "Server-driven UI",
      blurb: "Built our server-driven UI to decouple content from our iOS app releases.",
    },
    {
      title: "University of Waterloo",
      role: "ECE, Entrepreneurial option",
      blurb: "Won the GM Innovation Award for ModVR — a 3d modeling app built for VR (final year design project).",
    },
  ],
  "For Myself": [
    {
      title: "pupdash",
      role: "Puppy care dashboard",
      blurb: "A dashboard for logging and tracking our puppy Yuki's meds, meals, and daily routines — so my wife, our dog sitters, and I are always on the same page. User based, synced to cloud.",
    },
    {
      title: "Blackjack GTO",
      role: "Optimal-play guide",
      blurb: "Guides noobs to play 21 optimally — whipped up during casino night at a friend's, idea → design → implementation → deployment → live, entirely through my agent on my phone via Discord for orchestration.",
    },
    {
      title: "Memoryworthy",
      role: "Daily journaling app",
      blurb: "A daily journaling app inspired by Storyworthy by Matthew Dicks. Helps me pause and appreciate at least one moment of the day that is memoryworthy.",
    },
  ],
};

const SOMEDAY = [
  "This someday list, but more trackable",
  "Case studies for past projects",
  "Projection mapping art onto my ceramics",
  "Programmable wall piece with mechanical moving parts and a vision feedback loop",
  "Porcelain steamer basket shaped like a bamboo steamer",
  "AI sticker pack generator",
  "Beli but for dishes instead of restaurants",
  "A place to write and share my thoughts — and the content",
  "Memoryworthy redesign",
];

const CONSUMING = [
  { title: "Range Widely", author: "David Epstein", link: "https://davidepstein.substack.com/" },
  { title: "More To That", author: "Lawrence Yeo", link: "https://moretothat.com/" },
  { title: "Chinese Cooking Demystified", link: "https://www.youtube.com/@ChineseCookingDemystified" },
  { title: "The Skip", author: "Nikhyl Singhal", link: "https://theskip.substack.com/" },
  { title: "Alex Danco's Newsletter", author: "Alex Danco", link: "https://danco.substack.com/" },
  { title: "ChefSteps", link: "https://www.chefsteps.com/" },
  { title: "Wait But Why", author: "Tim Urban", link: "https://waitbutwhy.com" },
  { title: "A Knight of the Seven Kingdoms", author: "HBO", link: "https://www.imdb.com/title/tt27497448/" },
  { title: "Kurzgesagt", link: "https://www.youtube.com/@kurzgesagt" },
  { title: "Jules Cooking" },
  { title: "The Tim Ferriss Show", author: "Tim Ferriss", link: "https://tim.blog/podcast/" },
  { title: "Mark Rober", link: "https://www.youtube.com/@MarkRober" },
  { title: "Jujutsu Kaisen", link: "https://www.imdb.com/title/tt12343534/" },
  { title: "One Piece", link: "https://onepiece.fandom.com/wiki/One_Piece_Wiki" },
  { title: "Andrej Karpathy", link: "https://x.com/karpathy" },
  { title: "Thariq", link: "https://x.com/trq212" },
];

const INTERESTS = [
  { text: "ceramics" },
  { text: "agents" },
  { text: "yukipomsky", link: "https://www.instagram.com/yukipomsky/" },
  { text: "fermentation" },
  { text: "snowboarding" },
  { text: "3d printing" },
  { text: "hainanese chicken" },
  { text: "claude" },
  { text: "weightlifting" },
  { text: "kombucha" },
  { text: "digital art" },
  { text: "food science" },
  { text: "badminton" },
  { text: "poker" },
  { text: "fine dining" },
  { text: "street food" },
  { text: "foraging" },
  { text: "gaming" },
  { text: "cantonese soups" },
  { text: "uni" },
  { text: "pickles" },
];

function useIsMobile(breakpoint = 720) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const on = () => setM(window.innerWidth < breakpoint);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [breakpoint]);
  return m;
}

function Nav({ scrolled, active, onJump }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const bg = scrolled ? "rgba(245, 242, 236, 0.88)" : "transparent";
  const border = scrolled ? `1px solid ${LIGHT.border}` : "1px solid transparent";
  const textColor = scrolled ? LIGHT.text : DARK.text;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: bg,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: border,
          padding: "18px clamp(20px, 5vw, 56px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          color: textColor,
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            fontSize: 12,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            fontWeight: 500,
            color: "inherit",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
        >
          Matthew Tse
        </button>

        {scrolled && !isMobile && (
          <div style={{ display: "flex", gap: 32 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onJump(t.id)}
                className={"nav-link" + (active === t.id ? " active" : "")}
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: active === t.id ? ACCENT : LIGHT.dim,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {scrolled && isMobile && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            style={{ display: "flex", flexDirection: "column", gap: 5, padding: 4 }}
          >
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "transform 0.3s", transform: open ? "rotate(45deg) translate(3px,3px)" : "none" }} />
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "opacity 0.3s", opacity: open ? 0 : 1 }} />
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "transform 0.3s", transform: open ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
          </button>
        )}
      </nav>

      {scrolled && isMobile && (
        <div
          style={{
            position: "fixed",
            top: 58, left: 0, right: 0,
            zIndex: 99,
            background: "rgba(245, 242, 236, 0.97)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: open ? `1px solid ${LIGHT.border}` : "1px solid transparent",
            overflow: "hidden",
            maxHeight: open ? 420 : 0,
            transition: "max-height 0.35s ease, border-color 0.35s ease",
          }}
        >
          <div style={{ padding: "12px clamp(20px, 5vw, 56px) 20px", display: "flex", flexDirection: "column" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { onJump(t.id); setOpen(false); }}
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: active === t.id ? ACCENT : LIGHT.dim,
                  padding: "14px 0",
                  textAlign: "left",
                  borderLeft: active === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
                  paddingLeft: 12,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 640,
        background: DARK.bg,
        color: DARK.text,
        overflow: "hidden",
      }}
    >
      <MovingHeader />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(15,13,11,0.1) 0%, rgba(15,13,11,0.35) 55%, rgba(15,13,11,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 56px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "clamp(48px, 10vh, 96px)",
        }}
      >
        <div
          className="rise-in"
          style={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: ACCENT,
            fontWeight: 500,
            marginBottom: 28,
            animationDelay: "0.1s",
          }}
        >
          Matthew Tse — 2026
        </div>

        <h1
          className="rise-in"
          style={{
            fontSize: "clamp(44px, 9vw, 112px)",
            fontWeight: 500,
            margin: 0,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: DARK.text,
            maxWidth: 960,
            animationDelay: "0.25s",
          }}
        >
          Builder,<br />mostly.
        </h1>

        <div
          className="rise-in"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "clamp(24px, 5vw, 72px)",
            marginTop: "clamp(40px, 8vh, 72px)",
            animationDelay: "0.7s",
            alignItems: "start",
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.75,
              color: DARK.dim,
              fontWeight: 300,
              maxWidth: 360,
            }}
          >
            Hi, I'm Matt :)
            <br /><br />
            I like to build cool things, cook for friends and family, and tinker with whatever catches my attention next.
          </p>

          <InfoTable
            rows={[
              ["Role", "Engineering @ Headway"],
              ["Focus", "Family, friends, food, and then maybe agents"],
              ["Makes", "Apps, kombucha, dinners, 3d prints"],
            ]}
            theme={DARK}
          />
        </div>
      </div>
    </section>
  );
}

function InfoTable({ rows, theme }) {
  return (
    <div style={{ borderTop: `1px solid ${theme.border}` }}>
      {rows.map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr",
            padding: "14px 0",
            borderBottom: `1px solid ${theme.border}`,
            gap: 20,
            alignItems: "baseline",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.muted,
              fontWeight: 500,
            }}
          >
            {k}
          </div>
          <div
            style={{
              fontSize: 14,
              color: theme.text,
              fontWeight: 400,
              lineHeight: 1.55,
            }}
          >
            {v}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, theme }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: ACCENT,
          fontWeight: 500,
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ width: 24, height: 1, background: ACCENT }} />
        {eyebrow}
      </div>
      <h2
        style={{
          fontSize: "clamp(36px, 5.5vw, 64px)",
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          color: theme.text,
          textTransform: "uppercase",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function ProjectRow({ p, theme, last }) {
  const isMobile = useIsMobile(820);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(180px, 1fr) minmax(220px, 1fr) minmax(0, 2fr)",
        gap: isMobile ? 10 : 40,
        padding: isMobile ? "24px 0" : "28px 0",
        borderBottom: last ? "none" : `1px solid ${theme.border}`,
        alignItems: "baseline",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? 18 : 22,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          fontWeight: 500,
          color: theme.text,
        }}
      >
        {p.title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.dim,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 400,
        }}
      >
        {p.role}
      </div>
      <div
        style={{
          fontSize: 14,
          color: theme.dim,
          lineHeight: 1.7,
          fontWeight: 300,
          maxWidth: 540,
        }}
      >
        {p.blurb}
      </div>
    </div>
  );
}

function SubGroup({ label, items, theme }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: theme.muted,
          fontWeight: 500,
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {label}
      </div>
      {items.map((p, i) => (
        <ProjectRow key={p.title} p={p} theme={theme} last={i === items.length - 1} />
      ))}
    </div>
  );
}

function ProjectsSection({ id, eyebrow, title, groups, theme }) {
  return (
    <Section id={id} theme={theme}>
      <SectionHeader eyebrow={eyebrow} title={title} theme={theme} />
      {Object.entries(groups).map(([group, items]) => (
        <SubGroup key={group} label={group} items={items} theme={theme} />
      ))}
    </Section>
  );
}

function Section({ id, theme, children }) {
  return (
    <section
      id={id}
      style={{
        background: theme.bg,
        color: theme.text,
        padding: "clamp(96px, 14vh, 160px) clamp(20px, 5vw, 56px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SomedaySection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? SOMEDAY : SOMEDAY.slice(0, 5);
  const hasMore = SOMEDAY.length > 5;

  return (
    <Section id="someday" theme={LIGHT}>
      <SectionHeader eyebrow="Someday" title="What I want to build" theme={LIGHT} />
      <div style={{ position: "relative" }}>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            borderTop: `1px solid ${LIGHT.border}`,
          }}
        >
          {visible.map((item, i) => (
            <li
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                padding: "22px 0",
                borderBottom: `1px solid ${LIGHT.border}`,
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: ACCENT,
                  fontWeight: 500,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: LIGHT.text,
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
        {hasMore && !expanded && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 140,
              background: `linear-gradient(180deg, rgba(245, 242, 236, 0) 0%, ${LIGHT.bg} 85%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      {hasMore && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              fontSize: 11,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              fontWeight: 500,
              color: ACCENT,
              padding: "12px 20px",
              border: `1px solid ${ACCENT}`,
              background: "transparent",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = ACCENT;
            }}
          >
            {expanded ? "Show less" : `Show ${SOMEDAY.length - 5} more`}
          </button>
        </div>
      )}
    </Section>
  );
}

function ConsumingSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CONSUMING : CONSUMING.slice(0, 5);
  const hasMore = CONSUMING.length > 5;

  return (
    <Section id="consuming" theme={LIGHT}>
      <SectionHeader eyebrow="Consuming" title="How I spend my time rotting" theme={LIGHT} />
      <div style={{ position: "relative" }}>
        <div style={{ borderTop: `1px solid ${LIGHT.border}` }}>
          {visible.map((item, i) => {
            const inner = (
              <>
                <span style={{ fontSize: 15, color: LIGHT.text, fontWeight: 400 }}>{item.title}</span>
                {item.author && (
                  <span style={{ fontSize: 13, color: LIGHT.dim, fontWeight: 300, marginLeft: 10 }}>
                    — {item.author}
                  </span>
                )}
                {item.link && (
                  <span style={{ marginLeft: 10, color: LIGHT.muted, fontSize: 13 }}>↗</span>
                )}
              </>
            );
            const base = {
              display: "block",
              padding: "16px 0",
              borderBottom: `1px solid ${LIGHT.border}`,
              color: LIGHT.text,
            };
            return item.link ? (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link"
                style={base}
              >
                {inner}
              </a>
            ) : (
              <div key={i} style={base}>
                {inner}
              </div>
            );
          })}
        </div>
        {hasMore && !expanded && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 140,
              background: `linear-gradient(180deg, rgba(245, 242, 236, 0) 0%, ${LIGHT.bg} 85%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
      {hasMore && (
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              fontSize: 11,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              fontWeight: 500,
              color: ACCENT,
              padding: "12px 20px",
              border: `1px solid ${ACCENT}`,
              background: "transparent",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = ACCENT;
            }}
          >
            {expanded ? "Show less" : `Show ${CONSUMING.length - 5} more`}
          </button>
        </div>
      )}
    </Section>
  );
}

function InterestsSection() {
  const isMobile = useIsMobile(720);
  const cols = isMobile ? 2 : 4;

  return (
    <Section id="interests" theme={LIGHT}>
      <SectionHeader eyebrow="Interests" title="Things I adore" theme={LIGHT} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 12,
        }}
      >
        {INTERESTS.map((t, i) => {
          const styled = {
            padding: "16px 18px",
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: 0.2,
            textAlign: "center",
            cursor: t.link ? "pointer" : "default",
            border: `1px solid ${LIGHT.border}`,
            background: "transparent",
            color: LIGHT.text,
            textDecoration: "none",
            display: "block",
          };

          return t.link ? (
            <a key={i} href={t.link} target="_blank" rel="noopener noreferrer" className="tag" style={styled}>
              {t.text}
            </a>
          ) : (
            <div key={i} className="tag" style={styled}>
              {t.text}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: DARK.bg,
        color: DARK.text,
        padding: "clamp(56px, 10vh, 96px) clamp(20px, 5vw, 56px) 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: ACCENT,
              fontWeight: 500,
              marginBottom: 10,
            }}
          >
            Matthew Tse
          </div>
          <div style={{ fontSize: 12, color: DARK.muted, letterSpacing: 1, fontWeight: 300 }}>
            © 2026
          </div>
        </div>

        <div style={{ display: "flex", gap: 28 }}>
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/mcotse/" },
            { label: "Instagram", href: "https://www.instagram.com/yukipomsky/" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: DARK.dim,
                fontWeight: 500,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => (e.currentTarget.style.color = DARK.dim)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("building");

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setScrolled(window.scrollY > heroHeight);

      let current = "building";
      let bestTop = -Infinity;
      for (const t of TABS) {
        const el = document.getElementById(t.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 120 && top > bestTop) {
          bestTop = top;
          current = t.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div style={{ background: LIGHT.bg }}>
      <Nav scrolled={scrolled} active={active} onJump={jumpTo} />
      <Hero />
      <ProjectsSection
        id="building"
        eyebrow="Building"
        title="What I'm building"
        groups={BUILDING}
        theme={LIGHT}
      />
      <ProjectsSection
        id="built"
        eyebrow="Built"
        title="What I've built"
        groups={BUILT}
        theme={DARK}
      />
      <SomedaySection />
      <ConsumingSection />
      <InterestsSection />
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}
