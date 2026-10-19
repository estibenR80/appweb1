'use strict';

const app = require('./app');
const config = require('../../../shared/config');

const port = config.ports.catalog;
app.listen(port, () => {
  app.locals.logger.info('service_started', { port });
});
