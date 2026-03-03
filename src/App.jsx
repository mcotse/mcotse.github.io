import { useState, useEffect, useRef, useMemo } from "react";
import { Agentation } from "agentation";

const NAV_ITEMS = [
  { id: "top", label: "Home" },
  { id: "building", label: "Building" },
  { id: "built", label: "Built" },
  { id: "someday", label: "Someday" },
  { id: "reading", label: "Consuming" },
  { id: "interests", label: "Interests" },
];

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: 3.5,
      textTransform: "uppercase",
      color: "#999",
      fontWeight: 500,
      marginBottom: 10,
    }}>{children}</div>
  );
}

function SectionTitle({ children, italic = true }) {
  return (
    <h2 style={{
      fontSize: 38,
      fontWeight: 400,
      fontStyle: italic ? "italic" : "normal",
      fontFamily: "'Playfair Display', 'Georgia', serif",
      margin: "0 0 20px",
      lineHeight: 1.15,
      letterSpacing: -0.5,
      color: "#111",
    }}>{children}</h2>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#e8e5e0", margin: "56px 0" }} />;
}

function ProjectCard({ title, description, accent, status, glow }) {
  return (
    <div
      style={{
        padding: "24px 0",
        borderBottom: "1px solid #e8e5e0",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            {accent && <div className={glow ? "dot-glow" : undefined} style={{ width: 5.5, height: 5.5, borderRadius: "50%", background: accent, color: accent, flexShrink: 0, "--glow-delay": glow ? Math.random() * 3 : undefined }} />}
            <h3 style={{
              fontSize: 18,
              fontWeight: 500,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              color: "#111",
              letterSpacing: -0.2,
            }}>{title}</h3>
          </div>
          {description && <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "#777",
            margin: "0 0 10px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            paddingLeft: accent ? 18 : 0,
          }}>{description}</p>}

        </div>
        {status && (
          <span style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: status === "Live" ? "#2d8a4e" : status === "In Progress" ? "#c0860e" : status === "Ongoing" ? "#5b7fa4" : "#999",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginTop: 4,
          }}>{status}</span>
        )}
      </div>
    </div>
  );
}

function FadeOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 120,
      background: "linear-gradient(to bottom, transparent, #faf9f6)",
      pointerEvents: "none",
      transition: "opacity 0.4s ease",
    }} />
  );
}

function ExpandButton({ expanded, hiddenCount, onClick }) {
  if (hiddenCount <= 0) return null;
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 12,
        background: "none",
        border: "none",
        padding: "4px 0",
        fontSize: 11,
        letterSpacing: 0.5,
        color: "#aaa",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        transition: "color 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      onMouseEnter={e => e.currentTarget.style.color = "#777"}
      onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
    >
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}><path d="M2 4l4 4 4-4" /></svg>
      {expanded ? "Show less" : `Show ${hiddenCount} more`}
    </button>
  );
}

function ReadingItem({ title, author }) {
  return (
    <div
      style={{
        padding: "10px 0",
        borderTop: "1px solid #e8e5e0",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 400, color: "#222", fontFamily: "'DM Sans', sans-serif" }}>{title}</span>
      {author && <span style={{ fontSize: 13, color: "#aaa", fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}> - {author}</span>}
    </div>
  );
}

function CollapsibleList({ items, initialCount = 6 }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, initialCount);
  const hiddenCount = items.length - initialCount;

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div style={{
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: expanded ? items.length * 42 + "px" : initialCount * 42 + "px",
        }}>
          {items.map((item, i) => {
          const inner = (
            <>
              <span style={{ fontSize: 15, fontWeight: 400, color: "#222", fontFamily: "'DM Sans', sans-serif" }}>{item.title}</span>
              {item.author && <span style={{ fontSize: 13, color: "#aaa", fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}> - {item.author}</span>}
              {item.link && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#5b7fa4" strokeWidth="1.5" style={{ marginLeft: 8, opacity: 0.6, transition: "opacity 0.2s", verticalAlign: "middle" }}><path d="M3 9L9 3M9 3H4M9 3v5" /></svg>
              )}
            </>
          );
          return item.link ? (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "10px 0",
                borderTop: "1px solid #e8e5e0",
                textDecoration: "none",
                cursor: "pointer",
                transition: "padding-left 0.3s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.paddingLeft = "8px"; }}
              onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0px"; }}
            >{inner}</a>
          ) : (
            <div key={i} style={{ padding: "10px 0", borderTop: "1px solid #e8e5e0" }}>
              {inner}
            </div>
          );
          })}
        </div>
        <FadeOverlay visible={!expanded && hiddenCount > 0} />
      </div>

      <ExpandButton expanded={expanded} hiddenCount={hiddenCount} onClick={() => setExpanded(!expanded)} />
    </div>
  );
}

function NumberedList({ items, initialCount = 4 }) {
  const shuffled = useMemo(() => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);
  const [expanded, setExpanded] = useState(false);
  const [floats, setFloats] = useState([]);
  const hiddenCount = Math.max(0, shuffled.length - initialCount);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const floatTimers = useRef([]);

  const spawnFloat = (rowIndex) => {
    haptic();
    const id = Date.now() + Math.random();
    const offsetX = Math.round(Math.random() * 30 - 15);
    setFloats(prev => [...prev, { id, row: rowIndex, offsetX }]);
    const tid = setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 800);
    floatTimers.current.push(tid);
  };

  useEffect(() => {
    return () => floatTimers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const children = contentRef.current.children;
      let h = 0;
      for (let i = 0; i < Math.min(initialCount, children.length); i++) {
        h += children[i].offsetHeight;
      }
      setCollapsedHeight(h + 46);
      setExpandedHeight(containerRef.current.scrollHeight);
    }
  }, [shuffled, initialCount]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div ref={containerRef} style={{
          background: "#f5f3ee",
          border: "1px solid #e8e5e0",
          padding: "28px 28px 18px",
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: expanded ? expandedHeight + "px" : collapsedHeight + "px",
        }}>
          <div ref={contentRef}>
            {shuffled.map((text, i) => (
              <div key={i} style={{
                padding: "10px 0",
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                cursor: "pointer",
                position: "relative",
                transition: "padding-left 0.3s ease",
                ...(i > 0 && { borderTop: "1px solid #e0ddd7" }),
              }}
                onClick={() => spawnFloat(i)}
                onMouseEnter={e => { e.currentTarget.style.paddingLeft = "8px"; }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0px"; }}
              >
                <span style={{ fontSize: 10, color: "#ccc", fontWeight: 600, letterSpacing: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 14, color: "#555", fontWeight: 300, lineHeight: 1.5 }}>{text}</span>
                {floats.filter(f => f.row === i).map(f => (
                  <span key={f.id} style={{
                    position: "absolute",
                    right: 8 + f.offsetX,
                    top: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#5b7fa4",
                    pointerEvents: "none",
                    animation: "floatUp 0.8s ease-out forwards",
                  }}>+1</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <FadeOverlay visible={!expanded && hiddenCount > 0} />
      </div>

      <ExpandButton expanded={expanded} hiddenCount={hiddenCount} onClick={() => setExpanded(!expanded)} />
    </div>
  );
}

function CollapsibleCards({ children, initialCount = 2 }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(children) ? children : [children];
  const hiddenCount = Math.max(0, items.length - initialCount);
  const contentRef = useRef(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const ch = contentRef.current.children;
      let h = 0;
      for (let i = 0; i < Math.min(initialCount, ch.length); i++) {
        h += ch[i].offsetHeight;
      }
      setCollapsedHeight(h);
      setExpandedHeight(contentRef.current.scrollHeight);
    }
  }, [initialCount]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div style={{
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: expanded ? expandedHeight + "px" : collapsedHeight + "px",
        }}>
          <div ref={contentRef}>
            {items}
          </div>
        </div>
        <FadeOverlay visible={!expanded && hiddenCount > 0} />
      </div>

      <ExpandButton expanded={expanded} hiddenCount={hiddenCount} onClick={() => setExpanded(!expanded)} />
    </div>
  );
}

function CookCard({ title, note, vibe }) {
  return (
    <div style={{
      padding: "18px 20px",
      background: "#faf8f5",
      border: "1px solid #ece8e1",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h4 style={{ fontSize: 15, margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#222" }}>{title}</h4>
        {vibe && <span style={{ fontSize: 18 }}>{vibe}</span>}
      </div>
      {note && <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.5 }}>{note}</p>}
    </div>
  );
}

function haptic(ms = 8) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

export default function App() {
  const [activeSection, setActiveSection] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [interestFloats, setInterestFloats] = useState([]);
  const lastScrollY = useRef(0);
  const interestFloatTimers = useRef([]);

  const spawnInterestFloat = (index) => {
    haptic();
    const id = Date.now() + Math.random();
    const offsetX = Math.round(Math.random() * 20 - 10);
    setInterestFloats(prev => [...prev, { id, index, offsetX }]);
    const tid = setTimeout(() => setInterestFloats(prev => prev.filter(f => f.id !== id)), 800);
    interestFloatTimers.current.push(tid);
  };

  useEffect(() => {
    return () => interestFloatTimers.current.forEach(clearTimeout);
  }, []);

  // Global haptic feedback on any link or button click
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest("a, button")) haptic();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const consuming = useMemo(() => {
    const items = [
      { title: "Range Widely", author: "David Epstein", link: "https://davidepstein.substack.com/" },
      { title: "More To That", author: "Lawrence Yeo", link: "https://moretothat.com/" },
      { title: "Chinese Cooking Demystified", author: "", link: "https://www.youtube.com/@ChineseCookingDemystified" },
      { title: "The Skip", author: "Nikhyl Singhal", link: "https://theskip.substack.com/" },
      { title: "Alex Danco's Newsletter", author: "Alex Danco", link: "https://danco.substack.com/" },
      { title: "ChefSteps", author: "", link: "https://www.chefsteps.com/" },
      { title: "Wait But Why", author: "Tim Urban", link: "https://waitbutwhy.com" },
      { title: "A Knight of the Seven Kingdoms", author: "HBO", link: "https://www.imdb.com/title/tt27497448/" },
      { title: "Kurzgesagt", author: "", link: "https://www.youtube.com/@kurzgesagt" },
      { title: "Jules Cooking", author: "", link: "" },
      { title: "The Tim Ferriss Show", author: "Tim Ferriss", link: "https://tim.blog/podcast/" },
      { title: "Mark Rober", author: "", link: "https://www.youtube.com/@MarkRober" },
      { title: "Jujutsu Kaisen", author: "", link: "https://www.imdb.com/title/tt12343534/" },
      { title: "One Piece", author: "", link: "https://onepiece.fandom.com/wiki/One_Piece_Wiki" },
      { title: "Andrej Karpathy", author: "", link: "https://x.com/karpathy" },
      { title: "Thariq", author: "", link: "https://x.com/trq212" },
    ];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, []);

  const interests = useMemo(() => {
    const items = [
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
    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    // Random number of highlights (2-4), randomly assigned dark or blue
    const count = 2 + Math.floor(Math.random() * 3);
    const indices = new Set();
    while (indices.size < count) indices.add(Math.floor(Math.random() * items.length));
    const colors = ["#3d3d3d", "#5b7fa4"];
    return items.map((item, i) => ({
      ...item,
      highlight: indices.has(i) ? colors[Math.floor(Math.random() * colors.length)] : null,
    }));
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      // Hide/show header on mobile based on scroll direction
      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) > 10) {
        setHeaderVisible(delta < 0 || currentY < 40);
        lastScrollY.current = currentY;
      }

      const sections = NAV_ITEMS.map(n => ({
        id: n.id,
        el: document.getElementById(n.id),
      })).filter(s => s.el);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = maxScroll > 0 ? currentY / maxScroll : 0;

      // Near bottom of page: sections can't reach the top, so distribute
      // the last ~30% of scroll across the remaining bottom sections
      if (scrollRatio > 0.7) {
        // Find the last section whose top has passed 120px (the "normal" pick)
        let normalIdx = 0;
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].el.getBoundingClientRect().top <= 120) {
            normalIdx = i;
            break;
          }
        }
        // Count how many sections are below the normal pick
        const remaining = sections.length - 1 - normalIdx;
        if (remaining > 0) {
          // Map 0.7–1.0 scroll ratio to those remaining sections
          const subRatio = (scrollRatio - 0.7) / 0.3;
          const offset = Math.min(Math.floor(subRatio * (remaining + 1)), remaining);
          setActiveSection(sections[normalIdx + offset].id);
        } else {
          setActiveSection(sections[normalIdx].id);
        }
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const rect = sections[i].el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#faf9f6",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* ─── FIXED NAV ─── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(250,249,246,0.92)" : "#faf9f6",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "none",
        transition: ["transform", "opacity", "background", "border-color", "backdrop-filter"].map(p => `${p} 0.35s cubic-bezier(0.4, 0, 0.2, 1)`).join(", "),
        padding: "14px clamp(24px, 5vw, 48px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...(isMobile && {
          transform: (headerVisible || menuOpen) ? "translateY(0)" : "translateY(-100%)",
          opacity: (headerVisible || menuOpen) ? 1 : 0,
        }),
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 3, background: "#5b7fa4" }} />
          <span style={{
            fontSize: 13,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            fontWeight: 500,
            color: "#333",
          }}>Matthew Tse</span>
        </div>
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ width: 20, height: 1.5, background: "#333", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(2.75px, 2.75px)" : "none" }} />
            <div style={{ width: 20, height: 1.5, background: "#333", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: 20, height: 1.5, background: "#333", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(2.75px, -2.75px)" : "none" }} />
          </button>
        ) : (
          <div style={{ display: "flex", gap: 28 }}>
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                style={{
                  fontSize: 12,
                  letterSpacing: 1,
                  color: activeSection === n.id ? "#111" : "#aaa",
                  fontWeight: activeSection === n.id ? 600 : 400,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  padding: 0,
                  transition: "color 0.2s",
                  borderBottom: activeSection === n.id ? "1.5px solid #5b7fa4" : "1.5px solid transparent",
                  paddingBottom: 2,
                }}
              >{n.label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ─── NAV FADE SHADOW ─── */}
      <div style={{
        position: "fixed",
        top: 48,
        left: 0,
        right: 0,
        height: 40,
        background: "linear-gradient(to bottom, rgba(250,249,246,0.92), transparent)",
        pointerEvents: "none",
        zIndex: 99,
        opacity: (scrolled && (!isMobile || headerVisible || menuOpen)) ? 1 : 0,
        transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />

      {/* ─── MOBILE MENU DROPDOWN ─── */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: 48,
          left: 0,
          right: 0,
          zIndex: 99,
          background: "rgba(250,249,246,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: menuOpen ? "1px solid #e0ddd7" : "1px solid transparent",
          overflow: "hidden",
          maxHeight: menuOpen ? 400 : 0,
          transition: "max-height 0.3s ease, border-color 0.3s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: headerVisible ? 1 : 0,
        }}>
          <div style={{ padding: "12px clamp(24px, 5vw, 48px) 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => { scrollTo(n.id); setMenuOpen(false); }}
                style={{
                  fontSize: 14,
                  letterSpacing: 1,
                  color: activeSection === n.id ? "#111" : "#999",
                  fontWeight: activeSection === n.id ? 600 : 400,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  padding: "10px 0",
                  textAlign: "left",
                  transition: "color 0.2s",
                  borderLeft: activeSection === n.id ? "2px solid #5b7fa4" : "2px solid transparent",
                  paddingLeft: 12,
                }}
              >{n.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div style={{ flex: 1, paddingTop: 48 }}>

        {/* ─── HERO ─── */}
        <section id="top" style={{ padding: "80px clamp(24px, 5vw, 48px) 40px", maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(36px, 7vw, 56px)",
            fontWeight: 400,
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontStyle: "italic",
            lineHeight: 1.08,
            margin: "0 0 28px",
            color: "#111",
            letterSpacing: -1,
          }}>
            Learning How to Build
          </h1>
          <p style={{
            fontSize: 17,
            lineHeight: 1.85,
            color: "#666",
            fontWeight: 300,
            margin: 0,
          }}>
            Hi, I'm Matt :)<br /><br />I like to build cool things, cook for friends and family, and tinker with whatever catches my attention next.
          </p>

          {/* Quick facts - Swiss grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr",
            marginTop: 44,
            borderTop: "1px solid #e8e5e0",
          }}>
            {[
              { label: "Role", value: "Engineering Leader @ Headway" },
              { label: "Focus", value: "Wife, Yuki, friends, food, and then maybe agents" },
              { label: "Makes", value: "Apps, kombucha, dinners, 3d prints" },
            ].map((row, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{
                  padding: "12px 0",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#bbb",
                  borderBottom: "1px solid #e8e5e0",
                  display: "flex",
                  alignItems: "center",
                }}>{row.label}</div>
                <div style={{
                  padding: "12px 0 12px 20px",
                  fontSize: 14,
                  color: "#444",
                  fontWeight: 300,
                  borderBottom: "1px solid #e8e5e0",
                  lineHeight: 1.5,
                  display: "flex",
                  alignItems: "center",
                }}>{row.value}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 48 }} />


        {/* ─── WHAT I'M BUILDING ─── */}
        <section id="building" style={{ padding: "0 clamp(24px, 5vw, 48px)", maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>What I'm Building</SectionLabel>
          <SectionTitle>In Progress</SectionTitle>

          <div style={{ marginBottom: 10, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#5b7fa4", fontWeight: 600 }}>
            At Headway
          </div>
          <ProjectCard
            title="Clenge"
            description={<>Chief Vibe Officer - leading the <u>CL</u>ient <u>ENG</u>ag<u>E</u>ment team behind the core tools 90K+ providers use daily - home, calendar, telehealth, messaging, and patient outcome measures.</>}
            accent="#5b7fa4"
            glow
          />
          <div className="redacted-card">
            <ProjectCard
              title={<span className="redacted-shimmer">▓▓▓▓▓</span>}
              description="Building Headway's in-house cloud agent - plugged into everything to help every team move faster towards making mental healthcare accessible for everyone."
              accent="#5b7fa4"
              glow
            />
          </div>

          <div style={{ height: 32 }} />
          <div style={{ marginBottom: 10, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#2d8a4e", fontWeight: 600 }}>
            For Myself
          </div>
          <ProjectCard
            title="Crunchtime"
            description="Started as a bet among friends to get a six-pack in a couple of months. Turned into an app that serves as a coordination and commitment device for us to push each other to be healthier."
            accent="#2d8a4e"
            glow
          />
          <ProjectCard
            title="Fermentation Sleeve"
            description="Modular, aesthetic 3d-printed sleeves for Weck 905 jars - designed for long ferments like miso and fish sauce."
            accent="#2d8a4e"
            glow
          />
        </section>

        <div style={{ height: 48 }} />


        {/* ─── WHAT I'VE BUILT ─── */}
        <section id="built" style={{ padding: "0 clamp(24px, 5vw, 48px)", maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>What I've Built</SectionLabel>
          <SectionTitle>In The Past</SectionTitle>

          <div style={{ marginBottom: 10, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#5b7fa4", fontWeight: 600 }}>
            In my career
          </div>
          <CollapsibleCards initialCount={2}>
            <ProjectCard
              title="Lyft"
              description="Led location geocode snapping at Lyft Business concierge - drove ~$1M+ in yearly margin by reducing wait times and improving ride profitability."
              accent="#5b7fa4"
            />
            <ProjectCard
              title="Credit Karma"
              description="Led credit score refresh infra revamp that supported 100M+ members refreshes daily, built Identity Monitoring and Credit Lock from scratch, and started the Canadian internship program scaling from 0 to ~15 interns/quarter."
              accent="#5b7fa4"
            />
            <ProjectCard
              title="The Coterie"
              description="Built our server-driven UI to decouple content from our iOS app releases."
              accent="#5b7fa4"
            />
            <ProjectCard
              title="University of Waterloo"
              description="ECE with Entrepreneurial option. Won the GM Innovation Award for ModVR - a 3d modeling app built for VR (final year design project)."
              accent="#5b7fa4"
            />
          </CollapsibleCards>

          <div style={{ height: 32 }} />
          <div style={{ marginBottom: 10, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#2d8a4e", fontWeight: 600 }}>
            For Myself
          </div>
          <CollapsibleCards initialCount={2}>
            <ProjectCard
              title="pupdash"
              description="A dashboard for logging and tracking our puppy Yuki's meds, meals, and daily routines - so my wife, our dog sitters, and I are always on the same page. User based, synced to cloud."
              accent="#2d8a4e"
            />
            <ProjectCard
              title="Blackjack GTO"
              description="Guides noobs to play 21 optimally - whipped up during casino night at a friend's, idea → design → implementation → deployment → live - entirely through my agent on my phone via Discord for orchestration."
              accent="#2d8a4e"
            />
            <ProjectCard
              title="Memoryworthy"
              description="A daily journaling app inspired by Storyworthy by Matthew Dicks. Helps me pause and appreciate at least one moment of the day that is memoryworthy."
              accent="#2d8a4e"
            />
          </CollapsibleCards>
        </section>

        <div style={{ height: 48 }} />


        {/* ─── WHAT I WANT TO BUILD ─── */}
        <section id="someday" style={{ padding: "0 clamp(24px, 5vw, 48px)", maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>What I Want to Build</SectionLabel>
          <SectionTitle>One Day</SectionTitle>
          <NumberedList items={[
            "This someday list, but more trackable",
            "Case studies for past projects",
            "Projection mapping art onto my ceramics",
            "Programmable wall piece with mechanical moving parts and a vision feedback loop",
            "Porcelain steamer basket shaped like a bamboo steamer",
            "AI sticker pack generator",
            "Beli but for dishes instead of restaurants",
            "A place to write and share my thoughts - and the content",
            "Memoryworthy redesign",
          ]} />
        </section>

        <div style={{ height: 48 }} />


        {/* ─── CONSUMING ─── */}
        <section id="reading" style={{ padding: "0 clamp(24px, 5vw, 48px) 20px", maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>How I Spend My Time Rotting</SectionLabel>
          <SectionTitle>What I'm Consuming</SectionTitle>

          <CollapsibleList items={consuming} />
        </section>

        <div style={{ height: 48 }} />


        {/* ─── INTERESTS ─── */}
        <section id="interests" style={{ padding: "0 clamp(24px, 5vw, 48px)", maxWidth: 720, margin: "0 auto" }}>
          <SectionLabel>Miscellany</SectionLabel>
          <SectionTitle>Things I Adore</SectionTitle>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {interests.map((item, i) => {
              const bg = item.highlight || "#f5f3ee";
              const fg = item.highlight ? "#fff" : "#555";
              const border = item.highlight ? "none" : "1px solid #e0ddd7";
              const style = {
                padding: "8px 16px",
                background: bg,
                color: fg,
                fontSize: 13,
                fontWeight: 400,
                fontFamily: "'DM Sans', sans-serif",
                fontStyle: "normal",
                letterSpacing: 0.3,
                border,
                cursor: "pointer",
                position: "relative",
                overflow: "visible",
                textDecoration: "none",
              };
              const floatSpans = interestFloats.filter(f => f.index === i).map(f => (
                <span key={f.id} style={{
                  position: "absolute",
                  right: 4 + f.offsetX,
                  top: -4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: item.highlight ? "#fff" : "#5b7fa4",
                  pointerEvents: "none",
                  animation: "floatUp 0.8s ease-out forwards",
                }}>+1</span>
              ));
              return item.link ? (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" style={style} onClick={() => spawnInterestFloat(i)}>{item.text}{floatSpans}</a>
              ) : (
                <span key={i} style={style} onClick={() => spawnInterestFloat(i)}>{item.text}{floatSpans}</span>
              );
            })}
          </div>
        </section>

        <div style={{ height: 48 }} />

        {/* ─── FOOTER ─── */}
        <footer style={{
          borderTop: "1px solid #e8e5e0",
          padding: "32px clamp(24px, 5vw, 48px) 48px",
          maxWidth: 860,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
        }}>
          <div>
            <div style={{ width: 28, height: 3, background: "#5b7fa4", marginBottom: 12 }} />
            <span style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500, color: "#bbb" }}>
              Matthew Tse 2026
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { text: "LinkedIn", link: "https://www.linkedin.com/in/mcotse/" },
              { text: "Instagram", link: "https://www.instagram.com/yukipomsky/" },
            ].map(l => (
              <a key={l.text} href={l.link} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 12,
                letterSpacing: 1,
                color: "#888",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                paddingBottom: 2,
                fontWeight: 400,
                transition: "color 0.2s",
                textDecoration: "none",
              }}>{l.text}</a>
            ))}
          </div>
        </footer>
      </div>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </div>
  );
}
