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

  // State to prevent layout flicker
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Force a ScrollTrigger refresh after a short delay
    // This solves the 'it works locally but not on live' issue
    const timer = setTimeout(() => {
      setIsReady(true);
      ScrollTrigger.refresh();
    }, 200);

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          invalidateOnRefresh: true, // Recalculates if window is resized
        },
      });

      tl.to(gridRef.current, { y: "20vh", ease: "none" }, 0)
        .to(textRef.current, { y: "-15vh", ease: "none" }, 0)
        .to(imageRef.current, { y: "-40vh", ease: "none" }, 0)
        .to(btnRightRef.current, { y: "-55vh", ease: "none" }, 0)
        .to(btnLeftRef.current, { y: "-70vh", ease: "none" }, 0);
    });

    return () => {
      mm.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="home"
      // Added opacity-0 to opacity-100 transition to hide the "jump"
      className={`relative w-full lg:h-[170vh] h-[85vh] bg-white overflow-hidden transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* GRID BACKGROUND */}
      <div ref={gridRef} className="hidden lg:block absolute inset-0 opacity-[0.06] pointer-events-none z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: "4vw 4vw",
          }}
        />
      </div>

      {/* TEXT SECTION */}
      <div ref={textRef} className="relative w-full z-10 lg:pt-[24vh] pt-[15vh] px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 lg:h-[72vh] h-[22vh]">
          <div className="z-10 text-start">
            <p className="lg:text-[3vw] text-[18px] text-gray-800 mb-[0.5vw] font-semibold">Hey I’m a</p>
            {/* CLAMP ensures font doesn't get too big on ultra-wide screens */}
            <h1 className="text-[45px] lg:text-[clamp(4rem,9vw,10rem)] font-bold leading-[0.7] tracking-tighter">Software</h1>
          </div>
          <div />
          <div />
          <div className="flex items-end justify-end z-10">
            <h1 className="text-[42px] lg:text-[clamp(4rem,9vw,10rem)] relative lg:left-0 text-emerald-600 font-bold leading-[0.7] underline decoration-emerald-200/50 underline-offset-[2vw] tracking-tighter">Developer</h1>
          </div>
        </div>
      </div>

      {/* MAIN IMAGE */}
      <div ref={imageRef} className="absolute lg:top-[25vh] top-[22vh] w-full z-20 flex justify-center pointer-events-none">
        <img
          src={mainImage}
          alt="main"
          onLoad={() => ScrollTrigger.refresh()}
          className="lg:max-w-[1400px] max-w-[350px] object-contain h-auto"
        />
      </div>

      {/* BUTTONS - Added fixed widths and white-space control */}
      <div ref={btnRightRef} className="absolute lg:right-28 right-8 lg:top-[75vh] top-[24vh] z-30">
        <div className="float-fast relative">
          {/* SVG Cursor */}
          <button className="bg-[#21db7e] text-black lg:text-2xl text-[12px] px-6 py-2 lg:px-10 lg:py-5 lg:rounded-2xl rounded-lg shadow-xl font-bold border-2 border-black whitespace-nowrap transition-transform active:scale-95">
            Perhaps you?
          </button>
        </div>
      </div>

      <div ref={btnLeftRef} className="absolute lg:left-44 lg:bottom-44 bottom-16 left-8 z-30">
        <div className="float relative group">
          {/* SVG Cursor */}
          <button className="bg-[#635bff] text-white lg:text-2xl text-[12px] px-6 py-2 lg:px-10 lg:py-5 lg:rounded-2xl rounded-lg shadow-xl font-bold border-2 border-black whitespace-nowrap transition-transform active:scale-95">
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