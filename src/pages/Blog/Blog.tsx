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
import "./Blog.scss";

const BlogItem: React.FC<{
  blogContent: string;
  imgSrc: string;
  created: string;
  author: string;
  blogId: number;
  removed: any;
}> = ({ blogContent, imgSrc, created, author, blogId, removed }) => {
  const [isVisible, setVisible] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const removeBlog = async (blogId: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/blog/${blogId}`);

    toastr.success("Successfully removed!");
    removed();
  };

  return (
    <div className="w-full bg-[#131740] relative px-[20px] py-[20px] rounded-[4px]">
      <div className="float-left w-[100%] lg:w-[40%] relative">
        <img className="" src={imgSrc}></img>
        <div className="blog-item-date">
          {/* <span className="date-type">15</span> */}
          <span className="years-type">{formatDate(created)}</span>
        </div>
      </div>
      <div className="float-right w-[100%] lg:w-[60%] lg:px-[30px] lg:py-0">
        <div className="float-left mb-[15px] mt-[15px] lg:mt-0">
          <span className="text-[16px] text-[#ddd] font-[400] pr-[10px]">
            <FontAwesomeIcon
              className="text-[#ff06b7] mr-[5px]"
              icon={solid("user")}
            />
            {author}
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
                      removeBlog(blogId);
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
              <div className="modal-body p-4 bg-[#131740] text-white">
                <p>Are you sure you want to remove this blog?</p>
              </div>
            </Modal>
          </AdminOnly>
        </div>
        <div className="clear-both"></div>
        <Link
          className="text-[#fff] hover:text-[#ff06b7]"
          to={`/blog/detail/${blogId}`}
        >
          <h4 className="text-[22px] text-left transition duration-400">
            {blogContent}
          </h4>
        </Link>
        <Link className="blog-btn" to={`/blog/detail/${blogId}`}>
          Read more ...
        </Link>
      </div>
    </div>
  );
};

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [blogData, setBlogData] = useState([]);
  const [isGet, setGetBlogs] = useState(false);

  const getBlogList = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog`);

    setBlogData(response.data);
    setGetBlogs(true);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  useEffect(() => {
    getBlogList();
  }, [isGet]);

  return (
    <>
      {/* <div className="h-[50px]"> */}
      {/* </div> */}
      <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[124px]">
        <AdminOnly>
          <div className="w-[100%] rounded-[5px] h-[60px] py-[0px]">
            <Link
              to="/new_post"
              className="bg-[#ff06b7] text-white float-right text-right px-[20px] py-[10px] rounded-lg"
            >
              New Post
            </Link>
          </div>
        </AdminOnly>

        <div className="w-[100%] rounded-[5px] h-auto py-[130px] px-[50px] pageheader">
          <p className="text-[42px] leading-[50px] font-nunito text-left font-bold font-josefin text-[#fff]">
            Latest news
          </p>
        </div>

        {blogData.length == 0 ? (
          <div className="mt-[120px] font-[30px]">No results!</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] mt-[50px]">
              {blogData.map((item: any, index: number) => {
                if (
                  index >= 10 * currentPage &&
                  index < 10 * (currentPage + 1)
                ) {
                  return (
                    <BlogItem
                      key={index}
                      blogContent={item.title}
                      imgSrc={item.bannerImg}
                      created={item.created_at}
                      author={item.user.name}
                      blogId={item.id}
                      removed={() => getBlogList()}
                    />
                  );
                }
              })}
            </div>
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              pageCount={Math.ceil(blogData.length / 6)}
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

export default Blog;
