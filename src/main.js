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

const lazyloader = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const img = entry.target;
            const src = img.getAttribute('data-src');
            img.setAttribute('src',src);
            lazyloader.unobserve(img);
        }
    })
});
function createSectionMovies(container,movies,lazyload=false){
    container.innerHTML=''; 
    movies.forEach(movie=>{
        const movieContainer= document.createElement('div');
        const movieImg= document.createElement('Img');

        movieContainer.addEventListener('click',()=>{
            location.hash = `#movie=${movie.id}`;
        })
        
        movieContainer.classList.add('movie-container')
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazyload ? 'data-src': 'src', 'https://image.tmdb.org/t/p/w300'+movie.poster_path);
        
        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute('src','https://via.placeholder.com/300x450');
        })

        if(lazyload) lazyloader.observe(movieImg);
        
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
    createSectionMovies(trendingMoviesPreviewList,data.results,true);
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
    createSectionMovies(genericSection,data.results,true);
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

async function getMovieDetailById(id) {
    const {data,status} = await api(`movie/${id}`);
    const movieImgUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    movieDetailTitle.textContent=data.title;
    movieDetailDescription.textContent=data.overview;
    movieDetailScore.textContent=data.vote_average;
    headerSection.style.background =`linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;


    createSectionCategory(movieDetailCategoriesList,data.genres);
    getRelateById(id);
}

async function getRelateById(id) {
    const {data,status} = await api(`movie/${id}/recommendations`);


    createSectionMovies(relatedMoviesContainer,data.results);
}

