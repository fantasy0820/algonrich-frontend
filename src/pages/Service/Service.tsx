import { useState } from "react";

const Service = () => {
  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="w-[100%] rounded-[5px] h-auto">
        <p className="text-[42px] text-[#fff] leading-[50px] font-nunito text-center font-bold font-josefin pt-[50px]">
          <span className="text-[#ff06b7]">Algonrich</span> provides you best
          services
        </p>
        <div className="flex flex-wrap mx-[-15px]">
          <div className="w-full md:w-1/3 px-[15px]">
            <div className="single-service py-[30px] px-[20px] visible animate-delay-[0.5s] animate-fadeInUp shadow bg-[#131740] transition min-h-[310px] relative mb-[30px] rounded">
              <div>
                <img
                  className="w-[80px] h-[80px] mb-[30px]"
                  src="/assets/images/service/s2.png"
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
