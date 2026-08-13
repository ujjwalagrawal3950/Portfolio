import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SectionHeader = ({ title }) => (
  <div className="mt-4 mb-1.5 text-left">
    <h2 className="text-[16px] uppercase tracking-wide mb-0 text-left text-black font-normal" style={{ fontVariant: 'small-caps', letterSpacing: '0.05em' }}>
      {title}
    </h2>
    <hr className="border-t-[1px] border-black my-1" />
  </div>
);

const BulletRow = ({ bullet = "•", children, className = "mb-1" }) => (
  <div className={`flex items-start text-left ${className}`}>
    <div className="w-[20px] shrink-0 text-left pt-[0.5px]">{bullet}</div>
    <div className="flex-1 w-full">{children}</div>
  </div>
);

const SubBulletRow = ({ children, className = "mb-1" }) => (
  <div className={`flex items-start text-left ml-[20px] ${className}`}>
    <div className="w-[20px] shrink-0 text-left text-[13px] pt-[3px]">◦</div>
    <div className="flex-1 w-full">{children}</div>
  </div>
);

const Resume = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 sm:px-6 lg:px-8 text-left flex justify-center">
      <div
        className="w-full max-w-[800px] bg-white shadow-2xl min-h-[1100px] p-[40px] sm:p-[50px] lg:p-[60px] text-black relative"
        style={{
          fontFamily: '"Computer Modern", "Times New Roman", Times, serif',
          lineHeight: '1.4',
          fontSize: '15px'
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-300 flex items-center gap-2 group print:hidden"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-end mb-3 text-left">
          <div className="text-left">
            <h1 className="text-[26px] leading-none mb-1 font-normal text-black" style={{ fontFamily: '"Computer Modern", "Cabin" , "Avenir", Times, serif' }}>Ujjwal Agrawal</h1>
            <div className='flex  justify-between  w-[150px] mt-2'>
              <a href="https://www.linkedin.com/in/ujjwal-agrawal/" target="_blank" rel="noreferrer" className="hover:underline text-[15px] block">
                LinkedIn
              </a>
              <a href="https://github.com/ujjwalagrawal3950" target="_blank" rel="noreferrer" className="hover:underline text-[15px] block text-black">
                GitHub
              </a>
            </div>
          </div>
          <div className="text-right leading-snug text-[15px]">
            <p>
              Email : <a href="mailto:ujjwal4927@gmail.com" className="hover:underline text-black">ujjwal4927@gmail.com</a>
            </p>
            <p>Mobile : 6375775567</p>
          </div>
        </div>

        {/* Education */}
        <SectionHeader title="Education" />
        <BulletRow className="mb-2">
          <div className="flex justify-between items-start w-full">
            <span className="font-bold">National Institute of Technology(NIT), Jalandhar</span>
            <span className="font-normal text-black">Jalandhar, Punjab</span>
          </div>
          <div className="flex justify-between items-start w-full mt-[2px]">
            <span className="italic text-[15px]">B.Tech in Electrical Engineering ; CGPA: 7.99</span>
            <span className="italic text-[15px]">July. 2023 – May. 2027</span>
          </div>
        </BulletRow>

        {/* Experience */}
        <SectionHeader title="Experience" />
        <BulletRow >
          <div className="flex justify-between items-start w-full mb-1">
            <span><span className="font-bold">Technip Energies</span> | Technical Engineering Intern</span>
            <span className="italic text-[15px]">10 June 2026 – 26 July 2026</span>
          </div>
          <SubBulletRow>Designed and analyzed electrical distribution systems using Single Line Diagrams (SLDs) for large-scale engineering projects.</SubBulletRow>
          <SubBulletRow>Used DIALux for lighting design, simulation, and performance analysis while meeting technical and safety standards.</SubBulletRow>
          <SubBulletRow>Analyzed engineering requirements and translated them into structured technical designs and documentation.</SubBulletRow>
          <SubBulletRow>Collaborated with cross-functional teams to troubleshoot design issues, validate system performance, and improve project efficiency.</SubBulletRow>
        </BulletRow>

        {/* Projects */}
        <SectionHeader title="Projects" />
        <BulletRow className="mb-2">
          <p className="mb-1">
            <a
              href="https://white-board-lac.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-black hover:underline"
            >
              Real-Time Collaborative Whiteboard
            </a> | React 19, Redux Toolkit, Socket.io, Node.js, MongoDB, OAuth
          </p>
          <SubBulletRow>Engineered a high-performance HTML5 2D Canvas engine supporting vector shape primitives, freehand path interpolation, sticky notes, image rendering, and interactive viewport transformation math (pan/zoom).</SubBulletRow>
          <SubBulletRow>Developed a Template & Component Library feature enabling single-click instantiation of reusable diagram templates, UI component kits, and Excalidraw format imports onto the infinite canvas.</SubBulletRow>
          <SubBulletRow>Architected an event-driven real-time collaboration layer with Socket.io for bidirectional canvas state synchronization, low-latency cursor broadcasting, and pinned spatial comment threads.</SubBulletRow>
          <SubBulletRow>Built integrated workspace management and security pipelines, pairing a canvas-linked task panel with Redux Toolkit state stacks (undo/redo) and a Node.js/MongoDB backend secured via Google OAuth 2.0 and JWT.</SubBulletRow>
        </BulletRow>

        <BulletRow className="mb-2">
          <p className="mb-1">
            <a
              href="https://github.com/ujjwalagrawal3950/Bolt"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-black hover:underline"
            >
              AI-Based Website Generator
            </a> | Next.js, React, Tailwind CSS, Google Generative AI, Convex
          </p>
          <SubBulletRow>Built a dynamic web application utilizing Google Generative AI to automatically generate full website content and functional code based on user prompts.</SubBulletRow>
          <SubBulletRow>Integrated Convex to manage real-time backend workspaces, ensuring users experience instant, live previews of generated digital assets.</SubBulletRow>
          <SubBulletRow>Implemented Axios-based API routes for seamless data fetching and engineered a clean state management pipeline using React Context.</SubBulletRow>
        </BulletRow>

        {/* Achievements and Responsibilities */}
        <SectionHeader title="Achievements and Responsibilities" />
        <BulletRow>
          <p><span className="font-bold">Flipkart GRiD 8.0 Semifinalist (2026):</span> Advanced to the Semifinalist round of Flipkart’s national-level technology competition.</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">FFE Scholar:</span> Selected for the Foundation for Excellence (FFE)  based on academic merit and potential.</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Hostel Secretary, NIT Jalandhar:</span> Coordinating hostel operations, student concerns, and administrative activities to ensure smooth functioning.</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Mess Secretary, BH-2 & BH-7:</span> Served for two consecutive years, overseeing mess operations, vendor coordination, food quality, and student feedback.</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Hostel Night Events:</span> Led the planning and execution of two Hostel Night events, managing logistics, budgeting, team coordination, and execution.</p>
        </BulletRow>

        {/* Skills */}
        <SectionHeader title="Skills" />
        <BulletRow>
          <p><span className="font-bold">Languages:</span> C, C++, JavaScript, SQL</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Frontend:</span> React.js, JSX, HTML5, CSS3, Tailwind CSS, Redux, React Router</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Backend:</span> Node.js, Express.js, REST APIs, Authentication, Google OAuth</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Databases:</span> MongoDB, Convex</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Tools:</span> Git, GitHub, Vite, Postman, VS Code</p>
        </BulletRow>
        <BulletRow>
          <p><span className="font-bold">Core CS:</span> Data Structures & Algorithms, OOP, DBMS, Computer Networks</p>
        </BulletRow>
        <BulletRow>
          <div>
            <p className="font-bold mb-1">Coding Profile:</p>
            <SubBulletRow><span className="font-bold">LeetCode:</span> Solved 350+ problems and learning more</SubBulletRow>
            <SubBulletRow><span className="font-bold">GeeksforGeeks:</span> Solved 100+ problems on DSA topics consistently improving problem-solving skills and exploring more DSA patterns.</SubBulletRow>
          </div>
        </BulletRow>

      </div>
    </div>
  );
};

export default Resume;
