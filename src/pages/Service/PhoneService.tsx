import { useEffect } from "react";
import * as Yup from "yup";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.min.css";
import { message } from "antd";
import { LoadingButton } from "@mui/lab";
import axios from "axios";

import { useConnect, useDisconnect, useNetwork, useAccount } from "wagmi";
import {
  switchNetwork,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { parseEther } from "ethers/lib/utils.js";
import { shortenIfAddress } from "utils/address";
import { CONTRACT_ADDR, RECIPIENT } from "const/Consts";
import { ALGO_ABI } from "abi/AlgonrichABI";

import {
  Grid,
  Card,
  Chip,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import RHFTextField from "components/RHFTextField";

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

const NewServiceSchema = Yup.object().shape({
  companies: Yup.string().required("Phone Company is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  pin: Yup.string().required("PIN is required"),
  name: Yup.string().required("User Name is required"),
  email: Yup.string().required("User Email is required"),
  amount: Yup.string().required("Amount is required"),
});

const defaultValues = {
  companies: ["MetroPCS"],
  phoneNumber: "",
  pin: "",
  name: "",
  email: "",
  amount: "",
};

const PhoneService = () => {
  const servicesOption = [
    { id: 1, name: "MetroPCS" },
    { id: 2, name: "Boost Mobile" },
    { id: 3, name: "T-Mobile" },
  ];

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const methods = useForm({
    resolver: yupResolver(NewServiceSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const config = await prepareWriteContract({
        address: CONTRACT_ADDR["ALGO"] as `0x${string}`,
        abi: ALGO_ABI,
        functionName: "transfer",
        args: [RECIPIENT, parseEther(data.amount)],
      });

      await writeContract(config);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/service/create`,
        {
          type: 1,
          company: data.companies,
          phoneNumber: data.phoneNumber,
          pin: data.pin,
          username: data.name,
          email: data.email,
          amount: data.amount * 1,
        }
      );

      if (response.data.id > 0) {
        message.success("Phone Billing Service is successfully requested!");
      }

      reset();
    } catch (error: any) {
      error.response.data.message.forEach((error: any) => {
        message.error(error);
      });
    }
  };

  useEffect(() => {
    const handleSwitchNetwork = async () => {
      if (isConnected && chain?.id !== 56) {
        await switchNetwork({
          chainId: 56,
        });
      }
    };

    handleSwitchNetwork();
  }, [isConnected, chain?.id]);

  return (
    <div className="new-post justify-between mx-auto w-[95%] lg:w-[90%] py-[150px]">
      <div className="flex justify-end items-right gap-5 mr-8">
        <div className="items-center rounded-[5px] flex font-[500] text-white px-[15px] py-[10px] transition duration-300 hover:bg-[#222a3a] hover:cursor-pointer">
          <img
            src="../assets/images/bsc.svg"
            alt="Binance Smart Chain"
            className="h-7 w-7 pr-[10px]"
          />
          Binance Smart Chain
        </div>
        {isConnected && chain?.id === 56 ? (
          <div
            className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer"
            onClick={() => disconnect()}
          >
            {shortenIfAddress(address)}
          </div>
        ) : (
          <div
            className="bg-[#243056] rounded-[100px] text-[#5981f3] font-[700] py-[10px] px-[20px] transition duration-300 hover:text-[#3b4874] hover:cursor-pointer"
            onClick={() => connect()}
          >
            Connect
          </div>
        )}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
            marginTop="10px"
          >
            <Grid
              item
              xs={12}
              md={12}
              className="title"
              style={{ textAlign: "center" }}
            >
              Request a new service
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={6} className="other-info">
              <Card sx={{ p: 3 }} className="publish-switch">
                <Stack spacing={3}>
                  <Controller
                    name="companies"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={servicesOption.map((option) => option.name)}
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
                          <CssTextField label="Phone Companies" {...params} />
                        )}
                      />
                    )}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <RHFTextField name="phoneNumber" label="Phone Number" />
                    <RHFTextField name="pin" label="PIN" />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <RHFTextField name="name" label="User Name" />
                    <RHFTextField name="email" label="User Email" />
                  </Stack>
                  <RHFTextField name="amount" label="Amount" />

                  <Stack>
                    <LoadingButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                      sx={{
                        border: "2px solid #3d4db5",
                        background: "transparent",
                        fontWeight: "700",
                        "&:hover": {
                          borderColor: "#fff",
                          background: "#fff",
                          color: "#3d4db5",
                        },
                      }}
                    >
                      Pay with ALGO
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </div>
  );
};

export default PhoneService;
