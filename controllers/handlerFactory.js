const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No document found with that ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {

});

exports.createOne = Model => catchAsync(async (req, res, next) => {

});