import React, { useRef } from 'react';
import gsap from 'gsap';
import '../App.css';

const ResumeButton = () => {
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    const tl = gsap.timeline();

    // Springy background fill
    tl.to(bgRef.current, {
      width: "100%",
      duration: 0.6,
      ease: "expo.out"
    }, 0);

    // Text color change
    tl.to(textRef.current, {
      color: "#ffffff",
      duration: 0.3
    }, 0.1);

    // Spring animation for the icon (Overshoots and settles)
    tl.to(iconRef.current, {
      rotate: 45,
      scale: 1.2,
      duration: 0.7,
      ease: "elastic.out(1.2, 0.5)"
    }, 0);

    // Button container slight scale up
    tl.to(containerRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    }, 0);
  };

  const handleMouseLeave = () => {
    const tl = gsap.timeline();

    tl.to(bgRef.current, {
      width: "0%",
      duration: 0.4,
      ease: "power2.inOut"
    }, 0);

    tl.to(textRef.current, {
      color: "#333333",
      duration: 0.3
    }, 0.1);

    tl.to(iconRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.5,
      ease: "back.out(2)"
    }, 0);

    tl.to(containerRef.current, {
      scale: 1,
      duration: 0.3
    }, 0);
  };

  return (
    <button
      ref={containerRef}
      className="resume-btn"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={bgRef} className="btn-fill-bg " />

      <div ref={iconRef} className="icon-container">
        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>

      <span ref={textRef} className="btn-text">View Resume</span>
    </button>
  );
};

export default ResumeButton;