import { functionFamilies } from './config.js';
import { dom } from './dom.js';
import { AnimationController } from './controllers/animation-controller.js';
import { CircleView } from './views/circle-view.js';
import { GraphView } from './views/graph-view.js';

const state = {
  functionFamily: 'common',
  selectedGraph: 'sin',
};

const circleView = new CircleView(dom.circle);
const graphView = new GraphView(dom.graph);

function renderCurrentAngle() {
  const degrees = Number(dom.controls.angle.value);
  circleView.render(degrees, state.functionFamily);
  graphView.renderAngle(degrees, state.functionFamily, state.selectedGraph);
}

const animationController = new AnimationController(dom, renderCurrentAngle);

function selectGraph(button) {
  state.selectedGraph = button.dataset.graph;
  graphView.applySelection(state.functionFamily, state.selectedGraph, Number(dom.controls.angle.value));
}

function selectFunctionFamily(nextFamily) {
  if (nextFamily === state.functionFamily) return;

  const previousKeys = functionFamilies[state.functionFamily].keys;
  const selectedSlot = state.selectedGraph === 'all'
    ? 3
    : Math.max(0, previousKeys.indexOf(state.selectedGraph));

  state.functionFamily = nextFamily;
  state.selectedGraph = selectedSlot === 3
    ? 'all'
    : functionFamilies[nextFamily].keys[selectedSlot];

  dom.controls.familyToggles.forEach(button => {
    const selected = button.dataset.functionFamily === state.functionFamily;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  const symbols = functionFamilies[nextFamily].symbols;
  [
    ...dom.circle.functionSymbols,
    ...dom.circle.functionNames,
  ].forEach((element, index) => {
    element.textContent = symbols[index % 3];
  });

  dom.circle.functionLabels.forEach((element, index) => {
    element.textContent = symbols[index];
  });

  const legendLabels = nextFamily === 'common'
    ? ['seno', 'cosseno', 'tangente']
    : ['cossecante', 'secante', 'cotangente'];
  dom.circle.legend.forEach((element, index) => {
    element.textContent = legendLabels[index];
  });

  dom.circle.panel.dataset.family = nextFamily;
  dom.concepts.panel.dataset.family = nextFamily;
  dom.concepts.description.textContent = nextFamily === 'common'
    ? 'Uma posição na circunferência revela três medidas:'
    : 'As funções recíprocas surgem dos interceptos e da inclinação das tangentes:';

  graphView.applySelection(nextFamily, state.selectedGraph, Number(dom.controls.angle.value));
  circleView.render(Number(dom.controls.angle.value), nextFamily);
}

function switchTab(selectedTab) {
  dom.tabs.forEach(tab => {
    const selected = tab === selectedTab;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });

  dom.panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === selectedTab.dataset.tab);
  });
}

function initialize() {
  dom.circle.panel.dataset.family = state.functionFamily;
  dom.concepts.panel.dataset.family = state.functionFamily;
  circleView.createCoordinateLabels();
  graphView.initialize();
  graphView.applySelection(state.functionFamily, state.selectedGraph, Number(dom.controls.angle.value));
  renderCurrentAngle();

  animationController.bind();
  dom.graph.buttons.forEach(button => button.addEventListener('click', () => selectGraph(button)));
  dom.controls.familyToggles.forEach(button => {
    button.addEventListener('click', () => selectFunctionFamily(button.dataset.functionFamily));
  });
  dom.tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab)));
  dom.backToLab.addEventListener('click', event => {
    event.preventDefault();
    dom.tabs.find(tab => tab.dataset.tab === 'laboratorio').click();
  });

  window.setTimeout(() => dom.loading.classList.add('is-hidden'), 2000);
}

initialize();
