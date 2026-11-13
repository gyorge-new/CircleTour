import { animationConfig, notableAngles } from '../config.js';
import { nextNotableAngle } from '../math/trigonometry.js';

export class AnimationController {
  constructor(elements, render) {
    this.elements = elements;
    this.render = render;
    this.frame = null;
  }

  bind() {
    const { angle, presets, playArcade, playSmooth, playNextNotable } = this.elements.controls;

    angle.addEventListener('input', () => {
      this.stop();
      this.render();
    });
    presets.forEach(button => button.addEventListener('click', () => {
      this.stop();
      angle.value = button.dataset.angle;
      this.render();
    }));
    playArcade.addEventListener('click', () => this.startContinuous('arcade'));
    playSmooth.addEventListener('click', () => this.startContinuous('smooth'));
    playNextNotable.addEventListener('click', () => this.advanceToNextNotable());
  }

  stop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;

    const { playArcade, playSmooth, playNextNotable } = this.elements.controls;
    [playArcade, playSmooth, playNextNotable].forEach(button => {
      button.classList.remove('playing');
      button.querySelector('.mode-text').textContent = button === playArcade
        ? 'Arcade'
        : button === playSmooth ? 'Contínuo' : 'Próximo';
      button.querySelector('.play-icon').textContent = button === playNextNotable ? '↦' : '▶';
    });
    this.elements.circle.stamp.classList.remove('stamp-hit');
  }

  startContinuous(mode) {
    const { playArcade, playSmooth } = this.elements.controls;
    const button = mode === 'arcade' ? playArcade : playSmooth;

    if (this.frame) {
      if (button.classList.contains('playing')) return this.stop();
      this.stop();
    }

    button.classList.add('playing');
    button.querySelector('.mode-text').textContent = 'Pausar';
    button.querySelector('.play-icon').textContent = 'Ⅱ';

    let previous = null;
    let currentAngle = Number(this.elements.controls.angle.value);
    let targetAngle = mode === 'arcade' ? nextNotableAngle(currentAngle) : Infinity;
    let pauseRemaining = 0;
    const revolutionSeconds = mode === 'arcade'
      ? animationConfig.arcadeRevolutionSeconds
      : animationConfig.smoothRevolutionSeconds;
    const pauseDuration = mode === 'arcade' ? animationConfig.arcadePauseMilliseconds : 0;
    const pauseCount = mode === 'arcade' ? notableAngles.length : 0;
    const movementDuration = Math.max(1000, revolutionSeconds * 1000 - pauseCount * pauseDuration);
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
          pauseRemaining = animationConfig.arcadePauseMilliseconds;
          this.pulseValues(Math.round(((currentAngle % 360) + 360) % 360));
        }
      }

      const visibleAngle = ((currentAngle % 360) + 360) % 360;
      this.elements.controls.angle.value = Math.floor(visibleAngle);
      this.render();
      this.frame = requestAnimationFrame(animate);
    };

    this.frame = requestAnimationFrame(animate);
  }

  advanceToNextNotable() {
    const { playNextNotable, angle } = this.elements.controls;
    if (this.frame && playNextNotable.classList.contains('playing')) return this.stop();
    this.stop();

    playNextNotable.classList.add('playing');
    playNextNotable.querySelector('.play-icon').textContent = 'Ⅱ';
    const startAngle = Number(angle.value);
    const targetAngle = nextNotableAngle(startAngle);
    const destination = targetAngle % 360;
    const distance = targetAngle - startAngle;
    const duration = Math.max(
      300,
      distance * animationConfig.smoothRevolutionSeconds * 1000 / 360,
    );
    let startedAt = null;

    const animate = time => {
      if (startedAt === null) startedAt = time;
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const currentAngle = startAngle + distance * eased;
      angle.value = progress === 1 ? destination : Math.floor(currentAngle % 360);
      this.render();

      if (progress === 1) {
        this.stop();
        this.pulseValues(destination);
        return;
      }
      this.frame = requestAnimationFrame(animate);
    };

    this.frame = requestAnimationFrame(animate);
  }

  pulseValues(angle) {
    const { stamp, stampValue } = this.elements.circle;
    stampValue.textContent = `${angle}°`;
    stamp.classList.remove('stamp-hit');
    void stamp.offsetWidth;
    stamp.classList.add('stamp-hit');
    stamp.onanimationend = () => stamp.classList.remove('stamp-hit');

    [...this.elements.controls.valueCards, ...this.elements.controls.functionRows].forEach(element => {
      element.classList.remove('notable-pulse');
      void element.offsetWidth;
      element.classList.add('notable-pulse');
    });
  }
}
