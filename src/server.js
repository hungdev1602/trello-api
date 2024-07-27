/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const app = express();

  app.use("/v1", APIs_V1);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hello ${env.AUTHOR}, Back-End server successfully at Host: http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  // Thực hiện các tác vụ Cleanup trước khi dừng server
  exitHook(() => {
    console.log(`Server is shuting down`);
    CLOSE_DB();
    console.log(`Close MongoDB Cloud`);
  });
};

// Chỉ khi kết nối thành công mới Start Server lên
// Immediately-invoked / Anonymous Async function (IIFE)
(async () => {
  try {
    console.log("1. connecting to MongoDB Cloud Atlas!...");
    await CONNECT_DB();
    console.log("2. connected to MongoDB Cloud Atlas!");

    // Khởi động server Back-End sau khi connect DB thành công
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// // Chỉ khi kết nối thành công mới Start Server lên
// console.log("1. connecting to MongoDB Cloud Atlas!...");
// CONNECT_DB()
//   .then(() => console.log("2. connected to MongoDB Cloud Atlas!"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });
