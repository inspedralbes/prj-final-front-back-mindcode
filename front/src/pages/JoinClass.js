import React from 'react';

const JoinClass = () => {
  return (
    <div className="min-h-screen bg-black text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-black shadow sm:rounded-lg flex flex-row-reverse justify-center flex-1">

        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className=" mt-60 flex-col items-center">
            
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button className="w-40 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-white text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <span className="ma-4">JOIN CLASS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/IA.png')`, 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;