import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ButtonAnimation from "./ButtonAnimation";
import ProfileImage from "../assets/demon_slayer.png"

const SecondPage = () => {
  const polaroidRef = useRef(null);

  useEffect(() => {
    // Pendulum Animation
    gsap.to(polaroidRef.current, {
      rotation: -9,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "50% 0%",
    });
  }, []);

  return (
    <div id="about" className="relative w-full lg:min-h-screen bg-white overflow-x-hidden font-sans py-[5vw] px-[8vw] md:h-[60vh] pt-24 pb-24">

      {/* BACKGROUND GRID LINES */}
      <div
        /* hidden by default (mobile), block on medium screens and up */
        className="hidden md:block absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px)`,
          backgroundSize: '20% 100%'
        }}
      />

      {/* CHANGED: flex-col-reverse makes the second item (image) appear first on mobile */}
      <div className="relative z-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-[5vw] items-center">

        {/* LEFT CONTENT (Now appears second on mobile) */}
        <div className="flex flex-col gap-[3vw]">
          <div className="flex items-center gap-[1vw] bg-[#E8F5EE] text-[#2D8C5E] w-fit px-[2vw] py-[0.8vw] rounded-full border border-[#D1EADF]">
            <span className="w-[1.2vw] h-[1.2vw] bg-[#34C759] rounded-full animate-pulse"></span>
            <span className="lg:text-[0.85vw] text-[3vw] font-bold uppercase tracking-wider">Available For Work</span>
          </div>

          <div className="text-[#333] leading-[1.6]">
            <h2 className="text-[4.5vw] md:text-[1.4vw] font-medium mb-[2vw] text-start">
              Hey there! I’m Ayush, a Digital Product Designer from New Delhi 🇮🇳.
              My job? turn complexity into simplicity. I love the sweet spot where aesthetics
              meet usability—where pixels serve a purpose.
            </h2>
            <p className="text-[4vw] md:text-[1.4vw] font-medium mb-[2vw] text-start">
              Outside of design, you’ll find me binge-watching, sketching random ideas, or
              chasing the perfect spotify playlist 🎧. If you’re into design, creativity, or
              just good conversations, let’s connect! ☕
            </p>
          </div>

          <div className='w-fit scale-[0.8] md:scale-100 origin-left lg:mt-1 mt-7'>
            <ButtonAnimation />
          </div>
        </div>

        {/* RIGHT PHOTO (Now appears first on mobile) */}
        <div className="flex justify-center relative mb-[8vw] md:mb-0">
          <div
            ref={polaroidRef}
            className="bg-white p-[2vw] pb-[1.5vw] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rotate-[3deg] border border-[#EEE] w-[60vw] md:w-[28vw] aspect-[3/4] md:h-[72vh] relative"
            style={{ willChange: "transform" }}
          >
            {/* Red Pin */}
            <div className="absolute -top-[1.2vw] left-1/2 -translate-x-1/2 z-20">
              <div className="w-[4.5vw] h-[4.5vw] md:w-[2vw] md:h-[2vw] bg-[#B92B27] rounded-full shadow-inner relative">
                <div className="absolute top-1/4 left-1/4 w-[0.8vw] h-[0.8vw] bg-white opacity-30 rounded-full"></div>
              </div>
            </div>

            {/* Image */}
            <div className="w-full aspect-[9/10] bg-gray-200 overflow-hidden">
              <img
                src={ProfileImage}
                alt="Ayush"
                className="w-full h-full object-cover grayscale-[0.2]"
              />
            </div>

            <p className="text-center text-[4vw] md:text-[1.5vw] mt-[1vw] md:mt-[0.5vw] font-handwriting text-[#777]">
              Pick me!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;