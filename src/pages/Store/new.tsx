import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.min.css";
import "./NewProduct.scss";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { LoadingButton } from "@mui/lab";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

// import MUIRichTextEditor from "mui-rte";

import {
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import RHFTextField from "components/RHFTextField";
import RHFSwitch from "components/RHFSwitch";

const CssTextField = styled(TextField)({
  "& .MuiInputLabel-formControl": {
    color: "white",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
    color: "white",
  },
  "& .MuiAutocomplete-tag": {
    color: "white",
  },
  "& .MuiChip-deleteIcon": {
    color: "white !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
      color: "white",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  },
});

const CssMyEditor = styled(ReactQuill)({
  "& .ql-snow": {
    color: "white",
  },
});

const NewBlogSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  // description: Yup.string().required("Description is required"),
  // images: Yup.mixed().required("Cover is required"),
  code: Yup.string().required("Code is required"),
  price: Yup.number().required("Price is required"),
  salePrice: Yup.number().required("Sale price is required"),
});

const defaultValues = {
  name: "",
  description: "",
  images: null,
  inStock: true,
  code: "",
  keywords: ["Blockchain"],
  price: 0,
  salePrice: 0,
};

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const { Dragger } = Upload;

interface TagType {
  id: number;
  name: string;
}

const ProductForm = () => {
  const [quilValue, setQuilValue] = useState("");
  const [productImages, setImages] = useState<string[]>([]);
  const [keywordsOption, setKeywordsOption] = useState<Array<TagType>>([]);

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
        `${process.env.REACT_APP_API_URL}/product`,
        {
          name: data.name,
          images: JSON.stringify(productImages),
          description: quilValue,
          code: data.code,
          inStock: data.inStock,
          keywords: JSON.stringify(data.keywords),
          price: data.price,
          salePrice: data.salePrice,
        }
      );

      if (response.data.id > 0) {
        message.success("Product is successfully registered!");
      }

      reset();
      setQuilValue("");
      setImages([]);
      setKeywordsOption([]);
    } catch (error) {
      console.error(error);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/file-service/product-upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setImages((prevImages) => [...prevImages, info.file.response.imageUrl]);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("useremail") !== "admin@algonrich.com") {
      navigate("/");
    }
  }, []);

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} className="title">
              Create New Product
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9} className="post-block">
              <Card sx={{ p: 3 }} className="post-card">
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Product Name" />
                  <div>
                    <p className="content-title">Description</p>
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      onChange={setQuilValue}
                      value={quilValue}
                      formats={formats}
                    />
                  </div>
                  <div>
                    <p className="content-title">Images</p>
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
                      name="inStock"
                      label="In stock"
                      labelPlacement="start"
                      sx={{
                        mb: 1,
                        mx: 0,
                        width: 1,
                        justifyContent: "space-between",
                      }}
                    />
                  </div>

                  <RHFTextField name="code" label="Product Code" />

                  <Controller
                    name="keywords"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={keywordsOption.map((option) => option.name)}
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
                          <CssTextField label="Keywords" {...params} />
                        )}
                      />
                    )}
                  />
                </Stack>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <RHFTextField name="price" label="Price" />
                  <RHFTextField name="salePrice" label="Sale Price" />
                </Stack>
              </Card>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                <LoadingButton
                  style={{ backgroundColor: "#ff06b7" }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Create Product
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;