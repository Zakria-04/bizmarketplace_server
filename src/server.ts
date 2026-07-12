import http from "http";
import dotenv from "dotenv";
import app from "./index";

dotenv.config();

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `Server is running on port ${port} waiting for MongoDB connection...`,
  );
});
