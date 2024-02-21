//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const movieData = data.movies;
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");

router
  .route("/:movieId")
  .get(async (req, res) => {
    //code here for GET
    if (!req.params.movieId) {
      // throw "No movie id is provided!";
      res.status(400).json({ error: "No movie id is provided!." });
      return;
    }
    if (
      typeof req.params.movieId !== "string" ||
      req.params.movieId.trim().length === 0
    ) {
      // throw "Either movieId is not string or string with juts empty spaces which is not allowed!.";
      res.status(400).json({
        error:
          "Either movieId is not string or string with juts empty spaces which is not allowed!.",
      });
      return;
    }
    if (!ObjectId.isValid(req.params.movieId)) {
      //throw "Not a valid Object MovieId.";
      res.status(400).json({
        error: "Not a valid Object: MovieId.",
      });
      return;
    }
    //getting the movie for given movieId
    try {
      let movieByMovieId = await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      res.status(404).json({ error: `${e}` });
      return;
    }
    //getting the review for the given movieId from reviews data
    try {
      let reviewByMovieId = await reviewsData.getAllReviews(req.params.movieId);
      if (reviewByMovieId.length === 0) {
        res.status(404).json({ error: "No reviews found for given movieID." });
        return;
      }
      res.json(reviewByMovieId);
    } catch (e) {
      res.status(404).json({ error: "no reviews found!" });
      return;
    }
  })
  .post(async (req, res) => {
    //code here for POST
    if (!req.params.movieId) {
      // throw "No movie id is provided!";
      res.status(400).json({ error: "No movie id is provided!." });
      return;
    }
    if (
      typeof req.params.movieId !== "string" ||
      req.params.movieId.trim().length === 0
    ) {
      // throw "Either movieId is not string or string with juts empty spaces which is not allowed!.";
      res.status(400).json({
        error:
          "Either movieId is not string or string with juts empty spaces which is not allowed!.",
      });
      return;
    }
    if (!ObjectId.isValid(req.params.movieId)) {
      //throw "Not a valid Object MovieId.";
      res.status(400).json({
        error: "Not a valid Object: MovieId.",
      });
      return;
    }

    let body = req.body;

    const { reviewTitle, reviewerName, review, rating } = body;

    //console.log("title inside reviews..", reviewTitle);

    //....validations begins here....
    if (!reviewTitle || !reviewerName || !review || !rating) {
      //throw "You must provide valid input for your reviews db";
      res
        .status(400)
        .json({ error: "You must provide valid input for your reviews db." });
      return;
    }
    if (
      typeof reviewTitle !== "string" ||
      typeof reviewerName !== "string" ||
      typeof review !== "string"
    ) {
      //throw "Except Rating, all input must be a string";
      res
        .status(400)
        .json({ error: "Except Rating, all input must be a string" });
      return;
    }
    if (
      req.params.movieId.trim().length === 0 ||
      reviewTitle.trim().length === 0 ||
      reviewerName.trim().length === 0 ||
      review.trim().length === 0
    ) {
      //throw "One of the input is just an empty string or string with only spaces";
      res.status(400).json({
        error:
          "One of the input is just an empty string or string with only spaces.",
      });
      return;
    }
    if (isNaN(rating)) {
      //throw "Rating should be a number.";
      res.status(400).json({
        error: "Rating should be a number.",
      });
      return;
    }
    if (rating < 1 || rating > 5) {
      //throw "rating should be between 1 and 5.";
      res.status(400).json({
        error: "rating should be between 1 and 5.",
      });
      return;
    }

    //getting the movie for given movieId
    try {
      let movieByMovieId = await movieData.getMovieById(req.params.movieId);
    } catch (e) {
      res.status(404).json({ error: `${e}` });
      return;
    }

    //create the review for given movieID..
    try {
      let reviewCreatedByMovieId = await reviewsData.createReview(
        req.params.movieId,
        reviewTitle,
        reviewerName,
        review,
        rating
      );
      res.json(reviewCreatedByMovieId);
    } catch (e) {
      res
        .status(404)
        .json({ error: "could not create review. Contact Author." });
    }
  });

router
  .route("/review/:reviewId")
  .get(async (req, res) => {
    //code here for GET
    if (!req.params.reviewId) {
      // throw "No movie id is provided!";
      res.status(400).json({ error: "No movie id is provided!." });
      return;
    }
    if (
      typeof req.params.reviewId !== "string" ||
      req.params.reviewId.trim().length === 0
    ) {
      // throw "Either reviewId is not string or string with juts empty spaces which is not allowed!.";
      res.status(400).json({
        error:
          "Either reviewId is not string or string with juts empty spaces which is not allowed!.",
      });
      return;
    }
    if (!ObjectId.isValid(req.params.reviewId)) {
      //throw "Not a valid Object MovieId.";
      res.status(400).json({
        error: "Not a valid Object: reviewId.",
      });
      return;
    }

    try {
      let reviewForReviewId = await reviewsData.getReview(req.params.reviewId);
      res.json(reviewForReviewId);
    } catch (e) {
      res.status(404).json({ error: `${e}` });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    if (!req.params.reviewId) {
      // throw "No movie id is provided!";
      res.status(400).json({ error: "No movie id is provided!." });
      return;
    }
    if (
      typeof req.params.reviewId !== "string" ||
      req.params.reviewId.trim().length === 0
    ) {
      // throw "Either reviewId is not string or string with juts empty spaces which is not allowed!.";
      res.status(400).json({
        error:
          "Either reviewId is not string or string with juts empty spaces which is not allowed!.",
      });
      return;
    }
    if (!ObjectId.isValid(req.params.reviewId)) {
      //throw "Not a valid Object MovieId.";
      res.status(400).json({
        error: "Not a valid Object: reviewId.",
      });
      return;
    }

    //check if reviews are there or not
    try {
      let isReview = await reviewsData.getReview(req.params.reviewId);
    } catch (e) {
      res.status(400).json({ error: `${e}` });
    }

    try {
      let deletedReviewForReviewId = await reviewsData.removeReview(req.params.reviewId);
      res.json(deletedReviewForReviewId);
    } catch (e) {
      res.status(400).json({ error: `${e}` });
    }
  });

module.exports = router;
