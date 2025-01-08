/**
 * @type {import('next').NextConfig}
 */
const nextConfig: import('next').NextConfig = {

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Example: Adjust this as needed
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
