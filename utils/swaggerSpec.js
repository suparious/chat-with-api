const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat_with_USA_Economy_Data API',
      version: '1.0.0',
      description: 'API documentation for Chat_with_USA_Economy_Data project',
    },
  },
  apis: ['./routes/apiRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;