//DATA
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});
function likedMoviesList(){
  const item = JSON.parse(localStorage.getItem('likedMovies'));
  let movies;

  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  
  return movies;
}

function likeMovie(movie) {

  const likedMovies = likedMoviesList();
  
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
}

//utils

const lazyloader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute("data-src");
      img.setAttribute("src", src);
      lazyloader.unobserve(img);
    }
  });
});
function createSectionMovies(
  container,
  movies,
  { lazyload = false, clean = true }
) {
  if (clean) {
    container.innerHTML = "";
  }
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    const movieImg = document.createElement("Img");

    

    movieContainer.classList.add("movie-container");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyload ? "data-src" : "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );
    movieImg.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    movieImg.addEventListener("error", () => {
      movieImg.setAttribute("src", "https://via.placeholder.com/300x450");
    });

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      //agregar a localstorage peliculas 
      likeMovie(movie);
      getLikedMovies();
    }
      )
    if (lazyload) lazyloader.observe(movieImg);

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}
function createSectionCategory(container, categories) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    const categoryTitle = document.createElement("h3");
    const categoryTitleText = document.createTextNode(category.name);

    categoryContainer.classList.add("category-container");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//calls APIS
async function getTrendingMoviesPreview() {
  const { data, status } = await api("trending/movie/day");
  createSectionMovies(trendingMoviesPreviewList, data.results, true);
}

async function getCategoriesPreviw() {
  const { data, status } = await api("genre/movie/list");
  createSectionCategory(categoriesPreviewList, data.genres);
}

async function getMoviesByCategory(id) {
  const { data, status } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  maxPage = data.total_pages;
  createSectionMovies(genericSection, data.results, {
    lazyload: true,
    clean: true,
  });
}

function getPagMoviesByCategory(id) {
  return async function () {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    const scrollBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const isNotmaxPage = page < maxPage;
    if (scrollBottom && isNotmaxPage) {
      page++;
      const { data, status } = await api("discover/movie", {
        params: {
          with_genres: id,
          page,
        },
      });
      createSectionMovies(genericSection, data.results, { clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data, status } = await api("search/movie", {
    params: {
      query,
    },
  });
  maxPage = data.total_pages;
  createSectionMovies(genericSection, data.results, {
    lazyload: true,
    clean: true,
  });
}

function getPagMoviesBySearch(query) {
  return async function () {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    const scrollBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const isNotmaxPage = page < maxPage;
    if (scrollBottom && isNotmaxPage) {
      page++;
      const { data, status } = await api("search/movie", {
        params: {
          query: query,
          page,
        },
      });
      createSectionMovies(genericSection, data.results, { clean: false });
    }
  };
}

async function getTrendingMovies() {
  const { data, status } = await api("trending/movie/day");
  createSectionMovies(genericSection, data.results, {
    lazyload: true,
    clean: true,
  });

  maxPage = data.total_pages;
  // const btnLoadmore = document.createElement('button');
  // btnLoadmore.innerHTML = 'Load more';
  // btnLoadmore.addEventListener('click',getPaginatedMoviesBySearch);
  // genericSection.appendChild(btnLoadmore);
}

async function getPagTrendMovies() {
  const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
  const scrollBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const isNotmaxPage = page < maxPage;
  if (scrollBottom && isNotmaxPage) {
    page++;
    const { data, status } = await api("trending/movie/day", {
      params: {
        page,
      },
    });
    createSectionMovies(genericSection, data.results, { clean: false });
  }
  // const btnLoadmore = document.createElement('button');
  // btnLoadmore.innerHTML = 'Load more';
  // btnLoadmore.addEventListener('click',getPaginatedMoviesBySearch);
  // genericSection.appendChild(btnLoadmore)
}

async function getMovieDetailById(id) {
  const { data, status } = await api(`movie/${id}`);
  const movieImgUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  movieDetailTitle.textContent = data.title;
  movieDetailDescription.textContent = data.overview;
  movieDetailScore.textContent = data.vote_average;
  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;

  createSectionCategory(movieDetailCategoriesList, data.genres);
  getRelateById(id);
}

async function getRelateById(id) {
  const { data, status } = await api(`movie/${id}/recommendations`);

  createSectionMovies(relatedMoviesContainer, data.results);
}

 function getLikedMovies() {
  const likedMovies = likedMoviesList();
  if (Object.entries(likedMovies).length === 0 && location.hash === '') {
    likedMoviesSection.classList.add('inactive');
  }
  else {
    if (location.hash === '') {
      likedMoviesSection.classList.remove('inactive');
    }
  }
  const moviesArray = Object.values(likedMovies);
  createSectionMovies(likedMoviesListArticle, moviesArray, {lazyload: false, clean: true});
}