module.exports = {
<<<<<<< HEAD
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  exportPathMap: function() {
=======
  async rewrites () {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*'
      }
    ]
  },
  exportPathMap: function () {
>>>>>>> 551e70b (refactoring)
    return {
      '/': { page: '/' },
      '/query-interface': { page: '/query-interface' },
      '/charts': { page: '/charts' }
<<<<<<< HEAD
    };
  }
};
=======
    }
  }
}
>>>>>>> 551e70b (refactoring)
