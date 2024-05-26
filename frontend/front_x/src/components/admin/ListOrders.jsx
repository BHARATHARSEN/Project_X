import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useGetAdminOrdersQuery } from "../../redux/api/orderApi";

const ListOrders = () => {
  const { data, isLoading, error } = useGetAdminOrdersQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    // if (deleteError) {
    //   toast.error(deleteError?.data?.message);
    // }
    // if(isSuccess) {
    //   toast.success("Product is deleted");
    // }
  }, [error]);

  //   const deleteProductHandler = (id) => {

  //     deleteProduct(id);

  //   }

  if (isLoading) return <Loader />;

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
          sort: "asc",
        },
        {
          label: "Order Status ",
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
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status,
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>

            <button
              className="btn btn-outline-danger ms-2"
            //   onClick={() => deleteProductHandler(order?._id)}
            //   disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return orders;
  };

  return (
    <AdminLayout>
      <MetaData title={"All Orders"} />

      <div>
        <h1 className="my-5">{data?.orders?.length} Orders</h1>
        <MDBDataTable
          striped
          bordered
          hover
          searchLabel="Search orders"
          data={setOrders()}
          className="px-3"
        />
      </div>
    </AdminLayout>
  );
};

export default ListOrders;
