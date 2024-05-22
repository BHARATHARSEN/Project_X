import React from 'react';
import image from "../../images/default_avatar.jpg";
import StarRatings from 'react-star-ratings';

const ListReviews = ({ reviews }) => {
  return (
    <div className="reviews w-75">
      <h3>Others' Reviews:</h3>
      <hr />
      {reviews?.map((review) => (
        <div className="review-card my-3" key={review.id}> {/* Assuming that each review has a unique id */}
          <div className="row">
            <div className="col-1">
              <img
                src={review?.user?.avatar ? review?.user?.avatar?.url : image}
                alt="User Name"
                width="50"
                height="50"
                className="rounded-circle"
              />
            </div>
            <div className="col-11">
            <StarRatings
              rating={review?.rating}
              starRatedColor="#4d3810"
              numberOfStars={5}
              name="rating"
              starDimension="22px"
              starSpacing="5px"
            />
              <p className="review_user">by {review?.user?.name}</p>
              <p className="review_comment">{review?.comment}</p>
            </div>
          </div>
        </div>
      ))}
      <hr />
    </div>
  );
};

export default ListReviews;