/* eslint-disable quotes */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import cors from "cors";
import { corsOptions } from "~/config/cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";

const START_SERVER = () => {
  const app = express();

  // Xử lý Cors
  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  // Use APIs V1
  app.use("/v1", APIs_V1);

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hello ${env.AUTHOR}, Back-End server successfully at Port: ${env.APP_PORT}`
      );
    });
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3. Local Dev: Hello ${env.AUTHOR}, Back-End server successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
      );
    });
  }

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
