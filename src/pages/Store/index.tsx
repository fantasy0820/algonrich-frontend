import "./Store.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Store() {
  const [listShow, setListShow] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative flex flex-row justify-between bg-[#141a31] mt-[90px] category_bar w-full">
          <div className="responsive mx-10">
            <div className="bg-[#141a31] store flex flex-row h-[36px] items-center ">
              <p
                className="px-2 py-1 text-base text-white cursor-pointer hover:border-white hover:border-2"
                onClick={() => {
                  setListShow(!listShow);
                }}
              >
                {" "}
                All
                <FontAwesomeIcon icon={faList} className="mx-2" />
              </p>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category"
              >
                {" "}
                Today's Deals
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category"
              >
                {" "}
                Customer Service
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category"
              >
                Registry
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category"
              >
                Gift Cards
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category"
              >
                Sell
              </a>
            </div>
            {listShow && (
              <ul
                className="top-[36px] left-0 absolute bg-[#141a31] w-[150px] z-[100000] flex flex-col category-box"
                onMouseLeave={() => {
                  setListShow(false);
                }}
              >
                <li className="p-1 text-sm text-white">Today's Deals</li>
                <li className="p-1 text-sm text-white">Customer Service</li>
                <li className="p-1 text-sm text-white">Registry</li>
                <li className="p-1 text-sm text-white">Gift Card</li>
                <li className="p-1 text-sm text-white">Sell</li>
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center store-carousel">
          <div>
            <Carousel showThumbs={false} swipeable={true}>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
              <div>
                <img src="/assets/images/store/banner.jpg" />
              </div>
            </Carousel>
          </div>
          <div className="flex flex-wrap justify-between p-4 goods_list mt-[-320px] z-[100] item-group m-auto mb-[320px] w-[95%] lg:w-[90%]">
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
          </div>
          <div className="flex flex-wrap justify-between p-4 goods_list mt-[-320px] z-[100] item-group m-auto mb-[320px] w-[95%] lg:w-[90%]">
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
            <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
              <p className="text-lg text-[#141a31] mb-4 item-title">
                Gaming Accessories
              </p>
              <div className="flex flex-row w-full">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Headsets</p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Keyboards</p>
                </div>
              </div>
              <div className="flex flex-row w-full mt-2">
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">
                    Computer Mice
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <img
                    src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg"
                    className="h-auto "
                  />
                  <p className="text-xs text-[#141a31] item-name">Chairs</p>
                </div>
              </div>
              <a href="" className="text-sm text-[#141a31] mt-2 ">
                See More
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
