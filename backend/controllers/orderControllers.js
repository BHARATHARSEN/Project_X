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

//                             GETTING SALES DATA OF ALL ORDERS FOR CHART 

//=============================================================================
async function getSalesData(startDate, endDate) {
  console.log("Fetching sales data between", startDate, "and", endDate);
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrder: { $sum: 1 },
      },
    },
  ]);

  console.log("Sales data retrieved:", salesData);

  const salesMap = new Map();

  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrder; 

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  const datesBetween = getDatesBetween(startDate, endDate);

  console.log("Processed sales data map:", salesMap);
  console.log("Total sales:", totalSales);
  console.log("Total number of orders:", totalNumOrders);
  console.log("Dates between:", datesBetween);

  // Creating final sales data array with o for dates with no sales :(

  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  console.log("===============================")

  console.log(finalSalesData);

  console.log("===============================");

  return {salesData : finalSalesData, totalSales, totalNumOrders};

  
}




function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Get Sales Data =>  /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const {salesData, totalSales, totalNumOrders} = await getSalesData(startDate, endDate);

    res.status(200).json({
      totalSales,
      totalNumOrders,
      sales : salesData,

      
    });
  } catch (error) {
    next(error); // Proper error handling
  }
});









