// import React from "react";
// import MetaData from "../layout/MetaData";

// const invoice = () => {
//   return (
//     <>
//       <MetaData title={"Invoice"} />
//       <div class="order-invoice my-5">
//         <div class="row d-flex justify-content-center mb-5">
//           <button class="btn btn-success col-md-5">
//             <i class="fa fa-print"></i> Download Invoice
//           </button>
//         </div>
//         <div id="order_invoice" class="p-3 border border-secondary">
//           <header class="clearfix">
//             <div id="logo">
//               <img src="../images/invoice-logo.png" alt="Company Logo" />
//             </div>
//             <h1>INVOICE # 12345</h1>
//             <div id="company" class="clearfix">
//               <div>ShopIT</div>
//               <div>
//                 455 Foggy Heights,
//                 <br />
//                 AZ 85004, US
//               </div>
//               <div>(602) 519-0450</div>
//               <div>
//                 <a href="mailto:info@shopit.com">info@shopit.com</a>
//               </div>
//             </div>
//             <div id="project">
//               <div>
//                 <span>Name</span> John Doe
//               </div>
//               <div>
//                 <span>EMAIL</span> john.doe@example.com
//               </div>
//               <div>
//                 <span>PHONE</span> 123-456-7890
//               </div>
//               <div>
//                 <span>ADDRESS</span> 123 Main St, Cityville, 12345, Country
//               </div>
//               <div>
//                 <span>DATE</span> 2023-09-19
//               </div>
//               <div>
//                 <span>Status</span> Paid
//               </div>
//             </div>
//           </header>
//   <main>
//     <table class="mt-5">
//       <thead>
//         <tr>
//           <th class="service">ID</th>
//           <th class="desc">NAME</th>
//           <th>PRICE</th>
//           <th>QTY</th>
//           <th>TOTAL</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td class="service">1</td>
//           <td class="desc">Product 1</td>
//           <td class="unit">$499.99</td>
//           <td class="qty">3</td>
//           <td class="total">$1499.97</td>
//         </tr>
//         <tr>
//           <td class="service">2</td>
//           <td class="desc">Product 2</td>
//           <td class="unit">$399.99</td>
//           <td class="qty">2</td>
//           <td class="total">$799.98</td>
//         </tr>

//         <tr>
//           <td colspan="4">
//             <b>SUBTOTAL</b>
//           </td>
//           <td class="total">$2299.95</td>
//         </tr>

//         <tr>
//           <td colspan="4">
//             <b>TAX 15%</b>
//           </td>
//           <td class="total">$344.99</td>
//         </tr>

//         <tr>
//           <td colspan="4">
//             <b>SHIPPING</b>
//           </td>
//           <td class="total">$10.00</td>
//         </tr>

//         <tr>
//           <td colspan="4" class="grand total">
//             <b>GRAND TOTAL</b>
//           </td>
//           <td class="grand total">$2654.94</td>
//         </tr>
//       </tbody>
//     </table>
//     <div id="notices">
//       <div>NOTICE:</div>
//       <div class="notice">
//         A finance charge of 1.5% will be made on unpaid balances after
//         30 days.
//       </div>
//     </div>
//   </main>
//   <footer>
//     Invoice was created on a computer and is valid without the
//     signature.
//   </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default invoice;

import MetaData from "../layout/MetaData";
import "./invoice.css";
import px1 from "../../images/px1.png";
import { useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import Loader from "../layout/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const {
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    orderItems,
    orderStatus,
    user,
    shippingInfo,
  } = order;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const handleDownload = () => {
    const element = document.getElementById("order_invoice");

    if (element) {
      html2canvas(element)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add image to PDF, handling large content by creating multiple pages if necessary
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();

          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
          }

          pdf.save(`order_invoice  ${order?._id}.pdf`);
        })
        .catch((error) => {
          console.error("Error capturing screenshot:", error);
        });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Invoice"} />
      <div className="order-invoice my-5">
        <div className="row d-flex justify-content-center mb-5">
          <button className="btn btn-success col-md-5" onClick={handleDownload}>
            <i className="fa fa-print"></i> Download Invoice
          </button>
        </div>
        <div id="order_invoice" className="p-3 border border-secondary">
          <header className="clearfix">
            <div id="logo">
              <img src={px1} alt="Company Logo" />
            </div>
            <h1>INVOICE # {order?._id}</h1>
            <div id="company" className="clearfix">
              <div>Project_X</div>
              <div>
                Beacon Hills,
                <br />
                TX 90109, US
              </div>
              <div>(816) 255-9010</div>
              <div>
                <a href="mailto:noreply@projectX.com">noreply@projectX.com</a>
              </div>
            </div>
            <div id="project">
              <div>
                <span>Name</span> {user?.name}
              </div>
              <div>
                <span>EMAIL</span> {user?.email}
              </div>
              <div>
                <span>PHONE</span> {shippingInfo?.phoneNo}
              </div>
              <div>
                <span>ADDRESS</span> {shippingInfo.address}, {shippingInfo.city}
                , {"  "} {shippingInfo.zipCode},{shippingInfo.country}
              </div>
              <div>
                <span>DATE</span>{" "}
                {new Date(order?.createdAt).toLocaleString("en-us")}
              </div>
              <div>
                <span>Status</span> {paymentInfo?.status?.toUpperCase()}
              </div>
            </div>
          </header>
          <main>
            <table class="mt-5">
              <thead>
                <tr>
                  <th class="service">ID</th>
                  <th class="desc">NAME</th>
                  <th>PRICE</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item) => (
                  <>
                    <tr>
                      <td class="service">1</td>
                      <td class="desc">{item?.name}</td>
                      <td class="unit">${item?.price}</td>
                      <td class="qty">{item?.quantity}</td>
                      <td class="total">$ {item?.price * item?.quantity}</td>
                    </tr>
                  </>
                ))}
                <tr>
                  <td colspan="4">
                    <b>SUBTOTAL</b>
                  </td>
                  <td class="total">${order?.itemsPrice}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>TAX 15%</b>
                  </td>
                  <td class="total">${order?.taxAmount}</td>
                </tr>

                <tr>
                  <td colspan="4">
                    <b>SHIPPING</b>
                  </td>
                  <td class="total">${order?.shippingAmount}</td>
                </tr>

                <tr>
                  <td colspan="4" class="grand total">
                    <b>GRAND TOTAL</b>
                  </td>
                  <td class="grand total">${order?.totalAmount}</td>
                </tr>
              </tbody>
            </table>
            <div id="notices">
              <div>NOTICE:</div>
              <div class="notice">
                A finance charge of 1.5% will be made on unpaid balances after
                30 days.
              </div>
            </div>
          </main>
          <footer>
            Invoice was created on a computer and is valid without the
            signature.
          </footer>
        </div>
      </div>
    </>
  );
};

export default Invoice;
