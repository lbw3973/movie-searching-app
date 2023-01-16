const mainIconEl = document.querySelector('.main-icon')
const inputEl = document.querySelector('input')
const buttonEl = document.querySelector('button#btnSearch')
const moviesEl = document.querySelector('ul.movies')
const counterEl = document.querySelector('.counter')
const toTopEl = document.querySelector('#to-top');
const selectEl = document.querySelector('#select-year')
const curYear = new Date().getFullYear()
const detailEl = document.querySelector('.detail')
const dialogEl = detailEl.querySelector('.dialog')
const dlgImageEl = dialogEl.querySelector('.movie-image')
const dlgInfoEl = dialogEl.querySelector('.movie-info')
const btnCloseEl = document.querySelector('#btnClose')

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
    btnSearch.click()
  }
})

buttonEl.addEventListener('click', async function () {
  initialize()
  searchText = inputEl.value
  searchYear = selectEl.value

  if(searchText.length < 3){
    alert("Please enter at least 3 characters")
    return
  }

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
    showMovieDialog()
  }
}


const getMovies = async (title, year = '', page = 1) => {
  const s = `&s=${title}`
  const y = year === 'all' ? '' : `&y=${year}`
  const p = `&page=${page}`
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${s}${y}${p}`)
  const json = await res.json()
  let moviess = json.Search

  if(json.Response === "True"){
    return moviess
  }
  return null
  
}

const renderMovies = (movies, isFirst) => {
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


const showMovieDialog = () => {
  const movies = moviesEl.querySelectorAll('li')

  movies.forEach(x => x.addEventListener('click', () => {
    const movieId = x.dataset.id
    
    // dialog 띄었을 때, Scroll Lock
    document.getElementsByTagName('body')[0].classList.add('scroll-lock')

    detailEl.style.display = 'block'
    dialogEl.style.backgroundImage = `url(../images/loading.gif)`
    dialogEl.style.backgroundPosition = 'center'
    dialogEl.style.backgroundRepeat = 'no-repeat'

    getMovieInfo(movieId)
  }))
}

const getMovieInfo = async (id) => {
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
  const json = await res.json()
  console.log(json)

  if (json.Response === 'True') {
    setMovieInfo(json)
  }
  return json.Error
}

const setMovieInfo = (movie) => {
  if(dlgInfoEl.querySelector('li'))
    return

  
  const liEl = document.createElement('li')
  const title = document.createElement('h2')
  const country = document.createElement('div')
  const director = document.createElement('div')
  const actor = document.createElement('div')
  const metaScore = document.createElement('div')
  const genre = document.createElement('div')

  title.textContent = movie.Title
  country.textContent = movie.Country
  director.textContent = movie.Director
  actor.textContent = movie.Actors
  metaScore.textContent = movie.Metascore
  genre.textContent = movie.Genre

  title.classList.add('title')
  country.classList.add('country')
  director.classList.add('director')
  actor.classList.add('actor')
  metaScore.classList.add('metascore')
  genre.classList.add('boxoffice')

  // const img = movie.Poster === 'N/A' ? `url(../images/no-iamge.webp)` : movie.Poster.replace('X300', 'X500')
  // dlgImageEl.style.backgroundImage = `url(${img})`
  dlgImageEl.style.backgroundImage = movie.Poster === 'N/A' ? `url(../images/no-image.webp)` : `url(${movie.Poster})`
  dlgImageEl.style.backgroundPosition = 'center'
  dlgImageEl.style.backgroundRepeat = 'no-repeat'
  dialogEl.style.backgroundImage = 'none'

  liEl.append(title)
  liEl.append(country)
  liEl.append(director)
  liEl.append(actor)
  liEl.append(metaScore)
  liEl.append(genre)

  dlgInfoEl.append(liEl)
}

// dialog 닫는 동작 2가지
detailEl.addEventListener('click', (e) => {
  if(e.target.className === 'detail'){
    dlgMovieInfoReset()
  }
})
window.addEventListener('keyup', (e) => {
  if(e.key === 'Escape'){
    dlgMovieInfoReset()
  }
})
btnCloseEl.addEventListener('click', () => {
  dlgMovieInfoReset()
})
const dlgMovieInfoReset = () => {
  detailEl.style.display = 'none'
  dlgImageEl.style.backgroundImage = ''
  dlgInfoEl.innerHTML = ''
  document.getElementsByTagName('body')[0].classList.remove('scroll-lock')
}


// 초기화
const initialize = () => {
  pageNumber = 1
  moviesEl.innerHTML = ''
  counterEl.innerHTML = ''
}
mainIconEl.addEventListener('click', () => {
  initialize()
  inputEl.value = ''
})

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
