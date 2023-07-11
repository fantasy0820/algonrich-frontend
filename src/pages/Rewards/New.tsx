import * as Yup from 'yup';
import { useState, useEffect, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-toastify/dist/ReactToastify.min.css';
import './NewPost.scss';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { LoadingButton } from '@mui/lab';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

// import MUIRichTextEditor from "mui-rte";

import { Grid, Card, Stack } from '@mui/material';
import RHFTextField from 'components/RHFTextField';
import RHFSwitch from 'components/RHFSwitch';
import RHFDateTimePicker from 'components/RHFDateTimePicker';

const NewBlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  price: Yup.string().required('Reward Price is required'),
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
});

const defaultValues = {
  title: '',
  content: '',
  cover: null,
  publish: true,
  price: '',
  startDate: '',
  endDate: '',
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

const { Dragger } = Upload;

const NewRewards = () => {
  const [quilValue, setQuilValue] = useState('');
  const [cover, setCover] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reward/create`,
        {
          title: data.title,
          bannerImg: cover,
          content: quilValue,
          start: data.startDate,
          end: data.endDate,
          price: parseFloat(data.price),
        },
      );

      if (response.data.id > 0) {
        toastr.success('Reward is successfully created!');
      }

      reset();
      setQuilValue('');
      setCover('');
    } catch (error) {
      console.error(error);
    }
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: process.env.REACT_APP_API_URL + '/file-service/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        toastr.success(`${info.file.name} file uploaded successfully.`);
        setCover(info.file.response.imageUrl);
      } else if (status === 'error') {
        toastr.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('useremail') !== 'admin@algonrich.com') {
      navigate('/');
    }
  }, []);

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} className="title">
              Create New Rewards
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* <Grid item xs={1} ></Grid> */}
            <Grid item xs={12} md={9} className="post-block">
              <Card sx={{ p: 3 }} className="post-card">
                <Stack spacing={3}>
                  <RHFTextField name="title" label="Input Title" />
                  {/* <CssTextField name="postTitle" value={''} label="Post Title" onChange={setPostTitle} /> */}
                  {/* <RHFTextField name="description" label="Description" multiline rows={3} /> */}
                  <div>
                    <p className="content-title">Content</p>
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      onChange={setQuilValue}
                      value={quilValue}
                      formats={formats}
                    />
                  </div>
                  <div>
                    <p className="content-title">Cover</p>
                  </div>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited
                      from uploading company data or other banned files.
                    </p>
                  </Dragger>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} className="other-info">
              <Card sx={{ p: 3 }} className="publish-switch">
                <Stack spacing={3}>
                  <div>
                    <RHFSwitch
                      name="publish"
                      label="Publish"
                      labelPlacement="start"
                      sx={{
                        mb: 1,
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                      }}
                    />
                  </div>

                  <RHFDateTimePicker
                    name="startDate"
                    label="Start Date"
                    control={control}
                  />
                  <RHFDateTimePicker
                    name="endDate"
                    label="End Date"
                    control={control}
                  />

                  <RHFTextField name="price" label="Reward Price" />

                  {/* <Switch /> */}
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
                  Post
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewRewards;
