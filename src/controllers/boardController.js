/* eslint-disable quotes */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // console.log("req.body:", req.body);
    // console.log("req.query:", req.query);
    // console.log("req.params:", req.params);
    // console.log("req.files:", req.files);
    // console.log("req.cookies:", req.cookies);
    // console.log("req.jwtDecoded:", req.jwtDecoded);

    // Điều hướng dữ liệu Service
    const createdBoard = await boardService.createNew(req.body);

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id;

    const board = await boardService.getDetails(boardId);
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};
const moveCardInTheDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardInTheDifferentColumn(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardInTheDifferentColumn,
};
