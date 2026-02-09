const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Static Favicon - #439BB2 Color */}
        <img
          src="/favicon.svg"
          alt="Rise For Iran logo"
          className="w-[300px] h-[300px] drop-shadow-xl"
          style={{
            filter: 'brightness(0) saturate(100%) invert(50%) sepia(85%) saturate(450%) hue-rotate(185deg) brightness(95%) contrast(90%)'
          }}
        />

        {/* Animated Text and Loading Bar */}
        <div className="mt-12 overflow-hidden">
          <h2 className="text-2xl font-bold tracking-widest text-gray-800 animate-pulse">
            <span className="text-green-600">R</span>ISE 
            <span className="mx-2 text-gray-400">FOR</span> 
            <span className="text-red-600">I</span>RAN
          </h2>
          <div className="h-1 w-full bg-gray-200 mt-2 relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-white to-red-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;