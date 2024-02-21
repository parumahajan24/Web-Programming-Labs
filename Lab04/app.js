/*

1. Create a Movie of your choice.
2. Log the newly created Movie. (Just that movie, not all movies)
3. Create another movie of your choice.
4. Query all movies, and log them all
5. Create the 3rd movie of your choice.
6. Log the newly created 3rd movie. (Just that movie, not all movies)
7. Rename the first movie
8. Log the first movie with the updated name. 
9. Remove the second movie you created.
10. Query all movies, and log them all
11. Try to create a movie with bad input parameters to make sure it throws errors.
12. Try to remove a movie that does not exist to make sure it throws errors.
13. Try to rename a movie that does not exist to make sure it throws errors.
14. Try to rename a movie passing in invalid data for the newName parameter to make sure it throws errors.
15. Try getting a movie by ID that does not exist to make sure it throws errors.

*/

const movies = require("./data/movies");
const connection = require("./config/mongoConnection");

const main = async () => {
  const db = await connection.dbConnection();
  await db.dropDatabase();

  //this is the first attempt of using Mongodb
  let tempHackersId;
  let tempTestId;

  //create and log the first movie
  try {
    const hackers = await movies.createMovie(
      "Hackers",
      "Hackers are blamed for making a virus that will capsize five oil tankers.",
      ["Crime", "Drama", "Romance"],
      "PG-13",
      "United Artists",
      "Iain Softley",
      ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"],
      "09/15/1995",
      "1h 45min"
    );
    tempHackersId = hackers._id;
    console.log(hackers);
  } catch (e) {
    console.log(e);
  }

  //only create second movie
  try {
    const testMovie = await movies.createMovie(
      "test movie",
      "test movie is a random movie.",
      ["Testing", "random"],
      "PG",
      "United Artists",
      "Iain Softley",
      ["Jonny Miller", "Jolie Matthew", "Matthew Lillard", "Fisher Stevens"],
      "09/24/2009",
      "2h 45min"
    );
    tempTestId = testMovie._id;
    //console.log("another movie..", testMovie);
  } catch (e) {
    console.log(e);
  }

  //query all movies and console.
  try {
    const movieList = await movies.getAllMovies();
    console.log(movieList);
  } catch (e) {
    console.log(e);
  }

  //create and log the third movie
  try {
    const thirdMovie = await movies.createMovie(
      "Friends",
      "Friends is about 6 friends and their daily life. LOVE THIS!",
      ["Funny", "Romance"],
      "PG",
      "United Artists",
      "Parul Sharma",
      [
        "Monica Geller",
        "Pheoby Bhuffay",
        "Joey Tribiyani",
        "Chandler Bing",
        "Ross Geller",
        "Racheal Green",
      ],
      "09/24/1995",
      "1h 45min"
    );
    console.log(thirdMovie);
  } catch (e) {
    console.log(e);
  }

  //rename the first movie and log with updated name
  try {
    const renameFirstMovie = await movies.renameMovie(
      tempHackersId,
      "Hackers 2"
    );
    console.log(renameFirstMovie);
  } catch (e) {
    console.log(e);
  }

  //remove the second movie
  try {
    let deletedMovie = await movies.removeMovie(tempTestId); //everytime it will delete the 'test movie' created!
    console.log(deletedMovie);
  } catch (e) {
    console.log(e);
  }

  //query all movies and log them all
  try {
    const movieList = await movies.getAllMovies();
    console.log(movieList);
  } catch (e) {
    console.log(e);
  }

  //create a movie with bad input
  try {
    const hackers = await movies.createMovie(
      "Hackers",
      "Hackers are blamed for making a virus that will capsize five oil tankers.",
      ["Crime", "Drama", "Romance"],
      "PG-13",
      "United Artists",
      "Iain  Softley",
      ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"],
      "09/15/2029",
      "1h 45min"
    );
    tempHackersId = hackers._id;
    console.log(hackers);
  } catch (e) {
    console.log(e);
  }

  //try to remove a movie that does not exists
  try {
    let deletedMovie = await movies.removeMovie("634cc806e14ba471a7cac439");
    console.log(deletedMovie);
  } catch (e) {
    console.log(e);
  }

  //try to rename a movie that does not exists
  try {
    const renameFirstMovie = await movies.renameMovie(
      "634cc806e14ba471a7cac439",
      "Hackers 2"
    );
    console.log(renameFirstMovie);
  } catch (e) {
    console.log(e);
  }

  //try to rename the movie by passing invalid name parameter
  try {
    const renameFirstMovie = await movies.renameMovie(tempHackersId, "  ");
    console.log(renameFirstMovie);
  } catch (e) {
    console.log(e);
  }

  //try getting a movie by ID that does not exist
  try {
    movieById = await movies.getMovieById("634cc806e14ba471a7cac439");
    console.log(movieById);
  } catch (e) {
    console.log(e);
  }

  await connection.closeConnection();
  //console.log("Done!");
};

main();
