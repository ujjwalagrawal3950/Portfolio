import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';



const SONGS = [
  {
    title: "Tum Hi Aana",
    url: "/tum_hi_aana.mp3"
  },
  {
    title: "800 Din",
    url: "/800 Din.mp3"
  },
  {
    title: "Barsaat",
    url: "/Barsaat - Banjaare (Official Video).mp3"
  }
];

// 6-color palette mapped by row height (bottom → top)
const getBarColor = (rowRatio) => {
  if (rowRatio < 0.18) return { r: 45, g: 140, b: 94 };    // Deep forest green  #2D8C5E
  if (rowRatio < 0.35) return { r: 16, g: 185, b: 129 };   // Emerald             #10B981
  if (rowRatio < 0.52) return { r: 14, g: 165, b: 233 };   // Sky blue            #0EA5E9
  if (rowRatio < 0.70) return { r: 139, g: 92, b: 246 };   // Violet              #8B5CF6
  if (rowRatio < 0.85) return { r: 244, g: 114, b: 82 };   // Warm coral          #F47252
  return { r: 239, g: 68, b: 108 };                          // Rose pink           #EF446C
};

const DotMatrixVisualizer = forwardRef(({ audioRef, isPlaying }, ref) => {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const smoothedRef = useRef(null);
  const peakRef = useRef(null);
  const peakHoldRef = useRef(null);
  const trailRef = useRef(null);

  useImperativeHandle(ref, () => ({
    initAudio: () => {
      if (audioRef.current && !audioCtxRef.current) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtxRef.current = new AudioContext();
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 512;
          analyserRef.current.smoothingTimeConstant = 0.82;

          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        } catch (e) {
          console.error("Audio Context init failed", e);
        }
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      smoothedRef.current = null;
    };

    window.addEventListener('resize', resize);
    resize();

    const COLS = 22;
    const ROWS = 22;
    const CELL_GAP = 5;

    const render = () => {
      const cellW = (w - CELL_GAP * (COLS + 1)) / COLS;
      const cellH = (h - CELL_GAP * (ROWS + 1)) / ROWS;
      const radius = Math.min(cellW, cellH) * 0.35;

      if (!smoothedRef.current) {
        smoothedRef.current = new Float32Array(COLS).fill(0);
        peakRef.current = new Float32Array(COLS).fill(0);
        peakHoldRef.current = new Float32Array(COLS).fill(0);
        trailRef.current = Array.from({ length: COLS }, () => new Float32Array(ROWS).fill(0));
      }

      // Soft off-white background
      ctx.fillStyle = '#F7FAF8';
      ctx.fillRect(0, 0, w, h);

      // Only read frequency data if analyser exists and is playing
      let dataArray = null;
      if (analyserRef.current && isPlaying) {
        const len = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(len);
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      // When not playing, force everything to zero immediately
      if (!isPlaying) {
        for (let c = 0; c < COLS; c++) {
          smoothedRef.current[c] = 0;
          peakRef.current[c] = 0;
          peakHoldRef.current[c] = 0;
          for (let r = 0; r < ROWS; r++) {
            trailRef.current[c][r] = 0;
          }
        }
      }

      for (let c = 0; c < COLS; c++) {
        let target = 0;
        if (dataArray) {
          const binIdx = Math.floor((c / COLS) * (dataArray.length * 0.65));
          target = dataArray[binIdx] / 255;
        }

        // Asymmetric smoothing: fast attack, responsive release
        const cur = smoothedRef.current[c];
        if (target > cur) {
          smoothedRef.current[c] = cur + (target - cur) * 0.55;
        } else {
          smoothedRef.current[c] = cur + (target - cur) * 0.18;
        }

        const activeRows = Math.floor(smoothedRef.current[c] * ROWS);

        // Peak hold with gravity
        if (activeRows > peakRef.current[c]) {
          peakRef.current[c] = activeRows;
          peakHoldRef.current[c] = 0;
        } else {
          peakHoldRef.current[c]++;
          if (peakHoldRef.current[c] > 15) {
            peakRef.current[c] = Math.max(0, peakRef.current[c] - 0.5);
          }
        }
        const peakRow = Math.floor(peakRef.current[c]);

        // Update trail (afterglow)
        for (let r = 0; r < ROWS; r++) {
          const rowFromBottom = ROWS - 1 - r;
          if (isPlaying && rowFromBottom < activeRows) {
            trailRef.current[c][r] = 1.0;
          } else {
            trailRef.current[c][r] *= 0.85;
          }
        }

        for (let r = 0; r < ROWS; r++) {
          const rowFromBottom = ROWS - 1 - r;
          const x = CELL_GAP + c * (cellW + CELL_GAP);
          const y = CELL_GAP + r * (cellH + CELL_GAP);

          const isActive = isPlaying && rowFromBottom < activeRows;
          const isPeak = isPlaying && rowFromBottom === peakRow && peakRow > 0;
          const trail = trailRef.current[c][r];

          // Color based on row height
          const color = getBarColor(rowFromBottom / ROWS);

          if (isActive) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.85)`;
            ctx.beginPath();
            ctx.roundRect(x, y, cellW, cellH, radius);
            ctx.fill();
            ctx.shadowBlur = 0;

          } else if (isPeak) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
            ctx.beginPath();
            ctx.roundRect(x, y, cellW, cellH, radius);
            ctx.fill();
            ctx.shadowBlur = 0;

          } else if (trail > 0.05) {
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${trail * 0.25})`;
            ctx.beginPath();
            ctx.roundRect(x, y, cellW, cellH, radius);
            ctx.fill();

          } else {
            // Inactive — faint neutral dot
            ctx.fillStyle = 'rgba(180, 180, 180, 0.08)';
            ctx.beginPath();
            ctx.roundRect(x, y, cellW, cellH, radius);
            ctx.fill();
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full aspect-[1] rounded-xl overflow-hidden relative"
      style={{
        background: '#F7FAF8',
        border: '1px solid #D1EADF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 6px rgba(45,140,94,0.06)'
      }}>
      <div className="w-full h-full p-3 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

const AudioPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const visualizerRef = useRef(null);

  const togglePlay = () => {
    // Crucial for iOS/Safari: Initialize Web Audio API context directly inside the user click handler
    if (!isPlaying && visualizerRef.current) {
      visualizerRef.current.initAudio();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentSongIndex((currentSongIndex + 1) % SONGS.length);
  };

  const playPrev = () => {
    setCurrentSongIndex((currentSongIndex - 1 + SONGS.length) % SONGS.length);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex]);

  return (
    <div className="w-full md:w-[24vw] flex flex-col gap-3">
      {/* Visualizer */}
      <DotMatrixVisualizer ref={visualizerRef} audioRef={audioRef} isPlaying={isPlaying} />

      {/* Hidden Audio */}
      <audio
        ref={audioRef}
        src={SONGS[currentSongIndex].url}
        crossOrigin="anonymous"
        onEnded={playNext}
      />

      {/* Controls */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-[#EEE]"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

        {/* Song info */}
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2D8C5E] opacity-60">
            Now Playing
          </p>
          <p className="text-sm font-medium text-[#333] truncate mt-0.5">
            {SONGS[currentSongIndex].title}
          </p>
        </div>

        {/* Transport */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={playPrev}
            className="p-1.5 text-[#999] hover:text-[#2D8C5E] transition-colors duration-200"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-[#2D8C5E] hover:bg-[#23754e] text-white rounded-full transition-all duration-200 hover:scale-105"
            style={{ boxShadow: '0 2px 8px rgba(45,140,94,0.3)' }}
          >
            {isPlaying
              ? <Pause size={18} fill="currentColor" />
              : <Play size={18} fill="currentColor" className="ml-0.5" />
            }
          </button>

          <button
            onClick={playNext}
            className="p-1.5 text-[#999] hover:text-[#2D8C5E] transition-colors duration-200"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
