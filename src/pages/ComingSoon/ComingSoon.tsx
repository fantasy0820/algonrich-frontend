import "./ComingSoon.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [listShow, setListShow] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative flex flex-row justify-between bg-[#141a31] mt-[90px] category_bar w-full">
        <div className="mx-10">
          <div className="bg-[#141a31] store flex flex-row h-[36px] items-center ">
            <p className="px-2 py-1 text-base text-white cursor-pointer hover:border-white hover:border-2" onClick={() => {
              setListShow(!listShow)
            }} > All
              <FontAwesomeIcon icon={faList} className="mx-2" /></p>
            <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category" > Today's Deals</a>
            <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category" > Customer Service</a >
            <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category">Registry</a>
            <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category" >Gift Cards</a>
            <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category">Sell</a>
          </div >
          {
            listShow && <> <ul className="top-[0px] left-0 fixed bg-[#141a31] w-[150px] z-[100000] flex flex-col category-box h-[100vh] ">
              <li className="flex flex-row items-center justify-center p-1 mt-2 text-base text-white background-[#989898]"><FontAwesomeIcon icon={faCircleUser} className="mr-2 text-lg" />Sign In</li>
              <li className="p-1 text-sm text-white">Today's Deals</li>
              <li className="p-1 text-sm text-white">Customer Service</li>
              <li className="p-1 text-sm text-white">Registry</li>
              <li className="p-1 text-sm text-white">Gift Card</li>
              <li className="p-1 text-sm text-white">Sell</li>
            </ul>
              <div className="fixed top-0 left-0 bg-black opacity-70 z-[99999] w-[100vw] h-[100vh]" onClick={() => {
                setListShow
                  (!listShow)
              }}></div></>
          }
        </div>
        <div className="flex items-center justify-center">
          <a href="" className="px-2 py-1 text-base text-white hover:border-white hover:border-2 list-category">Shop Deals in Eltetronics</a>
        </div>
      </div>
      <div className="flex flex-col items-center store-carousel">
        <div className="relative">
          <Carousel showThumbs={false} swipeable={true}>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
            <div>
              <img src="https://m.media-amazon.com/images/I/71RaBHdyGuL._SX3000_.jpg" />
            </div>
          </Carousel>
          <div className="absolute top-0 left-0 z-20 w-full h-full gradient">

          </div>
        </div>
        <div className="flex flex-wrap justify-between p-4 goods_list mt-[-320px] z-[100] item-group max-w-[1520px] m-auto mb-[320px] w-[90vw]">
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between p-4 goods_list mt-[-320px] z-[100] item-group max-w-[1520px] m-auto mb-[320px] w-[90vw]">
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
          <div className="w-[23%] h-auto bg-white relative mb-4 store-item p-4 flex flex-col items-start font-medium">
            <p className="text-lg text-[#141a31] mb-4 item-title">Gaming Accessories</p>
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Headsets</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Keyboards</p>
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Computer Mice</p>
              </div>
              <div className="flex flex-col items-start justify-start">
                <img src="/assets/images/store/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg" className="h-auto " />
                <p className="text-xs text-[#141a31] item-name">Chairs</p>
              </div>
            </div>
            <a href="" className="text-sm text-[#141a31] mt-2 ">See More</a>
          </div>
        </div>
      </div>
    </div>
  )
}