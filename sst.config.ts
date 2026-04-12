/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "nicpjones",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
        cloudflare: true,
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb", {
      domain: {
        name: "nicpjones.com",
        dns: sst.cloudflare.dns(),
        redirects: [
          "www.nicpjones.com",
          "nicpwns.com",
          "www.nicpwns.com",
          "npj.wtf",
          "nicjones.org",
        ],
      },
    });
  },
});
