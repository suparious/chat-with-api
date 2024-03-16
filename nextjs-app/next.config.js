module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://hades:3000/api/:path*',
      },
    ];
  },
};