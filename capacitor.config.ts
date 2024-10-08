import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coders.comma',
  appName: 'COMMA',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'none'
    },
    LocalNotifications: {
      smallIcon: "alarm_icon",

    }
  }
};

export default config;
