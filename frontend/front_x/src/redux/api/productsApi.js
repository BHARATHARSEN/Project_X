import {createApi, fetchBaseQuery} from '@reduxjs/toolkit';

export const productApi = createApi({
    reducerPath : "productApi", // slice name
    baseQuery : fetchBaseQuery({baseUrl : "api/v1"}),
    endpoints : (builder) => ({
        getProducts: builder.query({
            query : (params) => ("/products")
        }),

    }),
});

export const { useGetProductsQuery } = productApi