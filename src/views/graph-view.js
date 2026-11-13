import { functionFamilies, graphConfig } from '../config.js';
import { graphDenominator, graphFunctionValue } from '../math/trigonometry.js';
import { graphX, graphY, makeGraphPath } from '../math/graph.js';

export class GraphView {
  constructor(elements) {
    this.elements = elements;
  }

  initialize() {
    const { grid, labels, paths, panel } = this.elements;

    for (let degrees = 0; degrees <= 360; degrees += 15) {
      const x = graphX(degrees);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('x2', x);
      line.setAttribute('y1', graphConfig.top);
      line.setAttribute('y2', graphConfig.top + graphConfig.height);
      line.setAttribute('class', degrees % 45 === 0 ? 'graph-grid-major' : 'graph-grid-minor');
      grid.appendChild(line);
      if (degrees % 45 === 0) this.addText(labels, x, 443, `${degrees}°`, 'graph-axis-label');
    }

    for (let value = graphConfig.minY; value <= graphConfig.maxY + 1e-6; value += 0.5) {
      const y = graphY(value);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', graphConfig.left);
      line.setAttribute('x2', graphConfig.left + graphConfig.width);
      line.setAttribute('y1', y);
      line.setAttribute('y2', y);
      line.setAttribute('class', Number.isInteger(value) ? 'graph-grid-major' : 'graph-grid-minor');
      grid.appendChild(line);
      if (Number.isInteger(value)) {
        this.addText(labels, 49, y + 3, String(value).replace('-', '−'), 'graph-axis-label', 'end');
      }
    }

    Object.entries(paths).forEach(([kind, path]) => path.setAttribute('d', makeGraphPath(kind)));
    panel.dataset.visible = 'sin';
  }

  applySelection(family, selectedGraph, degrees) {
    const elements = this.elements;
    const familyConfig = functionFamilies[family];
    const visibleKeys = familyConfig.keys;

    elements.panel.dataset.family = family;
    elements.panel.dataset.visible = selectedGraph;
    Object.entries(elements.paths).forEach(([key, path]) => {
      const visible = selectedGraph === 'all' ? visibleKeys.includes(key) : selectedGraph === key;
      path.style.display = visible ? 'block' : 'none';
    });

    elements.buttons.forEach((button, index) => {
      button.dataset.graph = index < 3 ? visibleKeys[index] : 'all';
      button.textContent = index < 3 ? familyConfig.labels[index] : 'Todas';
      const selected = button.dataset.graph === selectedGraph;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    elements.legend.forEach((label, index) => {
      label.textContent = `${familyConfig.symbols[index]} θ`;
    });

    const asymptoteAtCosZero = family === 'common'
      ? selectedGraph === 'tan' || selectedGraph === 'all'
      : selectedGraph === 'sec' || selectedGraph === 'all';
    const asymptoteAtSinZero = family === 'reciprocal'
      && (selectedGraph === 'csc' || selectedGraph === 'cot' || selectedGraph === 'all');

    elements.commonAsymptotes.style.display = asymptoteAtCosZero ? 'block' : 'none';
    elements.reciprocalAsymptotes.style.display = asymptoteAtSinZero ? 'block' : 'none';
    this.renderAngle(degrees, family, selectedGraph);
  }

  renderAngle(degrees, family, selectedGraph) {
    const radians = degrees * Math.PI / 180;
    const x = graphX(degrees);
    const { markers, current, cursor } = this.elements;

    cursor.setAttribute('x1', x);
    cursor.setAttribute('x2', x);
    current.textContent = `θ = ${degrees}°`;

    Object.entries(markers).forEach(([kind, marker]) => {
      const value = graphFunctionValue(kind, radians);
      const selected = selectedGraph === 'all'
        ? functionFamilies[family].keys.includes(kind)
        : selectedGraph === kind;
      const visible = selected
        && Number.isFinite(value)
        && Math.abs(graphDenominator(kind, radians)) > 0.025
        && Math.abs(value) <= graphConfig.maxY;

      marker.style.display = visible ? '' : 'none';
      marker.setAttribute('cx', x);
      marker.setAttribute('cy', graphY(Math.max(graphConfig.minY, Math.min(graphConfig.maxY, value))));
    });
  }

  addText(parent, x, y, text, className, anchor = 'middle') {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', anchor);
    label.setAttribute('class', className);
    label.textContent = text;
    parent.appendChild(label);
  }
}
