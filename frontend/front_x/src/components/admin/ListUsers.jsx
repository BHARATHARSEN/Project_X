import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useGetAdminUsersQuery } from "../../redux/api/userApi";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  //     if (deleteError) {
  //       toast.error(deleteError?.data?.message);
  //     }
  //     if (isSuccess) {
  //       toast.success("Order is deleted");
  //     }
  //   }

  //   const deleteOrderHandler = (id) => {
  //     deleteOrder(id);
  //   };

  if (isLoading) return <Loader />;

  const setUsers = () => {
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email ",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role ",
          field: "role",
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

    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <>
            <Link
              to={`/admin/users/${user?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>

            <button
              className="btn btn-outline-danger ms-2"
            //   onClick={() => deleteuserHandler(user?._id)}
            //   disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return users;
  };

  return (
    <AdminLayout>
      <MetaData title={"All Users"} />

      <div>
        <h1 className="my-5">{data?.users?.length} Users</h1>
        <MDBDataTable
          striped
          bordered
          hover
          searchLabel="Search users"
          data={setUsers()}
          className="px-3"
        />
      </div>
    </AdminLayout>
  );
};

export default ListUsers;
