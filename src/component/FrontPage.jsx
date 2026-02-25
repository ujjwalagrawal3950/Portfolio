import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mainImage from "../assets/Main_imge.avif";
import "../App.css";

gsap.registerPlugin(ScrollTrigger);

function FrontPage() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const btnRightRef = useRef(null);
  const btnLeftRef = useRef(null);

  // State to ensure images are loaded before calculating parallax
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Refresh ScrollTrigger when images/fonts are fully ready
    const handleLoad = () => setIsLoaded(true);
    window.addEventListener("load", handleLoad);

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Create the timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true, // Crucial for production resizing
        },
      });

      // Synchronized Parallax
      tl.to(gridRef.current, { y: 200, ease: "none" }, 0)
        .to(textRef.current, { y: -150, ease: "none" }, 0)
        .to(imageRef.current, { y: -400, ease: "none" }, 0)
        .to(btnRightRef.current, { y: -550, ease: "none" }, 0)
        .to(btnLeftRef.current, { y: -750, ease: "none" }, 0);
    });

    // Cleanup and Refresh
    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      window.removeEventListener("load", handleLoad);
    };
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      id="home"
      className="relative w-full lg:min-h-[160vh] min-h-[80vh] bg-white overflow-hidden"
    >
      {/* GRID BACKGROUND */}
      <div
        ref={gridRef}
        className="hidden lg:block absolute inset-0 opacity-[0.06] pointer-events-none z-0"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: "4vw 4vw",
          }}
        />
      </div>

      {/* TEXT SECTION */}
      <div ref={textRef} className="relative w-full z-10 lg:pt-[24vh] pt-[12vh] px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 lg:h-[72vh] h-[25vh]">
          <div className="z-10 text-start">
            <p className="lg:text-[3vw] text-[18px] text-gray-800 mb-[0.5vw] font-semibold whitespace-nowrap">Hey I’m a</p>
            <h1 className="lg:text-[9vw] text-[48px] font-semibold leading-[0.8]">Software</h1>
          </div>
          <div />
          <div />
          <div className="flex items-end justify-end z-10">
            <h1 className="lg:text-[9vw] text-[45px] relative left-4 lg:left-32 text-emerald-600 font-bold leading-[0.8] underline decoration-emerald-200/50 underline-offset-[2vw]">Developer</h1>
          </div>
        </div>
      </div>

      {/* MAIN IMAGE - Using min-height to prevent collapse before image loads */}
      <div ref={imageRef} className="absolute lg:top-[25vh] top-[25vh] w-full z-20 flex justify-center pointer-events-none">
        <img
          src={mainImage}
          alt="main"
          onLoad={() => ScrollTrigger.refresh()}
          className="lg:max-w-[1500px] max-w-[90%] md:max-w-[600px] object-contain h-auto"
        />
      </div>

      {/* BUTTONS */}
      <div ref={btnRightRef} className="absolute lg:right-28 right-6 lg:top-[75vh] top-[26vh] z-30">
        <div className="float-fast relative">
          <svg
            viewBox="0 0 24 24"
            className="absolute lg:-top-8 lg:-left-7 -top-4 -left-4 lg:w-10 lg:h-10 w-6 h-6 z-40"
            fill="#21db7e"
            stroke="#1a8a4e"
            strokeWidth="1.5"
            style={{ transform: 'rotate(-5deg)' }}
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          <button className="bg-[#21db7e] text-black lg:text-2xl text-[12px] lg:px-8 px-4 lg:py-4 py-2 lg:rounded-2xl rounded-lg shadow-xl font-semibold border border-black active:scale-95 transition-transform">
            Perhaps you?
          </button>
        </div>
      </div>

      <div ref={btnLeftRef} className="absolute lg:left-44 lg:bottom-44 bottom-10 left-6 z-30">
        <div className="float relative group">
          <svg
            viewBox="0 0 24 24"
            className="absolute lg:-top-8 -top-4 lg:-right-6 -right-3 lg:w-10 lg:h-10 w-6 h-6 z-40"
            fill="#635bff"
            stroke="#2e2a7a"
            strokeWidth="2"
            style={{ transform: 'rotate(86deg)' }}
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
          <button className="bg-[#635bff] text-white lg:text-2xl text-[12px] lg:px-8 px-4 lg:py-4 py-2 lg:rounded-2xl rounded-lg shadow-xl font-semibold border border-black active:scale-95 transition-transform">
            Other Designer
          </button>
        </div>
      </div>

      {/* GRADIENT SECTION */}
      <div
        className="absolute bottom-0 w-full h-[30vh] z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #fff, #defff7)" }}
      />
    </div>
  );
}

export default FrontPage;