import { circleConfig } from '../config.js';
import { clippedLineEndpoints, formatTrigValue, radianLabel } from '../math/trigonometry.js';
import { setLine } from '../utils/svg.js';

export class CircleView {
  constructor(elements) {
    this.elements = elements;
  }

  createCoordinateLabels() {
    const { center, radius, bounds } = circleConfig;
    const labelGroup = this.elements.labels;

    for (let value = -3; value <= 3; value++) {
      const coordinate = center + value * radius;
      if (value === 0 || coordinate < bounds.min || coordinate > bounds.max) continue;

      const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xLabel.setAttribute('x', coordinate);
      xLabel.setAttribute('y', center + 17);
      xLabel.setAttribute('text-anchor', 'middle');
      xLabel.setAttribute('class', 'grid-number');
      xLabel.textContent = String(value).replace('.', ',');
      labelGroup.appendChild(xLabel);

      const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      yLabel.setAttribute('x', center - 9);
      yLabel.setAttribute('y', center - value * radius + 3);
      yLabel.setAttribute('text-anchor', 'end');
      yLabel.setAttribute('class', 'grid-number');
      yLabel.textContent = String(value).replace('.', ',');
      labelGroup.appendChild(yLabel);
    }
  }

  render(rawAngle, family) {
    const elements = this.elements;
    const { center, radius, bounds } = circleConfig;
    const degrees = Number(rawAngle);
    const radians = degrees * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = center + radius * cos;
    const y = center - radius * sin;
    const tangent = Math.abs(cos) < 0.00001 ? Infinity : sin / cos;
    const secant = Math.abs(cos) < 1e-8 ? Infinity : 1 / cos;
    const cosecant = Math.abs(sin) < 1e-8 ? Infinity : 1 / sin;
    const cotangent = Math.abs(sin) < 1e-8 ? Infinity : cos / sin;
    const displayedSin = family === 'common' ? sin : cosecant;
    const displayedCos = family === 'common' ? cos : secant;
    const displayedTan = family === 'common' ? tangent : cotangent;

    elements.degree.textContent = degrees;
    elements.controlDegree.textContent = degrees;
    elements.sliderDegree.textContent = `${degrees}°`;
    elements.radian.textContent = radianLabel(degrees);
    elements.functionValues[0].textContent = formatTrigValue(displayedSin);
    elements.functionValues[1].textContent = formatTrigValue(displayedCos);
    elements.functionValues[2].textContent = formatTrigValue(displayedTan);
    elements.controlValues[0].textContent = formatTrigValue(displayedSin);
    elements.controlValues[1].textContent = formatTrigValue(displayedCos);
    elements.controlValues[2].textContent = formatTrigValue(displayedTan);

    elements.point.setAttribute('cx', x);
    elements.point.setAttribute('cy', y);
    setLine(elements.radius, center, center, x, y);

    const extension = clippedLineEndpoints(center, center, cos, -sin, bounds);
    if (extension) setLine(elements.radiusExtension, extension[0].x, extension[0].y, extension[1].x, extension[1].y);

    setLine(elements.cosineLine, center, center, x, center);
    setLine(elements.sineLine, x, center, x, y);

    const tangentX = center + radius;
    const tangentY = center - radius * tangent;
    setLine(elements.tangentGuide, tangentX, bounds.min, tangentX, bounds.max);
    setLine(elements.topTangentGuide, bounds.min, center - radius, bounds.max, center - radius);
    setLine(elements.tangentLine, tangentX, center, tangentX, Math.max(bounds.min, Math.min(bounds.max, tangentY)));

    this.updateReciprocalGeometry({
      cos,
      sin,
      cosecant,
      cotangent,
      secant,
      point: { x, y },
      center,
      radius,
      bounds,
    });

    const arcRadius = radius * 0.26;
    const arcEndX = center + arcRadius * Math.cos(radians);
    const arcEndY = center - arcRadius * Math.sin(radians);
    const largeArc = degrees > 180 ? 1 : 0;
    elements.arc.setAttribute(
      'd',
      `M ${center + arcRadius} ${center} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`,
    );

    this.positionFunctionLabels({ cos, sin, tangent, x, y, tangentX, center, radius });
    elements.quadrant.textContent = this.getQuadrantLabel(degrees);
    elements.insight.innerHTML = `Ponto: (${formatTrigValue(cos)}; ${formatTrigValue(sin)})`;
    elements.angle.style.background = `linear-gradient(to right,#528565 0 ${degrees / 359 * 100}%,#e4e8e1 ${degrees / 359 * 100}% 100%)`;
    elements.presets.forEach(button => button.classList.toggle('selected', Number(button.dataset.angle) === degrees));
  }

  updateReciprocalGeometry({ cos, sin, cosecant, cotangent, secant, point, center, radius, bounds }) {
    const elements = this.elements;
    const secantDefined = Math.abs(cos) > 1e-8;
    const cosecantDefined = Math.abs(sin) > 1e-8;
    const secantX = secantDefined ? Math.max(bounds.min, Math.min(bounds.max, center + radius * secant)) : center;
    const cosecantY = cosecantDefined ? Math.max(bounds.min, Math.min(bounds.max, center - radius * cosecant)) : center;
    const cotangentX = cosecantDefined ? Math.max(bounds.min, Math.min(bounds.max, center + radius * cotangent)) : center;
    const cotangentY = center - radius;

    setLine(elements.secantLine, center, center, secantX, center);
    setLine(elements.cosecantLine, center, center, center, cosecantY);
    setLine(elements.cotangentLine, center, cotangentY, cotangentX, cotangentY);

    const tangentEndpoints = clippedLineEndpoints(point.x, point.y, sin, cos, bounds);
    if (tangentEndpoints) {
      setLine(elements.pointTangent, tangentEndpoints[0].x, tangentEndpoints[0].y, tangentEndpoints[1].x, tangentEndpoints[1].y);
    }

    const markSize = 10;
    const inwardX = -cos;
    const inwardY = sin;
    const alongX = sin;
    const alongY = cos;
    const corner1 = { x: point.x + markSize * inwardX, y: point.y + markSize * inwardY };
    const corner2 = {
      x: point.x + markSize * (inwardX + alongX),
      y: point.y + markSize * (inwardY + alongY),
    };
    const corner3 = { x: point.x + markSize * alongX, y: point.y + markSize * alongY };
    elements.tangentRightAngle.setAttribute(
      'd',
      `M ${corner1.x} ${corner1.y} L ${corner2.x} ${corner2.y} L ${corner3.x} ${corner3.y}`,
    );

    elements.secantPoint.setAttribute('cx', secantX);
    elements.secantPoint.setAttribute('cy', center);
    elements.cosecantPoint.setAttribute('cx', center);
    elements.cosecantPoint.setAttribute('cy', cosecantY);
    elements.cotangentPoint.setAttribute('cx', cotangentX);
    elements.cotangentPoint.setAttribute('cy', cotangentY);
    elements.secantLine.style.display = elements.secantPoint.style.display = secantDefined ? '' : 'none';
    elements.cosecantLine.style.display = elements.cosecantPoint.style.display = cosecantDefined ? '' : 'none';
    elements.cotangentLine.style.display = elements.cotangentPoint.style.display = cosecantDefined ? '' : 'none';
    elements.secantLabel.style.display = secantDefined ? '' : 'none';
    elements.cosecantLabel.style.display = elements.cotangentLabel.style.display = cosecantDefined ? '' : 'none';

    elements.secantLabel.setAttribute('x', (center + secantX) / 2);
    elements.secantLabel.setAttribute('y', center + 18);
    elements.cosecantLabel.setAttribute('x', center + 8);
    elements.cosecantLabel.setAttribute('y', (center + cosecantY) / 2);
    elements.cotangentLabel.setAttribute('x', (center + cotangentX) / 2);
    elements.cotangentLabel.setAttribute('y', cotangentY - 10);
  }

  positionFunctionLabels({ cos, sin, tangent, x, y, tangentX, center, radius }) {
    const [sinLabel, cosLabel, tanLabel] = this.elements.functionLabels;
    cosLabel.setAttribute('x', center + (radius * cos) / 2 - 10);
    cosLabel.setAttribute('y', center + (sin >= 0 ? 20 : -9));
    sinLabel.setAttribute('x', x + (cos >= 0 ? 7 : -28));
    sinLabel.setAttribute('y', center + (y - center) / 2 + (sin >= 0 ? 0 : 12));
    tanLabel.setAttribute('x', tangentX + 7);
    tanLabel.setAttribute('y', Math.max(40, Math.min(420, center - radius * tangent / 2)));
  }

  getQuadrantLabel(degrees) {
    if ([0, 90, 180, 270].includes(degrees)) return 'EIXO';
    return `${Math.floor(degrees / 90) + 1}º QUADRANTE`;
  }
}
