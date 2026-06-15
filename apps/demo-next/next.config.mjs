/** @type {import('next').NextConfig} */
const nextConfig = {
  // モノレポ内の workspace パッケージをトランスパイル対象にする
  transpilePackages: ['@site-map/react', '@site-map/core'],
};

export default nextConfig;
