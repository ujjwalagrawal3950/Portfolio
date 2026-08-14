import React from 'react';
import ButtonAnimation from "./ButtonAnimation";
import AudioPlayer from "./AudioPlayer";

const SecondPage = () => {
  return (
    <div id="about" className="relative w-full lg:min-h-screen bg-white overflow-hidden font-sans py-[5vw] px-[8vw] md:h-[60vh] pt-24 pb-24">

      {/* BACKGROUND GRID LINES */}
      <div
        /* hidden by default (mobile), block on medium screens and up */
        className="hidden md:block absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px)`,
          backgroundSize: '20% 100%'
        }}
      />

      {/* CHANGED: flex-col-reverse makes the second item (image/player) appear first on mobile */}
      <div className="relative z-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-[5vw] items-center">

        {/* LEFT CONTENT (Now appears second on mobile) */}
        <div className="flex flex-col gap-[3vw]">
          <div className="flex items-center gap-[1vw] bg-[#E8F5EE] text-[#2D8C5E] w-fit px-[2vw] py-[0.8vw] rounded-full border border-[#D1EADF]">
            <span className="w-[1.2vw] h-[1.2vw] bg-[#34C759] rounded-full animate-pulse"></span>
            <span className="lg:text-[0.85vw] text-[3vw] font-bold uppercase tracking-wider">Available For Work</span>
          </div>

          <div className="text-[#333] leading-[1.6]">
            <h2 className="text-[4vw] md:text-[1.4vw] font-medium mb-[2vw] text-start">
              Hi, I’m Ujjwal Agrawal, currently completing my BTech at NIT Jalandhar. I specialize in full-stack
               web development with a strong passion for software optimization and architecting scalable applications.
            </h2>
            <p className="text-[3.5vw] md:text-[1.4vw] font-medium mb-[2vw] text-start">
              I enjoy combining robust engineering with exceptional user experiences, 
              from optimizing backend systems to building developer-focused tools. Passionate about problem-solving, 
              I’m eager to build impactful digital products and solve meaningful challenges.
            </p>
          </div>

          <div className='w-fit scale-[0.8] md:scale-100 origin-left lg:mt-0 mt-7'>
            <ButtonAnimation />
          </div>
        </div>

        {/* RIGHT MUSIC PLAYER (Now appears first on mobile) */}
        <div className="flex justify-center relative mb-[8vw] md:mb-0">
          <AudioPlayer />
        </div>
      </div>
    </div>
  );
};

export default SecondPage;