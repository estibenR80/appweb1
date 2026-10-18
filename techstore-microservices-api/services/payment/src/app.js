'use strict';

const { createApp } = require('../../../shared/appFactory');
const { registerRoutes } = require('./routes');

module.exports = createApp('payment-service', registerRoutes);
