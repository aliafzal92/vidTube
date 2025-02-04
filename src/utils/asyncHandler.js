// export const asyncHandler = (requestHandler) => {
//   return async (req, res, next) => {
//     return Promise.resolve(requestHandler(req, res, next)).catch((err) =>
//       next(err)
//     );
//   };
// };

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
