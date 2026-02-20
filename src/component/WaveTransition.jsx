export const WaveTransition = () => {
    return (
        <div className="absolute top-0 left-0 w-full leading-[0] z-20 pointer-events-none">
            <svg
                className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px] bg-white"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,30 C150,90 200,10 300,30 C400,50 500,110 600,30 C700,-50 800,50 900,30 C1000,10 1100,90 1200,30 L1200,120 L0,120 Z"
                    fill="#222223"
                />
            </svg>

        </div>
    );
};