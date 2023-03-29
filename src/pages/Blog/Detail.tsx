import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import {
  solid,
  regular,
  brands,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import "./Blog.scss"

interface BlogType {
  id: number;
  bannerImg: string;
  createdAt: string;
  content: string;
  title: string;
  author: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState<BlogType>({
    id: 0,
    bannerImg: "",
    createdAt: "",
    content: "",
    title: "",
    author: ""
  });

  const [prevBlogData, setPrevBlogData] = useState<BlogType>({
    id: 0,
    bannerImg: "",
    createdAt: "",
    content: "",
    title: "",
    author: ""
  });

  const [nextBlogData, setNextBlogData] = useState<BlogType>({
    id: 0,
    bannerImg: "",
    createdAt: "",
    content: "",
    title: "",
    author: ""
  });

  const [isGet, setGetBlog] = useState(false);

  const getBlog = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/${id}`);
    
    let blog = {
      id: response.data.id,
      bannerImg: response.data.bannerImg,
      createdAt: response.data.created_at,
      content: response.data.content,
      title: response.data.title,
      author: response.data.user.name,
    };
    
    setBlogData(blog);

    const prevReponse = await axios.get(`${process.env.REACT_APP_API_URL}/blog/${Number(id)-1}`);

    if(prevReponse.data) {
      let prevBlog = {
        id: prevReponse.data.id,
        bannerImg: prevReponse.data.bannerImg,
        createdAt: prevReponse.data.created_at,
        content: prevReponse.data.content,
        title: prevReponse.data.title,
        author: prevReponse.data.user.name,
      };
      
      setPrevBlogData(prevBlog);
    }

    const nextReponse = await axios.get(`${process.env.REACT_APP_API_URL}/blog/${Number(id)+1}`);

    if(nextReponse.data) {
      let nextBlog = {
        id: nextReponse.data.id,
        bannerImg: nextReponse.data.bannerImg,
        createdAt: nextReponse.data.created_at,
        content: nextReponse.data.content,
        title: nextReponse.data.title,
        author: nextReponse.data.user.name,
      };
      
      setNextBlogData(nextBlog);
    }

    setGetBlog(true);
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  useEffect(() => {
    getBlog();
  }, [isGet]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="w-[100%] rounded-[5px] h-auto py-[130px] px-[50px] pageheader">
        <p className="text-[42px] text-[#fff] leading-[50px] font-nunito text-left font-bold font-josefin">
        {blogData.title}
        </p>
      </div>

      <div className="blog-area blog-details mt-[50px]">
        <article className="blog-post-wrapper">
          <div className="blog-banner relative">
            <img className="w-[100%]" src={blogData.bannerImg}></img>
            <div className="blog-item-date">
              {/* <span className="date-type">15</span> */}
              <span className="years-type">{formatDate(blogData.createdAt)}</span>
            </div>
          </div>
          <div>
            <div className="border-none py-[30px] pl-0 bg-transparent text-left">
              <div className="mb-[10px]">
                <span className="text-[16px] text-[#ddd] font-[400] pr-[10px]">
                  <FontAwesomeIcon className="text-[#ff06b7] mr-[5px]" icon={solid("user")} />
                  {blogData.author}
                </span>
                {/* <span className="text-[16px] text-[#ddd] font-[400] pr-[10px]">
                  <FontAwesomeIcon className="text-[#ff06b7] mr-[5px]" icon={solid("comment")} />
                  16
                </span> */}
              </div>
              <div className="leading-7 transition duration-400 text-[16px] font-normal mb-[15px]" dangerouslySetInnerHTML={{ __html: blogData.content }}></div>
            </div>

            <div className="pb-[10px] text-left blog-single-tags">
              <div className="font-[700] text-[#fff] inline-block mr-[15px]">Tags:</div>
              <ul className="inline-block tag-list">
                <li className="inline-block list-none">
                  <a>
                    Ripple
                  </a>
                </li>
                <li className="inline-block list-none">
                  <a>
                    Bitcoin
                  </a>
                </li>
                <li className="inline-block list-none">
                  <a>
                    Ethereum
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </article>
        <div className="mt-[30px] text-left">
          <div>
            <h3 className="border-b border-solid border-[#666] text-[28px] font-[700] text-white mt-0 mb-[40px] pt-0 pb-[20px] capitalize">Related Posts</h3>
          </div>
          <div>
            <div className="w-[50%] float-left py-0 pr-[20px] mb-[40px]">
              {prevBlogData.id > 0 && (
                <>
                  <div className="inline-block float-left pr-[15px]">
                    <img className="w-[100%] max-w-[80px] h-[80px] object-cover rounded-[3px] border border-solid border-[#020134]" src={prevBlogData.bannerImg}></img>
                  </div>
                  <div className="pl-[100px]">
                    <p className="mb-0">
                      <Link className="text-[#ddd] text-[16px] font-[600] hover:text-[#ff06b7]" to={`/blog/detail/${prevBlogData.id}`}>
                        {prevBlogData.title}
                      </Link>
                    </p>
                    <span className="text-[14px]">
                      {formatDate(prevBlogData.createdAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="w-[50%] float-left py-0 pr-[20px] mb-[40px]">
              {nextBlogData.id > 0 && (
                <>
                  <div className="inline-block float-left pr-[15px]">
                    <img className="w-[100%] max-w-[80px] h-[80px] object-cover rounded-[3px] border border-solid border-[#020134]" src={nextBlogData.bannerImg}></img>
                  </div>
                  <div className="pl-[100px]">
                    <p className="mb-0">
                      <Link className="text-[#ddd] text-[16px] font-[600] hover:text-[#ff06b7]" to={`/blog/detail/${nextBlogData.id}`}>
                        {nextBlogData.title}
                      </Link>
                    </p>
                    <span className="text-[14px]">
                      {formatDate(nextBlogData.createdAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="clear-both"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
