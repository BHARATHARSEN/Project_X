
import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import "./invoice.css";
import px1 from "../../images/px1.png";
import { useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  console.log(data);

  const {
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentInfo,
    orderItems,
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

          pdf.save(`order_invoice_${order?._id}.pdf`);
        })
        .catch((error) => {
          console.error("Error capturing screenshot:", error);
          toast.error("Failed to download invoice. Please try again.");
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
              <address>
                Beacon Hills,<br />
                TX 90109, US<br />
                (816) 255-9010<br />
                <a href="mailto:noreply@projectX.com">noreply@projectX.com</a>
              </address>
            </div>
            <div id="project">
              <div>
                <span>Name</span> {user?.name || 'N/A'}
              </div>
              <div>
                <span>EMAIL</span> {user?.email || 'N/A'}
              </div>
              <div>
                <span>PHONE</span> {shippingInfo?.phoneNo || 'N/A'}
              </div>
              <div>
                <span>ADDRESS</span> {shippingInfo?.address || 'N/A'}, {shippingInfo?.city || 'N/A'}, {shippingInfo?.zipCode || 'N/A'}, {shippingInfo?.country || 'N/A'}
              </div>
              <div>
                <span>DATE</span> {order?.createdAt ? new Date(order.createdAt).toLocaleString("en-us") : 'N/A'}
              </div>
              <div>
                <span>Status</span> {paymentInfo?.status ? paymentInfo.status.toUpperCase() : 'N/A'}
              </div>
            </div>
          </header>
          <main>
            <table className="mt-5">
              <thead>
                <tr>
                  <th className="service">ID</th>
                  <th className="desc">NAME</th>
                  <th>PRICE</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item) => (
                  <tr key={item?._id}>
                    <td className="service">{item?._id}</td>
                    <td className="desc">{item?.name}</td>
                    <td className="unit">{item?.price}</td>
                    <td className="qty">{item?.quantity}</td>
                    <td className="total"> {(item?.price * item?.quantity).toFixed(2)}</td>

                  </tr>
                ))}
                <tr>
                  <td colSpan="4">
                    <b>SUBTOTAL</b>
                  </td>
                  <td className="total">$ {itemsPrice}</td>
                </tr>

                <tr>
                  <td colSpan="4">
                    <b>TAX 15%</b>
                  </td>
                  <td className="total">$ {taxAmount}</td>
                </tr>

                <tr>
                  <td colSpan="4">
                    <b>SHIPPING</b>
                  </td>
                  <td className="total">${shippingAmount}</td>
                </tr>

                <tr>
                  <td colSpan="4" className="grand total">
                    <b>GRAND TOTAL</b>
                  </td>
                  <td className="grand total">$ {totalAmount}</td>
                </tr>
              </tbody>
            </table>
            <div id="notices">
              <div>NOTICE:</div>
              <div className="notice">
                A finance charge of 1.5% will be made on unpaid balances after 30 days.
              </div>
            </div>
          </main>
          <footer>
            Invoice was created on a computer and is valid without the signature.
          </footer>
        </div>
      </div>
    </>
  );
};

export default Invoice;

