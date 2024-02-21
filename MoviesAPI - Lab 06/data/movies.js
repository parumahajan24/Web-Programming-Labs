const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;

const createMovie = async (
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
  //reviews, //(an array of review objects, you will initialize this field to be an empty array when a movie is created),
  //overallRating //number (from 0 to 5 this will be a computed average from all the movie reviews posted for a movie,
  //the initial value of this field will be 0 when a movie is created)
) => {
  //console.log("inside create movie inside movies data")
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
    throw "You must provide valid input for your movies db";
  }
  if (
    typeof title !== "string" ||
    typeof plot !== "string" ||
    typeof rating !== "string" ||
    typeof studio !== "string" ||
    typeof director !== "string" ||
    typeof dateReleased !== "string" ||
    typeof runtime !== "string"
  ) {
    throw "Except Genres and Cast Members, all input must be a string";
  }
  if (
    title.trim().length === 0 ||
    plot.trim().length === 0 ||
    rating.trim().length === 0 ||
    studio.trim().length === 0 ||
    director.trim().length === 0 ||
    dateReleased.trim().length === 0 ||
    runtime.trim().length === 0
  ) {
    throw "One of the input (except Genres or Cast Members) is just an empty string or string with only spaces";
  }

  let validTitle = title
    .trim()
    .replace(/[!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]/gi, ""); //no speacial chars or punctuation
  if (title.trim().length < 2) {
    throw "Title must contain atleast 2 chars.";
  }
  if (title.trim() !== validTitle) {
    throw "Title must not contain any special chars or punctuation.";
  }

  let validStudio = studio.trim().replace(/[@#$%^&*_+\=\\`|0-9<>\/]/gi, ""); //no numbers or special letters; Punc allowed
  if (studio.trim().length < 5) {
    throw "Studio must be atleast 5 chars long.";
  }
  if (studio.trim() !== validStudio) {
    throw "Studio must not contain any special chars or numbers. Only letters are allowed.";
  }

  let temp = director
    .trim()
    .replace(/[!@#$%^&*()_+\-=\[\]{};'`:"\\|,.0-9<>\/?]/gi, ""); //no numbers, special chars or punctuation
  let space = " ";
  let validDirector = temp.split(space);
  let directorArray = director.trim().split(space);
  if (directorArray.length !== 2) {
    throw "Director must be in format FirstName space LastName.";
  }
  for (let i = 0; i < directorArray.length; i++) {
    if (directorArray[i] !== validDirector[i] || directorArray[i].length < 3) {
      throw `Director's firstName and lastName must be only letters AND atleast 3 chars long.`;
    }
  }

  if (rating !== "G") {
    if (rating !== "PG") {
      if (rating !== "PG-13") {
        if (rating !== "NC-17") {
          if (rating !== "R") {
            throw "Rating must be either G, PG, PG-13 or NC-17 (case sensitive).";
          }
        }
      }
    }
  }

  if (genres.length === 0 || !Array.isArray(genres))
    throw "You must provide an array of Genres."; // what about [{crime: "crime"}] ????
  let validGenres = genres.map((i) =>
    i.trim().replace(/[!@#$%^&*()_+\-=\[\]{};'`:"\\|,.0-9<>\/?]/gi, "")
  );
  for (let i = 0; i < validGenres.length; i++) {
    if (genres[i].trim() !== validGenres[i]) {
      throw "Genres must only contain Letters (no numbers, special chars or punctuation).";
    }
  }
  let genresInvalidFlag = false; // to check for type string and has length
  let genresInvalidFlagForLength = false; // to check for length of the string >5
  for (i in genres) {
    if (typeof genres[i] !== "string" || genres[i].trim().length === 0) {
      genresInvalidFlag = true;
      break;
    }
    genres[i] = genres[i].trim();
  }
  if (genresInvalidFlag) {
    throw "One or more Genres is not a string or is an empty string with just spaces.";
  }
  for (i in genres) {
    if (genres[i].trim().length < 5) {
      genresInvalidFlagForLength = true;
      break;
    }
    genres[i] = genres[i].trim();
  }
  if (genresInvalidFlagForLength) {
    throw "Each element in Genres must have atleast 5 chars.";
  }

  //console.log("original castMembers..", castMembers);
  if (castMembers.length === 0 || !Array.isArray(castMembers)) {
    throw "You must provide an array of Cast Members";
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
    throw "One or more Cast Members is not a string or is an empty string with just spaces.";
  }

  for (i in castMembers) {
    // console.log('castmembers length after split by space..',castMembers[i].toString().split(space).length);
    if (castMembers[i].toString().split(space).length !== 2) {
      throw "Each Cast Memeber must be in First name space Last Name format.";
    }
  }
  for (i in castMembers) {
    let tempcastMembers = castMembers[i].toString().split(space);
    for (j in tempcastMembers) {
      if (tempcastMembers[j].length < 3) {
        throw "Each element in Cast Members must be 3 chars long.";
      }
    }
  }
  let validCastMembers = [];
  for (let i = 0; i < castMembers.length; i++) {
    validCastMembers[i] = castMembers[i]
      .trim()
      .replace(/[@#$%^&*_+\=\\`|0-9<>\/]/gi, "");
    if (castMembers[i] !== validCastMembers[i]) {
      throw "Cast Members must only be Letters(no numbers or special chars).";
    }
  }

  //console.log("original date released posted..", dateReleased);
  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/; //mm/dd/yyy
  if (!dateFormat.test(dateReleased)) {
    throw "Date Released must be in mm/dd/yyyy format."; //will check for all invalid formats;
  }
  const dateArray = dateReleased.split("/");
  //console.log(dateArray);
  if (dateArray[0] < 0 || dateArray[0] > 12 || dateArray[0] === "00") {
    throw "Date Released(mm/dd/yyy) month must be between 1 to 12.";
  }
  if (dateArray[1] < 0 || dateArray[1] > 31 || dateArray[1] === "00") {
    throw "Date Released(mm/dd/yyyy) day must be between 1 to 31.";
  }
  //feb month-only 28 days, no leap years
  if (dateArray[0] === "02") {
    if (dateArray[1] > 28 || dateArray[1] < 0 || dateArray[1] === "00") {
      throw "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.";
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
      throw "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days.";
    }
  }
  let currentDate = new Date().getFullYear();
  if (dateArray[2] < 1900 || dateArray[2] > currentDate + 2) {
    throw "Date Released must be between years 1900 and currentYear(2022)+2.";
  }

  // console.log("original runtime..", runtime);
  // console.log("split array lentght...", runtime.trim().split(space));

  let validRuntimeArray = runtime.trim().split(space);
  if (validRuntimeArray.length !== 2) {
    throw "Runtime must be in #h #min format(#- positive whole number and MUST match exact format).";
  }

  if (
    /[abcdefgjklopqrstuvwxyzABCDEFGJKMNILOPQRSTUVWXYZ]/.test(
      validRuntimeArray[1]
    )
  ) {
    throw "Invalid time format(only min)";
  }
  if (
    /[abcdefgijklmnopqrstuvwxyzABCDEFGIJKLMNHOPQRSTUVWXYZ]/.test(
      validRuntimeArray[0]
    )
  ) {
    throw "Invalid runtime format(only h)";
  }
  // >=1 hour and <20 hours - confirmed with Frank

  let validHourFormat = validRuntimeArray[0].split("h");
  if (validHourFormat[0] === "") {
    throw "Invalid hour format (only #h).";
  }
  let validMinFormat = validRuntimeArray[1].split("min");
  if (validMinFormat[0] === "") {
    throw "Invalid hour format (only #min).";
  }

  //console.log("valid hours..", validHourFormat);
  //console.log("valid minutes format...", validMinFormat);
  if (
    validHourFormat[0] < 1 ||
    validHourFormat[0] > 20 ||
    !Number.isInteger(Number(validHourFormat[0])) ||
    !Number.isInteger(Number(validMinFormat[0]))
  ) {
    throw "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers.";
  }

  if (
    (validHourFormat[0] >= 1 && validMinFormat[0] === "60") ||
    validMinFormat[0] > 60
  ) {
    throw "Invalid runtime input.";
  }

  const moviesCollection = await movies();
  let newMovie = {
    title: title,
    plot: plot,
    genres: genres,
    rating: rating,
    studio: studio,
    director: director,
    castMembers: castMembers,
    dateReleased: dateReleased,
    runtime: runtime,
    reviews: [],
    overallRating: 0,
  };
  const insertInfo = await moviesCollection.insertOne(newMovie);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not create the movie";
  const newId = insertInfo.insertedId.toString();

  const movie = await getMovieById(newId);
  // let finalMovie = {
  //   _id: movie._id.toString(),
  //   title: movie.title,
  //   plot: movie.plot,
  //   genres: movie.genres,
  //   rating: movie.rating,
  //   studio: movie.studio,
  //   director: movie.director,
  //   castMembers: movie.castMembers,
  //   dateReleased: movie.dateReleased,
  //   runtime: movie.runtime,
  // };
  //return { finalMovie };

  return { ...movie, _id: newId };
};

const getAllMovies = async () => {
  //console.log('inside get all movies....')
  const moviesCollection = await movies();
  const movieList = await moviesCollection.find({}).toArray();
  if (movieList === null) throw `Could not get all movies. Contact Author.`;
  //console.log(movieList)
  let finalMovie = movieList.map((i) => {
    return { ...i, _id: i._id.toString() };
  });

  //let onlyIdandName = movieList.map( i => { return {_id: i._id.toString(), title:i.title} } )
  return finalMovie;
};

const getMovieById = async (movieId) => {
  //console.log("inside getMovieById inside movies data...,", movieId);
  if (!movieId) throw "You must provide an id to search for";
  if (typeof movieId !== "string") throw "Id must be a string";
  if (movieId.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw "invalid object ID";

  const moviesCollection = await movies();
  const findMovie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  //console.log("this is the id:..", movieId);
  //console.log("this is the movie...", findMovie);
  if (findMovie == null) throw `No movie with given id: ${movieId} `;
  let finalMovie = { ...findMovie, _id: movieId };
  return finalMovie;
};

const removeMovie = async (movieId) => {
  if (!movieId) throw "You must provide an id to search for";
  if (typeof movieId !== "string") throw "Id must be a string";
  if (movieId.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw "invalid object ID";

  const moviesCollection = await movies();
  const findMovie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  if(findMovie === null) throw 'Could not find movie with give Id.';
  const deletionInfo = await moviesCollection.deleteOne({
    _id: ObjectId(movieId),
  });
  //console.log('movie was',findMovie.title);

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${movieId}`;
  }
  return `${findMovie.title} has been successfully deleted!`;
};

const updateMovie = async (
  movieId,
  title,
  plot,
  genres,
  rating,
  studio,
  castMembers,
  dateReleased,
  runtime,
  director // proff has not given this in instructions.. ???
) => {
  // movieId = movieId.trim();
  //console.log('movie id provided is...',movieId);
  let space = " ";
  if (
    !movieId ||
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
    throw "You must provide all the input values to update the movies db.";
  }

  if (
    typeof movieId !== "string" ||
    typeof title !== "string" ||
    typeof plot !== "string" ||
    typeof rating !== "string" ||
    typeof studio !== "string" ||
    typeof director !== "string" ||
    typeof dateReleased !== "string" ||
    typeof runtime !== "string"
  ) {
    throw "Except Genres and Cast Members, all input must be a string";
  }

  if (!ObjectId.isValid(movieId)) throw "invalid object ID";

  if (
    typeof movieId.trim().length === 0 ||
    typeof title.trim().length === 0 ||
    typeof plot.trim().length === 0 ||
    typeof rating.trim().length === 0 ||
    typeof studio.trim().length === 0 ||
    typeof director.trim().length === 0 ||
    typeof dateReleased.trim().length === 0 ||
    typeof runtime.trim().length === 0
  ) {
    throw "Input must be a string and not just empty spaces.";
  }

  //generes validation
  //console.log('original geners...',genres);
  if (genres.length === 0 || !Array.isArray(genres))
    throw "You must provide an array of Genres.";

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
    throw "One or more Genres is not a string or is an empty string with just spaces.";
  }

  //console.log("original castMembers..", castMembers);
  if (castMembers.length === 0 || !Array.isArray(castMembers)) {
    throw "You must provide an array of Cast Members";
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
    throw "One or more Cast Members is not a string or is an empty string with just spaces.";
  }

  //dateRelease validation
  //console.log("original date released posted..", dateReleased);
  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/; //mm/dd/yyy
  if (!dateFormat.test(dateReleased)) {
    throw "Date Released must be in mm/dd/yyyy format."; //will check for all invalid formats;
  }
  const dateArray = dateReleased.split("/");
  //console.log(dateArray);
  if (dateArray[0] < 0 || dateArray[0] > 12 || dateArray[0] === "00") {
    throw "Date Released(mm/dd/yyy) month must be between 1 to 12.";
  }
  if (dateArray[1] < 0 || dateArray[1] > 31 || dateArray[1] === "00") {
    throw "Date Released(mm/dd/yyyy) day must be between 1 to 31.";
  }
  //feb month-only 28 days, no leap years
  if (dateArray[0] === "02") {
    if (dateArray[1] > 28 || dateArray[1] < 0 || dateArray[1] === "00") {
      throw "February month in Date Released(mm/dd/yyyy) can not have more than 28 days.";
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
      throw "Given month in Date Released(mm/dd/yyyy) cannot have more than 30 days.";
    }
  }
  let currentDate = new Date().getFullYear();
  if (dateArray[2] < 1900 || dateArray[2] > currentDate + 2) {
    throw "Date Released must be between years 1900 and currentYear(2022)+2.";
  }

  //runtime validations
  // console.log("original runtime..", runtime);
  // console.log("split array lentght...", runtime.trim().split(space));

  let validRuntimeArray = runtime.trim().split(space);
  if (validRuntimeArray.length !== 2) {
    throw "Runtime must be in #h #min format(#- positive whole number and MUST match exact format).";
  }

  if (
    /[abcdefgjklopqrstuvwxyzABCDEFGJKMNILOPQRSTUVWXYZ]/.test(
      validRuntimeArray[1]
    )
  ) {
    throw "Invalid time format(only min)";
  }
  if (
    /[abcdefgijklmnopqrstuvwxyzABCDEFGIJKLMNHOPQRSTUVWXYZ]/.test(
      validRuntimeArray[0]
    )
  ) {
    throw "Invalid runtime format(only h)";
  }
  // >=1 hour and <20 hours - confirmed with Frank

  let validHourFormat = validRuntimeArray[0].split("h");
  if (validHourFormat[0] === "") {
    throw "Invalid hour format (only #h).";
  }
  let validMinFormat = validRuntimeArray[1].split("min");
  if (validMinFormat[0] === "") {
    throw "Invalid hour format (only #min).";
  }

  //console.log("valid hours..", validHourFormat);
  //console.log("valid minutes format...", validMinFormat);
  if (
    validHourFormat[0] < 1 ||
    validHourFormat[0] > 20 ||
    !Number.isInteger(Number(validHourFormat[0])) ||
    !Number.isInteger(Number(validMinFormat[0]))
  ) {
    throw "Movie runtime can not be less than an hour or greater than 20 hours AND must be in whole numbers.";
  }

  if (
    (validHourFormat[0] >= 1 && validMinFormat[0] === "60") ||
    validMinFormat[0] > 60
  ) {
    throw "Invalid runtime input.";
  }

  const moviesCollection = await movies();
  let movieExisted = await getMovieById(movieId);
  //const findMovie = await moviesCollection.findOne({ _id: ObjectId(movieId) });
  if (!movieExisted) throw "No movie is present in db with provided ID.";

  const updatedValues = {
    //movieId,
    title: title,
    plot: plot,
    genres: genres,
    rating: rating,
    studio: studio,
    castMembers: castMembers,
    dateReleased: dateReleased,
    runtime: runtime,
    director: director,
    reviews: movieExisted.reviews,
    overallRating: movieExisted.overallRating,
  };

  const updatedInfo = await moviesCollection.updateOne(
    { _id: ObjectId(movieId) },
    { $set: updatedValues }
  );
  //console.log('updated info..', updatedInfo);
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update movie successfully";
  }
  let finalUpdatedMovie = await getMovieById(movieId);
  return { ...finalUpdatedMovie, _id: movieId };
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  updateMovie,
};
