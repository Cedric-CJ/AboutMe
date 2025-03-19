<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
let ctx = null;
let animationFrameId;
let time = 0;
let primaryColorHSL = { h: 120, s: 100, l: 50 }; // Fallback für --primary-color
let waterColor = 'rgba(0,50,100,0.8)';            // Fallback für --water-color

// Konstanten und globale Arrays
const MAX_AURORA_LINES = 2;
const auroraLines = [];
const stars = [];
const shootingStars = [];
let baseMirrorLine = 0;

//////////////////////
// Farb- und Hilfsfunktionen
//////////////////////

const loadPrimaryColor = () => {
  const cssColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
  if (cssColor.startsWith('#')) {
    primaryColorHSL = hexToHsl(cssColor);
  } else {
    console.warn('Konnte --primary-color nicht als Hex parsen. Fallback wird verwendet.');
  }
};

const loadWaterColor = () => {
  const wc = getComputedStyle(document.documentElement)
      .getPropertyValue('--water-color')
      .trim();
  if (wc) waterColor = wc;
};

const hexToHsl = (hex) => {
  let chars = hex.substring(1).split('');
  if (chars.length === 3) {
    chars = [chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]];
  }
  const r = parseInt(chars[0] + chars[1], 16) / 255;
  const g = parseInt(chars[2] + chars[3], 16) / 255;
  const b = parseInt(chars[4] + chars[5], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

//////////////////////
// Canvas-Initialisierung
//////////////////////

const initCanvas = () => {
  if (!canvas.value) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  ctx = canvas.value.getContext('2d');
  baseMirrorLine = canvas.value.height * 0.4;  // Spiegelungslinie bei 40%
};

//////////////////////
// Hilfsfunktion: Dynamische Spiegelungslinie
//////////////////////

const getMirrorLine = () => baseMirrorLine + 5 * Math.sin(time * 0.5);

//////////////////////
// Polarlicht (Aurora) Funktionen
//////////////////////

const createAuroraLine = () => {
  const direction = Math.random() < 0.5 ? 'left' : 'right';
  const spawnOffset = 200 + Math.random() * 400;
  const exitOffset = 200 + Math.random() * 400;
  const spawnX = direction === 'left' ? -spawnOffset : canvas.value.width + spawnOffset;
  const speedX = direction === 'left'
      ? 0.3 + Math.random() * 0.9
      : -(0.3 + Math.random() * 0.9);
  const exitX = direction === 'left' ? canvas.value.width + exitOffset : -exitOffset;

  let startY;
  let attempts = 0;
  do {
    startY = canvas.value.height * (0.05 + Math.random() * 0.25);
    attempts++;
  } while (
      auroraLines.some(line => line.dir === direction && Math.abs(line.y - startY) < 120)
      && attempts < 10
      );

  // Speichere den zufälligen Farboffset (fix) für diese Linie:
  const hueOffset = (Math.random() - 0.5) * 50;

  return {
    x: spawnX,
    y: startY,
    dir: direction,
    speedX,
    spawnX,
    exitX,
    baseLength: 500 + Math.random() * 300,
    baseAmplitude: 5 + Math.random() * 5,
    baseBandThickness: 60 + Math.random() * 30,
    cycles: 1 + Math.random() * 2,
    phase: Math.random() * 2 * Math.PI,
    hueOffset, // Neuer Wert, der dauerhaft gespeichert wird
    // Setze hue vorerst basierend auf dem aktuellen primaryColorHSL:
    hue: primaryColorHSL.h + hueOffset,
    saturation: Math.max(0, Math.min(100, primaryColorHSL.s + (Math.random() - 0.5) * 10)),
    lightness: Math.max(0, Math.min(100, primaryColorHSL.l + (Math.random() - 0.5) * 10)),
    swayAmplitude: 5 + Math.random() * 5,
    swayPhase: Math.random() * 2 * Math.PI,
    depthShift: 20
  };
};

const updatePolarLights = () => {
  while (auroraLines.length < MAX_AURORA_LINES) {
    auroraLines.push(createAuroraLine());
  }
  for (let i = 0; i < auroraLines.length; i++) {
    const line = auroraLines[i];
    // Aktualisiere die Farbe basierend auf der aktuellen primaryColorHSL:
    line.hue = primaryColorHSL.h + line.hueOffset;

    line.x += line.speedX;
    const f = line.dir === 'left'
        ? (line.x - line.spawnX) / (line.exitX - line.spawnX)
        : (line.spawnX - line.x) / (line.spawnX - line.exitX);

    if (f <= 0 || f >= 1) {
      auroraLines[i] = createAuroraLine();
      continue;
    }
    const scale = 4 * f * (1 - f);
    const currentLength = line.baseLength * scale;
    const currentAmplitude = line.baseAmplitude * scale;
    const currentBandThickness = line.baseBandThickness * scale;
    const points = [];
    const segments = 40;
    const swayOffset = line.swayAmplitude * Math.sin(time + line.swayPhase);

    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      const baseX = line.x + t * currentLength;
      const offset = currentAmplitude * Math.sin(2 * Math.PI * (line.cycles * t + line.phase + time));
      points.push({ x: baseX + swayOffset, y: line.y + offset, t });
    }
    drawAurora(points, line, currentBandThickness, scale);
    drawAuroraReflection(points, line, currentBandThickness, scale);
  }
};

const drawAurora = (points, line, bandThickness, scale) => {
  ctx.save();
  ctx.filter = 'blur(3px)';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let j = 1; j < points.length; j++) {
    ctx.lineTo(points[j].x, points[j].y);
  }
  for (let j = points.length - 1; j >= 0; j--) {
    const shift = line.depthShift * (1 - points[j].t);
    ctx.lineTo(points[j].x - shift, points[j].y - bandThickness);
  }
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, line.y, 0, line.y - bandThickness);
  gradient.addColorStop(0, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.8 * scale})`);
  gradient.addColorStop(0.5, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.4 * scale})`);
  gradient.addColorStop(1, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, 0)`);
  ctx.fillStyle = gradient;
  ctx.shadowColor = `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.6 * scale})`;
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();
};

const drawAuroraReflection = (points, line, bandThickness, scale) => {
  const mLine = getMirrorLine();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, mLine, canvas.value.width, canvas.value.height - mLine);
  ctx.clip();
  ctx.translate(0, 2 * mLine);
  ctx.scale(1, -0.67);
  ctx.globalAlpha = 0.5;
  const getWaveOffset = (x) => 5 * Math.sin(x / 100 + time);
  ctx.filter = 'blur(3px)';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y + getWaveOffset(points[0].x));
  for (let j = 1; j < points.length; j++) {
    ctx.lineTo(points[j].x, points[j].y + getWaveOffset(points[j].x));
  }
  for (let j = points.length - 1; j >= 0; j--) {
    const shift = line.depthShift * (1 - points[j].t);
    ctx.lineTo(points[j].x - shift, points[j].y - bandThickness + getWaveOffset(points[j].x - shift));
  }
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, line.y, 0, line.y - bandThickness);
  gradient.addColorStop(0, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.8 * scale})`);
  gradient.addColorStop(0.5, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.4 * scale})`);
  gradient.addColorStop(1, `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, 0)`);
  ctx.fillStyle = gradient;
  ctx.shadowColor = `hsla(${line.hue}, ${line.saturation}%, ${line.lightness}%, ${0.6 * scale})`;
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.restore();
};

//////////////////////
// Sternenhimmel und Sternschnuppen
//////////////////////

const initStars = () => {
  const numStars = 100;
  for (let i = 0; i < numStars; i++) {
    const star = {
      x: Math.random() * canvas.value.width,
      y: Math.random() * baseMirrorLine,
      baseRadius: Math.random() * 1.5,
      radius: 0,
      baseAlpha: 0.5 + Math.random() * 0.5,
      twinkleSpeed: 0.001 + Math.random() * 0.002,
      phase: Math.random() * 2 * Math.PI
    };
    star.radius = star.baseRadius;
    stars.push(star);
  }
};

const drawStars = () => {
  stars.forEach(star => {
    const newAlpha = star.baseAlpha + Math.sin(performance.now() * star.twinkleSpeed + star.phase);
    const alpha = Math.max(0.3, Math.min(newAlpha, star.baseAlpha + 1));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
};

const drawStarsReflection = () => {
  const mLine = getMirrorLine();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, mLine, canvas.value.width, canvas.value.height - mLine);
  ctx.clip();
  ctx.translate(0, 2 * mLine);
  ctx.scale(1, -0.67);
  ctx.globalAlpha = 0.6;
  const getWaveOffset = (x) => 5 * Math.sin(x / 100 + time);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y + getWaveOffset(star.x), star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,0.7)`;
    ctx.fill();
  });
  ctx.restore();
};

const spawnShootingStar = () => {
  shootingStars.push({
    x: Math.random() * canvas.value.width,
    y: Math.random() * (baseMirrorLine * 0.8),
    length: 80 + Math.random() * 50,
    speed: 5 + Math.random() * 3,
    angle: Math.PI / 4,
    alpha: 1
  });
};

const updateShootingStars = () => {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;
    star.alpha -= 0.01;
    if (star.alpha <= 0 || star.y > baseMirrorLine) {
      shootingStars.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
      );
      ctx.strokeStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      drawShootingStarReflection(star);
    }
  }
  if (Math.random() < 0.002) spawnShootingStar();
};

const drawShootingStarReflection = (star) => {
  const mLine = getMirrorLine();
  ctx.save();
  const getWaveOffset = (x) => 5 * Math.sin(x / 100 + time);
  const reflectionY = 2 * mLine - star.y + getWaveOffset(star.x);
  const reflectionEndX = star.x - Math.cos(star.angle) * star.length;
  const reflectionEndY = 2 * mLine - (star.y - Math.sin(star.angle) * star.length) + getWaveOffset(reflectionEndX);
  ctx.beginPath();
  ctx.moveTo(star.x, reflectionY);
  ctx.lineTo(reflectionEndX, reflectionEndY);
  ctx.strokeStyle = `rgba(255,255,255,${star.alpha * 0.5})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
};

//////////////////////
// Mond und Spiegelung mit Strahlen, Kratern und Wasser-Highlights
//////////////////////

const drawMoon = () => {
  const moonX = canvas.value.width * 0.8;
  const moonY = canvas.value.height * 0.2;
  const moonRadius = 60;

  ctx.save();
  // Äußerer Leuchteffekt (Glow)
  ctx.shadowBlur = 30;
  ctx.shadowColor = "rgba(255,255,255,0.6)";

  // Mond-Basiskreis mit radialem Verlauf
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI);
  const moonGradient = ctx.createRadialGradient(
      moonX,
      moonY,
      moonRadius * 0.2,
      moonX,
      moonY,
      moonRadius
  );
  moonGradient.addColorStop(0, "rgba(255,255,255,1)");
  moonGradient.addColorStop(0.7, "rgba(220,220,220,0.9)");
  moonGradient.addColorStop(1, "rgba(180,180,180,0.8)");
  ctx.fillStyle = moonGradient;
  ctx.fill();

  // Entferne den Glow-Effekt für weitere Details
  ctx.shadowBlur = 0;

  // Innere Abschattung
  ctx.globalCompositeOperation = "multiply";
  ctx.beginPath();
  ctx.arc(moonX - 10, moonY - 10, moonRadius * 0.95, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // Krater hinzufügen
  const craterData = [
    { x: -15, y: -10, r: 8 },
    { x: 10, y: 5, r: 6 },
    { x: -5, y: 20, r: 5 },
    { x: 20, y: -15, r: 7 }
  ];
  craterData.forEach(crater => {
    ctx.beginPath();
    ctx.arc(moonX + crater.x, moonY + crater.y, crater.r, 0, 2 * Math.PI);
    const craterGradient = ctx.createRadialGradient(
        moonX + crater.x,
        moonY + crater.y,
        crater.r * 0.3,
        moonX + crater.x,
        moonY + crater.y,
        crater.r
    );
    craterGradient.addColorStop(0, "rgba(100,100,100,0.6)");
    craterGradient.addColorStop(1, "rgba(50,50,50,0.4)");
    ctx.fillStyle = craterGradient;
    ctx.fill();
  });
  ctx.restore();
};

const drawMoonReflection = () => {
  const mLine = getMirrorLine();
  const moonX = canvas.value.width * 0.8;
  const moonY = canvas.value.height * 0.2;
  const moonRadius = 60;

  ctx.save();
  // Beschränke den Zeichnungsbereich auf den Spiegelungsbereich
  ctx.beginPath();
  ctx.rect(0, mLine, canvas.value.width, canvas.value.height - mLine);
  ctx.clip();

  // Transformation zur vertikalen Spiegelung mit Kompression
  ctx.translate(0, 2 * mLine);
  ctx.scale(1, -0.67);
  ctx.globalAlpha = 0.4;

  // Mondspiegelung zeichnen
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI);
  const moonReflectionGradient = ctx.createRadialGradient(
      moonX,
      moonY,
      moonRadius * 0.2,
      moonX,
      moonY,
      moonRadius
  );
  moonReflectionGradient.addColorStop(0, "rgba(255,255,255,0.5)");
  moonReflectionGradient.addColorStop(0.7, "rgba(220,220,220,0.4)");
  moonReflectionGradient.addColorStop(1, "rgba(180,180,180,0.3)");
  ctx.fillStyle = moonReflectionGradient;
  ctx.fill();

  // Zusätzlicher Glanzstreifen (Schimmer) auf der Spiegelung
  const shimmerGradient = ctx.createLinearGradient(
      moonX - moonRadius,
      moonY,
      moonX + moonRadius,
      moonY
  );
  shimmerGradient.addColorStop(0, "rgba(255,255,255,0)");
  shimmerGradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  shimmerGradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shimmerGradient;
  ctx.fillRect(
      moonX - moonRadius,
      moonY - moonRadius * 0.3,
      moonRadius * 2,
      moonRadius * 0.6
  );
  ctx.restore();
};

//////////////////////
// Wasser-Overlay mit Glanz am Horizont
//////////////////////

const drawReflectionOverlay = () => {
  const mLine = getMirrorLine();
  ctx.save();
  ctx.filter = 'blur(3px)';
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = waterColor;
  ctx.fillRect(0, mLine, canvas.value.width, canvas.value.height - mLine);

  // Glanz am Übergang zwischen Wasser und Himmel
  const horizonHeight = 50;
  const shineGradient = ctx.createLinearGradient(
      0,
      mLine - horizonHeight,
      0,
      mLine + horizonHeight
  );
  shineGradient.addColorStop(0, "rgba(255,255,255,0.1)");
  shineGradient.addColorStop(0.5, "rgba(255,255,255,0.4)");
  shineGradient.addColorStop(1, "rgba(255,255,255,0.1)");
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = shineGradient;
  ctx.fillRect(0, mLine - horizonHeight, canvas.value.width, horizonHeight * 2);
  ctx.restore();
};

////////////////////////
// Zusätzlicher Wasserstrahl unter dem Mond
////////////////////////
function drawMoonWaterBeam() {
  const mirrorLine = getMirrorLine();

  // Position des Mondes anpassen
  const moonX = canvas.value.width * 0.8;
  const moonY = canvas.value.height * 0.2;
  const moonRadius = 60;

  // Wenn Mond unterhalb oder nahe der Spiegelungslinie, kein Platz für den Effekt
  if (moonY >= mirrorLine - 10) return;

  // Einstellungen für den Streifen
  const beamTopWidth = moonRadius * 0.7;      // Breite oben direkt unterm Mond
  const beamBottomWidth = moonRadius * 5;     // Breite unten, weiter entfernt
  const beamHeight = canvas.value.height - mirrorLine; // Höhe vom Wasserspiegel bis zum unteren Rand
  const segments = 10;                        // Anzahl Segmente für den Verlauf

  // Wellenamplitude – wie stark soll es an den Rändern „wackeln“?
  const waveAmplitude = 5;

  // Erzeuge Punktlisten für die linke und rechte Kante
  const leftPoints = [];
  const rightPoints = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Aktuelle y-Position
    const currentY = mirrorLine + t * beamHeight;
    // Breite an dieser Stelle
    const currentWidth = beamTopWidth + t * (beamBottomWidth - beamTopWidth);

    // Leichte Wellenbewegung
    const waveOffset = waveAmplitude * Math.sin((currentY + time * 100) / 30);

    // Linke / rechte Seite
    const leftX = moonX - currentWidth / 2 + waveOffset;
    const rightX = moonX + currentWidth / 2 + waveOffset;

    leftPoints.push({ x: leftX, y: currentY });
    rightPoints.push({ x: rightX, y: currentY });
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, mirrorLine, canvas.value.width, canvas.value.height - mirrorLine);
  ctx.clip();

  ctx.beginPath();
  ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
  // Linke Kante nach unten
  for (let i = 1; i < leftPoints.length; i++) {
    ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
  }
  // Rechte Kante von unten nach oben
  for (let i = rightPoints.length - 1; i >= 0; i--) {
    ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
  }
  ctx.closePath();

  // Farbverlauf
  const beamGradient = ctx.createLinearGradient(0, mirrorLine, 0, mirrorLine + beamHeight);
  beamGradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  beamGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.3)");
  beamGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = beamGradient;
  ctx.fill();
  ctx.restore();
}

//////////////////////
// Haupt-Update-Schleife
//////////////////////

const update = () => {
  time += 0.005;
  loadPrimaryColor();
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  drawMoon();
  drawStars();
  drawStarsReflection();
  updatePolarLights();
  updateShootingStars();
  drawMoonReflection();
  drawReflectionOverlay();
  drawMoonWaterBeam();

  animationFrameId = requestAnimationFrame(update);
};

onMounted(() => {
  initCanvas();
  loadPrimaryColor();
  loadWaterColor();
  initStars();
  window.addEventListener('resize', initCanvas);
  update();
});

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000; /* Nachthimmel */
  pointer-events: none;
  z-index: -1;
}
</style>