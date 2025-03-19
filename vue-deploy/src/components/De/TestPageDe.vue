### Erstellt von Cedric visit my [GitHub](https://cedric-cj.github.io/AboutMe/)
<template>
  <div class="fun-page">
    <div class="scene flex">
      <svg class="scene__animation" id="animation" xmlns="http://www.w3.org/2000/svg" role="img"></svg>
    </div>
  </div>
</template>
<script>
import { gsap } from "gsap";

class Line {
  constructor(x1, x2, y1, y2, strokeColor, strokeWidth, marker) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.marker = marker;
    this.element = document.createElementNS("http://www.w3.org/2000/svg", "line");

    this.setElement();
  }

  getElement() {
    return this.element;
  }

  setElement() {
    this.element.setAttribute("x1", this.x1);
    this.element.setAttribute("x2", this.x2);
    this.element.setAttribute("y1", this.y1);
    this.element.setAttribute("y2", this.y2);
    this.element.style.stroke = this.strokeColor;
    this.element.style.strokeWidth = this.strokeWidth;
    this.element.setAttribute("marker-end", `url(#${this.marker})`);
  }
}

class Animation {
  constructor(selector) {
    this.cols = 10;
    this.rows = 6;
    this.lineWidth = 40;
    this.markerName = "marker";
    this.spacingHorizontal = 100;
    this.spacingVertical = 100;
    this.strokeColor = getComputedStyle(document.documentElement).getPropertyValue(
        "--card-background-color"
    );
    this.strokeWidth = 10;
    this.svgMargin = 40;

    this.svg = document.querySelector(selector);
    this.lines = [];
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouseStored = { ...this.mouse };

    this.svgWidth =
        this.cols * this.lineWidth +
        2 * this.svgMargin +
        (this.cols - 1) * this.spacingHorizontal;
    this.svgHeight =
        this.rows * this.lineWidth +
        2 * this.svgMargin +
        (this.rows - 1) * this.spacingVertical;

    this.svg.setAttribute("viewBox", `0 0 ${this.svgWidth} ${this.svgHeight}`);
    this.svg.setAttribute("stroke-linecap", "round");

    this.addEventListeners();
    this.createMarker();
    this.draw();
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
        ? this.animate()
        : null;
  }

  addEventListeners() {
    window.addEventListener("resize", () => {
      this.setLineCenters();
    });
  }

  draw() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let line = new Line(
            this.svgMargin + j * this.lineWidth + j * this.spacingHorizontal,
            this.svgMargin + (j + 1) * this.lineWidth + j * this.spacingHorizontal,
            this.svgMargin + i * this.spacingVertical,
            this.svgMargin + i * this.spacingVertical,
            this.strokeColor,
            this.strokeWidth,
            this.markerName
        );

        const lineElement = line.getElement();
        gsap.set(lineElement, { transformOrigin: "50% 50%" });
        this.svg.appendChild(lineElement);
        this.lines.push(line);
      }
    }
    this.setLineCenters();
  }

  createMarker() {
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    let marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");

    marker.setAttribute("id", this.markerName);
    marker.setAttribute("viewBox", `0 0 ${this.strokeWidth} ${this.strokeWidth}`);
    marker.setAttribute("refX", this.strokeWidth / 2);
    marker.setAttribute("refY", this.strokeWidth / 2);
    marker.setAttribute("markerUnits", "strokeWidth");
    marker.setAttribute("markerWidth", this.strokeWidth / 4);
    marker.setAttribute("markerHeight", this.strokeWidth / 4);
    marker.setAttribute("fill", this.strokeColor);
    marker.setAttribute("orient", "auto");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
        "d",
        `M 0 0 L ${this.strokeWidth} ${this.strokeWidth / 2} L 0 ${this.strokeWidth} z`
    );

    marker.appendChild(path);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
  }

  setMouseCoords(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  setLineCenters() {
    this.lines.forEach((line) => {
      const boundingRect = line.getElement().getBoundingClientRect();
      line.center = {
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height / 2,
      };
    });
  }

  animate() {
    window.addEventListener("mousemove", this.setMouseCoords.bind(this));
    gsap.ticker.add(this.setLineRotation.bind(this));
  }

  setLineRotation() {
    if (
        this.mouseStored.x === this.mouse.x &&
        this.mouseStored.y === this.mouse.y
    )
      return;

    this.lines.forEach((line) => {
      let angle =
          Math.atan2(this.mouse.x - line.center.x, -(this.mouse.y - line.center.y)) *
          (180 / Math.PI) -
          90;

      gsap.to(line.getElement(), {
        rotation: angle + "_short",
      });
    });

    this.mouseStored.x = this.mouse.x;
    this.mouseStored.y = this.mouse.y;
  }
}

export default {
  mounted() {
    new Animation("#animation");
  },
};
</script>
<style scoped>
.fun-page {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color);
}

.scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.scene__animation {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  position: absolute;
}
</style>