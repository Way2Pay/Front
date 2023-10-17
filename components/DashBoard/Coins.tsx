import React from "react";

const Coins: React.FC = () => {
  const handleMouseEnter = (
    event: React.MouseEvent<HTMLVideoElement, MouseEvent>
  ) => {
    const video = event.currentTarget;
    video.play();
  };

  return (
    <div>
      <section>
        <div className="relative items-center w-full px-5  mx-auto md:px-12 lg:px-20 max-w-7xl">
          <div className="grid w-full grid-cols-2 mx-auto lg:grid-cols-3">
            {["ETH", "USDT", "USDC"].map((coin) => (
              <div key={coin} className="max-w-md p-6 mx-auto relative">
                <video
                  onMouseEnter={handleMouseEnter}
                  muted
                  src={`${coin}.webm`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 bg-opacity-60 p-4 px-10 rounded-xl ">
                  <div className="text-lg font-medium leading-6 text-white">
                    Total Earned
                    <br />
                    <div className="flex items-center justify-center h-full">
                      <span className="font-light">{`200 ${coin}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coins;
