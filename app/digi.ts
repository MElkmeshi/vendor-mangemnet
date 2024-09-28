import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 9000;

const API_SERVICE_URL = "http://localhost:8080";

app.use(
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Starting Proxy at http://localhost:${PORT}`);
});
