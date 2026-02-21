import { useEffect, useRef } from "react";
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

  useEffect(() => {
    let mm = gsap.matchMedia();

    // 1. DESKTOP/LAPTOP ANIMATION (1024px and up)
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      tl.to(gridRef.current, { y: 200 }, 0)
        .to(textRef.current, { y: -150 }, 0)
        .to(imageRef.current, { y: -400 }, 0)
        .to(btnRightRef.current, { y: -550 }, 0)
        .to(btnLeftRef.current, { y: -750 }, 0);
    });

    // 2. MOBILE/TABLET (No animation, static layout)
    // No code needed here, the elements will follow the CSS below.

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="home"
      /* On Laptop: 160vh provides the scroll distance for parallax.
         On Mobile: 70vh fits the content perfectly without extra scrolling.
      */
      className="relative w-full lg:h-[160vh] h-[70vh] md:pb-32 bg-white overflow-hidden"
    >
      {/* GRID BACKGROUND - Hidden on mobile, shown on laptop */}
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
      <div ref={textRef} className="relative w-full z-10 lg:pt-[24vh] pt-[15vh] px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 grid-rows-2 lg:h-[72vh] h-[22vh]">
          <div className="z-10 text-start">
            <p className="lg:text-[3vw] text-[17px] text-gray-800 mb-[0.5vw] font-semibold whitespace-nowrap">Hey I’m a</p>
            <h1 className="lg:text-[9vw] text-[45px] font-semibold leading-[0.6]">Software</h1>
          </div>
          <div />
          <div />
          <div className="flex items-end justify-end z-10">
            <h1 className="lg:text-[9vw] text-[42px] relative left-6 lg:left-32 text-emerald-600 font-bold leading-[0.75] underline decoration-emerald-200/50 underline-offset-[2vw]">Developer</h1>
          </div>
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div ref={imageRef} className="absolute lg:top-[25vh] top-[22vh] w-full z-20 flex justify-center pointer-events-none">
        <img src={mainImage} alt="main" className="lg:max-w-[1500px] max-w-[350px] object-contain" />
      </div>

      {/* BUTTONS */}
      <div ref={btnRightRef} className="absolute lg:right-28 right-8 lg:top-[75vh] top-[24vh] z-30">
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
          <button className="bg-[#21db7e] text-black lg:text-2xl text-[11px] lg:px-8 px-4 lg:py-4 py-2 lg:rounded-2xl rounded-lg shadow-lg font-semibold border border-black">
            Perhaps you?
          </button>
        </div>
      </div>

      <div ref={btnLeftRef} className="absolute lg:left-44 lg:bottom-44 bottom-16 left-8 z-30">
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
          <button className="bg-[#635bff] text-white lg:text-2xl text-[11px] lg:px-8 px-4 lg:py-4 py-2 lg:rounded-2xl rounded-lg shadow-lg font-semibold border border-black">
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