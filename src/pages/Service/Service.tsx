import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import ReactPaginate from "react-paginate";
import AdminOnly from "components/AdminOnly";
import "./Service.scss";

const TABLE_HEAD = [
  { id: "phone", label: "Phone Number", alignRight: false },
  { id: "pin", label: "PIN", alignRight: false },
  { id: "name", label: "User name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "amount", label: "Amount", alignRight: true },
  { id: "company", label: "Service Company", alignRight: false },
];

const Service = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [serviceData, setServiceData] = useState([]);
  const [isGet, setGetServices] = useState(false);

  const getServiceList = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/service`
    );

    setServiceData(response.data);
    setGetServices(true);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  useEffect(() => {
    getServiceList();
  }, [isGet]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="w-[100%] h-auto">
        <p className="text-[42px] text-white leading-[50px] font-nunito text-center font-bold font-josefin pt-[50px] pb-[100px]">
          <span className="text-[#ff06b7]">Algonrich</span> provides you best
          services
        </p>
        <div className="flex flex-wrap mx-[-15px]">
          <div className="w-full md:w-1/3 px-[15px]">
            <Link
              to="/service/phone"
              className="single-service block z-[1] py-[30px] px-[20px] shadow bg-[#131740] hover:bg-[#101436] cursor-pointer min-h-[310px] relative mb-[30px] rounded"
            >
              <div className="service-icon">
                <img
                  className="w-[80px] h-[80px] mb-[30px]"
                  src="/assets/images/service/s2.png"
                ></img>
              </div>
              <div className="service-inner">
                <div className="service-content text-left">
                  <p className="inline-block text-[24px] text-white mb-0 pb-[15px] capitalize font-medium">
                    Phone Bill
                  </p>
                  <p className="text-[16px] mb-0">
                    Aspernatur sit adipisci quaerat unde at neque Redug Lagre
                    dolor sit amet consectetu. independent agency, free from
                    the.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-full md:w-1/3 px-[15px]">
            <div className="single-service z-[1] py-[30px] px-[20px] shadow bg-[#131740] min-h-[310px] relative mb-[30px] rounded">
              <div className="service-icon">
                <img
                  className="w-[80px] h-[80px] mb-[30px]"
                  src="/assets/images/service/s4.png"
                ></img>
              </div>
              <div className="service-inner">
                <div className="service-content text-left">
                  <p className="inline-block text-[24px] text-white mb-0 pb-[15px] capitalize font-medium">
                    Cable Bill
                  </p>
                  <p className="text-[16px] mb-0">Coming Soon...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-[15px]">
            <div className="single-service z-[1] py-[30px] px-[20px] shadow bg-[#131740] min-h-[310px] relative mb-[30px] rounded">
              <div className="service-icon">
                <img
                  className="w-[80px] h-[80px] mb-[30px]"
                  src="/assets/images/service/s4.png"
                ></img>
              </div>
              <div className="service-inner">
                <div className="service-content text-left">
                  <p className="inline-block text-[24px] text-white mb-0 pb-[15px] capitalize font-medium">
                    Electric Bill
                  </p>
                  <p className="text-[16px] mb-0">Coming Soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminOnly>
        <div className="w-[100%] h-auto">
          <p className="text-[42px] text-white leading-[50px] font-nunito text-center font-bold font-josefin pt-[50px] pb-[100px]">
            Service Request List
          </p>
          <TableContainer>
            <Table stickyHeader>
              <TableHead className="">
                <TableRow>
                  {TABLE_HEAD.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.alignRight ? "right" : "left"}
                      className="border border-[#121a3e]"
                      style={{
                        background: "#0d102d",
                        color: "#ddd",
                        borderBottomColor: "#121a3e",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceData.map((row: any, index: number) => {
                  if (
                    index >= 10 * currentPage &&
                    index < 10 * (currentPage + 1)
                  ) {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        className="service-table-row"
                      >
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.phoneNumber}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.pin}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.username}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.email}
                        </TableCell>
                        <TableCell
                          align="right"
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.amount}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: "#0d102d",
                            color: "#ddd",
                            borderBottomColor: "#121a3e",
                          }}
                        >
                          {row.company}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={Math.ceil(serviceData.length / 10)}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </AdminOnly>
    </div>
  );
};

export default Service;
