
//import { setupCarousel } from "./carousel.js";

window.addEventListener('load', () => {

    //Förslagsvis anropar ni era funktioner som skall sätta lyssnare, rendera objekt osv. härifrån


    setupCarousel();
    fetchMovies()
    posterDB()
    searchMovies()

});

//Hämtar youtube videos från API
const url = 'https://santosnr6.github.io/Data/movies.json'
const ulRef = document.querySelector('#youtube-slides')
const imageRef = document.querySelector('.popular__img-container')
const movieSearchBox = document.querySelector('#movie-search-box')
const searchList = document.querySelector('.search-list')
const resultGrid = document.querySelector('.result-grid')
const containerRef = document.querySelector('.container')
const form = document.querySelector('form')
const dNone = document.querySelector('.d-none')
const dVisible = document.querySelector('.visible')
const resultContainer = document.querySelector('.result-container')



const fetchMovies = async () => {
    try {

        const resp = await fetch(url)
        const data = await resp.json()
        let urlData = []
        //stoppar i alla filmer i arrayen 


        data.map(Newdata => {

            urlData.push(Newdata.trailer_link)

        })


        // 5 stycken slumpmässigt genererade länkar
        // som stoppas i generatedUrl
        const generatedUrl = []
        for (let i = 0; i < 5; i++) {

            const link = urlData.splice(Math.floor(Math.random() * urlData.length), 1)
            generatedUrl.push(link)
        }
        const listGenerated = generatedUrl

        appendYoutubeSlides(listGenerated)
    } catch (error) {
        console.error('fel vid hämtning av filmdata', error)

    }



}




// Listar youtube-videos 5 stycken slumpmässigt

function appendYoutubeSlides(listofGen) {

    const youtubeSlides = `<li class="carousel__slide" data-active>
    <iframe src="${listofGen[0]}" width="420" height="315" frameborder="0"></iframe>
    </li>
    <li class="carousel__slide">
    <iframe src="${listofGen[1]}" width="420" height="315" frameborder="0"></iframe>
    </li>
    <li class="carousel__slide">
    <iframe src="${listofGen[2]}" width="420" height="315" frameborder="0"></iframe>
    </li>
    <li class="carousel__slide">
    <iframe src="${listofGen[3]}" width="420" height="315" frameborder="0"></iframe>
    </li>
    <li class="carousel__slide">
    <iframe src="${listofGen[4]}" width="420" height="315" frameborder="0"></iframe>
    </li>`



    ulRef.innerHTML = youtubeSlides
}



let newPostArray = []
let movieArray = []

const posterDB = async () => {

    const resp = await fetch(url)
    const dataMovie = await resp.json()


    dataMovie.map(moviePoster => {
        newPostArray.push(moviePoster.poster)
    })

    dataMovie.map(movieSearch => {

        movieArray.push(movieSearch.title)
    })



    postImage()
}

 function setupCarousel() {

    const buttons = document.querySelectorAll('[data-carousel-btn]');
    buttons.forEach(btn => {
         btn.addEventListener('click', () => {
             const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
            const slides = btn.closest('[data-carousel').querySelector('[data-slides');
            const activeSlide = slides.querySelector('[data-active]');
             let newIndex = [...slides.children].indexOf(activeSlide) + offset;

             if (newIndex < 0) {
                newIndex = slides.children.length - 1;
            } else if (newIndex >= slides.children.length) {
                newIndex = 0;
           }

             slides.children[newIndex].dataset.active = true;
             delete activeSlide.dataset.active;
        });
     });
 }






// skapar bilder och lägger till så att det 
// det går att göra bilderna till länkar.
function postImage() {

    newPostArray.forEach(function (src) {

        const createImg = document.createElement("img")
        createImg.src = src
        const createTitle = document.createElement("h4")
        createTitle.src = src.Title
        const createLink = document.createElement("a");
        createLink.href = "#";
        createLink.appendChild(createImg);

        imageRef.appendChild(createLink);



    })
}




//Här börjar sökfunktionerna för att hitta filmerna och 
//detaljen till filmerna

function searchMovies() {

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        console.log('hejejeejjejejejejej')
        dNone.classList.remove('d-none')

        dVisible.classList.remove('visible')
        dVisible.classList.add('d-none')


        findMovies()





        // Laddar filmer från API
        async function loadMovies(searchTerm) {
            console.log(`här laddas movies igen tror jag ${searchTerm}`)
            const URL = `http://www.omdbapi.com/?s=${searchTerm}&apikey=33183ef7`
            const resp = await fetch(`${URL}`)
            const data = await resp.json()

            try {
                const resp = await fetch(URL);
                const data = await resp.json();

                if (data.Response === "True") {
                    displayMovieList(data.Search);
                } else {
                    console.log('No movies found. Please try a different search term.');
                    wrongSearchTerm()
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        }

        function wrongSearchTerm() {
            searchList.innerHTML = "";
            document.querySelector('.search-list').innerHTML = ""
            document.querySelector('#res').classList.add('d-none')
            document.querySelector('#wrap-list').classList.add('d-none')


            const errorMessage = document.querySelector('.wrapper-error-cont')
            errorMessage.innerHTML = `<section class="error-container">
                   <article class="error-container__text">
              
                      <h1>Sorry The movie you search for dont exist</h1>
                   </article> 
              
              
                </section> 
        `





            loadMovies()

        }



        function findMovies() {

            let searchTerm = (movieSearchBox.value).trim();
            console.log(searchTerm)
            if (searchTerm.length > 0) {
                searchList.classList.remove('hide-search-list');
                loadMovies(searchTerm);
            } else {
                searchList.classList.add('hide-search-list');
            }
        }



        //Display Movies
        function displayMovieList(movies) {
            console.log(`här är det movies ${movies}`)
            document.querySelector('#res').classList.add('d-none')

            resultGrid.innerHTML = ""


            searchList.innerHTML = "";
            for (let i = 0; i < movies.length; i++) {
                console.log(`i forloopen movies ${i}`)

                let movieListItem = document.createElement('div');
                movieListItem.dataset.id = movies[i].imdbID; // setting movie id in  data-id

                //let moviePoster = ""
                movieListItem.classList.add('search-list-item');
                if (movies[i].Poster != "N/A")
                    moviePoster = movies[i].Poster;
                else
                    moviePoster = "image_not_found.png";

                movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}" alt="medium movie poster">
        </div>
        <div class = "search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;

                //resultContainer.classList.remove('d-none')
                searchList.appendChild(movieListItem);


            }

            loadMovieDetails()
        }

        function loadMovieDetails() {
            const searchListMovies = searchList.querySelectorAll('.search-list-item');
            searchListMovies.forEach(movie => {
                movie.addEventListener('click', async () => {
                    // console.log(movie.dataset.id);

                    searchList.classList.add('hide-search-list');
                    movieSearchBox.value = "";
                    const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&tt3896198&apikey=33183ef7`);
                    const movieDetails = await result.json();
                    console.log(`nu är vi på moviedetails ${movieDetails}`)
                    displayMovieDetails(movieDetails);
                });
            });
        }

        function displayMovieDetails(details) {
            document.querySelector('#res').classList.remove('d-none')
            resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;


        }


    })
}