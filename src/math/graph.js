import { graphConfig } from '../config.js';
import { graphDenominator, graphFunctionValue } from './trigonometry.js';

export function graphX(degrees) {
  return graphConfig.left + graphConfig.width * degrees / 360;
}

export function graphY(value) {
  return graphConfig.top + graphConfig.height * (graphConfig.maxY - value)
    / (graphConfig.maxY - graphConfig.minY);
}

export function makeGraphPath(kind) {
  let path = '';
  let drawing = false;
  const step = ['tan', 'sec', 'csc', 'cot'].includes(kind) ? 0.5 : 1;

  for (let degrees = 0; degrees <= 360; degrees += step) {
    const radians = degrees * Math.PI / 180;
    const value = graphFunctionValue(kind, radians);
    const valid = Number.isFinite(value)
      && Math.abs(graphDenominator(kind, radians)) > 0.025
      && value >= graphConfig.minY
      && value <= graphConfig.maxY;

    if (!valid) {
      drawing = false;
      continue;
    }

    path += `${drawing ? 'L' : 'M'}${graphX(degrees).toFixed(2)},${graphY(value).toFixed(2)} `;
    drawing = true;
  }

  return path;
}
