import { useEffect, useRef } from "react";

const HERO_PRESET = {
  bgColor: "#0f0d0b",
  lineColor: "#3a3228",
  lineWidth: 0.8,
  lineStyle: "Solid",
  opacity: 0.75,
  trailLength: 0,
  blendMode: "source-over",
  colorMode: "Gradient",
  gradientColor1: "#2a2419",
  gradientColor2: "#8a6d48",
  taperAmount: 0.55,
  lineCount: 140,
  resolution: 50,
  lineSpacing: 0.85,
  overflow: 0.15,
  orientation: "Vertical",
  symmetry: "None",
  perspectiveTilt: 0,
  rotation: 0,
  autoRotateSpeed: 0,
  amplitude: 42,
  frequency: 0.006,
  driftSpeed: 0.18,
  grouping: 8,
  groupScale: 0.2,
  octaves: 2,
  noiseSeed: 42,
  cursorRadius: 150,
  repulsion: 1.5,
  attractMode: false,
  springStiffness: 0.025,
  pushDamping: 0.88,
  returnDamping: 0.94,
  forceFalloff: 2.8,
  gravity: 0,
  shockwaveForce: 4,
};

class PerlinNoise {
  constructor(seed) {
    this.perm = new Uint8Array(512);
    this.grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed || Math.random() * 65536;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }
  _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  _dot(gi, x, y) { const g = this.grad[gi & 7]; return g[0] * x + g[1] * y; }
  _lerp(a, b, t) { return a + t * (b - a); }
  noise2D(x, y) {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = this._fade(xf), v = this._fade(yf);
    const aa = this.perm[this.perm[xi] + yi];
    const ab = this.perm[this.perm[xi] + yi + 1];
    const ba = this.perm[this.perm[xi + 1] + yi];
    const bb = this.perm[this.perm[xi + 1] + yi + 1];
    const x1 = this._lerp(this._dot(aa, xf, yf), this._dot(ba, xf - 1, yf), u);
    const x2 = this._lerp(this._dot(ab, xf, yf - 1), this._dot(bb, xf - 1, yf - 1), u);
    return this._lerp(x1, x2, v);
  }
  octaveNoise2D(x, y, octaves) {
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let o = 0; o < octaves; o++) {
      val += this.noise2D(x * freq, y * freq) * amp;
      max += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / max;
  }
}

function lerpColor(hex1, hex2, t) {
  const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

export default function MovingHeader({ style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const P = HERO_PRESET;

    let W = 0, H = 0;
    let perlin = new PerlinNoise(P.noiseSeed);
    let lines = [];
    let timeOffset = 0;
    let shockwaves = [];
    let mouseX = -9999, mouseY = -9999;
    let mouseOn = false;
    let rafId = 0;
    let lastTime = 0;

    const parent = canvas.parentElement;

    function resize() {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      initLines();
    }

    function initLines() {
      lines = [];
      const oX = P.overflow * W, oY = P.overflow * H;
      const eW = W + 2 * oX, eH = H + 2 * oY;
      const sp = (eW / (P.lineCount + 1)) * P.lineSpacing;
      const tw = sp * (P.lineCount - 1);
      const sx = -oX + (eW - tw) / 2;

      for (let i = 0; i < P.lineCount; i++) {
        const np = P.lineCount > 1 ? i / (P.lineCount - 1) : 0.5;
        let bx = sx + tw * np;
        if (P.grouping > 0) bx += perlin.noise2D(i * P.groupScale, 100) * P.grouping;
        const pts = [];
        for (let j = 0; j <= P.resolution; j++) {
          pts.push({
            baseX: bx,
            y: -oY + (j / P.resolution) * eH,
            dispX: 0, dispY: 0, velX: 0, velY: 0,
          });
        }
        lines.push(pts);
      }
    }

    function computeNoise(bx, y) {
      return P.octaves > 1
        ? perlin.octaveNoise2D(bx * 0.01 + timeOffset, y * P.frequency, P.octaves)
        : perlin.noise2D(bx * 0.01 + timeOffset, y * P.frequency);
    }

    function getLineColor(i) {
      return lerpColor(P.gradientColor1, P.gradientColor2, i / Math.max(1, lines.length - 1));
    }

    function update(dt) {
      timeOffset += P.driftSpeed * dt;

      for (const wave of shockwaves) {
        wave.radius += 400 * dt;
        wave.strength *= Math.pow(0.3, dt);
      }
      shockwaves = shockwaves.filter((w) => w.strength > 0.05 && w.radius < Math.max(W, H) * 1.5);

      for (let i = 0; i < lines.length; i++) {
        const pts = lines[i];
        for (let j = 0; j < pts.length; j++) {
          const p = pts[j];
          const nv = computeNoise(p.baseX, p.y);
          const rx = p.baseX + nv * P.amplitude;
          const cx = rx + p.dispX, cy = p.y + p.dispY;
          let pushed = false;

          if (mouseOn) {
            const dx = cx - mouseX, dy = cy - mouseY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < P.cursorRadius && d > 0) {
              const t = 1 - d / P.cursorRadius;
              const f = Math.pow(t, P.forceFalloff) * P.repulsion;
              p.velX += (dx / d) * f;
              p.velY += (dy / d) * f;
              pushed = true;
            }
          }

          for (const wave of shockwaves) {
            const dx = cx - wave.x, dy = cy - wave.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const waveWidth = 60;
            const dFront = Math.abs(d - wave.radius);
            if (dFront < waveWidth && d > 0) {
              const prox = 1 - dFront / waveWidth;
              const f = prox * wave.strength * 0.5;
              p.velX += (dx / d) * f;
              p.velY += (dy / d) * f;
            }
          }

          p.velX -= P.springStiffness * p.dispX;
          p.velY -= P.springStiffness * p.dispY;
          const dm = pushed ? P.pushDamping : P.returnDamping;
          p.velX *= dm;
          p.velY *= dm;
          p.dispX += p.velX;
          p.dispY += p.velY;
        }
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = P.bgColor;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = P.blendMode;
      ctx.globalAlpha = P.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const useTaper = P.taperAmount > 0;

      for (let i = 0; i < lines.length; i++) {
        const pts = lines[i];
        if (pts.length < 2) continue;
        ctx.strokeStyle = getLineColor(i);

        if (useTaper) {
          for (let j = 0; j < pts.length - 1; j++) {
            const t0 = j / (pts.length - 1);
            const t1 = (j + 1) / (pts.length - 1);
            const taper0 = 1 - P.taperAmount * (1 - Math.sin(t0 * Math.PI));
            const taper1 = 1 - P.taperAmount * (1 - Math.sin(t1 * Math.PI));
            ctx.lineWidth = P.lineWidth * Math.max(0.1, (taper0 + taper1) * 0.5);
            const na = computeNoise(pts[j].baseX, pts[j].y);
            const nb = computeNoise(pts[j + 1].baseX, pts[j + 1].y);
            const ax = pts[j].baseX + na * P.amplitude + pts[j].dispX;
            const ay = pts[j].y + pts[j].dispY;
            const bx = pts[j + 1].baseX + nb * P.amplitude + pts[j + 1].dispX;
            const by = pts[j + 1].y + pts[j + 1].dispY;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        } else {
          ctx.lineWidth = P.lineWidth;
          ctx.beginPath();
          const fn = computeNoise(pts[0].baseX, pts[0].y);
          ctx.moveTo(pts[0].baseX + fn * P.amplitude + pts[0].dispX, pts[0].y + pts[0].dispY);
          for (let j = 0; j < pts.length - 1; j++) {
            const na = computeNoise(pts[j].baseX, pts[j].y);
            const nb = computeNoise(pts[j + 1].baseX, pts[j + 1].y);
            const ax = pts[j].baseX + na * P.amplitude + pts[j].dispX;
            const ay = pts[j].y + pts[j].dispY;
            const bx = pts[j + 1].baseX + nb * P.amplitude + pts[j + 1].dispX;
            const by = pts[j + 1].y + pts[j + 1].dispY;
            if (j < pts.length - 2) ctx.quadraticCurveTo(ax, ay, (ax + bx) * 0.5, (ay + by) * 0.5);
            else ctx.quadraticCurveTo(ax, ay, bx, by);
          }
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      update(dt);
      draw();
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseOn = mouseY >= 0 && mouseY <= H;
    }
    function onMouseLeave() { mouseOn = false; }
    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      shockwaves.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        strength: P.shockwaveForce,
      });
    }
    function onTouchMove(e) {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouseX = t.clientX - rect.left;
      mouseY = t.clientY - rect.top;
      mouseOn = true;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onTouchEnd = () => (mouseOn = false);
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("click", onClick);
    parent.addEventListener("touchmove", onTouchMove, { passive: true });
    parent.addEventListener("touchend", onTouchEnd);

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("click", onClick);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
    />
  );
}
