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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // FIX: Wait for both DOM and all assets (images/fonts)
    const onPageLoad = () => {
      setIsReady(true);
      // Force GSAP to recalculate now that everything has a physical size
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
    }

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(gridRef.current, { y: "15vh", ease: "none" }, 0)
        .to(textRef.current, { y: "-15vh", ease: "none" }, 0)
        .to(imageRef.current, { y: "-35vh", ease: "none" }, 0)
        .to(btnRightRef.current, { y: "-50vh", ease: "none" }, 0)
        .to(btnLeftRef.current, { y: "-65vh", ease: "none" }, 0);
    });

    return () => {
      mm.revert();
      window.removeEventListener("load", onPageLoad);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="home"
      // Added opacity transition so the "jump" isn't visible while loading
      className={`relative w-full lg:h-[170vh] h-[80vh] bg-white overflow-hidden transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
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
      <div ref={textRef} className="relative w-full z-10 lg:pt-[24vh] pt-[24vh] px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 lg:h-[72vh] h-[25vh]">
          <div className="z-10 text-start">
            <p className="lg:text-[2.5vw] text-[18px] text-gray-800 mb-[0.5vw] font-semibold whitespace-nowrap">Hey I’m a</p>
            {/* CLAMPED TEXT: Minimum 40px, Preferred 9vw, Maximum 160px */}
            <h1 className="text-[40px] lg:text-[clamp(40px,9vw,160px)] font-semibold leading-[0.8] tracking-tighter">Software</h1>
          </div>
          <div />
          <div />
          <div className="flex items-end justify-end z-10">
            <h1 className="text-[40px] lg:text-[clamp(40px,9vw,160px)] relative left-4 lg:left-7 text-emerald-600 font-bold leading-[0.8] underline decoration-emerald-200/50 underline-offset-[2vw] tracking-tighter">Developer</h1>
          </div>
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div ref={imageRef} className="absolute lg:top-[25vh] top-[25vh] w-full z-20 flex justify-center pointer-events-none">
        <img
          src={mainImage}
          alt="main"
          onLoad={() => ScrollTrigger.refresh()}
          className="lg:max-w-[1500px] max-w-[90%] md:max-w-[650px] object-contain h-auto"
        />
      </div>

      {/* BUTTON RIGHT */}
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
          {/* STABILIZED BUTTON: Fixed padding and whitespace-nowrap */}
          <button className="bg-[#21db7e] text-black lg:text-[1.4rem] text-[12px] px-5 py-2 lg:px-10 lg:py-5 lg:rounded-2xl rounded-lg shadow-xl font-bold border-[1.5px] border-black active:scale-95 transition-transform whitespace-nowrap">
            Perhaps you?
          </button>
        </div>
      </div>

      {/* BUTTON LEFT */}
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
          <button className="bg-[#635bff] text-white lg:text-[1.4rem] text-[12px] px-5 py-2 lg:px-10 lg:py-5 lg:rounded-2xl rounded-lg shadow-xl font-bold border-[1.5px] border-black active:scale-95 transition-transform whitespace-nowrap">
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