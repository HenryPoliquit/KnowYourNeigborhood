import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';

// "Warm Community" theme — warm white, coral + sage, soft rounded shapes.
const warmCommunity = {
  dark: false,
  colors: {
    background: '#FBF7F2',
    surface: '#FFFFFF',
    primary: '#E8745B',     // coral
    secondary: '#6B9B7C',   // sage
    error: '#D9534F',
    info: '#6B9B7C',
    success: '#578068',
    warning: '#F2C14E',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#2D2A26',
    'on-surface': '#2D2A26',
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'warmCommunity',
    themes: { warmCommunity },
  },
  defaults: {
    VBtn: { variant: 'flat', rounded: 'lg' },
    VCard: { flat: true },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VTextarea: { variant: 'outlined', color: 'primary' },
    VAlert: { variant: 'tonal' },
  },
});
