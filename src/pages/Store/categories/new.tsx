import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-toastify/dist/ReactToastify.min.css';
import '../NewProduct.scss';
import { message, Upload } from 'antd';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import 'react-quill/dist/quill.snow.css';

import {
  Grid,
  Card,
  Stack,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Check, Edit, Delete } from '@mui/icons-material';
import RHFTextField from 'components/RHFTextField';

const NewCategorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  code: Yup.string().required('Code is required'),
});

const TABLE_HEAD = [
  { id: 'id', label: 'No', alignRight: false },
  { id: 'name', label: 'Category', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'action', label: '...', alignRight: false },
];

const defaultValues = {
  name: '',
  code: '',
  isDelete: false,
};

const CategoryForm = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryList, setCategoryList] = useState([
    {
      id: 1,
      name: '',
      code: '',
    },
  ]);
  const [isGet, setGetList] = useState(false);
  const [catName, setCatName] = useState('');
  const [catCode, setCode] = useState('');
  const [catId, setCatId] = useState(0);

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      if (catId > 0) {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_URL}/category/${catId}`,
          {
            name: data.name,
            code: data.code,
          },
        );

        if (response.data.id > 0) {
          message.success('Category is successfully Updated!');
        }

        reset();
        setCatId(0);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/category`,
          {
            name: data.name,
            code: data.code,
          },
        );

        if (response.data.id > 0) {
          message.success('Category is successfully registered!');
        }

        reset();
        setCatId(0);
      }
      setGetList(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/category`,
      );

      setCategoryList(response.data);
      setGetList(true);
    } catch (error) {
      console.error(error);
    }
  };

  const editCategory = async (id: number) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/category/${id}`,
      );

      if (response.data.id) {
        methods.setValue('name', response.data.name);
        methods.setValue('code', response.data.code);
        setCatId(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id: number) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/category/${id}`,
    );

    message.success(response.data);
    setGetList(false);
  };

  const activateCategory = async (id: number) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/category/activate/${id}`,
    );

    message.success(response.data);
    setGetList(false);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('useremail') !== 'admin@algonrich.com') {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (!isGet) {
      getCategoryList();
    }
  }, [isGet]);

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} className="title">
          <Trans i18nKey="cat_title">Create New Category</Trans>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} className="other-info">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card sx={{ p: 3 }} className="publish-switch">
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Category Name" />
                  <RHFTextField name="code" label="Category Code" />
                </Stack>
              </Card>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <LoadingButton
                  style={{ backgroundColor: '#ff06b7' }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {catId > 0 ? (
                    <Trans i18nKey="btn_update">Update</Trans>
                  ) : (
                    <Trans i18nKey="btn_create">Create</Trans>
                  )}
                </LoadingButton>
              </Stack>
            </form>
          </FormProvider>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer>
            <Table>
              <TableHead className="font-bold">
                <TableRow>
                  {TABLE_HEAD.map((column) => (
                    <TableCell
                      key={column.id}
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
                {categoryList.map((row: any, index: number) => {
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
                          {row.name}
                        </TableCell>
                        <TableCell
                          className="border border-[#121a3e]"
                          style={{
                            background: '#0d102d',
                            color: '#ddd',
                            borderBottomColor: '#121a3e',
                          }}
                        >
                          {row.code}
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
                            badgeContent={
                              row.isDelete ? 'Deactivated' : 'Active'
                            }
                            color={row.isDelete ? 'error' : 'success'}
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
                          <Tooltip title="Edit Category">
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
                                editCategory(row.id);
                              }}
                            >
                              <Edit sx={{ width: '16px', height: '16px' }} />
                            </IconButton>
                          </Tooltip>
                          {row.isDelete ? (
                            <Tooltip title="Activate">
                              <IconButton
                                sx={{
                                  marginRight: '5px',
                                  borderRadius: '50%',
                                  backgroundColor: '#007aff',
                                  color: '#fff',
                                  '&:hover': {
                                    backgroundColor: '#34aadc',
                                  },
                                }}
                                onClick={() => {
                                  activateCategory(row.id);
                                }}
                              >
                                <Check sx={{ width: '16px', height: '16px' }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Delete">
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
                                  deleteCategory(row.id);
                                }}
                              >
                                <Delete
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
            pageCount={Math.ceil(categoryList.length / 10)}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            previousLinkClassName={'pagination__link'}
            nextLinkClassName={'pagination__link'}
            disabledClassName={'pagination__link--disabled'}
            activeClassName={'pagination__link--active'}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryForm;
