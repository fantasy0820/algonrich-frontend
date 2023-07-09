import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const CssSelect = styled(Select)({
  '& .MuiInputLabel-formControl': {
    color: 'white',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
      color: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

export default function RHFSelect({ name, options, ...other }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CssSelect
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {options.map((option: any) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </CssSelect>
      )}
    />
  );
}
