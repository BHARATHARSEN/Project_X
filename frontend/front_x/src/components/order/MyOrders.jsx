// import React from 'react'

// const MyOrders = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default MyOrders


import React, { useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { useMyOrdersQuery } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/features/cartSlice';

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const orderSuccess = searchParams.get("order_success");
  const navigate = useNavigate();

  // Example useEffect for additional side effects (logging, analytics, etc.)
  useEffect(() => {
    if (data?.orders?.length > 0) {
      console.log('Orders have been loaded');
    }
  }, [data?.orders]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if(orderSuccess) {
        
        dispatch(clearCart());
        navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  if(isLoading) return <Loader /> ;


  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };


    data?.orders?.forEach((order) => {
        orders.rows.push({
            id : order?._id,
            amount : `$ ${order?.totalAmount}`,
            status : order?.paymentInfo?.status?.toUpperCase(),
            orderStatus : order?.orderStatus,
            actions : <>

            <Link to = {`/me/order/${order?._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i> View
            </Link>

            <Link to = {`/invoice/order/${order?._id}`} className="btn btn-secondary">
            <i className="fa fa-print"></i> Print
            </Link>
            
            
            </>
        }
        )
    })

    return orders;
  };

  

   



  return (
    <>
      <MetaData title={"My Orders"} />

      <div>
        <h1 className="my-5">Total Orders: {data?.orders?.length}</h1>
        <MDBDataTable
          striped
          bordered
          hover
          small
          responsive
          maxHeight="300px"
          entries={5}
          entriesOptions={[5, 10, 20]}
          pagination
          searching
          searchLabel="Search orders"
          displayEntries
          fixedHeader
          data={setOrders()}
          className="px-3"
        />
      </div>
    </>
  );
};

export default MyOrders;
