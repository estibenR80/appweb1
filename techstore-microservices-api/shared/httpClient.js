'use strict';

/**
 * Cliente HTTP para la comunicación síncrona entre microservicios.
 * Encapsula axios con timeouts y propagación del token de autenticación.
 */
const axios = require('axios');

function createClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Reenvía el header Authorization del request entrante hacia otro servicio. */
function forwardAuthHeaders(req) {
  const headers = {};
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;
  return headers;
}

module.exports = { createClient, forwardAuthHeaders };
