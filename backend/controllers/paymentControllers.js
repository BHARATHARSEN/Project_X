// import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
// import Stripe from "stripe";

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// //Create stripe checkout session => /api/v1/payment/checkout_session

// export const stripeCheckoutSession = catchAsyncErrors(
//   async (req, res, next) => {
//     const body = req?.body;

//     const line_items = body?.orderItems.map((item) => {
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item?.name,
//             image: [item?.images],
//             metadata: { productId: item?.product },
//           },
//           unit_amount: item?.price * 100, // Stripe expects the amount in cents
//         },
//         tax_rates: ["txr_1PHIcQRwIZjtz0nFLcDlynCs"],
//         quantity: item?.quantity,
//       };
//     });

//     const shippingInfo = body?.shippingInfo ;

//     const shipping_rate =
//       body?.itemsPrice >= 200
//         ? "shr_1PHIKZRwIZjtz0nFQRE4cux2"
//         : "shr_1PHIMRRwIZjtz0nFOpbNCSTo";

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       success_url: `${process.env.FRONTEND_URL}/me/orders`,
//       cancel_url: `${process.env.FRONTEND_URL}`,
//       customer_email: req?.user?.email,
//       client_reference_id: req?.user?._id?.toString(),
//       mode: "payment",
//       metadata : {...shippingInfo, itemPrice: body?.itemsPrice},
//       shipping_options: [
//         {
//           shipping_rate,
//         },
//       ],
//       line_items,
//     });

//     console.log("===================================");


//     console.log(session);


//     console.log("===================================");

//     res.status(200).json({
//         url: session.url,
//     })
//   }
// );



import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Note: use 'new' keyword

// Create stripe checkout session => /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req.body;

    const line_items = body.orderItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image], // Corrected 'image' to 'images' as Stripe expects an array
            metadata: { productId: item.product },
          },
          unit_amount: item.price * 100, // Stripe expects the amount in cents
        },
        tax_rates: ["txr_1PHIcQRwIZjtz0nFLcDlynCs"],
        quantity: item.quantity,
      };
    });

    const shippingInfo = body.shippingInfo;

    const shipping_rate =
      body.itemsPrice >= 200
        ? "shr_1PHIKZRwIZjtz0nFQRE4cux2"
        : "shr_1PHIMRRwIZjtz0nFOpbNCSTo";

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${process.env.FRONTEND_URL}/me/orders`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req.user.email,
        client_reference_id: req.user._id.toString(),
        mode: "payment",
        metadata: { ...shippingInfo, itemPrice: body.itemsPrice },
        shipping_options: [
          {
            shipping_rate,
          },
        ],
        line_items,
      });

      console.log("===================================");
      console.log(session);
      console.log("===================================");

      res.status(200).json({
        url: session.url,
      });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({
        error: "Failed to create Stripe session",
      });
    }
  }
);

