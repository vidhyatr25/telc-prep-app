import type { CapacitorConfig } from "@capacitor/cli";

const hostedUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.deutschlearn.app",
  appName: "DeutschLearn",
  webDir: "out",
  ...(hostedUrl
    ? {
        server: {
          url: hostedUrl,
          cleartext: false,
        },
      }
    : {}),
};

export default config;
