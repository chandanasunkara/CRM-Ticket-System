const client = require('prom-client');
const express = require('express');
const router = express.Router();

const register = new client.Registry();

client.collectDefaultMetrics({ register });

router.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
});

exports.metricsRoute = router;

