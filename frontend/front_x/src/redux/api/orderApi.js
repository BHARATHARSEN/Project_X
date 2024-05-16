import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: "orderApi", // slice name
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1" }),
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query (body) {
        return {
            url: "/orders/new",
            method: "POST",
            body,
        };
      },
    }),
  }),
});

export const { useCreateNewOrderMutation } = orderApi;
