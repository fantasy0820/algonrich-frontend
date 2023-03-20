import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';


// ----------------------------------------------------------------------


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

export default function RHFTextField({ name, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CssTextField {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
      )}
    />
  );
}
