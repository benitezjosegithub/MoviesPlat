const api = axios.create({
    baseURL :'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'api_key':API_KEY
    }
});

//utils
function createSectionMovies(container,movies){
    container.innerHTML=''; 
    movies.forEach(movie=>{
        const movieContainer= document.createElement('div');
        const movieImg= document.createElement('Img');
        
        movieContainer.classList.add('movie-container')
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300'+movie.poster_path);
        
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    })
}
function createSectionCategory(container,categories){
    container.innerHTML='';
    
    categories.forEach(category=>{
        const categoryContainer= document.createElement('div');
        const categoryTitle= document.createElement('h3');
        const categoryTitleText=document.createTextNode(category.name);

        categoryContainer.classList.add('category-container')
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);
        categoryTitle.addEventListener('click',()=>{
            location.hash = `#category=${category.id}-${category.name}`;
        });

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })
}


//calls APIS
async function getTrendingMoviesPreview() {
    const {data,status} = await api('trending/movie/day');
    createSectionMovies(trendingMoviesPreviewList,data.results);
}

async function getCategoriesPreviw() {
    const {data,status} = await api('genre/movie/list');
    createSectionCategory(categoriesPreviewList,data.genres);
}

async function getMoviesByCategory(id) {
    const {data,status} = await api('discover/movie',{
        params: {
            with_genres:id
        }
    });
    createSectionMovies(genericSection,data.results)
}

async function getMoviesBySearch(query) {
    const {data,status} = await api('search/movie',{
        params: {
            query:query
        }
    });
    createSectionMovies(genericSection,data.results)
}

async function getTrendingMovies() {
    const {data,status} = await api('trending/movie/day');
    createSectionMovies(genericSection,data.results);
}
