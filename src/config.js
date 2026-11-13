export const circleConfig = {
  center: 230,
  radius: 200 / 3,
  bounds: { min: 30, max: 430 },
};

export const graphConfig = {
  left: 60,
  top: 35,
  width: 720,
  height: 385,
  minY: -2,
  maxY: 2,
};

export const animationConfig = {
  arcadeRevolutionSeconds: 30,
  smoothRevolutionSeconds: 6.7,
  arcadePauseMilliseconds: 1500,
};

export const notableAngles = [
  0, 30, 45, 60, 90, 120, 135, 150,
  180, 210, 225, 240, 270, 300, 315, 330,
];

export const functionFamilies = {
  common: {
    keys: ['sin', 'cos', 'tan'],
    labels: ['Seno', 'Cosseno', 'Tangente'],
    symbols: ['sen', 'cos', 'tg'],
  },
  reciprocal: {
    keys: ['csc', 'sec', 'cot'],
    labels: ['Cossecante', 'Secante', 'Cotangente'],
    symbols: ['cossec', 'sec', 'cotg'],
  },
};
