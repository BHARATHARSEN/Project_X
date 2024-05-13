// import dotenv from "dotenv";
// import cloudinary from "cloudinary";

// dotenv.config({ path: "backend/config/config.env" });

// cloudinary.config({
//     cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
//     api_key : process.env.CLOUDINARY_API_KEY,
//     api_secret : process.env.CLOUDINARY_API_SECRET,
// });

// export const upload_file = (file,folder) => {
//     return new Promise((resolve,reject) =>{
//         cloudinary.v2.uploader.upload(
//             file,
//             (result)=> {
//                 resolve({
//                     public_id : result.public_id,
//                     url:result.url,
//             })},
//             {
//                 resource_type : "auto",
//                 folder,
//             }
//         );
//     });
// };

// export const delete_file = async(file) => {
//     const res = await cloudinary.uploader.destroy(file);

//     if(res?.result === "ok") return true ; 
// };


import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config({ path: "backend/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = async (file, folder) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file, {
      resource_type: "auto",
      folder,
    });
    return {
      public_id: result.public_id,
      url: result.url,
    };
  } catch (error) {
    throw new Error(error.message); // Re-throw the error for further handling
  }
};

// export const upload_file = (file, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.upload(
//       file,
//       (result) => {
//         if (result?.error) {
//           reject(new Error(result.error.message));
//         } else {
//           resolve({
//             public_id: result.public_id,
//             url: result.url,
//           });
//         }
//       },
//       {
//         resource_type: "auto",
//         folder,
//       }
//     );
//   });
// };

export const delete_file = async (file) => {
  try {
    const res = await cloudinary.uploader.destroy(file);
    return res?.result === "ok";
  } catch (error) {
    console.error("Error deleting file:", error);
    return false; // Or throw an error for further handling
  }
};
