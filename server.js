const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const winston = require("winston");

const app = express();

function logProvider(provider) {
  return require("winston");
}

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    log: "debug",
    onProxyReq: (proxyReq, req, res) => {
      // Intercept and modify the request before it is sent to the target
      const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`;
      console.log(
        "Intercepted request to target:",
        fullUrl,
        " -> ",
        `http://${proxyReq._headers.host}${proxyReq.path}`
      );
      // You can modify headers or do other operations here if needed
    },
  })
);

app.listen(3000);
