module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/query-interface': { page: '/query-interface' },
      '/charts': { page: '/charts' }
    };
  }
};