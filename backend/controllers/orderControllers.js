import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js";


export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id
  });

  res.status(200).json({
    order,
  })
});

export const myOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({user : req.user._id});

    if(!orders){
        return next(new ErrorHandler("No orders found", 404));
    }

    res.status(200).json({
        orders,
    })

});


export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user","name email");

  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  res.status(200).json({
    order,
  });
});

//==================================ADMIN===================================

export const allOrders = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find();

    res.status(200).json({
        orders,
    })
});



export const updateOrder = catchAsyncErrors(async (req, res, next) => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("Order has been delivered", 400));
  }

  // Update products stock

  order?.orderItems?.forEach(async (item) => {

    const product = await Product.findById(item?.product?.toString());

    if(!product){
        return next(new ErrorHandler("No product found", 404));
    }

    // await Product.findOneAndUpdate(product._id, {stock: product.stock - item.quantity})
    product.stock = product.stock - item.quantity;
    await product.save({validateBeforeSave : false});
  });

  order.orderStatus = req.body.status ;
  order.deliveredAt = Date.now();

  await order.save();



  res.status(200).json({
    success : true,
  });
});

// Delete ORDER

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success : true 
  });
});



//=======================Review Section functionalities=======================

// review : [
//   {
//     user : {},
//     rating : {},
//     comment:{},
//   }
// ]

export const createProductReview = catchAsyncErrors(async (req, res, next) => {

  const {rating, comment, productId} = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  }

  const product = await Product.findById(productId);

  if(!product){
      return next(new ErrorHandler('Product is not found', 404));
  }

  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if(isReviewed){
    product.reviews.forEach((review) => {
      if(review.user.toString() === req?.user?._id.toString()){
        review.comment = comment;
        review.rating = rating ;

      }

    });

  }else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

  }


  product.ratings = product.reviews.reduce((acc,item) => item.rating + acc, 0)
   /product.reviews.length;

  await product.save({validateBeforeSave : false})

  res.status(200).json({
    success: true,
  });
});


//================================================================================================

export const getProductReviews = catchAsyncErrors( async (req, res, next) => {
  const product = await Product.findById(req.query.id)

  if (!product) {
    return next(new ErrorHandler("Product is not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

//=================================================================================================

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  // const { rating, comment, productId } = req.body;

  // const review = {
  //   user: req?.user?._id,
  //   rating: Number(rating),
  //   comment,
  // };

  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product is not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0 
      ? 0
      :product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

  product = await Product.findByIdAndUpdate(req.query.productId, {reviews,numOfReviews,ratings}, {new:true})

  res.status(200).json({
    success: true,
    product
  });
});




