import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'COMMA',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: "alarm_icon",
    }
  }
};

export default config;
