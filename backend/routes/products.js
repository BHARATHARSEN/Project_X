import express from 'express';
import { deleteProduct, getProductDetails, getProducts, newProduct, updateProduct } from "../controllers/productControllers.js";
import { isAuthenticatedUser,authorizeRoles } from '../middlewares/auth.js';
import { createProductReview, deleteReview, getProductReviews } from '../controllers/orderControllers.js';
const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router.route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProducts);

  
router.route("/product/:id").get(getProductDetails);


router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .get(isAuthenticatedUser,getProductReviews)
  .put(isAuthenticatedUser,createProductReview );

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);


export default router ;
