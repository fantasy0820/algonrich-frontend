import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import ReactPaginate from "react-paginate";
import AdminOnly from "components/AdminOnly";
import { Modal } from "antd";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "./Reward.scss";

const RewardItem: React.FC<{
  rewardContent: string;
  imgSrc: string;
  start: string;
  end: string;
  price: number;
  rewardId: number;
  removed: any;
}> = ({ rewardContent, imgSrc, start, end, price, rewardId, removed }) => {
  const [isVisible, setVisible] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const removeReward = async (rewardId: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/reward/${rewardId}`);

    toastr.success("Successfully removed!");
    removed();
  };

  return (
    <div className="w-full bg-[#131740] relative px-[20px] py-[20px] rounded-[4px]">
      <div className="float-left w-[100%] lg:w-[40%] relative">
        <img className="" src={imgSrc}></img>
      </div>
      <div className="float-right w-[100%] lg:w-[60%] lg:px-[30px] lg:py-0">
        <div className="float-left mb-[15px] mt-[15px] lg:mt-0">
          <span className="text-[16px] text-[#ddd] font-[400] pr-[10px]">
            <FontAwesomeIcon
              className="text-[#ff06b7] mr-[5px]"
              icon={solid("dollar")}
            />
            {price.toLocaleString()}
          </span>
          <AdminOnly>
            <span
              className="text-[16px] text-[#ddd] font-[400] pr-[10px] cursor-pointer hover:text-[#ff06b7]"
              onClick={() => {
                setVisible(true);
              }}
            >
              <FontAwesomeIcon
                className="text-[#ff06b7] mr-[5px]"
                icon={solid("trash")}
              />
              Remove
            </span>
            <Modal
              open={isVisible}
              className="modal pb-0"
              footer={
                <div className="flex justify-end bg-[#131740] py-2 px-2 rounded-b-[7px]">
                  <button
                    className="bg-[#ff06b7] hover:opacity-80 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      removeReward(rewardId);
                      setVisible(false);
                    }}
                  >
                    OK
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => {
                      setVisible(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              }
            >
              <div className="modal-header bg-[#ff06b7] text-white p-4 rounded-t-[7px]">
                <h2>Confirm Removal</h2>
              </div>
              <div className="modal-body p-4 bg-[#131740]">
                <p>Are you sure you want to remove this reward?</p>
              </div>
            </Modal>
          </AdminOnly>
        </div>
        <div className="float-left mb-[15px] mt-[15px] lg:mt-0 text-left">
          <span className="text-[16px] text-[#ddd] font-[400]">
            <FontAwesomeIcon
              className="text-[#ff06b7] mr-[5px]"
              icon={solid("calendar")}
            />
            {formatDate(start)} ~ {formatDate(end)}
          </span>
        </div>
        <div className="clear-both"></div>
        <Link
          className="text-[#fff] hover:text-[#724766]"
          to={`/rewards/${rewardId}`}
        >
          <h4 className="text-[22px] text-left transition duration-400">
            {rewardContent}
          </h4>
        </Link>
        <Link className="reward-btn" to={`/rewards/${rewardId}`}>
          More ...
        </Link>
      </div>
    </div>
  );
};

const RewardList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [RewardData, setRewardData] = useState([]);
  const [isGet, setGetRewards] = useState(false);

  const getRewardList = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reward`);

    setRewardData(response.data);
    setGetRewards(true);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  useEffect(() => {
    getRewardList();
  }, [isGet]);

  return (
    <>
      {/* <div className="h-[50px]"> */}
      {/* </div> */}
      <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[124px]">
        <AdminOnly>
          <div className="w-[100%] rounded-[5px] h-[60px] py-[0px]">
            <Link
              to="/new_reward"
              className="bg-[#ff06b7] text-white float-right text-right px-[20px] py-[10px] rounded-lg"
            >
              New Reward
            </Link>
          </div>
        </AdminOnly>

        <div className="w-[100%] rounded-[5px] h-auto py-[130px] px-[50px] reward-pageheader">
          <p className="text-[42px] leading-[50px] font-nunito text-left font-bold font-josefin text-[#fff]">
            Latest rewards
          </p>
        </div>

        {RewardData.length == 0 ? (
          <div className="mt-[120px] font-[30px]">No results!</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] mt-[50px]">
              {RewardData.map((item: any, index: number) => {
                if (
                  index >= 10 * currentPage &&
                  index < 10 * (currentPage + 1)
                ) {
                  return (
                    <RewardItem
                      key={index}
                      rewardContent={item.title}
                      imgSrc={item.bannerImg}
                      start={item.start}
                      end={item.end}
                      price={item.price}
                      rewardId={item.id}
                      removed={() => getRewardList()}
                    />
                  );
                }
              })}
            </div>
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              pageCount={Math.ceil(RewardData.length / 6)}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RewardList;
