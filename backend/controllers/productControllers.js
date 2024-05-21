// logic for the end point

// to get products  /api/v1/products
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
import Order from "../models/order.js";

export const getProducts = catchAsyncErrors(async (req,res,next) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters (Product, req.query).search().filters();
    console.log("req?.user", req.user)

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    // return next(new ErrorHandler("Error", 400))


    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();
    
    res.status(200).json({
       resPerPage,
       filteredProductsCount,
       products,
    });
});

// create  a new product  /api/v1/admin/products

export const newProduct = catchAsyncErrors (async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(200).json({ product });


    
});

// get a single product  /api/v1/products/:id

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  
  
    const product = await Product.findById(req?.params?.id).populate("reviews.user")
    console.log(product)

    if(!product){
        return next(new ErrorHandler('Product is not found', 404));
    }
    console.log({product,})

    res.status(200).json({product,});
});

// get a single product  /api/v1/products/:id


export const updateProduct = catchAsyncErrors(async (req, res) => {
  
    let product = await Product.findById(req?.params?.id)

    if (!product) {
      return next(new ErrorHandler("Product is not found", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new : true});

    res.status(200).json({product,})
});

export const deleteProduct = catchAsyncErrors( async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product is not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({ message : "Product Deleted",});
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


// Can user give a review  => /api/v1/can_review

export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.query.productId;

    console.log("User ID:", userId);
    console.log("Product ID:", productId);

    const orders = await Order.find({
      user: userId,
      "orderItems.product": productId,
    });

    const canReview = orders.length > 0;

    res.status(200).json({ canReview });
  } catch (error) {
    next(error);
  }
});







