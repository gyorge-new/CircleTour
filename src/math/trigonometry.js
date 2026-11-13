import { notableAngles } from '../config.js';

export function graphFunctionValue(kind, radians) {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  if (kind === 'sin') return sin;
  if (kind === 'cos') return cos;
  if (kind === 'tan') return Math.tan(radians);
  if (kind === 'sec') return 1 / cos;
  if (kind === 'csc') return 1 / sin;
  return cos / sin;
}

export function graphDenominator(kind, radians) {
  if (kind === 'tan' || kind === 'sec') return Math.cos(radians);
  if (kind === 'csc' || kind === 'cot') return Math.sin(radians);
  return 1;
}

export function decimalToFraction(number) {
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

export function formatTrigValue(number) {
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
    [2 * Math.sqrt(3) / 3, '2√3/3'], [-2 * Math.sqrt(3) / 3, '−2√3/3'],
  ];
  const exact = exactValues.find(([value]) => Math.abs(number - value) < 1e-8);

  return exact ? exact[1] : decimalToFraction(number);
}

export function radianLabel(degrees) {
  if (degrees === 0) return '0';

  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const divisor = gcd(degrees, 180);
  const numerator = degrees / divisor;
  const denominator = 180 / divisor;

  if (denominator === 1) return numerator === 1 ? 'π' : `${numerator}π`;
  return `${numerator === 1 ? '' : numerator}π / ${denominator}`;
}

export function clippedLineEndpoints(x, y, dx, dy, bounds) {
  const crossings = [];
  const { min, max } = bounds;

  if (Math.abs(dx) > 1e-8) {
    [min, max].forEach(edgeX => {
      const t = (edgeX - x) / dx;
      const edgeY = y + t * dy;
      if (edgeY >= min && edgeY <= max) crossings.push({ t, x: edgeX, y: edgeY });
    });
  }
  if (Math.abs(dy) > 1e-8) {
    [min, max].forEach(edgeY => {
      const t = (edgeY - y) / dy;
      const edgeX = x + t * dx;
      if (edgeX >= min && edgeX <= max) crossings.push({ t, x: edgeX, y: edgeY });
    });
  }

  crossings.sort((a, b) => a.t - b.t);
  return crossings.length >= 2 ? [crossings[0], crossings.at(-1)] : null;
}

export function nextNotableAngle(angle) {
  const revolution = Math.floor(angle / 360) * 360;
  const withinRevolution = angle - revolution;
  const next = notableAngles.find(value => value > withinRevolution + 1e-7);
  return revolution + (next === undefined ? 360 : next);
}
