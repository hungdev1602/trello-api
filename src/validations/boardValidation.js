/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  /**
   * Note: mặc định ko cần phải custom message ở phía BE làm gì vì để cho Front-end tự validate và custom message phía FE cho đẹp
   * Back-end chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trọng: Việc validate dữ liệu là BẮT BUỘC phải có ở phía back-end vì đây là điểm cuối để lưu trữ dữ liệu và database
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required (hungdev)",
      "string.empty": "Title is not allowed to be empty (hungdev)",
      "string.min": "Title must be at least 3 characters long (hungdev)",
      "string.max": "Title must be at least 3 characters long (hungdev)",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
  });

  try {
    // chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang Controller
    next();
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = {
  createNew,
};
