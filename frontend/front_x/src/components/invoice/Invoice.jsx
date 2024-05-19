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
//           <main>
//             <table class="mt-5">
//               <thead>
//                 <tr>
//                   <th class="service">ID</th>
//                   <th class="desc">NAME</th>
//                   <th>PRICE</th>
//                   <th>QTY</th>
//                   <th>TOTAL</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td class="service">1</td>
//                   <td class="desc">Product 1</td>
//                   <td class="unit">$499.99</td>
//                   <td class="qty">3</td>
//                   <td class="total">$1499.97</td>
//                 </tr>
//                 <tr>
//                   <td class="service">2</td>
//                   <td class="desc">Product 2</td>
//                   <td class="unit">$399.99</td>
//                   <td class="qty">2</td>
//                   <td class="total">$799.98</td>
//                 </tr>

//                 <tr>
//                   <td colspan="4">
//                     <b>SUBTOTAL</b>
//                   </td>
//                   <td class="total">$2299.95</td>
//                 </tr>

//                 <tr>
//                   <td colspan="4">
//                     <b>TAX 15%</b>
//                   </td>
//                   <td class="total">$344.99</td>
//                 </tr>

//                 <tr>
//                   <td colspan="4">
//                     <b>SHIPPING</b>
//                   </td>
//                   <td class="total">$10.00</td>
//                 </tr>

//                 <tr>
//                   <td colspan="4" class="grand total">
//                     <b>GRAND TOTAL</b>
//                   </td>
//                   <td class="grand total">$2654.94</td>
//                 </tr>
//               </tbody>
//             </table>
//             <div id="notices">
//               <div>NOTICE:</div>
//               <div class="notice">
//                 A finance charge of 1.5% will be made on unpaid balances after
//                 30 days.
//               </div>
//             </div>
//           </main>
//           <footer>
//             Invoice was created on a computer and is valid without the
//             signature.
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// };

// export default invoice;




import MetaData from '../layout/MetaData';
import "./invoice.css"
import px1 from '../../images/px1.png';

const Invoice = () => {
  return (
    <>
      <MetaData title={"Invoice"} />
      <div className="order-invoice my-5">
        <div className="row d-flex justify-content-center mb-5">
          <button className="btn btn-success col-md-5">
            <i className="fa fa-print"></i> Download Invoice
          </button>
        </div>
        <div id="order_invoice" className="p-3 border border-secondary">
          <header className="clearfix">
            <div id="logo">
              <img src={px1} alt="Company Logo" />
            </div>
            <h1>INVOICE # 12345</h1>
            <div id="company" className="clearfix">
              <div>ShopIT</div>
              <div>
                455 Foggy Heights,
                <br />
                AZ 85004, US
              </div>
              <div>(602) 519-0450</div>
              <div>
                <a href="mailto:info@shopit.com">info@shopit.com</a>
              </div>
            </div>
            <div id="project">
              <div><span>Name</span> John Doe</div>
              <div><span>EMAIL</span> john.doe@example.com</div>
              <div><span>PHONE</span> 123-456-7890</div>
              <div>
                <span>ADDRESS</span> 123 Main St, Cityville, 12345, Country
              </div>
              <div><span>DATE</span> 2023-09-19</div>
              <div><span>Status</span> Paid</div>
            </div>
          </header>
          <main>
            <table className="mt-5">
              <thead>
                {/* Your table head content here */}
              </thead>
              <tbody>
                {/* Your table body content here */}
              </tbody>
            </table>
          </main>
        </div>
      </div>
    </>
  );
};

export default Invoice;