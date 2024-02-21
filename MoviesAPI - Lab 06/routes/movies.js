//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const { ObjectId } = require("mongodb");
const movieData = data.movies;

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET
    try {
      let listOfMovies = await movieData.getAllMovies();
      let onlyIdandName = listOfMovies.map((i) => {
        return { _id: i._id.toString(), title: i.title };
      });
      //console.log("this is the list of movies inside movies routes..", listOfMovies)
      res.json(onlyIdandName);
    } catch (e) {
      res.status(404).json({ error: "Movies not Found." });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //console.log("inside post method...")
    //console.log(req.body.data);
    try {
      // console.log("inside post method...0", req.body);
      let body = req.body;
      const {
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = body;

      //console.log("title...", title)
      //console.log("inside post method 1...")
      if (
        !title ||
        !plot ||
        !genres ||
        !rating ||
        !studio ||
        !director ||
        !castMembers ||
        !dateReleased ||
        !runtime
      ) {
        //throw "You must provide valid input for your movies db";
        res
          .status(400)
          .json({ error: "You must provide valid input for your movies db." });
        return;
      }
      //console.log("inside post method...2")
      if (
        typeof title !== "string" ||
        typeof plot !== "string" ||
        typeof rating !== "string" ||
        typeof studio !== "string" ||
        typeof director !== "string" ||
        typeof dateReleased !== "string" ||
        typeof runtime !== "string"
      ) {
        //throw "Except Genres and Cast Members, all input must be a string";
        res.status(400).json({
          error: "Except Genres and Cast Members, all input must be a string",
        });
        return;
      }
      // console.log("inside post method...3")
      if (
        title.trim().length === 0 ||
        plot.trim().length === 0 ||
        rating.trim().length === 0 ||
        studio.trim().length === 0 ||
        director.trim().length === 0 ||
        dateReleased.trim().length === 0 ||
        runtime.trim().length === 0
      ) {
        //throw "One of the input (except Genres or Cast Members) is just an empty string or string with only spaces";
        res.status(400).json({
          error:
            "One of the input (except Genres or Cast Members) is just an empty string or string with only spaces",
        });
        return;
      }
      // console.log("inside post method...4");
      //generes validation
      if (genres.length === 0 || !Array.isArray(genres)) {
        //throw "You must provide an array of Genres.";
        res.status(400).json({
          error: "You must provide an array of Genres.",
        });
        return;
      }
      //console.log("inside post method...5")

      let genresInvalidFlag = false; // to check for type string and has length
      //let genresInvalidFlagForLength = false; // to check for length of the string >5
      for (i in genres) {
        if (typeof genres[i] !== "string" || genres[i].trim().length === 0) {
          genresInvalidFlag = true;
          break;
        }
        genres[i] = genres[i].trim();
      }
      if (genresInvalidFlag) {
        //throw "One or more Genres is not a string or is an empty string with just spaces.";
        res.status(400).json({
          error:
            "One or more Genres is not a string or is an empty string with just spaces.",
        });
        return;
      }

      //console.log("original castMembers..", castMembers);
      if (castMembers.length === 0 || !Array.isArray(castMembers)) {
        //throw "You must provide an array of Cast Members";
        res.status(400).json({
          error: "You must provide an array of Cast Members.",
        });
        return;
      }
      let castMembersInvalidFlag = false;
      for (i in castMembers) {
        if (
          typeof castMembers[i] !== "string" ||
          castMembers[i].trim().length === 0
        ) {
          castMembersInvalidFlag = true;
          break;
        }
        castMembers[i] = castMembers[i].trim();
      }
      if (castMembersInvalidFlag) {
        //throw "One or more Cast Members is not a string or is an empty string with just spaces.";
        res.status(400).json({
          error:
            "One or more Cast Members is not a string or is an empty string with just spaces.",
        });
        return;
      }

      //dateRelease validation
      const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/; //mm/dd/yyy
      if (!dateFormat.test(dateReleased)) {
        // throw "Date Released must be in mm/dd/yyyy format."; //will check for all invalid formats;
        res.status(400).json({
          error: "Date Released must be in mm/dd/yyyy format.",
        });
        return;
      }
      const dateArray = dateReleased.split("/");
      //console.log(dateArray);
      if (dateArray[0] < 0 || dateArray[0] > 12 || dateArray[0] === "00") {
        //throw "Date Released(mm/dd/yyy) month must be between 1 to 12.";
        res.status(400).json({
          error: "Date Released(mm/dd/yyy) month must be between 1 to 12.",
        });
        return;
      }
      if (dateArray[1] < 0 || dateArray[1] > 31 || dateArray[1] === "00") {
        //throw "Date Released(mm/dd/yyyy) day must be between 1 to 31.";
        res.status(400).json({
          error: "Date Released(mm/dd/yyyy) day must be between 1 to 31.",
        });
        return;
      }
      //feb month-only 28 days, no leap years
      if (dateArray[0] === "02") {
        if (dateArray[1] > 28 || dateArray[1] < 0 || dateArray[1] === "00") {
          //throw "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.";
          res.status(400).json({
            error:
              "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.",
          });
          return;
        }
      }
      //april,june,sep,nov- months with 30 days
      if (
        dateArray[0] == "04" ||
        dateArray[0] === "06" ||
        dateArray[0] === "09" ||
        dateArray[0] === "11"
      ) {
        if (dateArray[1] > 30) {
          // throw "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days.";
          res.status(400).json({
            error:
              "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days.",
          });
          return;
        }
      }
      let currentDate = new Date().getFullYear();
      if (dateArray[2] < 1900 || dateArray[2] > currentDate + 2) {
        //throw "Date Released must be between years 1900 and currentYear(2022)+2.";
        res.status(400).json({
          error:
            "Date Released must be between years 1900 and currentYear(2022)+2.",
        });
        return;
      }

      //console.log("inside post method...6");
      //runtime validations
      //console.log("runtime is...", runtime.trim().split(space))
      let space = " ";

      let validRuntimeArray = runtime.trim().split(space);
      //console.log("validRuntimeArray...",validRuntimeArray)
      if (validRuntimeArray.length !== 2) {
        //throw "Runtime must be in #h #min format(#- positive whole number and MUST match exact format).";
        res.status(400).json({
          error:
            "Runtime must be in #h #min format(#- positive whole number and MUST match exact format).",
        });
        return;
      }

      if (
        /[abcdefgjklopqrstuvwxyzABCDEFGJKMNILOPQRSTUVWXYZ]/.test(
          validRuntimeArray[1]
        )
      ) {
        //throw "Invalid time format(only min)";
        res.status(400).json({
          error: "Invalid time format(only min).",
        });
        return;
      }
      if (
        /[abcdefgijklmnopqrstuvwxyzABCDEFGIJKLMNHOPQRSTUVWXYZ]/.test(
          validRuntimeArray[0]
        )
      ) {
        //throw "Invalid runtime format(only h)";
        res.status(400).json({
          error: "Invalid runtime format(only h).",
        });
        return;
      }
      // >=1 hour and <20 hours - confirmed with Frank

      let validHourFormat = validRuntimeArray[0].split("h");
      if (validHourFormat[0] === "") {
        //throw "Invalid hour format (only #h).";
        res.status(400).json({
          error: "Invalid hour format (only #h).",
        });
        return;
      }
      let validMinFormat = validRuntimeArray[1].split("min");
      if (validMinFormat[0] === "") {
        //throw "Invalid min format (only #min).";
        res.status(400).json({
          error: "Invalid min format (only #min).",
        });
        return;
      }

      // console.log("valid hours..", validHourFormat);
      // console.log("valid minutes format...", validMinFormat);
      if (
        validHourFormat[0] < 1 ||
        validHourFormat[0] > 20 ||
        !Number.isInteger(Number(validHourFormat[0])) ||
        !Number.isInteger(Number(validMinFormat[0]))
      ) {
        //throw "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers.";
        res.status(400).json({
          error:
            "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers.",
        });
        return;
      }

      if (
        (validHourFormat[0] >= 1 && validMinFormat[0] === "60") ||
        validMinFormat[0] > 60
      ) {
        //throw "Invalid runtime input.";
        res.status(400).json({
          error: "Invalid runtime input.",
        });
        return;
      }

      //..... validations completed ......//
      // console.log("before create movie..")

      let movieCreated = await movieData.createMovie(
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime
      );
      //console.log("movie created is...", movieCreated)
      res.json(movieCreated);
    } catch (e) {
      res.status(404).json({ error: "Movie could not be created." });
    }
  });

router
  .route("/:movieId")
  .get(async (req, res) => {
    //code here for GET
    try {
      //console.log('inside get for moviesID...', req.params.movieId)
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
          error:
            "Not a valid Object: MovieId - inside reviews.routes/get movieID.",
        });
        return;
      }
      //getting the movie for given movieId

      let movieByMovieId = await movieData.getMovieById(req.params.movieId);
      res.json(movieByMovieId);
    } catch (e) {
      res.status(400).json({
        error: "Movie Not found with the given ID. - inside get of /movieId",
      });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    //id validation
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
        error:
          "Not a valid Object: MovieId - inside reviews.routes/get movieID.",
      });
      return;
    }
    //deletign the movie after validating movieId
    try {
      let deleteSuccess = await movieData.removeMovie(req.params.movieId);
      if (deleteSuccess) {
        res.json({ movieId: req.params.movieId, deleted: true });
      }
    } catch (e) {
      res.status(400).json({
        error: "Movie could not be deleted-inside delet method for movieByid",
      });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    try {
      // console.log('inside put')
      let body = req.body;
      const {
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = body;
      console.log("title is inside out method...", title);

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
          error:
            "Not a valid Object: MovieId - inside reviews.routes/get movieID.",
        });
        return;
      }

      //..........validations begin here......

      let space = " ";
      if (
        !req.params.movieId ||
        !title ||
        !plot ||
        !genres ||
        !rating ||
        !studio ||
        !director ||
        !castMembers ||
        !dateReleased ||
        !runtime
      ) {
        //throw "You must provide all the input values to update the movies db.";
        res.status(400).json({
          error:
            "You must provide all the input values to update the movies db",
        });
        return;
      }
      //console.log("type of rating..",typeof rating)
      if (
        typeof req.params.movieId !== "string" ||
        typeof title !== "string" ||
        typeof plot !== "string" ||
        typeof rating !== "string" ||
        typeof studio !== "string" ||
        typeof director !== "string" ||
        typeof dateReleased !== "string" ||
        typeof runtime !== "string"
      ) {
        //throw "Except Genres and Cast Members, all input must be a string";
        res.status(400).json({
          error: "Except Genres and Cast Members, all input must be a string",
        });
        return;
      }

      if (!ObjectId.isValid(req.params.movieId)) {
        //throw "invalid object ID";
        res.status(400).json({ error: "invalid object ID" });
        return;
      }

      if (
        typeof req.params.movieId.trim().length === 0 ||
        typeof title.trim().length === 0 ||
        typeof plot.trim().length === 0 ||
        typeof rating.trim().length === 0 ||
        typeof studio.trim().length === 0 ||
        typeof director.trim().length === 0 ||
        typeof dateReleased.trim().length === 0 ||
        typeof runtime.trim().length === 0
      ) {
        //throw "Input must be a string and not just empty spaces.";
        res
          .status(400)
          .json({ error: "Input must be a string and not just empty spaces." });
        return;
      }

      //generes validation
      //console.log('original geners...',genres);
      if (genres.length === 0 || !Array.isArray(genres)) {
        //throw "You must provide an array of Genres.";
        res.status(400).json({ error: "ou must provide an array of Genres.." });
        return;
      }

      let genresInvalidFlag = false; // to check for type string and has length
      //let genresInvalidFlagForLength = false; // to check for length of the string >5
      for (i in genres) {
        if (typeof genres[i] !== "string" || genres[i].trim().length === 0) {
          genresInvalidFlag = true;
          break;
        }
        genres[i] = genres[i].trim();
      }
      if (genresInvalidFlag) {
        //throw "One or more Genres is not a string or is an empty string with just spaces.";
        res.status(400).json({
          error:
            "One or more Genres is not a string or is an empty string with just spaces.",
        });
        return;
      }

      //console.log("original castMembers..", castMembers);
      if (castMembers.length === 0 || !Array.isArray(castMembers)) {
        //throw "You must provide an array of Cast Members";
        res
          .status(400)
          .json({ error: "You must provide an array of Cast Members ." });
        return;
      }
      let castMembersInvalidFlag = false;
      for (i in castMembers) {
        if (
          typeof castMembers[i] !== "string" ||
          castMembers[i].trim().length === 0
        ) {
          castMembersInvalidFlag = true;
          break;
        }
        castMembers[i] = castMembers[i].trim();
      }
      if (castMembersInvalidFlag) {
        //throw "One or more Cast Members is not a string or is an empty string with just spaces.";
        res.status(400).json({
          error:
            "One or more Cast Members is not a string or is an empty string with just spaces. .",
        });
        return;
      }

      //dateRelease validation
      //console.log("original date released posted..", dateReleased);
      const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/; //mm/dd/yyy
      if (!dateFormat.test(dateReleased)) {
        //throw "Date Released must be in mm/dd/yyyy format."; //will check for all invalid formats;
        res
          .status(400)
          .json({ error: "Date Released must be in mm/dd/yyyy format.." });
        return;
      }
      const dateArray = dateReleased.split("/");
      //console.log(dateArray);
      if (dateArray[0] < 0 || dateArray[0] > 12 || dateArray[0] === "00") {
        //throw "Date Released(mm/dd/yyy) month must be between 1 to 12.";
        res.status(400).json({
          error: "Date Released(mm/dd/yyy) month must be between 1 to 12.",
        });
        return;
      }
      if (dateArray[1] < 0 || dateArray[1] > 31 || dateArray[1] === "00") {
        //throw "Date Released(mm/dd/yyyy) day must be between 1 to 31.";
        res.status(400).json({
          error: "Date Released(mm/dd/yyyy) day must be between 1 to 31.",
        });
        return;
      }
      //feb month-only 28 days, no leap years
      if (dateArray[0] === "02") {
        if (dateArray[1] > 28 || dateArray[1] < 0 || dateArray[1] === "00") {
          // throw "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.";
          res.status(400).json({
            error:
              "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.",
          });
          return;
        }
      }
      //april,june,sep,nov- months with 30 days
      if (
        dateArray[0] == "04" ||
        dateArray[0] === "06" ||
        dateArray[0] === "09" ||
        dateArray[0] === "11"
      ) {
        if (dateArray[1] > 30) {
          //throw "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days.";
          res.status(400).json({
            error:
              "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days",
          });
          return;
        }
      }
      let currentDate = new Date().getFullYear();
      if (dateArray[2] < 1900 || dateArray[2] > currentDate + 2) {
        //throw "Date Released must be between years 1900 and currentYear(2022)+2.";
        res.status(400).json({
          error:
            "Date Released must be between years 1900 and currentYear(2022)+2.",
        });
        return;
      }

      //runtime validations
      // console.log("original runtime..", runtime);
      // console.log("split array lentght...", runtime.trim().split(space));

      let validRuntimeArray = runtime.trim().split(space);
      if (validRuntimeArray.length !== 2) {
        // throw "Runtime must be in #h #min format(#- positive whole number and MUST match exact format).";
        res.status(400).json({
          error:
            "Runtime must be in #h #min format(#- positive whole number and MUST match exact format)",
        });
        return;
      }

      if (
        /[abcdefgjklopqrstuvwxyzABCDEFGJKMNILOPQRSTUVWXYZ]/.test(
          validRuntimeArray[1]
        )
      ) {
        // throw "Invalid time format(only min)";
        res.status(400).json({ error: "Invalid time format(only min)." });
        return;
      }
      if (
        /[abcdefgijklmnopqrstuvwxyzABCDEFGIJKLMNHOPQRSTUVWXYZ]/.test(
          validRuntimeArray[0]
        )
      ) {
        //throw "Invalid runtime format(only h)";
        res.status(400).json({ error: "Invalid runtime format(only h)." });
        return;
      }
      // >=1 hour and <20 hours - confirmed with Frank

      let validHourFormat = validRuntimeArray[0].split("h");
      if (validHourFormat[0] === "") {
        //throw "Invalid hour format (only #h).";
        res.status(400).json({ error: "Invalid hour format (only #h)" });
        return;
      }
      let validMinFormat = validRuntimeArray[1].split("min");
      if (validMinFormat[0] === "") {
        //throw "Invalid hour format (only #min).";
        res.status(400).json({ error: "Invalid hour format (only #min)." });
        return;
      }

      //console.log("valid hours..", validHourFormat);
      //console.log("valid minutes format...", validMinFormat);
      if (
        validHourFormat[0] < 1 ||
        validHourFormat[0] > 20 ||
        !Number.isInteger(Number(validHourFormat[0])) ||
        !Number.isInteger(Number(validMinFormat[0]))
      ) {
        //throw "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers.";
        res.status(400).json({
          error:
            "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers",
        });
        return;
      }

      if (
        (validHourFormat[0] >= 1 && validMinFormat[0] === "60") ||
        validMinFormat[0] > 60
      ) {
        //throw "Invalid runtime input.";
        res.status(400).json({ error: "Invalid runtime input." });
        return;
      }

      //............validation end here.......

      //update the movie now
      let updatedMovieById = await movieData.updateMovie(
        req.params.movieId,
        title,
        plot,
        genres,
        rating,
        studio,
        castMembers,
        dateReleased,
        runtime,
        director
      );
      res.json(updatedMovieById);
    } catch (e) {
      res.status(400).json({
        error: "Movie could not be updated -inside put method for movieByid",
      });
    }
  });

module.exports = router;
