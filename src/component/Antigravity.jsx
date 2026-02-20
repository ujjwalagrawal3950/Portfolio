import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// --- 1. THE PHYSICS ENGINE (Encapsulated) ---
const QuantumMechanicsBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;
        let mouse = { x: -1000, y: -1000, isMoving: false };
        let mouseTimeout;

        // Premium Luminescence
        const colors = ["#FACC15", "#F8FAFC", "#60A5FA", "#A78BFA"];

        const GRAVITY_CONSTANT = 1200;
        const SPRING_CONSTANT = 0.003;
        const DRAG_COEFFICIENT = 0.08;

        const resize = () => {
            // We target the parent's dimensions to keep it contained
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            init();
        };

        class QuantumParticle {
            constructor() {
                this.originX = Math.random() * canvas.width;
                this.originY = Math.random() * canvas.height;
                this.x = this.originX;
                this.y = this.originY;
                this.vx = 0;
                this.vy = 0;
                this.mass = Math.random() * 4 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distanceSq = dx * dx + dy * dy;
                let distance = Math.sqrt(distanceSq);

                let forceX = 0;
                let forceY = 0;

                if (distance < 400 && mouse.isMoving) {
                    let F_gravity = (GRAVITY_CONSTANT * this.mass) / (distanceSq + 2000);
                    let pullX = (dx / distance) * F_gravity;
                    let pullY = (dy / distance) * F_gravity;
                    let vortexX = -(dy / distance) * F_gravity * 1.5;
                    let vortexY = (dx / distance) * F_gravity * 1.5;

                    forceX += pullX + vortexX;
                    forceY += pullY + vortexY;
                }

                forceX += (this.originX - this.x) * SPRING_CONSTANT;
                forceY += (this.originY - this.y) * SPRING_CONSTANT;

                this.vx += forceX / this.mass;
                this.vy += forceY / this.mass;
                this.vx -= this.vx * DRAG_COEFFICIENT;
                this.vy -= this.vy * DRAG_COEFFICIENT;

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                ctx.beginPath();
                ctx.moveTo(this.x - this.vx * 2, this.y - this.vy * 2);
                ctx.lineTo(this.x, this.y);
                ctx.lineWidth = (this.mass / 2) + (speed * 0.1);
                ctx.strokeStyle = this.color;
                ctx.lineCap = "round";
                ctx.stroke();
            }
        }

        const init = () => {
            particles = [];
            const density = (canvas.width * canvas.height) / 8000;
            for (let i = 0; i < density; i++) {
                particles.push(new QuantumParticle());
            }
        };

        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "lighter";
            particles.forEach(p => { p.update(); p.draw(); });
            ctx.globalCompositeOperation = "source-over";
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            // Calculate mouse position relative to the canvas container
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.isMoving = true;
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => mouse.isMoving = false, 100);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: "#000000" }}
        />
    );
};
