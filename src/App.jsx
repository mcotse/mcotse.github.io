import { useEffect, useRef, useState } from "react";
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
  { id: "home", label: "Home" },
  { id: "building", label: "Building" },
  { id: "built", label: "Built" },
  { id: "someday", label: "Someday" },
  { id: "consuming", label: "Consuming" },
  { id: "interests", label: "Interests" },
];

const TAB_IDS = TABS.map((t) => t.id);

const THEMES = {
  home: "dark",
  building: "light",
  built: "dark",
  someday: "light",
  consuming: "light",
  interests: "light",
};

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
            style={{ color: ACCENT, textDecoration: "underline" }}
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

function readHash() {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "");
  return TAB_IDS.includes(h) ? h : "home";
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useIsMobile(breakpoint = 720) {
  const [m, setM] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const on = () => setM(window.innerWidth < breakpoint);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [breakpoint]);
  return m;
}

function Nav({ active, hidden, onJump }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: "var(--nav-bg)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          borderBottom: "1px solid var(--border)",
          height: isMobile ? 56 : 64,
          padding: "0 clamp(20px, 5vw, 56px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "var(--text)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 280ms cubic-bezier(0.4, 0, 0.2, 1), background-color 500ms cubic-bezier(0.4, 0, 0.2, 1), color 500ms cubic-bezier(0.4, 0, 0.2, 1), border-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <button
          onClick={() => { onJump("home"); setOpen(false); }}
          className="brand-link"
          style={{
            fontSize: 12,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Matthew Tse
        </button>

        {!isMobile && (
          <div style={{ display: "flex", gap: 32 }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onJump(tab.id)}
                className={"nav-link" + (active === tab.id ? " active" : "")}
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            style={{ display: "flex", flexDirection: "column", gap: 5, padding: 4, color: "var(--text)" }}
          >
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "transform 0.3s", transform: open ? "rotate(45deg) translate(3px,3px)" : "none" }} />
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "opacity 0.3s", opacity: open ? 0 : 1 }} />
            <span style={{ width: 22, height: 1.5, background: "currentColor", transition: "transform 0.3s", transform: open ? "rotate(-45deg) translate(3px,-3px)" : "none" }} />
          </button>
        )}
      </nav>

      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 56, left: 0, right: 0,
            zIndex: 99,
            background: "var(--nav-bg)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            borderBottom: open ? "1px solid var(--border)" : "1px solid transparent",
            overflow: "hidden",
            maxHeight: open ? 420 : 0,
            transform: hidden ? "translateY(-120%)" : "translateY(0)",
            transition:
              "max-height 0.35s ease, border-color 0.35s ease, transform 280ms cubic-bezier(0.4, 0, 0.2, 1), background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={{ padding: "12px clamp(20px, 5vw, 56px) 20px", display: "flex", flexDirection: "column" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onJump(tab.id); setOpen(false); }}
                style={{
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: active === tab.id ? ACCENT : "var(--dim)",
                  padding: "14px 0 14px 12px",
                  textAlign: "left",
                  borderLeft: active === tab.id ? `2px solid ${ACCENT}` : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function InfoTable({ rows, theme }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ borderTop: `1px solid ${theme.border}` }}>
      {rows.map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "72px 1fr" : "100px 1fr",
            padding: "14px 0",
            borderBottom: `1px solid ${theme.border}`,
            gap: isMobile ? 16 : 20,
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

function HomeContent() {
  const isMobile = useIsMobile();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <section
        style={{
          position: "relative",
          flex: 1,
          minHeight: 540,
          color: DARK.text,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
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
            flex: 1,
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "clamp(48px, 10vh, 96px)",
          }}
        >
          <h1
            className="rise-in"
            style={{
              fontSize: "clamp(35px, 7.2vw, 90px)",
              fontWeight: 500,
              margin: 0,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              color: DARK.text,
              maxWidth: 960,
              animationDelay: "0.25s",
            }}
          >
            Part time sponge, full time tinkerer.
          </h1>

          <div
            className="rise-in"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(0, 1fr) minmax(0, 1.4fr)",
              gap: isMobile ? 32 : "clamp(24px, 5vw, 72px)",
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
              Hi, I'm Matthew :)
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

      <Footer />
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <span
        style={{
          display: "block",
          width: 24,
          height: 1,
          background: ACCENT,
          marginBottom: 24,
        }}
      />
      <h2
        style={{
          fontSize: "clamp(36px, 5.5vw, 64px)",
          fontWeight: 500,
          margin: 0,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          textTransform: "uppercase",
          whiteSpace: "pre-line",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function ContentTab({ title, children }) {
  return (
    <section
      style={{
        padding: "clamp(120px, 18vh, 200px) clamp(20px, 5vw, 56px) clamp(96px, 14vh, 160px)",
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader title={title} />
        {children}
      </div>
    </section>
  );
}

function ProjectRow({ p, last }) {
  const isMobile = useIsMobile(820);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(180px, 1fr) minmax(220px, 1fr) minmax(0, 2fr)",
        gap: isMobile ? 10 : 40,
        padding: isMobile ? "24px 0" : "28px 0",
        borderBottom: last ? "none" : "1px solid var(--border)",
        alignItems: "baseline",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? 18 : 22,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          fontWeight: 500,
          color: "var(--text)",
        }}
      >
        {p.title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--dim)",
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
          color: "var(--dim)",
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

function SubGroup({ label, items }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: "uppercase",
          color: "var(--muted)",
          fontWeight: 500,
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {label}
      </div>
      {items.map((p, i) => (
        <ProjectRow key={p.title} p={p} last={i === items.length - 1} />
      ))}
    </div>
  );
}

function ProjectsTab({ title, groups }) {
  return (
    <ContentTab title={title}>
      {Object.entries(groups).map(([group, items]) => (
        <SubGroup key={group} label={group} items={items} />
      ))}
    </ContentTab>
  );
}

function SomedayTab() {
  return (
    <ContentTab title={"What I want\nto build"}>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          borderTop: "1px solid var(--border)",
        }}
      >
        {SOMEDAY.map((item, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr",
              padding: "22px 0",
              borderBottom: "1px solid var(--border)",
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
                color: "var(--text)",
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </ContentTab>
  );
}

function ConsumingTab() {
  return (
    <ContentTab title={"How I spend\nmy time rotting"}>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {CONSUMING.map((item, i) => {
          const inner = (
            <>
              <span style={{ fontSize: 15, color: "var(--text)", fontWeight: 400 }}>{item.title}</span>
              {item.author && (
                <span style={{ fontSize: 13, color: "var(--dim)", fontWeight: 300, marginLeft: 10 }}>
                  — {item.author}
                </span>
              )}
              {item.link && (
                <span style={{ marginLeft: 10, color: "var(--muted)", fontSize: 13 }}>↗</span>
              )}
            </>
          );
          const base = {
            display: "block",
            padding: "16px 0",
            borderBottom: "1px solid var(--border)",
            color: "var(--text)",
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
    </ContentTab>
  );
}

function InterestsTab() {
  const isMobile = useIsMobile(720);
  const cols = isMobile ? 2 : 4;

  return (
    <ContentTab title={"Things I adore"}>
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
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text)",
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
    </ContentTab>
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

function renderTabContent(id) {
  switch (id) {
    case "home": return <HomeContent />;
    case "building": return <ProjectsTab title={"What I'm\nbuilding"} groups={BUILDING} />;
    case "built": return <ProjectsTab title={"What I've\nbuilt"} groups={BUILT} />;
    case "someday": return <SomedayTab />;
    case "consuming": return <ConsumingTab />;
    case "interests": return <InterestsTab />;
    default: return null;
  }
}

export default function App() {
  const [active, setActive] = useState(readHash);
  const [displayed, setDisplayed] = useState(active);
  const [phase, setPhase] = useState("entered");
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Sync html data-theme for CSS-variable cross-fade
  useEffect(() => {
    document.documentElement.dataset.theme = THEMES[active];
  }, [active]);

  // hashchange listener (browser back/forward)
  useEffect(() => {
    const onHash = () => {
      const next = readHash();
      setActive((cur) => (cur === next ? cur : next));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Coordinate panel exit/enter + scroll reset
  useEffect(() => {
    if (active === displayed) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      const t = setTimeout(() => {
        setDisplayed(active);
        setPhase("entered");
        setNavHidden(false);
        window.scrollTo({ top: 0, behavior: "auto" });
        lastScrollY.current = 0;
      }, 0);
      return () => clearTimeout(t);
    }

    const t0 = setTimeout(() => setPhase("exiting"), 0);
    const t1 = setTimeout(() => {
      setDisplayed(active);
      setPhase("entering");
      setNavHidden(false);
      window.scrollTo({ top: 0, behavior: "auto" });
      lastScrollY.current = 0;
    }, 200);
    const t2 = setTimeout(() => setPhase("entered"), 600);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, displayed]);

  // Sticky-with-hide nav
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const last = lastScrollY.current;
      if (y > 80 && y > last) setNavHidden(true);
      else if (y < last) setNavHidden(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onJump = (id) => {
    if (!TAB_IDS.includes(id)) return;
    setNavHidden(false);
    if (id === active) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (window.location.hash !== "#" + id) {
      window.location.hash = id;
    } else {
      setActive(id);
    }
  };

  const homeVisible = displayed === "home";

  return (
    <>
      <Nav active={active} hidden={navHidden} onJump={onJump} />

      <main>
        {/* Home is always mounted so MovingHeader keeps running */}
        <div
          className={homeVisible ? `panel-${phase}` : ""}
          style={{ display: homeVisible ? "block" : "none" }}
        >
          <HomeContent />
        </div>

        {/* Other tabs render only when active */}
        {!homeVisible && (
          <div className={`panel-${phase}`}>
            {renderTabContent(displayed)}
          </div>
        )}
      </main>

      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
