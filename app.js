'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

const { swaggerSecurityHandlers } = require('./api/helpers/swaggerSecurity');

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port, () => {
    console.log(`App started on \x1b[32mhttp://127.0.0.1:${port}\x1b[0m`);
  });
});
