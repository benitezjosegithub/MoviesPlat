const api = axios.create({
    baseURL :'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'api_key':API_KEY
    }
});


async function getTrendingMoviesPreview() {
    const {data,status} = await api('trending/movie/day');
    const movies = data.results;

    movies.forEach(movie=>{
        const trendingPevMovContainer= trendingMoviesPreviewList;
        const movieContainer= document.createElement('div');
        const movieImg= document.createElement('Img');
        
        movieContainer.classList.add('movie-container')
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300'+movie.poster_path);
        
        movieContainer.appendChild(movieImg);
        trendingPevMovContainer.appendChild(movieContainer);
    })
    console.log({data,movies});
}

async function getCategoriesPreviw() {
    const {data,status} = await api('genre/movie/list');
    const categories = data.genres;
    categories.forEach(category=>{
        const prevCatContainer = categoriesPreviewList;
        const categoryContainer= document.createElement('div');
        const categoryTitle= document.createElement('h3');
        const categoryTitleText=document.createTextNode(category.name);

        categoryContainer.classList.add('category-container')
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        prevCatContainer.appendChild(categoryContainer);
    })
}