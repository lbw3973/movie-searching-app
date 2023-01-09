const inputEl = document.querySelector('input')
const buttonEl = document.querySelector('button#btnSearch')
const moviesEl = document.querySelector('ul.movies')
const counterEl = document.querySelector('.counter')
const toTopEl = document.querySelector('#to-top');

let searchText = ''
let pageNumber = 1

inputEl.addEventListener("keyup", function (event) {
  if(event.key === 'Enter'){
    event.preventDefault()
    document.getElementById('btnSearch').click()
  }
})

buttonEl.addEventListener('click', async function () {
  searchText = inputEl.value
  if(searchText.length < 3){
    alert("Please enter at least 3 characters")
    return
  }
  pageNumber = 1
  moviesEl.innerHTML = ''

  const movies = await getMovies(searchText,'', pageNumber)
  await getCountMovies(searchText)

  if(movies != null){
    renderMovies(movies, true)
  }
})

const getCountMovies = async (title, year = '') => {
  if(!document.querySelector('.movieCounter')){
    let divEl = document.createElement('div')
    divEl.classList.add('movieCounter')
    document.querySelector('section .counter').append(divEl)
  }

  const countEl = document.querySelector('.movieCounter')
  const s = `&s=${title}`
  const y = `&y=${year}`

  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${s}${y}`)
  const json = await res.json()

  if(json.Response === 'True'){
    countEl.innerHTML = `There are ${json.totalResults} movies searched`
  }else{
    countEl.innerHTML = 'Movie Not Found!!'
  }

  counterEl.append(countEl)
}

const viewmore = async () => {
  const movies = await getMovies(searchText, '', ++pageNumber)
  if(movies != null){
    renderMovies(movies, false)
  }
}

let moviess = []
async function getMovies(title, year = '', page = 1) {
  const s = `&s=${title}`
  const y = `&y=${year}`
  const p = `&page=${page}`
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${s}${y}${p}`)
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
    const posterEl = document.createElement('a')
    const imgEl = document.createElement('div')
    const infoEl = document.createElement('div')
    const titleEl = document.createElement('span')
    const yearEl = document.createElement('span')

    infoEl.append(titleEl)
    infoEl.append(yearEl)
    posterEl.append(imgEl)
    posterEl.append(infoEl)

    liEl.classList.add('list')
    titleEl.classList.add('title')
    titleEl.textContent = movie.Title
    infoEl.classList.add('info')
    yearEl.classList.add('year')
    yearEl.textContent = movie.Year
    imgEl.classList.add('poster')
    imgEl.style.backgroundImage = movie.Poster === 'N/A' ? `url(../images/no-image.webp)` : `url(${movie.Poster})`
    imgEl.style.backgroundPosition = 'center'

    liEl.append(posterEl)

    return liEl
  })
  moviesEl.append(...movieEls)
}
window.addEventListener('scroll', function() {
  if(window.scrollY >= document.documentElement.scrollHeight - window.innerHeight){
    if(document.querySelector('.movies > li')){
      viewmore()
    }
  }
})



// to-top 버튼
window.addEventListener('scroll', _.throttle(function(){
  if(window.scrollY > 500){
    gsap.to(toTopEl, 0, {
      x: -132
    });
  }
  else{
    gsap.to(toTopEl, 0, {
      x: 100
    });
  }
}, 300));

toTopEl.addEventListener('click', function () {
  gsap.to(window, .7, {
    scrollTo: 0
  });
});
