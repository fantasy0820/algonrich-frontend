import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Trans } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import LangFlagSelector from "./LangFLagSelector";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";
import { Button, Dropdown, ConfigProvider } from "antd";

export default function NavBar({ lngCh }: any) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          href="https://bscscan.com/address/0x2da63e26978b27ca854bdfe33f9866aa7c99813d"
          target="_blank"
        >
          <Trans i18nKey="tab_smartcontact">Smart Contract</Trans>
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink to={"/rewards/list"}>
          <Trans i18nKey="tab_rewards">Rewards</Trans>
        </NavLink>
      ),
    },
    {
      key: "3",
      label: <NavLink to="/blog">News</NavLink>,
    },
    {
      key: "4",
      label: <NavLink to="/contactus">Contact US</NavLink>,
    },
  ];
  const [navbar, setNavbar] = useState(false);
  const [navbarCls, setNavbarCls] = useState("navbar");
  const { i18n, ready } = useTranslation();
  useEffect(() => {
    window.onscroll = function () {
      scrollFunction();
    };
  }, []);
  const scrollFunction = () => {
    if (document.documentElement.scrollTop < 200) {
      setNavbarCls("navbar z-[100]");
    } else if (document.documentElement.scrollTop < 500) {
      setNavbarCls("navbar is-fixed z-[100]");
    } else {
      setNavbarCls("navbar is-fixed is-small z-[100]");
    }
  };
  const changeLng = (lang: any) => {
    lngCh(lang);
  };
  return (
    <nav className={navbarCls}>
      <div className="justify-between mx-auto w-[95%] md:items-center md:flex">
        <div className="">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            {/* <a href="/" className="flex align-middle md:hidden xl:flex"> */}
            <NavLink className="flex flex-none align-middle xl:flex" to="/">
              <img
                src="/assets/images/logo1.png"
                alt="Logo"
                className="w-[125px] md:w-[90px] xl:w-[120px]"
              />
              <h1 className="font-chakrapetch text-[22px] hidden 2xl:block md:text-[20px] xl:text-[24px] text-white my-auto ml-[18px] uppercase">
                <Trans i18nKey="company_title">algonrich</Trans>
              </h1>
            </NavLink>
            {/* </a> */}
            <div className="flex space-x-1 md:hidden">
              {/* <LanguageSelector change={changeLng} /> */}
              <LangFlagSelector change={changeLng} />
              <button
                className="pl-[10px] pr-[10px] text-gray-700 rounded-md cursor-pointer outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* <div> */}
        <div
          className={`justify-self-center pb-3 mt-8 md:flex md:pb-0 md:mt-0 ${navbar ? "block" : "hidden"
            }`}
        >
          <ul className="items-center justify-center space-y-8 md:flex md:space-x-2 2xl:space-x-6 md:space-y-0 py-[30px] text-white font-chakrapetch uppercase font-bold">
            <li className="">
              <NavLink to={"/comingsoon"}>
                <Trans i18nKey="tab_store">Store</Trans>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/service"}>
                <Trans i18nKey="tab_services">Services</Trans>
              </NavLink>
            </li>
            <li className="md:hidden lg:block">
              <NavLink to={"/rewards/list"}>
                <Trans i18nKey="tab_rewards">Rewards</Trans>
              </NavLink>
            </li>
            <li>
              <a
                href={
                  "https://poocoin.app/tokens/0x2da63e26978b27ca854bdfe33f9866aa7c99813d"
                }
                target="_blank"
              >
                <Trans i18nKey="tab_poocoin">PooCoin</Trans>
              </a>
            </li>
            <li>
              {ready && i18n.language == "es" ? (
                <a href="https://es.futurepaper.algonrich.com/" target="_blank">
                  <Trans i18nKey="tab_futurepaper">Future Paper</Trans>
                </a>
              ) : (
                <a href="https://futurepaper.algonrich.com/" target="_blank">
                  <Trans i18nKey="tab_futurepaper">Future Paper</Trans>
                </a>
              )}
            </li>
            <li className="md:hidden lg:block">
              <a
                className="md:hidden lg:block"
                href="https://bscscan.com/address/0x2da63e26978b27ca854bdfe33f9866aa7c99813d"
                target="_blank"
              >
                <Trans i18nKey="tab_smartcontact">Smart Contract</Trans>
              </a>
            </li>
            <li className="md:hidden lg:block">
              <NavLink to="/blog">
                <Trans i18nKey="tab_news">News</Trans>
              </NavLink>
            </li>
            <li className="md:hidden lg:block">
              <NavLink to="/contactus">
                <Trans i18nKey="tab_contactus">Contact US</Trans>
              </NavLink>
            </li>
          </ul>

          <div className="mx-auto my-3 space-y-2 lg:mt-3 md:hidden lg:hidden">
            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0x2dA63e26978B27CA854bdFe33F9866AA7c99813D"
              target={"_blank"}
              className="inline-block w-full px-4 py-2 text-white rounded-0 border-[2px] rounded-[4px]  border-[#3d4db5] font-bold font-chakrapetch hover:text-[#3d4db5] hover:border-transparent hover:bg-white uppercase transition ease-in-ease"
            >
              <Trans i18nKey="btn_buyalgo"> buy algo</Trans>
            </a>
            <NavLink
              to="/swap"
              className="inline-block w-full px-4 py-2 text-white rounded-0 border-[2px] rounded-[4px]  border-[#3d4db5] font-bold font-chakrapetch hover:text-[#3d4db5] hover:border-transparent hover:bg-white uppercase transition ease-in-ease"
            >
              <Trans i18nKey="btn_swap">Swap</Trans>
            </NavLink>
          </div>
        </div>
        {/* </div> */}
        <div className="hidden space-x-2 lg:flex md:flex">
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0x2dA63e26978B27CA854bdFe33F9866AA7c99813D"
            target={"_blank"}
            className="px-4 py-2 text-white rounded-0 border-[2px] rounded-[4px]  border-[#3d4db5] font-bold font-chakrapetch hover:text-[#3d4db5] hover:border-transparent hover:bg-white uppercase transition ease-in-ease flex flex-nowrap"
          >
            <Trans i18nKey="btn_buyalgo">buy algo</Trans>
          </a>
          <NavLink
            to="/swap"
            className="px-4 py-2 text-white rounded-0 border-[2px] rounded-[4px]  border-[#3d4db5] font-bold font-chakrapetch hover:text-[#3d4db5] hover:border-transparent hover:bg-white uppercase transition ease-in-ease flex items-center"
          >
            <Trans i18nKey="btn_swap">Swap</Trans>
          </NavLink>
        </div>
        <div className="flex-initial hidden lg:hidden md:inline-block">
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: "#141a31",
                colorTextBase: "#fff",
              },
            }}
          >
            <Dropdown menu={{ items }} placement="bottomCenter">
              {/* <Button>bottomRight</Button> */}
              <button className="text-gray-700 rounded-md outline-none cursor-pointer focus:border-gray-400 focus:border">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </Dropdown>
          </ConfigProvider>
        </div>

        <div className="hidden ml-2 md:inline-block">
          {/* <LanguageSelector change={changeLng} /> */}
          <LangFlagSelector change={changeLng} />
        </div>
      </div>
    </nav>
  );
}
