import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: "productApi", // slice name
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/v1" }),
  tagTypes: ["Product", "AdminProducts"],
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          keyword: params?.keyword,
          category: params?.category,
          "price[gte]": params.min,
          "price[lte]": params.max,
          "ratings[gte]": params?.ratings,
        },
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),

    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),

    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),

    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["Adminproducts"],
    }),

    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },

      invalidatesTags: ["AdminProducts"],
    }),

    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["AdminProducts", "Product"],
    }),

    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["Product"],
    }),

    deleteProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/delete_image`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",
        };
      },

      invalidatesTags: ["AdminProducts"],
    }),
  }),
});


export const { useGetProductsQuery, useGetProductDetailsQuery, useSubmitReviewMutation, useCanUserReviewQuery, useGetAdminProductsQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImagesMutation, useDeleteProductImagesMutation, useDeleteProductMutation } = productApi ;