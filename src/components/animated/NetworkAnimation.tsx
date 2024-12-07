'use client';
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  closest: Point[];
  circle: Circle;
  active?: number;
}

class Circle {
  pos: Point;
  radius: number;
  color: string;
  active: number;

  constructor(pos: Point, radius: number, color: string) {
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    this.active = 0;
  }

  draw(ctx: CanvasRenderingContext2D | null) {
    if (!ctx || this.active <= 0) return;

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(156,217,249,${this.active})`;
    ctx.fill();
  }
}

const NetworkAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const largeHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width: number;
    let height: number;
    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null = null;
    let points: Point[] = [];
    let target = { x: 0, y: 0 };
    let animateHeader = true;

    const initHeader = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      target = { x: width / 2, y: height / 2 };

      const largeHeader = largeHeaderRef.current;
      if (largeHeader) largeHeader.style.height = `${height}px`;

      canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
      }

      // Create points
      points = [];
      for (let x = 0; x < width; x += width / 20) {
        for (let y = 0; y < height; y += height / 20) {
          const px = x + Math.random() * (width / 20);
          const py = y + Math.random() * (height / 20);
          const point: Point = { x: px, originX: px, y: py, originY: py, closest: [], circle: null as any };
          points.push(point);
        }
      }

      // Find closest points
      points.forEach((p1) => {
        const closest: Point[] = [];
        points.forEach((p2) => {
          if (p1 !== p2) {
            closest.push(p2);
            closest.sort((a, b) => getDistance(p1, a) - getDistance(p1, b));
            if (closest.length > 5) closest.pop();
          }
        });
        p1.closest = closest;
      });

      // Assign a circle to each point
      points.forEach((p) => {
        p.circle = new Circle(p, 2 + Math.random() * 2, "rgba(255,255,255,0.3)");
      });
    };

    const addListeners = () => {
      window.addEventListener("mousemove", mouseMove);
    //   window.addEventListener("scroll", scrollCheck);
      window.addEventListener("resize", resize);
    };

    const mouseMove = (e: MouseEvent) => {
      target.x = e.clientX || e.pageX;
      target.y = e.clientY || e.pageY;
    };

    const scrollCheck = () => {
      animateHeader = window.scrollY <= height;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const largeHeader = largeHeaderRef.current;
      if (largeHeader) largeHeader.style.height = `${height}px`;

      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const initAnimation = () => {
      animate();
      points.forEach((point) => shiftPoint(point));
    };

    const animate = () => {
      if (!ctx || !animateHeader) return;

      ctx.clearRect(0, 0, width, height);

      points.forEach((point) => {
        const distance = getDistance(target, point);
        if (distance < 4000) {
          point.active = 0.3;
          point.circle.active = 0.6;
        } else if (distance < 20000) {
          point.active = 0.1;
          point.circle.active = 0.3;
        } else if (distance < 40000) {
          point.active = 0.02;
          point.circle.active = 0.1;
        } else {
          point.active = 0;
          point.circle.active = 0;
        }

        drawLines(point, ctx); // Pass ctx explicitly
        point.circle.draw(ctx); // Pass ctx explicitly
      });

      requestAnimationFrame(animate);
    };

    const shiftPoint = (p: Point) => {
      gsap.to(p, {
        duration: 1 + Math.random(),
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        onComplete: () => shiftPoint(p),
      });
    };

    const drawLines = (p: Point, ctx: CanvasRenderingContext2D | null) => {
      if (!p.active || !ctx) return;

      p.closest.forEach((close) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(close.x, close.y);
        ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
        ctx.stroke();
      });
    };

    const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
      Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);

    initHeader();
    initAnimation();
    addListeners();

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    //   window.removeEventListener("scroll", scrollCheck);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={largeHeaderRef} style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default NetworkAnimation;
