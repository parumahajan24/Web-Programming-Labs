const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const { getMovieById } = require("./movies");
const movies = mongoCollections.movies;

//??????
const createReview = async (
  movieId,
  reviewTitle,
  reviewerName,
  review,
  rating
  //reviewDate will be set to current date when review is created
) => {
  if (!ObjectId.isValid(movieId)) throw "invalid object ID";
  // console.log('type of rating..',typeof(rating));
  // console.log('rating provided is...',rating)

  if (!movieId || !reviewTitle || !reviewerName || !review || !rating) {
    throw "You must provide valid input for your reviews db";
  }
  if (
    typeof movieId !== "string" ||
    typeof reviewTitle !== "string" ||
    typeof reviewerName !== "string" ||
    typeof review !== "string"
  ) {
    throw "Except Rating, all input must be a string";
  }
  if (
    movieId.trim().length === 0 ||
    reviewTitle.trim().length === 0 ||
    reviewerName.trim().length === 0 ||
    review.trim().length === 0
  ) {
    throw "One of the input is just an empty string or string with only spaces";
  }

  const moviesCollection = await movies();
  const findMovie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  //console.log("this is the id:..", movieId);
  //console.log("this is the movie...", findMovie);
  if (findMovie == null || !findMovie)
    throw `No movie with given id: ${movieId} `;

  if (isNaN(rating)) throw "Rating should be a number.";
  if (rating < 1 || rating > 5) throw "rating should be between 1 and 5.";
  // if() float rating ???????? - ASK TA

  //let date = new Date();
  let date = new Date().toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  //console.log('date is...',date);

  let totalReviews = 0;
  let reviewObj = {
    _id: new ObjectId(),
    reviewTitle,
    reviewerName,
    review,
    rating,
    reviewDate: date,
  };

  let averageRating = 0;
  let movieCollectionReviews = moviesCollection.reviews;
  //console.log("moie colection reviews are..", reviewObj);
  if (
    !movieCollectionReviews ||
    movieCollectionReviews === undefined ||
    movieCollectionReviews === null
  ) {
    averageRating = rating;
  } else {
    movieCollectionReviews.forEach(
      (i) => (totalReviews = totalReviews + i.rating)
    );
    averageRating =
      (totalReviews + rating) / (movieCollectionReviews.length + 1);
  }

  //if(!isNaN(averageRating)) throw '';
  // can we include decimals in average rating?? or it has to be strict numbers???????? - ASK TA
  // ??????? should it throw if the avg rating is not between 0 and 5 and is not a number ????? - ASK TA
  //if(averageRating<0 || averageRating>5) throw '';

  //console.log('reviews in movie before upadting...', moviesCollection.rating)
  const updatedInfoMovieCollection = await moviesCollection.updateOne(
    { _id: ObjectId(movieId) },
    { $set: { overallRating: averageRating }, $push: { reviews: reviewObj } }
  );

  //console.log("movie collection review immediate...", reviewObj);
  if (updatedInfoMovieCollection.modifiedCount === 0)
    throw `Could not find the movie: ${moviesCollection.title}`;

  let movieById = await getMovieById(movieId);
  //console.log('after upadting review n overallrating..',movieById)
  // movieById._id.toString();
  // console.log('reviews in moviebyid after updating..', movieById.reviews)
  // console.log('ratibg in moviebyid after updating..', movieById.overallRating)
  let finalReviews = movieById.reviews.map((i) => {
    return { ...i, _id: i._id.toString() };
  });
  movieById.reviews = finalReviews;
  //movieById.rating = averageRating;
  // console.log('final movie with reviews...',movieById);
  //console.log("movie collection review...", moviesCollection.reviews);
  return movieById;
};

const getAllReviews = async (movieId) => {
  //console.log("movie id inside getALlReviews by movieId...",movieId)
  if (!movieId) throw "No movie id is provided!";
  if (typeof movieId !== "string" || movieId.trim().length === 0)
    throw "Either movieId is not string or string with juts empty spaces which is not allowed!.";
  if (!ObjectId.isValid(movieId)) throw "Not a valid Object MovieId.";

  let moviesCollection = await movies();
  const findMovie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  if (findMovie == null || !findMovie)
    throw `No movie with given id: ${movieId} `;
  let reviews = findMovie.reviews.map((i) => {
    return { ...i, _id: i._id.toString() };
  });
  //console.log('full movie...', reviews);
  return reviews;
};

const getReview = async (reviewId) => {
  if (!reviewId) throw "No reviewId is provided!.";
  if (typeof reviewId !== "string" || reviewId.trim().length === 0)
    throw "Either reviewId is not string or string with just empty spaces which is not allowed!.";
  if (!ObjectId.isValid(reviewId)) throw "Not a valid Object reviewId.";

  let moviesCollection = await movies();
  let findMovieReviews = await moviesCollection.findOne(
    { "reviews._id": { $eq: ObjectId(reviewId) } },
    { projection: { _id: 0, reviews: 1 } }
  );
  if (findMovieReviews == null || !findMovieReviews)
    throw "No review found for given ID.";
  //console.log('reviews for review id...', findMovieReviews);
  let finalReview = findMovieReviews.reviews.find(
    (i) => i._id.toString() === reviewId
  );
  finalReview = { ...finalReview, _id: finalReview._id.toString() };
  return finalReview;
};

//?????????
const removeReview = async (reviewId) => {
  //console.log("inside remove review...");
  //console.log("remove review is...", reviewId);
  if (!reviewId) throw "No reviewId is provided!.";
  if (typeof reviewId !== "string" || reviewId.trim().length === 0)
    throw "Either reviewId is not string or string with just empty spaces which is not allowed!.";
  if (!ObjectId.isValid(reviewId)) throw "Not a valid Object reviewId.";

  let moviesCollection = await movies();
  let findMovieReviews = await moviesCollection.findOne({
    "reviews._id": { $eq: ObjectId(reviewId) },
  });

  if (findMovieReviews == null || !findMovieReviews)
    throw "No review found for given ID.";

  //get movies id..for given reviewId
  let movieIdOfReviewId = findMovieReviews._id;
  let countReviwe = 0;
  let total = 0;
  let averageRating = 0;
  console.log("findMoviews id is...", findMovieReviews._id.toString());
  findMovieReviews.reviews.forEach((i) => {
    if (i._id.toString() !== reviewId) {
      total = total + i.rating;
      countReviwe++;
    }
  });
  // console.log("count is...", countReviwe);
  // console.log("ttoal is...", total);
  averageRating = total / countReviwe;
  console.log("avg rating...", averageRating);
  if(averageRating == 'NaN') {
    console.log("tru insdie nan")
    averageRating = 0;
  }

  //pull the review for given ReviewID... and set the average rating as overrating
  //????? ...ASK TA
  const updatedReviewInMovie = await moviesCollection.updateOne(
    { _id: findMovieReviews._id },
    {
      $pull: { reviews: { _id: { $eq: ObjectId(reviewId) } } },
      $set: { overallRating: averageRating },
    }
  );
  if (updatedReviewInMovie.modifiedCount === 0) {
    throw "Review could not b modified.Conatct Author.";
  }

  let movieWithDeletedReview = await moviesCollection.findOne({
    _id: movieIdOfReviewId,
  });
  //console.log('movie review length after deleting revie...',movieWithDeletedReview.reviews.length)
  if(movieWithDeletedReview.reviews.length === 0) {
    let finalUpdate = await moviesCollection.updateOne(
      { _id: findMovieReviews._id },
      {
        //$pull: { reviews: { _id: { $eq: ObjectId(reviewId) } } },
        $set: { overallRating: 0 },
      }
    );
    let finalDeletedReviewMovie = await moviesCollection.findOne({
      _id: movieIdOfReviewId,
    });
    return {
      ...finalDeletedReviewMovie, _id: movieIdOfReviewId.toString()
    };
  }
  //console.log('review id deletes..',movieWithDeletedReview);
  return { ...movieWithDeletedReview,
    _id: movieIdOfReviewId.toString() };
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview,
};
