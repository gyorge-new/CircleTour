const slider = document.querySelector('#angle');
const degree = document.querySelector('#degree');
const controlDegree = document.querySelector('#controlDegree');
const sliderDegree = document.querySelector('#sliderDegree');
const radian = document.querySelector('#radian');
const cosValue = document.querySelector('#cosValue');
const sinValue = document.querySelector('#sinValue');
const tanValue = document.querySelector('#tanValue');
const point = document.querySelector('#point');
const radius = document.querySelector('#radius');
const radiusExtension = document.querySelector('#radiusExtension');
const cosLine = document.querySelector('#cosLine');
const sinLine = document.querySelector('#sinLine');
const tanLine = document.querySelector('#tanLine');
const arc = document.querySelector('#arc');
const quadrant = document.querySelector('#quadrant');
const insightText = document.querySelector('#insightText');
const playArcade = document.querySelector('#playArcade');
const playSmooth = document.querySelector('#playSmooth');
const playNextNotable = document.querySelector('#playNextNotable');
const presets = [...document.querySelectorAll('.preset-row button')];
const controlCos = document.querySelector('#controlCos');
const controlSin = document.querySelector('#controlSin');
const controlTan = document.querySelector('#controlTan');
const angleStamp = document.querySelector('#angleStamp');
const stampValue = document.querySelector('#stampValue');
const familyToggle = [...document.querySelectorAll('[data-function-family]')];
const symbolSin = document.querySelector('#symbolSin');
const symbolCos = document.querySelector('#symbolCos');
const symbolTan = document.querySelector('#symbolTan');
const readoutSinName = document.querySelector('#readoutSinName');
const readoutCosName = document.querySelector('#readoutCosName');
const readoutTanName = document.querySelector('#readoutTanName');
const secLine = document.querySelector('#secLine');
const cscLine = document.querySelector('#cscLine');
const cotLine = document.querySelector('#cotLine');
const pointTangent = document.querySelector('#pointTangent');
const tangentRightAngle = document.querySelector('#tangentRightAngle');
const secPoint = document.querySelector('#secPoint');
const cscPoint = document.querySelector('#cscPoint');
const reciprocalPoint = document.querySelector('#reciprocalPoint');
const graphAsymptotes = document.querySelector('#graphAsymptotes');
const reciprocalAsymptotes = document.querySelector('#reciprocalAsymptotes');
const graphLegendLabels = [document.querySelector('#legendSin'), document.querySelector('#legendCos'), document.querySelector('#legendTan')];
const graphPanel = document.querySelector('#graficos');
const graphGrid = document.querySelector('#graphGrid');
const graphLabels = document.querySelector('#graphLabels');
const graphCurrent = document.querySelector('#graphCurrent');
const graphCursor = document.querySelector('#graphCursor');
const graphPaths = {
  sin: document.querySelector('#graphSin'),
  cos: document.querySelector('#graphCos'),
  tan: document.querySelector('#graphTan'),
  sec: document.querySelector('#graphSec'),
  csc: document.querySelector('#graphCsc'),
  cot: document.querySelector('#graphCot')
};
const graphMarkers = {
  sin: document.querySelector('#markerSin'),
  cos: document.querySelector('#markerCos'),
  tan: document.querySelector('#markerTan'),
  sec: document.querySelector('#markerSec'),
  csc: document.querySelector('#markerCsc'),
  cot: document.querySelector('#markerCot')
};
const graphButtons = [...document.querySelectorAll('[data-graph]')];
let functionFamily = 'common';
let selectedGraph = 'sin';
const center = 230, radiusSize = 200 / 3;
document.querySelector('#laboratorio').dataset.family = 'common';
// Tempos das animações em segundos; Arcade também inclui as pausas.
const ARCADE_REVOLUTION_SECONDS = 30;
const SMOOTH_REVOLUTION_SECONDS = 6.7;
const ARCADE_PAUSE_MS = 1500;
const NOTABLE_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
let animationFrame = null;

const plot = { left: 60, top: 35, width: 720, height: 385, minY: -2, maxY: 2 };
const graphX = degrees => plot.left + plot.width * degrees / 360;
const graphY = value => plot.top + plot.height * (plot.maxY - value) / (plot.maxY - plot.minY);
const familyKeys = {
  common: ['sin', 'cos', 'tan'],
  reciprocal: ['csc', 'sec', 'cot']
};
const familyLabels = {
  common: ['Seno', 'Cosseno', 'Tangente'],
  reciprocal: ['Cossecante', 'Secante', 'Cotangente']
};
const familySymbols = {
  common: ['sen', 'cos', 'tg'],
  reciprocal: ['cossec', 'sec', 'cotg']
};
function graphFunctionValue(kind, radians) {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  if (kind === 'sin') return sin;
  if (kind === 'cos') return cos;
  if (kind === 'tan') return Math.tan(radians);
  if (kind === 'sec') return 1 / cos;
  if (kind === 'csc') return 1 / sin;
  return cos / sin;
}
function graphDenominator(kind, radians) {
  if (kind === 'tan' || kind === 'sec') return Math.cos(radians);
  if (kind === 'csc' || kind === 'cot') return Math.sin(radians);
  return 1;
}
function svgText(parent, x, y, text, className, anchor = 'middle') {
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', x);
  label.setAttribute('y', y);
  label.setAttribute('text-anchor', anchor);
  label.setAttribute('class', className);
  label.textContent = text;
  parent.appendChild(label);
}

for (let deg = 0; deg <= 360; deg += 15) {
  const x = graphX(deg);
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x);
  line.setAttribute('x2', x);
  line.setAttribute('y1', plot.top);
  line.setAttribute('y2', plot.top + plot.height);
  line.setAttribute('class', deg % 45 === 0 ? 'graph-grid-major' : 'graph-grid-minor');
  graphGrid.appendChild(line);
  if (deg % 45 === 0) svgText(graphLabels, x, 443, `${deg}°`, 'graph-axis-label');
}
for (let value = plot.minY; value <= plot.maxY + 1e-6; value += 0.5) {
  const y = graphY(value);
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', plot.left);
  line.setAttribute('x2', plot.left + plot.width);
  line.setAttribute('y1', y);
  line.setAttribute('y2', y);
  line.setAttribute('class', Number.isInteger(value) ? 'graph-grid-major' : 'graph-grid-minor');
  graphGrid.appendChild(line);
  if (Number.isInteger(value)) svgText(graphLabels, 49, y + 3, String(value).replace('-', '−'), 'graph-axis-label', 'end');
}

function makeGraphPath(kind) {
  let path = '', drawing = false;
  const step = ['tan', 'sec', 'csc', 'cot'].includes(kind) ? 0.5 : 1;
  for (let deg = 0; deg <= 360; deg += step) {
    const radians = deg * Math.PI / 180;
    const value = graphFunctionValue(kind, radians);
    const valid = Number.isFinite(value) && Math.abs(graphDenominator(kind, radians)) > 0.025 && value >= plot.minY && value <= plot.maxY;
    if (!valid) {
      drawing = false;
      continue;
    }
    path += `${drawing ? 'L' : 'M'}${graphX(deg).toFixed(2)},${graphY(value).toFixed(2)} `;
    drawing = true;
  }
  return path;
}
Object.entries(graphPaths).forEach(([kind, path]) => path.setAttribute('d', makeGraphPath(kind)));
graphPanel.dataset.visible = 'sin';
function applyGraphSelection() {
  graphPanel.dataset.family = functionFamily;
  graphPanel.dataset.visible = selectedGraph;
  const visibleKeys = familyKeys[functionFamily];
  Object.entries(graphPaths).forEach(([key, path]) => {
    path.style.display = (selectedGraph === 'all' ? visibleKeys.includes(key) : selectedGraph === key) ? 'block' : 'none';
  });
  graphButtons.forEach((button, index) => {
    button.dataset.graph = index < 3 ? visibleKeys[index] : 'all';
    button.textContent = index < 3 ? familyLabels[functionFamily][index] : 'Todas';
    const selected = button.dataset.graph === selectedGraph;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  graphLegendLabels.forEach((label, index) => {
    label.textContent = `${familySymbols[functionFamily][index]} θ`;
  });
  const asymptoteAtCosZero = functionFamily === 'common'
    ? selectedGraph === 'tan' || selectedGraph === 'all'
    : selectedGraph === 'sec' || selectedGraph === 'all';
  const asymptoteAtSinZero = functionFamily === 'reciprocal' && (selectedGraph === 'csc' || selectedGraph === 'cot' || selectedGraph === 'all');
  graphAsymptotes.style.display = asymptoteAtCosZero ? 'block' : 'none';
  reciprocalAsymptotes.style.display = asymptoteAtSinZero ? 'block' : 'none';
  updateFunctionGraph(Number(slider.value));
}

graphButtons.forEach(button => button.addEventListener('click', () => {
  selectedGraph = button.dataset.graph;
  applyGraphSelection();
}));

function setFunctionFamily(nextFamily) {
  if (nextFamily === functionFamily) return;
  const oldKeys = familyKeys[functionFamily];
  const slot = selectedGraph === 'all' ? 3 : Math.max(0, oldKeys.indexOf(selectedGraph));
  functionFamily = nextFamily;
  selectedGraph = slot === 3 ? 'all' : familyKeys[functionFamily][slot];
  familyToggle.forEach(button => {
    const selected = button.dataset.functionFamily === functionFamily;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const symbols = familySymbols[functionFamily];
  [symbolSin, symbolCos, symbolTan, readoutSinName, readoutCosName, readoutTanName].forEach((element, index) => {
    element.textContent = symbols[index % 3];
  });
  document.querySelector('#sinLabel').textContent = symbols[0];
  document.querySelector('#cosLabel').textContent = symbols[1];
  document.querySelector('#tanLabel').textContent = symbols[2];
  document.querySelector('#circleLegendSin').textContent = functionFamily === 'common' ? 'seno' : 'cossecante';
  document.querySelector('#circleLegendCos').textContent = functionFamily === 'common' ? 'cosseno' : 'secante';
  document.querySelector('#circleLegendTan').textContent = functionFamily === 'common' ? 'tangente' : 'cotangente';
  document.querySelector('#laboratorio').dataset.family = functionFamily;
  const concepts = document.querySelector('#conceitos');
  concepts.dataset.family = functionFamily;
  document.querySelector('#conceptDescription').textContent = functionFamily === 'common'
    ? 'Uma posição na circunferência revela três medidas:'
    : 'As funções recíprocas surgem dos interceptos e da inclinação das tangentes:';
  applyGraphSelection();
  update(slider.value);
}
familyToggle.forEach(button => button.addEventListener('click', () => setFunctionFamily(button.dataset.functionFamily)));
applyGraphSelection();

const labelGroup = document.querySelector('#gridLabels');
for (let value = -3; value <= 3; value++) {
  const coordinate = center + value * radiusSize;
  if (Math.abs(value) > 0.001 && coordinate >= 30 && coordinate <= 430) {
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', coordinate);
    xLabel.setAttribute('y', center + 17);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('class', 'grid-number');
    xLabel.textContent = String(value).replace('.', ',');
    labelGroup.appendChild(xLabel);
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', center - 9);
    yLabel.setAttribute('y', center - value * radiusSize + 3);
    yLabel.setAttribute('text-anchor', 'end');
    yLabel.setAttribute('class', 'grid-number');
    yLabel.textContent = String(value).replace('.', ',');
    labelGroup.appendChild(yLabel);
  }
}

function formatNumber(number) {
  if (!Number.isFinite(number)) return 'indef.';
  if (Math.abs(number) < 0.0005) return '0,000';
  return number.toFixed(3).replace('-', '−').replace('.', ',');
}

function decimalToFraction(number) {
  if (!Number.isFinite(number)) return 'indef.';
  const absoluteValue = Math.abs(number);
  let rounded = Math.round(absoluteValue * 1000);
  if (rounded / 1000 === Math.round(absoluteValue) && absoluteValue !== rounded / 1000) {
    rounded += absoluteValue < rounded / 1000 ? -1 : 1;
  }
  if (rounded === 0) return '0';
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const divisor = gcd(rounded, 1000);
  const numerator = rounded / divisor;
  const denominator = 1000 / divisor;
  const sign = number < 0 ? '−' : '';
  return denominator === 1 ? `${sign}${numerator}` : `${sign}${numerator}/${denominator}`;
}

function formatTrigValue(number) {
  if (!Number.isFinite(number)) return 'indef.';
  const root2over2 = Math.SQRT1_2;
  const root3over2 = Math.sqrt(3) / 2;
  const exactValues = [
    [0, '0'], [1, '1'], [-1, '−1'],
    [2, '2'], [-2, '−2'], [Math.SQRT2, '√2'], [-Math.SQRT2, '−√2'],
    [0.5, '1/2'], [-0.5, '−1/2'],
    [root2over2, '√2/2'], [-root2over2, '−√2/2'],
    [root3over2, '√3/2'], [-root3over2, '−√3/2'],
    [Math.sqrt(3), '√3'], [-Math.sqrt(3), '−√3'],
    [Math.sqrt(3) / 3, '√3/3'], [-Math.sqrt(3) / 3, '−√3/3'],
    [2 * Math.sqrt(3) / 3, '2√3/3'], [-2 * Math.sqrt(3) / 3, '−2√3/3']
  ];
  const exact = exactValues.find(([value]) => Math.abs(number - value) < 1e-8);
  return exact ? exact[1] : decimalToFraction(number);
}

function radianLabel(deg) {
  if (deg === 0) return '0';
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const divisor = gcd(deg, 180);
  const numerator = deg / divisor;
  const denominator = 180 / divisor;
  if (denominator === 1) return numerator === 1 ? 'π' : `${numerator}π`;
  return `${numerator === 1 ? '' : numerator}π / ${denominator}`;
}

function setLine(line, x1, y1, x2, y2) {
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
}

function clippedLineEndpoints(x, y, dx, dy) {
  const crossings = [];
  if (Math.abs(dx) > 1e-8) [30, 430].forEach(edgeX => {
    const t = (edgeX - x) / dx, edgeY = y + t * dy;
    if (edgeY >= 30 && edgeY <= 430) crossings.push({ t, x: edgeX, y: edgeY });
  });
  if (Math.abs(dy) > 1e-8) [30, 430].forEach(edgeY => {
    const t = (edgeY - y) / dy, edgeX = x + t * dx;
    if (edgeX >= 30 && edgeX <= 430) crossings.push({ t, x: edgeX, y: edgeY });
  });
  crossings.sort((a, b) => a.t - b.t);
  return crossings.length >= 2 ? [crossings[0], crossings.at(-1)] : null;
}

function update(rawAngle) {
  const deg = Number(rawAngle);
  const theta = deg * Math.PI / 180;
  const cos = Math.cos(theta), sin = Math.sin(theta);
  const x = center + radiusSize * cos;
  const y = center - radiusSize * sin;
  const tangent = Math.abs(cos) < 0.00001 ? Infinity : sin / cos;
  const secant = Math.abs(cos) < 1e-8 ? Infinity : 1 / cos;
  const cosecant = Math.abs(sin) < 1e-8 ? Infinity : 1 / sin;
  const cotangent = Math.abs(sin) < 1e-8 ? Infinity : cos / sin;
  const displayedSin = functionFamily === 'common' ? sin : cosecant;
  const displayedCos = functionFamily === 'common' ? cos : secant;
  const displayedTan = functionFamily === 'common' ? tangent : cotangent;
  degree.textContent = deg;
  controlDegree.textContent = deg;
  sliderDegree.textContent = `${deg}°`;
  radian.textContent = radianLabel(deg);
  cosValue.textContent = formatTrigValue(displayedCos);
  sinValue.textContent = formatTrigValue(displayedSin);
  tanValue.textContent = formatTrigValue(displayedTan);
  controlCos.textContent = formatTrigValue(displayedCos);
  controlSin.textContent = formatTrigValue(displayedSin);
  controlTan.textContent = formatTrigValue(displayedTan);
  point.setAttribute('cx', x);
  point.setAttribute('cy', y);
  setLine(radius, center, center, x, y);
  // Continue the angle line across the plotting area so it always reaches x = 1.
  const directionY = -sin;
  const crossings = [];
  if (Math.abs(cos) > 1e-8) [30, 430].forEach(edgeX => {
    const t = (edgeX - center) / cos;
    const edgeY = center + t * directionY;
    if (edgeY >= 30 && edgeY <= 430) crossings.push({ t, x: edgeX, y: edgeY });
  });
  if (Math.abs(directionY) > 1e-8) [30, 430].forEach(edgeY => {
    const t = (edgeY - center) / directionY;
    const edgeX = center + t * cos;
    if (edgeX >= 30 && edgeX <= 430) crossings.push({ t, x: edgeX, y: edgeY });
  });
  crossings.sort((a, b) => a.t - b.t);
  if (crossings.length >= 2) setLine(radiusExtension, crossings[0].x, crossings[0].y, crossings.at(-1).x, crossings.at(-1).y);
  setLine(cosLine, center, center, x, center);
  setLine(sinLine, x, center, x, y);
  const tanX = center + radiusSize;
  const tanY = center - radiusSize * tangent;
  setLine(document.querySelector('#tanGuide'), tanX, 30, tanX, 430);
  setLine(document.querySelector('#topTanGuide'), 30, center - radiusSize, 430, center - radiusSize);
  setLine(tanLine, tanX, center, tanX, Math.max(30, Math.min(430, tanY)));
  const secDefined = Math.abs(cos) > 1e-8;
  const cscDefined = Math.abs(sin) > 1e-8;
  const secX = secDefined ? Math.max(30, Math.min(430, center + radiusSize * secant)) : center;
  const cscY = cscDefined ? Math.max(30, Math.min(430, center - radiusSize * cosecant)) : center;
  const cotX = cscDefined ? Math.max(30, Math.min(430, center + radiusSize * cotangent)) : center;
  const cotY = center - radiusSize;
  setLine(secLine, center, center, secX, center);
  setLine(cscLine, center, center, center, cscY);
  setLine(cotLine, center, cotY, cotX, cotY);
  const tangentEndpoints = clippedLineEndpoints(x, y, sin, cos);
  if (tangentEndpoints) setLine(pointTangent, tangentEndpoints[0].x, tangentEndpoints[0].y, tangentEndpoints[1].x, tangentEndpoints[1].y);
  const markSize = 10;
  const inwardX = -cos, inwardY = sin, alongX = sin, alongY = cos;
  const corner1 = { x: x + markSize * inwardX, y: y + markSize * inwardY };
  const corner2 = { x: x + markSize * (inwardX + alongX), y: y + markSize * (inwardY + alongY) };
  const corner3 = { x: x + markSize * alongX, y: y + markSize * alongY };
  tangentRightAngle.setAttribute('d', `M ${corner1.x} ${corner1.y} L ${corner2.x} ${corner2.y} L ${corner3.x} ${corner3.y}`);
  secPoint.setAttribute('cx', secX);
  secPoint.setAttribute('cy', center);
  cscPoint.setAttribute('cx', center);
  cscPoint.setAttribute('cy', cscY);
  reciprocalPoint.setAttribute('cx', cotX);
  reciprocalPoint.setAttribute('cy', cotY);
  secLine.style.display = secPoint.style.display = secDefined ? '' : 'none';
  cscLine.style.display = cscPoint.style.display = cotLine.style.display = reciprocalPoint.style.display = cscDefined ? '' : 'none';
  document.querySelector('#secLabel').style.display = secDefined ? '' : 'none';
  document.querySelector('#cscLabel').style.display = document.querySelector('#cotLabel').style.display = cscDefined ? '' : 'none';
  const arcRadius = radiusSize * 0.26;
  const arcEndX = center + arcRadius * Math.cos(theta);
  const arcEndY = center - arcRadius * Math.sin(theta);
  const largeArc = deg > 180 ? 1 : 0;
  arc.setAttribute('d', `M ${center + arcRadius} ${center} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`);
  const cosLabel = document.querySelector('#cosLabel');
  const sinLabel = document.querySelector('#sinLabel');
  const tanLabel = document.querySelector('#tanLabel');
  cosLabel.setAttribute('x', center + (radiusSize * cos) / 2 - 10);
  cosLabel.setAttribute('y', center + (sin >= 0 ? 20 : -9));
  sinLabel.setAttribute('x', x + (cos >= 0 ? 7 : -28));
  sinLabel.setAttribute('y', center + (y - center) / 2 + (sin >= 0 ? 0 : 12));
  tanLabel.setAttribute('x', tanX + 7);
  tanLabel.setAttribute('y', Math.max(40, Math.min(420, center - radiusSize * tangent / 2)));
  document.querySelector('#secLabel').setAttribute('x', (center + secX) / 2);
  document.querySelector('#secLabel').setAttribute('y', center + 18);
  document.querySelector('#cscLabel').setAttribute('x', center + 8);
  document.querySelector('#cscLabel').setAttribute('y', (center + cscY) / 2);
  document.querySelector('#cotLabel').setAttribute('x', (center + cotX) / 2);

  const q = deg === 0 || deg === 90 || deg === 180 || deg === 270 ? 'EIXO' : `${Math.floor(deg / 90) + 1}º QUADRANTE`;
  quadrant.textContent = q;
  insightText.innerHTML = `Ponto: (${formatTrigValue(cos)}; ${formatTrigValue(sin)})`;
  slider.style.background = `linear-gradient(to right,#528565 0 ${deg / 359 * 100}%,#e4e8e1 ${deg / 359 * 100}% 100%)`;
  presets.forEach(button => button.classList.toggle('selected', Number(button.dataset.angle) === deg));
  updateFunctionGraph(deg);
}

function updateFunctionGraph(deg) {
  if (!graphPanel) return;
  const radians = deg * Math.PI / 180;
  const x = graphX(deg);
  graphCursor.setAttribute('x1', x);
  graphCursor.setAttribute('x2', x);
  graphCurrent.textContent = `θ = ${deg}°`;
  const values = Object.fromEntries(Object.keys(graphMarkers).map(kind => [kind, graphFunctionValue(kind, radians)]));
  Object.entries(values).forEach(([kind, value]) => {
    const marker = graphMarkers[kind];
    const selected = selectedGraph === 'all' ? familyKeys[functionFamily].includes(kind) : selectedGraph === kind;
    const visible = selected && Number.isFinite(value) && Math.abs(graphDenominator(kind, radians)) > 0.025 && Math.abs(value) <= plot.maxY;
    marker.style.display = visible ? '' : 'none';
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', graphY(Math.max(plot.minY, Math.min(plot.maxY, value))));
  });
}

slider.addEventListener('input', () => {
  stopAnimation();
  update(slider.value);
});
presets.forEach(button => button.addEventListener('click', () => {
  stopAnimation();
  slider.value = button.dataset.angle;
  update(slider.value);
}));

function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  [playArcade, playSmooth, playNextNotable].forEach(button => {
    button.classList.remove('playing');
    button.querySelector('.mode-text').textContent = button === playArcade ? 'Arcade' : button === playSmooth ? 'Contínuo' : 'Próximo';
    button.querySelector('.play-icon').textContent = button === playNextNotable ? '↦' : '▶';
  });
  angleStamp.classList.remove('stamp-hit');
}

function startAnimation(mode) {
  const button = mode === 'arcade' ? playArcade : playSmooth;
  if (animationFrame) {
    if (button.classList.contains('playing')) return stopAnimation();
    stopAnimation();
  }
  button.classList.add('playing');
  button.querySelector('.mode-text').textContent = 'Pausar';
  button.querySelector('.play-icon').textContent = 'Ⅱ';
  let previous = null;
  let currentAngle = Number(slider.value);
  let targetAngle = mode === 'arcade' ? nextNotableAngle(currentAngle) : Infinity;
  let pauseRemaining = 0;
  const revolutionSeconds = mode === 'arcade' ? ARCADE_REVOLUTION_SECONDS : SMOOTH_REVOLUTION_SECONDS;
  const pauseDuration = mode === 'arcade' ? ARCADE_PAUSE_MS : 0;
  const movementDuration = Math.max(1000, revolutionSeconds * 1000 - NOTABLE_ANGLES.length * pauseDuration);
  const degreesPerMillisecond = 360 / movementDuration;
  const animate = time => {
    if (previous === null) previous = time;
    const delta = Math.min(time - previous, 100);
    previous = time;
    if (mode === 'arcade' && pauseRemaining > 0) {
      pauseRemaining -= delta;
      if (pauseRemaining <= 0) targetAngle = nextNotableAngle(currentAngle);
    } else {
      currentAngle += delta * degreesPerMillisecond;
      if (mode === 'arcade' && currentAngle >= targetAngle) {
        currentAngle = targetAngle;
        pauseRemaining = ARCADE_PAUSE_MS;
        pulseValues(Math.round(((currentAngle % 360) + 360) % 360));
      }
    }
    const visibleAngle = ((currentAngle % 360) + 360) % 360;
    slider.value = Math.floor(visibleAngle);
    update(slider.value);
    animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);
}

playArcade.addEventListener('click', () => startAnimation('arcade'));
playSmooth.addEventListener('click', () => startAnimation('smooth'));
playNextNotable.addEventListener('click', animateToNextNotable);

function nextNotableAngle(angle) {
  const revolution = Math.floor(angle / 360) * 360;
  const withinRevolution = angle - revolution;
  const next = NOTABLE_ANGLES.find(notable => notable > withinRevolution + 1e-7);
  return revolution + (next === undefined ? 360 : next);
}

function animateToNextNotable() {
  if (animationFrame && playNextNotable.classList.contains('playing')) return stopAnimation();
  stopAnimation();
  playNextNotable.classList.add('playing');
  playNextNotable.querySelector('.mode-text').textContent = 'Próximo';
  playNextNotable.querySelector('.play-icon').textContent = 'Ⅱ';
  const startAngle = Number(slider.value);
  const targetAngle = nextNotableAngle(startAngle);
  const destination = targetAngle % 360;
  const distance = targetAngle - startAngle;
  const duration = Math.max(300, distance * SMOOTH_REVOLUTION_SECONDS * 1000 / 360);
  let startedAt = null;
  const animate = time => {
    if (startedAt === null) startedAt = time;
    const progress = Math.min((time - startedAt) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const currentAngle = startAngle + distance * eased;
    slider.value = progress === 1 ? destination : Math.floor(currentAngle % 360);
    update(slider.value);
    if (progress === 1) {
      stopAnimation();
      pulseValues(destination);
      return;
    }
    animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);
}

function pulseValues(angle) {
  stampValue.textContent = `${angle}°`;
  angleStamp.classList.remove('stamp-hit');
  void angleStamp.offsetWidth;
  angleStamp.classList.add('stamp-hit');
  angleStamp.onanimationend = () => angleStamp.classList.remove('stamp-hit');
  document.querySelectorAll('.function-row, .plot-readout div').forEach(element => {
    element.classList.remove('notable-pulse');
    void element.offsetWidth;
    element.classList.add('notable-pulse');
  });
}

update(slider.value);
window.setTimeout(() => document.querySelector('#loadingScreen').classList.add('is-hidden'), 2000);

document.querySelectorAll('[data-tab]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-tab]').forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === tab.dataset.tab));
}));
document.querySelector('[data-go-lab]').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('[data-tab="laboratorio"]').click();
});
