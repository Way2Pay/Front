import React from "react";

const GetStarted: React.FC = () => {
  return (
    <div>
      <section>
        <div className="flex flex-col justify-center flex-1 px-8 py-8 md:px-12 lg:flex-none lg:px-24">
          <div>
            <div className="relative overflow-hidden">
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative overflow-hidden ">
                  <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                    <div className="max-w-2xl p-10 mx-auto text-center">
                      <div>
                        <p className="text-3xl tracking-tight text-gray-700">
                          Set up an account and start accepting payments in
                          crypto today.
                        </p>
                        <button className="bg-gray-600 px-5 p-2 rounded-xl mt-10">
                          Get Started Today
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="relative items-center w-full px-5 mx-auto md:px-12 lg:px-16 max-w-7xl">
          <div className="py-12 mx-auto lg:py-16">
            <div className="grid grid-cols-2 gap-0.5 md:grid-cols-4">
              <div className="flex justify-center col-span-1 px-8">
                <img className="max-h-12" src="connext.png" alt="logo" />
              </div>
              <div className="flex justify-center col-span-1 px-8">
                <img className="max-h-12" src="uni.png" alt="logo" />
              </div>

              <div className="flex justify-center col-span-1 px-8">
                <img className="max-h-12" src="polygon.png" alt="logo" />
              </div>
              <div className="flex justify-center col-span-1 px-8">
                <img className="max-h-12" src="push.png" alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;
