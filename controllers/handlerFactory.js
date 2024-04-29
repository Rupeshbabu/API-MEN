const { Model } = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

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
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No document found with that ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    },
  });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;
  // const doc = await Model.findById(req.params.id).populate(popOptions);
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No document found with that ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {

  // To allow for nested GET reviews on tour
  let filter = {}
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const doc = await features.query;

  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {
      data: doc,
    },
  });
});