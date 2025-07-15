import type {ConfigContext, ExpoConfig} from 'expo/config';

export default ({config}: ConfigContext): ExpoConfig => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return {
    ...config,
    name: config.name!,
    slug: config.slug!,
    extra: {
      ...config.extra,
      apiUrl,
    },
  };
};
