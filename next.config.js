const path = require('path');

module.exports = {
  async headers() {
    return [
      {
        source: '/maroc1.zarr/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/octet-stream' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/maroc1.zarr/:path*',
        destination: '/public/maroc1.zarr/:path*',
      },
    ];
  },
};
