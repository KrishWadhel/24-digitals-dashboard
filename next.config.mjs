/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3', 'pdf-parse', 'xlsx'],
  output: 'standalone',
};

export default nextConfig;
