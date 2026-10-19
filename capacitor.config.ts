import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dgbmoveisplanejados.medidas',
  appName: 'DGB Medidas',
  webDir: 'dgb-medidas',
  bundledWebRuntime: false,
  ios: { contentInset: 'automatic' },
  android: { allowMixedContent: false },
};

export default config;
