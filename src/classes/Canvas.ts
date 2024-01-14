export class Canvas {
  /**@type{HTMLCanvasElement} */
  $canvas: HTMLCanvasElement;
  clearColor = '#fff';
  currentColor = '#000';

  constructor(tag: string, clearColor: string, currentColor: string) {
    const $el = document.querySelector(tag);
    if ($el instanceof HTMLCanvasElement) {
      this.$canvas = $el;
    } else {
      throw new Error(
        `Element with tagName "${tag}" notfound or not canvas node`
      );
    }

    if (clearColor) this.clearColor = clearColor;
    if (currentColor) this.currentColor = currentColor;

    this.clearCanvas();
  }

  _getContext() {
    return this.$canvas.getContext('2d');
  }

  drawPoint(x: number, y: number, r = 3, color: string) {
    if (color) this.currentColor = color;

    const ctx = this._getContext();

    if (!ctx) return;

    ctx.beginPath();
    ctx.fillStyle = this.currentColor;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  drawRect(p1: [number, number], p2: [number, number], color: string) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    if (color) this.currentColor = color;

    const ctx = this._getContext();

    if (!ctx) return;

    const width = x2 - x1;
    const height = y2 - y1;

    ctx.fillStyle = this.currentColor;
    ctx.fillRect(x1, y1, width, height);
  }

  clearCanvas(color?: string) {
    if (color) this.clearColor = color;
    const ctx = this._getContext();

    if (!ctx) return;

    const rect = this.$canvas.getBoundingClientRect();

    ctx.fillStyle = this.clearColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }
}
