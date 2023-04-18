import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#940404',
    },
    secondary: {
      main: '#61523C',
    },
    action: {
      disabledBackground: '#E38989',
      disabled: '#FFFFF',
    },
  },
});
export default theme;
