
import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import { useSelector } from 'react-redux';
import { calculateOrderCost } from '../../Helpers/helpers.js';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
    const [method, setMethod] = useState("");
    const navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [createNewOrder, { error: createOrderError, isSuccess: isOrderSuccess }] = useCreateNewOrderMutation();
    const [stripeCheckoutSession, { data: checkoutData, error: checkoutError, isLoading }] = useStripeCheckoutSessionMutation();

    useEffect(() => {
        if (checkoutData) {
            console.log('Checkout data received:', checkoutData);
            if (checkoutData.url) {
                window.location.href = checkoutData.url;
            } else {
                toast.error('Failed to get the checkout URL.');
            }
        }
    }, [checkoutData]);

    useEffect(() => {
        if (checkoutError) {
            toast.error(checkoutError?.data?.message);
        }
    }, [checkoutError]);

    useEffect(() => {
        if (createOrderError) {
            toast.error(createOrderError?.data?.message);
        }

        if (isOrderSuccess) {
            navigate("/me/orders?order_success=true"); // Adjust this route as needed
        }
    }, [createOrderError, isOrderSuccess, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

        const orderData = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice,
            shippingAmount: shippingPrice,
            taxAmount: taxPrice,
            totalAmount: totalPrice,
        };

        if (method === "COD") {
            await createNewOrder({
                ...orderData,
                paymentInfo: { status: "Not Paid" },
                paymentMethod: "COD",
            });
        } else if (method === "Card") {
            await stripeCheckoutSession(orderData);
        } else {
            toast.error("Please select a payment method");
        }
    };

    return (
        <>
            <MetaData title={"Payment Method"} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow rounded bg-body" onSubmit={submitHandler}>
                        <h2 className="mb-4">Select Payment Method</h2>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="codradio"
                                value="COD"
                                onChange={(e) => setMethod("COD")}
                            />
                            <label className="form-check-label" htmlFor="codradio">
                                Cash on Delivery
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="cardradio"
                                value="Card"
                                onChange={(e) => setMethod("Card")}
                            />
                            <label className="form-check-label" htmlFor="cardradio">
                                Card - VISA, MasterCard
                            </label>
                        </div>
                        <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentMethod;










































































































// import React, { useEffect, useState } from 'react'
// import MetaData from '../layout/MetaData'
// import CheckoutSteps from './CheckoutSteps'
// import { useSelector } from 'react-redux';
// import { calculateOrderCost } from '../../Helpers/helpers.js';
// import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi.js';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const PaymentMethod = () => {

//     const [method, setMethod] = useState("");
//     const navigate = useNavigate();
//     const {cartItems, shippingInfo } = useSelector((state) => state.cart);
//     const [createNewOrder,{isLoading, error, isSuccess}] = useCreateNewOrderMutation();
//     const [stripeCheckoutSession,{checkoutData, error: checkoutError}]= useStripeCheckoutSessionMutation();

    

//     useEffect(() => {

//         if(checkoutData?.url) {
//             window.location.href = checkoutData?.url ;
//         }

//         console.log(checkoutData)

//         if(checkoutError){
//             toast.error(error?.data?.message);
//         }
//     },[checkoutData, checkoutError]);

//     useEffect(() => {
//         if(error){
//             toast.error(checkoutError?.data?.message)
//         }

//         if(isSuccess) {
//             navigate("/");
//         }
//     },[error, isSuccess]);

//     const {user} = useSelector((state) => state.auth);
    

    

//     const submitHandler = (e) => {
//         e.preventDefault();

//         const { itemsPrice,shippingPrice,taxPrice,totalPrice } = calculateOrderCost(cartItems);

//         if(method === "COD") {
//             // Create COD order
//             const orderData = {
//                 shippingInfo,
//                 orderItems:cartItems,
//                 itemsPrice,
//                 shippingAmount : shippingPrice,
//                 taxAmount :taxPrice,
//                 totalAmount :totalPrice,
//                 paymentInfo : {
//                     status : "Not Paid",

//                 },
//                 paymentMethod: "COD",

//             };

//             createNewOrder(orderData);

//         }
//         if(method === "Card"){

//             // Create stripe Checkout
//             const orderData = {
//                 shippingInfo,
//                 orderItems:cartItems,
//                 itemsPrice,
//                 shippingAmount : shippingPrice,
//                 taxAmount :taxPrice,
//                 totalAmount :totalPrice,
                

//             };

//             stripeCheckoutSession(orderData);
            
//         }
//     }
//     return (
//         <>
//             <MetaData title={"Payment Method"} />
//             <CheckoutSteps shipping confirmOrder payment/>
//             <div className="row wrapper">
//                 <div className="col-10 col-lg-5">
//                     <form
//                         className="shadow rounded bg-body"
//                         action="your_submit_url_here"
//                         method="post"
//                     >
//                         <h2 className="mb-4">Select Payment Method</h2>

//                         <div className="form-check">
//                             <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payment_mode"
//                                 id="codradio"
//                                 value="COD"
//                                 onChange={(e) => setMethod("COD")}
//                             />
//                             <label className="form-check-label" htmlFor="codradio">
//                                 Cash on Delivery
//                             </label>
//                         </div>
//                         <div className="form-check">
//                             <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payment_mode"
//                                 id="cardradio"
//                                 value="Card"
//                                 onChange={(e) => setMethod("Card")}
//                             />
//                             <label className="form-check-label" htmlFor="cardradio">
//                                 Card - VISA, MasterCard
//                             </label>
//                         </div>

//                         <button id="shipping_btn" type="submit" className="btn py-2 w-100" onClick={submitHandler}>
//                             CONTINUE
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default PaymentMethod ;
