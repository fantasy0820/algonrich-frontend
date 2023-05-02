import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import "./Reward.scss";

interface RewardType {
  id: number;
  bannerImg: string;
  createdAt: string;
  content: string;
  title: string;
  start: string;
  end: string;
  price: number;
}

const Rewards = () => {
  const { id } = useParams();
  const [rewardData, setRewardData] = useState<RewardType>({
    id: 0,
    bannerImg: "",
    createdAt: "",
    content: "",
    title: "",
    start: "",
    end: "",
    price: 0,
  });

  const [isGet, setGetReward] = useState(false);

  const getReward = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/reward/${id}`
    );

    let reward = {
      id: response.data.id,
      bannerImg: response.data.bannerImg,
      createdAt: response.data.created_at,
      content: response.data.content,
      title: response.data.title,
      start: response.data.start,
      end: response.data.end,
      price: response.data.price,
    };

    setRewardData(reward);
    setGetReward(true);
  };

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

  useEffect(() => {
    getReward();
  }, [isGet]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="w-[100%] rounded-[5px] h-auto py-[130px] px-[50px] reward-pageheader">
        <p className="text-[42px] text-[#fff] leading-[50px] font-nunito text-left font-bold font-josefin">
          {rewardData.title}
        </p>
        {rewardData.start && (
          <div className="reward-item-date">
            <span className="years-type">
              {formatDate(rewardData.start)} ~ {formatDate(rewardData.end)}
            </span>
          </div>
        )}
      </div>

      <div className="reward-area reward-details mt-[50px]">
        <article className="reward-post-wrapper">
          <div className="reward-banner relative">
            <img className="w-[100%]" src={rewardData.bannerImg}></img>
          </div>
          <div>
            <div className="border-none py-[30px] pl-0 bg-transparent text-left">
              <div className="mb-[10px]">
                <span className="text-[16px] text-[#ddd] font-[400] pr-[10px]">
                  <FontAwesomeIcon
                    className="text-[#ff06b7] mr-[5px]"
                    icon={solid("dollar")}
                  />
                  {rewardData.price.toLocaleString()}
                </span>
              </div>
              <div
                className="leading-7 transition duration-400 text-[16px] font-normal mb-[15px] reward-detail"
                dangerouslySetInnerHTML={{ __html: rewardData.content }}
              ></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Rewards;
