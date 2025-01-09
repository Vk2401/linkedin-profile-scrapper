/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          // Suppressing ESLint for wildcard origin usage - adjust this for production
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          { key: "Access-Control-Allow-Credentials", value: "true" },
          /* eslint-disable-next-line no-restricted-globals */
          { key: "Access-Control-Allow-Origin", value: "*" }, // Example: Adjust this as needed
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
