import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/material/styles';
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

import {
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';
import RHFTextField from 'components/RHFTextField';
import RHFSwitch from 'components/RHFSwitch';

const CssTextField = styled(TextField)({
  '& .MuiInputLabel-formControl': {
    color: 'white',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
      color: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
      color: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
      color: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
    },
  },
});

const CssMyEditor = styled(ReactQuill)({
  '& .ql-snow': {
    color: 'white',
  },
});

const NewBlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  // description: Yup.string().required('Description is required'),
  // content: Yup.string().required('Content is required'),
  // cover: Yup.mixed().required('Cover is required'),
});

const defaultValues = {
  title: '',
  // description: '',
  content: '',
  cover: null,
  tags: ['Blockchain'],
  publish: true,
  comments: true,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: ['Blockchain'],
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

interface TagType {
  id: number;
  name: string;
}

const ContactForm = () => {
  const [quilValue, setQuilValue] = useState('');
  const [cover, setCover] = useState('');
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [tagsOption, setTagsOption] = useState<Array<TagType>>([]);
  const [isGetTags, setIsGetTags] = useState(false);

  const handleClosePreview = () => {
    setOpen(false);
  };
  const handleOpenPreview = () => {
    setOpen(true);
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/blog`,
        {
          title: data.title,
          bannerImg: cover,
          content: quilValue,
          userId: 2,
        },
      );

      if (response.data.id > 0) {
        toastr.success('Blog is successfully posted!');
      }

      reset();
      setQuilValue('');
      setCover('');
    } catch (error) {
      console.error(error);
    }
  };

  const getTagsList = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/tag`, {
      headers: {
        accept: 'application/json',
      },
    });

    setTagsOption(response.data);
    setIsGetTags(true);
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

    getTagsList();
  }, [isGetTags]);

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} className="title">
              Create New Post
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* <Grid item xs={1} ></Grid> */}
            <Grid item xs={12} md={9} className="post-block">
              <Card sx={{ p: 3 }} className="post-card">
                <Stack spacing={3}>
                  <RHFTextField name="title" label="Post Title" />
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
                    <RHFSwitch
                      name="comments"
                      label="Enable comments"
                      labelPlacement="start"
                      sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  </div>

                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={tagsOption.map((option) => option.name)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={option}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <CssTextField label="Tags" {...params} />
                        )}
                      />
                    )}
                  />
                  <RHFTextField name="metaTitle" label="Meta Title" />

                  <RHFTextField
                    name="metaDescription"
                    label="Meta description"
                    multiline
                    rows={3}
                  />
                  <Controller
                    name="metaKeywords"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={tagsOption.map((option) => option.name)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={option}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <CssTextField label="Meta keywords" {...params} />
                        )}
                      />
                    )}
                  />

                  {/* <Switch /> */}
                </Stack>
              </Card>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleOpenPreview}
                >
                  Preview
                </Button>
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

export default ContactForm;
