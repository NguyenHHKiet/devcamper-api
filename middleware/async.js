// Applying some DRY
// Một điều chúng ta có thể làm để tránh lặp lại mã try/catch trên mỗi phần mềm trung gian không đồng bộ là viết một lần ở hàm bậc cao.

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
