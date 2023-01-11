const inputEl = document.querySelector('input')
const buttonEl = document.querySelector('button#btnSearch')
const moviesEl = document.querySelector('ul.movies')
const counterEl = document.querySelector('.counter')
const toTopEl = document.querySelector('#to-top');
const selectEl = document.querySelector('#select-year')
const curYear = new Date().getFullYear()
const detailEl = document.querySelector('.dialog')

let searchText = ''
let pageNumber = 1
let searchYear

for(let i = curYear; i >= curYear - 50; --i){
  let selectYear = document.createElement('option')
  selectYear.classList.add('option')
  selectYear.innerHTML = i
  selectYear.value = i
  selectEl.appendChild(selectYear)
}

inputEl.addEventListener("keyup", function (event) {
  if(event.key === 'Enter'){
    event.preventDefault()
    btnSearch.click()
  }
})

buttonEl.addEventListener('click', async function () {
  searchText = inputEl.value
  searchYear = selectEl.value
  if(searchText.length < 3){
    alert("Please enter at least 3 characters")
    return
  }
  pageNumber = 1
  moviesEl.innerHTML = ''

  const movies = await getMovies(searchText, searchYear, pageNumber)
  await getCountMovies(searchText, searchYear)

  if(movies != null){
    renderMovies(movies, true)
    showMovieDialog()
  }
})

const getCountMovies = async (title, year = '') => {
  // movieCounter가 이미 만들어져 있으면 다시 생성하지 않는다
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
  const movies = await getMovies(searchText, searchYear, ++pageNumber)
  if(movies != null){
    renderMovies(movies, false)
  }
}


async function getMovies(title, year = '', page = 1) {
  const s = `&s=${title}`
  const y = year === 'all' ? '' : `&y=${year}`
  const p = `&page=${page}`
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${s}${y}${p}`)
  const json = await res.json()
  console.log(json)
  let moviess = json.Search

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
    liEl.dataset.id = movie.imdbID
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

// 무한 스크롤
window.addEventListener('scroll', function() {
  if(window.scrollY >= document.documentElement.scrollHeight - window.innerHeight){
    if(document.querySelector('.movies > li')){
      viewmore()
    }
  }
})

function showMovieDialog() {
  const movies = moviesEl.querySelectorAll('li')

  movies.forEach(x => x.addEventListener('click', (event) => {
    const movieId = x.dataset.id

    getMovieInfo(movieId)
  }))
}

async function getMovieInfo(id) {
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
  const json = await res.json()

  if (json.Response === 'True') {
    // return json
    setMovieInfo(json)
  }
  return json.Error
}

function setMovieInfo(movie) {
  detailEl.style.display = 'block'
  detailEl.innerHTML = 'asdwqdqwasdasdwqwqdd'
}



// to-top 버튼
window.addEventListener('scroll', _.throttle(function() {
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
