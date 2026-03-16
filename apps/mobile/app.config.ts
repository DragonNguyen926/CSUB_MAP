import "dotenv/config"

export default ({ config }: any) => ({
  ...config,
  extra: {
    API_BASE: process.env.EXPO_PUBLIC_API_BASE,
  },
})