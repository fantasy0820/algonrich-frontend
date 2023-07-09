import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Store.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Box, Drawer } from '@mui/material';
import axios from 'axios';
import tokenList from 'utils/tokenList.json';
import AdminOnly from 'components/AdminOnly';
import { Sidebar } from 'components/Sidebar';

export default function Store() {
  const [listShow, setListShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [isGet, setGetProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [algoPrices, setAlgoPrices] = useState<any>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const PAGE_LENGTH = 24;

  const getProducts = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/product`,
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
      return '00';
    } else {
      const decimalAsInt = Math.floor(decimal * 100);
      return decimalAsInt.toString().padStart(2, '0');
    }
  };

  const getAlgoPrice = async (usdPrice: any) => {
    const url = `https://deep-index.moralis.io/api/v2/erc20/${tokenList[0].address}/price?chain=bsc&exchange=pancakeswap-v2`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.REACT_APP_MORALIS_KEY,
      },
    });

    return (usdPrice / response.data.usdPrice).toFixed(2);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCatIdChange = async (catId: number) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/search_by_category/${catId}`,
    );

    setProducts(response.data);
    setGetProducts(true);
  };

  const searchProduct = async (event: any) => {
    if (event.keyCode === 13) {
      if (keyword === '') {
        getProducts();
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/search/${keyword}`,
        );

        setProducts(response.data);
        setGetProducts(true);
      }
    }
  };

  useEffect(() => {
    if (!isGet) {
      getProducts();
    }
  }, [isGet]);

  useEffect(() => {
    async function fetchAlgoPrices() {
      const prices = await Promise.all(
        products.map(async (product: any) => {
          const algoPrice = await getAlgoPrice(product.price);
          return algoPrice;
        }),
      );
      setAlgoPrices(prices);
    }

    fetchAlgoPrices();
  }, [products]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative flex flex-row justify-between bg-[#141a31] mt-[90px] category_bar w-full">
          <div className="mx-10 responsive">
            <div className="bg-[#141a31] store flex flex-row h-[36px] items-center ">
              <p
                className="border-2 border-transparent px-2 py-1 text-base text-white cursor-pointer hover:rounded-sm hover:border-white hover:mt-[1px] hover:pt-[3px]"
                onClick={handleDrawerToggle}
              >
                {' '}
                All
                <FontAwesomeIcon icon={faList} className="mx-2" />
              </p>
              <Link
                to="#"
                className="border-2 border-transparent px-2 py-1 text-base text-white hover:border-white hover:rounded-sm list-category hover:mt-[1px] hover:pt-[3px]"
              >
                {' '}
                Today's Deals
              </Link>
              <a
                href=""
                className="border-2 border-transparent px-2 py-1 text-base text-white hover:border-white hover:rounded-sm list-category hover:mt-[1px] hover:pt-[3px]"
              >
                {' '}
                Customer Service
              </a>
              <a
                href=""
                className="border-2 border-transparent px-2 py-1 text-base text-white hover:border-white hover:rounded-sm list-category hover:mt-[1px] hover:pt-[3px]"
              >
                Registry
              </a>
              <a
                href=""
                className="border-2 border-transparent px-2 py-1 text-base text-white hover:border-white hover:rounded-sm list-category hover:mt-[1px] hover:pt-[3px]"
              >
                Gift Cards
              </a>
              <a
                href=""
                className="border-2 border-transparent px-2 py-1 text-base text-white hover:border-white hover:rounded-sm list-category hover:mt-[1px] hover:pt-[3px]"
              >
                Sell
              </a>
            </div>
          </div>
          <AdminOnly>
            <div className="flex">
              <Link
                to="/store/orders"
                className="py-1 px-2 mr-2 text-base text-white border-2 rounded-sm border-transparent box-border hover:border-white hover:mt-[1px] hover:pt-[3px]"
              >
                Order List
              </Link>
              <Link
                to="/store/new"
                className="py-1 px-2 mr-2 text-base text-white border-2 rounded-sm border-transparent box-border hover:border-white hover:mt-[1px] hover:pt-[3px]"
              >
                + Add New
              </Link>
              <Link
                to="/store/new_category"
                className="py-1 px-2 mr-8 text-base text-white border-2 rounded-sm border-transparent box-border hover:border-white hover:mt-[1px] hover:pt-[3px]"
              >
                + Add Category
              </Link>
            </div>
          </AdminOnly>
        </div>
        <Box
          component="nav"
          sx={{ width: { md: '240px' }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'block', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: '240px',
              },
              '& .MuiPaper-root': {
                top: '90px',
              },
            }}
          >
            <Sidebar onCategoryChange={handleCatIdChange} />
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute top-[10px] right-[10px] text-[20px] cursor-pointer"
              onClick={handleDrawerToggle}
            />
          </Drawer>
        </Box>
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
          <div className="absolute xl:top-[300px] lg:top-[240px] md:top-[200px] sm:top-[160px] top-[100px]">
            <input
              type="text"
              placeholder="Search..."
              className="md:w-[400px] sm:w-[300px] text-xl lg:py-[10px] py-[5px] pr-[3px] pl-[15px] border-[2px] border-[#0c1226] rounded-[15px] bg-grey text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
              onChange={(e: any) => setKeyword(e.target.value)}
              onKeyDown={(e: any) => searchProduct(e)}
            ></input>
          </div>
          {products.length === 0 ? (
            <div className="text-[28px] mt-[50px] mb-[100px]">
              There are no products!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 p-4z mt-[-160px] z-[100] item-group m-auto mb-[320px] w-[95%] lg:w-[90%]">
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
                              item.images,
                            )})`,
                          }}
                          className="block w-full pb-[100%] mx-auto cursor-pointer bg-no-repeat bg-contain bg-top"
                        ></Link>
                        <Link
                          to={`/store/detail/${item.id}`}
                          target="_blank"
                          className="product-name sm:text-[1.2rem] text-[0.6rem]  font-medium mt-[1rem] p-[0.5rem] text-left text-[#0f1111] hover:text-[#3d4db5]"
                        >
                          {item.name}
                        </Link>
                        {item.inStock && (
                          <p className="flex justify-between items-center text-[#0f1111] p-[0.5rem] pt-0 font-semibold text-[14px] sm:text-[28px]">
                            <div className="flex items-center usd-price">
                              <span className="relative sm:text-sm text-[9px] sm:top-[-0.2rem] font-normal pr-[2px]">
                                $
                              </span>
                              {getBigPrice(item.price)}
                              <span className="relative sm:text-sm text-[9px] sm:top-[-0.2rem] pl-[2px] font-normal">
                                {getSmallPrice(item.price)}
                              </span>
                            </div>
                            <div className="algo-price">
                              <span className="relative sm:text-sm text-[9px] sm:top-[-0.5rem] font-normal pr-[2px]">
                                ALGO
                              </span>
                              <span className="text-right">
                                {algoPrices[index]}
                              </span>
                            </div>
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
