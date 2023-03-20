import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel, styled, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

// ----------------------------------------------------------------------

const CssFormControlLabel = styled(FormControlLabel)({
    '& span': {
        color: 'white',
    }
});
const CssSwitch = styled(Switch)({
    '& span': {
        color: 'white',
    }
});


const theme = createTheme({
    components: {
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            // Controls default (unchecked) color for the thumb
            color: "#fff"
          },
          colorPrimary: {
            "&.Mui-checked": {
              // Controls checked color for the thumb
              color: "#ff06b7",
              opacity: 1,
            }
          },
          track: {
            // Controls default (unchecked) color for the track
            opacity: 0.5,
            backgroundColor: "#fff",
            ".Mui-checked.Mui-checked + &": {
              // Controls checked color for the track
              opacity: 1,
              backgroundColor: "#ff06b7"
            }
          }
        }
      }
    }
  });

export default function RHFSwitch({ name, ...other }: any) {
    const { control } = useFormContext();

    return (
        <ThemeProvider theme={theme}>

            <CssFormControlLabel
                control={
                    <Controller name={name} control={control} render={({ field }) => <CssSwitch {...field} checked={field.value} />} />
                }
                {...other}
            />
        </ThemeProvider>
    );
}
