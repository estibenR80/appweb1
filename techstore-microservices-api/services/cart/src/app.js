'use strict';

const { createApp } = require('../../../shared/appFactory');
const { registerRoutes } = require('./routes');

module.exports = createApp('cart-service', registerRoutes);
