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
import Order from "../models/order.js";

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
        success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req.user.email,
        client_reference_id: req.user._id.toString(),
        mode: "payment",
        metadata: { ...shippingInfo, itemsPrice: body.itemsPrice, },
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

// Function to get all the order Items from the session

const getOrderItems =async (line_items) => {

    // const line_items = body.orderItems.map((item) => {
    //   return {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: item.name,
    //         images: [item.image], // Corrected 'image' to 'images' as Stripe expects an array
    //         metadata: { productId: item.product },
    //       },
    //       unit_amount: item.price * 100, // Stripe expects the amount in cents
    //     },
    //     tax_rates: ["txr_1PHIcQRwIZjtz0nFLcDlynCs"],
    //     quantity: item.quantity,
    //   };
    // });
    return new Promise ((resolve,reject) => {
        let cartItems = [];

        line_items?.data?.forEach(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);
            const productID = product.metadata.productId

            cartItems.push({
                product :productID,
                name : product.name,
                price : item.price.unit_amount_decimal / 100,
                quantity : item.quantity,
                image : product.images[0],

            });

            if(cartItems.length === line_items?.data?.length) {
                resolve(cartItems);
            }
        })
    })







}






















//Create a Webhook for a new order after payment

export const stripeWebhook = catchAsyncErrors(
  async (req, res, next) => {
    try {

        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'] ;

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ;

        const event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          webhookSecret,
        );

        if(event.type === "checkout.session.completed") {
            const session = event.data.object;

            const line_items = await stripe.checkout.sessions.listLineItems(session.id) ; 

            const orderItems = await getOrderItems(line_items);

            const user = session.client_reference_id;

            const totalAmount = session.amount_total / 100 ;
            const taxAmount = session.total_details.amount_tax / 100 ;
            const shippingAmount = session.total_details.amount_shipping /100 ;
            const itemsPrice = session.metadata.itemsPrice ;


            const shippingInfo = {
              address: session.metadata.address,
              city: session.metadata.city,
              phoneNo: session.metadata.phoneNo,
              zipCode: session.metadata.zipCode,
              country: session.metadata.country,
            };

            const paymentInfo = {
                id : session.payment_intent,
                status : session.payment_status,
            }

            const orderData = {
              shippingInfo,
              orderItems,
              itemsPrice,
              taxAmount,
              shippingAmount,
              totalAmount,
              paymentInfo,
              paymentMethod : "Card",
              user,
            };

            await Order.create(orderData);














            console.log("=======================")
            
            console.log("Session =>", session)

            console.log("=======================");

            res.status(200).json({
                success: true,
            });
        }


    }
    catch (error) {

        console.log("=============================")

        console.log("Error =>" ,error)

        console.log("=============================");

    }


  }
);


