/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['tarotvora.com'], // 허용할 외부 도메인 추가
      },
};

export default nextConfig;
