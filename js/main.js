const inputEl = document.querySelector('input')
const buttonEl = document.querySelector('button#btnSearch')
const moviesEl = document.querySelector('ul.movies')
const viewMoreEl = document.querySelector('.view-more')

let searchText = ''

inputEl.addEventListener('input', function () {
  searchText = inputEl.value
})
inputEl.addEventListener("keyup", function (event) {
  if(event.key === 'Enter'){
    event.preventDefault()
    document.getElementById('btnSearch').click()
  }
})

buttonEl.addEventListener('click', async function () {
  moviesEl.innerHTML = ''
  const movies = await getMovies()
  if(movies != null){
    renderMovies(movies, true)
  }
})

viewMoreEl.addEventListener('click', async function() {
  const movies = await getMovies()
  if(movies != null){
    renderMovies(movies, false)
  }
})

let moviess = []
async function getMovies() {
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${searchText}`)
  const json = await res.json()
  console.log(json)
  moviess = json.Search

  if(json.Response === "True"){
    return moviess
  }
  return null
  
}
function renderMovies(movies, isFirst) {
  const movieEls = movies.map(function (movie) {
    const liEl = document.createElement('li')
    const titleEl = document.createElement('h2')
    const posterEl = document.createElement('img')

    titleEl.textContent = movie.Title
    posterEl.src = movie.Poster

    liEl.append(titleEl, posterEl)

    return liEl
  })
  moviesEl.append(...movieEls)
}