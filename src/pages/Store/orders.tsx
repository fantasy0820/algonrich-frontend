import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Check, SettingsBackupRestore } from '@mui/icons-material';
import { Modal } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { shortenIfAddress } from 'utils/address';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AdminOnly from 'components/AdminOnly';

const TABLE_HEAD = [
  { id: 'id', label: 'Order No', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'name', label: 'Product', alignRight: false, width: 200 },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'orderer', label: 'Orderer', alignRight: false, width: 240 },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'action', label: '...', alignRight: false },
];

interface OrderProps {
  id: number;
  productId: string;
  products: [];
  product: {
    id: number;
    name: string;
    images: string;
    description: string;
    code: string;
    inStock: boolean;
    keywords: string;
    price: number;
    salePrice: number;
    orderId: string;
    isDelete: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  price: number;
  qty: number;
  orderer: string;
  address: string;
  status: string;
  isDelete: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [orderData, setOrderData] = useState([
    {
      id: 1,
      productId: '1',
      products: [],
      product: {
        id: 1,
        name: '',
        images: '',
        description: '',
        code: '',
        inStock: false,
        keywords: '',
        price: 0,
        salePrice: 0,
        orderId: '',
        isDelete: false,
        created_at: '',
        updated_at: '',
        deleted_at: '',
      },
      price: 0,
      qty: 0,
      orderer: '',
      address: '',
      status: '',
      isDelete: false,
      created_at: '',
      updated_at: '',
      deleted_at: '',
    },
  ]);
  const [isGet, setGetOrders] = useState(false);
  const [isDeleteVisible, setDeleteVisible] = useState(false);

  const getOrderList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/order`,
      );
      const order = response.data;

      const promises = order.map(async (item: any) => {
        const productResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/${parseInt(
            item.productId,
          )}`,
        );
        item.product = productResponse.data;
        return item;
      });

      const result = await Promise.all(promises);
      setOrderData(result);
      setGetOrders(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(Date.parse(dateString));
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const refund = async (id: number) => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/order/refund/${id}`);

    setGetOrders(false);
    toastr.success('Successfully refunded!');
  };

  const completeOrder = async (id: number) => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/order/complete/${id}`);

    setGetOrders(false);
    toastr.success('Successfully updated!');
  };

  const getFirstImage = (images: string) => {
    if (images !== '') {
      const list = JSON.parse(images);

      return list[0];
    }

    return '';
  };

  const getBadegeContent = (status: string) => {
    if (status === 'pending') {
      return 'Pending';
    } else if (status === 'refunded') {
      return 'Refunded';
    } else {
      return 'Completed';
    }
  };

  const getBadegeColor = (status: string) => {
    if (status === 'pending') {
      return 'warning';
    } else if (status === 'refunded') {
      return 'error';
    } else {
      return 'success';
    }
  };

  useEffect(() => {
    getOrderList();
  }, [isGet]);

  return (
    <div className="justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <AdminOnly>
        <div className="w-[100%] h-auto">
          <p className="text-[42px] text-white leading-[50px] font-nunito text-center font-bold font-josefin pt-[50px] pb-[100px]">
            Order List
          </p>
          <TableContainer>
            <Table stickyHeader>
              <TableHead className="font-bold">
                <TableRow>
                  {TABLE_HEAD.map((column) => (
                    <TableCell
                      key={column.id}
                      width={column.width ? column.width : ''}
                      align={column.alignRight ? 'right' : 'left'}
                      className="border border-[#121a3e]"
                      style={{
                        background: '#0d102d',
                        color: '#ddd',
                        borderBottomColor: '#121a3e',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.map((row: any, index: number) => {
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
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          {row.id}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          <img
                            src={getFirstImage(row.product.images)}
                            alt="img"
                            className="w-[60px] h-[60px]"
                          ></img>
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          {row.product.name}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          <p>
                            Price: {row.usd}$({row.algo}ALGO)
                          </p>
                          <p>Qty: {row.qty}</p>
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          <p title={row.orderer}>
                            {shortenIfAddress(row.orderer)}
                          </p>
                          <p>{row.address}</p>
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                            textAlign: 'center',
                          }}
                        >
                          <Badge
                            badgeContent={getBadegeContent(row.status)}
                            color={getBadegeColor(row.status)}
                          ></Badge>
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          {row.created_at && formatDate(row.created_at)}
                        </TableCell>

                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          {row.status === 'pending' && (
                            <Tooltip title="Mark as completed">
                              <IconButton
                                sx={{
                                  marginRight: '5px',
                                  borderRadius: '50%',
                                  backgroundColor: '#07bc0c',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#278029',
                                  },
                                }}
                                onClick={() => {
                                  completeOrder(row.id);
                                }}
                              >
                                <Check sx={{ width: '16px', height: '16px' }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {!(row.status === 'completed') && (
                            <Tooltip title="Refund product">
                              <IconButton
                                sx={{
                                  marginRight: '5px',
                                  borderRadius: '50%',
                                  backgroundColor: '#ff06b7',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#b70082',
                                  },
                                }}
                                onClick={() => {
                                  refund(row.id);
                                }}
                              >
                                <SettingsBackupRestore
                                  sx={{ width: '16px', height: '16px' }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            pageCount={Math.ceil(orderData.length / 10)}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            previousLinkClassName={'pagination__link'}
            nextLinkClassName={'pagination__link'}
            disabledClassName={'pagination__link--disabled'}
            activeClassName={'pagination__link--active'}
          />
        </div>
      </AdminOnly>
    </div>
  );
};

export default Orders;
