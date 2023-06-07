import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Store.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AdminOnly from "components/AdminOnly";

export default function Store() {
  const [listShow, setListShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [isGet, setGetProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_LENGTH = 24;

  const getProducts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/product`
    );

    setProducts(response.data);
    setGetProducts(true);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const getFirstImage = (images: string) => {
    const list = JSON.parse(images);

    return list[0];
  };

  const getBigPrice = (price: number) => {
    return Math.floor(price);
  };

  const getSmallPrice = (price: number) => {
    const decimal = price - Math.floor(price);
    if (decimal === 0) {
      return "00";
    } else {
      const decimalAsInt = Math.floor(decimal * 100);
      return decimalAsInt.toString().padStart(2, "0");
    }
  };

  useEffect(() => {
    getProducts();
  }, [isGet]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative flex flex-row justify-between bg-[#141a31] mt-[90px] category_bar w-full">
          <div className="responsive mx-10">
            <div className="bg-[#141a31] store flex flex-row h-[36px] items-center ">
              <p
                className="px-2 py-1 text-base text-white cursor-pointer hover:rounded-sm hover:border-white hover:border-2"
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
                className="px-2 py-1 text-base text-white hover:border-white hover:rounded-sm hover:border-2 list-category"
              >
                {" "}
                Today's Deals
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:rounded-sm hover:border-2 list-category"
              >
                {" "}
                Customer Service
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:rounded-sm hover:border-2 list-category"
              >
                Registry
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:rounded-sm hover:border-2 list-category"
              >
                Gift Cards
              </a>
              <a
                href=""
                className="px-2 py-1 text-base text-white hover:border-white hover:rounded-sm hover:border-2 list-category"
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
          <AdminOnly>
            <Link
              to="/store/new"
              className="flex py-1 px-2 mr-8 text-base text-white border-2 rounded-sm border-transparent box-border hover:border-white hover:mt-[1px] hover:pt-[3px]"
            >
              + Add New
            </Link>
          </AdminOnly>
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
          {products.length === 0 ? (
            <div className="text-[28px] mt-[50px] mb-[100px]">
              There are no products!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 p-4z mt-[-320px] z-[100] item-group m-auto mb-[320px] w-[95%] lg:w-[90%]">
              {products.map((item: any, index: number) => {
                if (
                  index >= PAGE_LENGTH * currentPage &&
                  index < PAGE_LENGTH * (currentPage + 1)
                ) {
                  return (
                    <>
                      <section className="bg-white mx-[0.5rem] w-full">
                        <Link
                          to={`/store/detail/${item.id}`}
                          style={{
                            backgroundImage: `url(${getFirstImage(
                              item.images
                            )})`,
                          }}
                          className="block w-full pb-[100%] mx-auto cursor-pointer bg-no-repeat bg-contain bg-top"
                        ></Link>
                        <Link
                          to={`/store/detail/${item.id}`}
                          className="product-name sm:text-[1.2rem] text-[0.6rem]  font-medium mt-[1rem] p-[0.5rem] text-left text-[#0f1111] hover:text-[#3d4db5]"
                        >
                          {item.name}
                        </Link>
                        {item.inStock && (
                          <p className="text-left text-[#0f1111] p-[0.5rem] pt-0 font-semibold text-[14px] sm:text-[28px]">
                            <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] font-normal pr-[2px]">
                              $
                            </span>
                            {getBigPrice(item.price)}
                            <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] top-[-0.2rem] pl-[2px] font-normal">
                              {getSmallPrice(item.price)}
                            </span>
                          </p>
                        )}
                      </section>
                    </>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
