/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";

import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tuỳ đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard);

    // Lấy bản ghi board sau khi gọi (tuỳ mục đích dự án có cần bước này hay ko)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

    // Làm thêm các xử lý logic khác với các Collection khác tuỳ đặc thù dự án
    // Bắn email, notification về cho admin khi có 1 cái board mới dc tạo

    // Trả kết quả về, trong service luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }

    // Bước 1: Deep Clone board ra 1 cái mới để xử lý
    const resBoard = cloneDeep(board);

    // Bước 2: Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // cách dùng .equals của MongoDB ObjectId để compare
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );

      // cách dùng JavaScript => convert ObjectId sang String
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
    });

    // Bước 3: Xoá mảng card khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const moveCardInTheDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    });

    return { updateResult: "Successfully!" };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardInTheDifferentColumn,
};
