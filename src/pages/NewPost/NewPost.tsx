import * as Yup from 'yup';
import { useState } from "react";
import { useSnackbar } from 'notistack';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from '@mui/material/styles';
import "react-toastify/dist/ReactToastify.min.css";
import "./NewPost.scss";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { LoadingButton } from '@mui/lab';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


// import MUIRichTextEditor from "mui-rte";

import { Grid, Card, Chip, Stack, Button, TextField, Autocomplete } from '@mui/material';
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
      color: 'white'
    }
  },
});

const CssMyEditor =styled(ReactQuill) ( {
  '& .ql-snow': {
    color: 'white',
  },
})

const NewBlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  content: Yup.string().min(1000).required('Content is required'),
  cover: Yup.mixed().required('Cover is required'),
});


const defaultValues = {
  title: '',
  description: '',
  content: '',
  cover: null,
  tags: ['Logan'],
  publish: true,
  comments: true,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: ['Logan'],
};


const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const ContactForm = () => {

  const [description, setDescription] = useState({});
  const [tagValue, setTagValue] = useState({});
  const [title, setTitle] = useState({});
  const [quilValue, setQuilValue] = useState('');
  const [publishState, setPublishState] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [metaTitle, setMetaTitle] = useState({});
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      handleClosePreview();
      enqueueSnackbar('Post success!');
      // navigate(PATH_DASHBOARD.blog.posts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <FormProvider {...methods} >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} >
            <Grid item xs={9} className="title">
              Create New Post
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* <Grid item xs={1} ></Grid> */}
            <Grid item xs={9} md={9} className="post-block" >
              <Card sx={{ p: 3 }} className="post-card">
                <Stack spacing={3}>
                  <RHFTextField name="title" label="Post Title" />
                  {/* <CssTextField name="postTitle" value={''} label="Post Title" onChange={setPostTitle} /> */}
                  <RHFTextField name="description" label="Description" multiline rows={3} />
                  <div>
                    <p className="content-title">Content</p>
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      onChange={setQuilValue}
                      value={quilValue}
                      formats={formats}/>
                  </div>
                  <div>
                    <p className="content-title">Cover</p>
                  </div>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint" >
                      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                      banned files.
                    </p>
                  </Dragger>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={3} className="other-info" >
              <Card sx={{ p: 3 }} className="publish-switch">
                <Stack spacing={3}>
                  <div>
                    <RHFSwitch
                      name="publish"
                      label="Publish"
                      labelPlacement="start"
                      sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
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
                        options={TAGS_OPTION.map((option) => option)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                          ))
                        }
                        renderInput={(params) => <CssTextField label="Tags" {...params} />}
                      />
                    )}
                  />
                  <RHFTextField name="metaTitle" label="Meta Title" />

                  <RHFTextField name="metaDescription" label="Meta description" multiline rows={3} />
                  <Controller
                    name="metaKeywords"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={TAGS_OPTION.map((option) => option)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                          ))
                        }
                        renderInput={(params) => <CssTextField label="Meta keywords" {...params} />}
                      />
                    )}
                  />

                  {/* <Switch /> */}

                </Stack>
              </Card>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                  Preview
                </Button>
                <LoadingButton style={{backgroundColor: '#ff06b7'}} fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
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
