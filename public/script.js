console.log(apiKey)
const baseURL = 'https://www.omdbapi.com/';

// Global Variables
let mov1_idx
let mov2_idx
let mov1_score
let mov2_score
let cur_selected = 0
let score = 0
let all_movies

// Button Connections
const higherButton = document.querySelector('#higherBtn');
const lowerButton = document.querySelector('#lowerBtn');



const higherBtn = () => {
  update_score(1)
}

const lowerBtn = () => {
  update_score(0)
}

higherButton.addEventListener('click', higherBtn);
lowerButton.addEventListener('click', lowerBtn);

function update_score(higher) {
  const score_label = document.getElementById('chain_score');
  // Can Definately optimize this entire if tree
  if(higher){
    if (cur_selected == 0 && mov1_score > mov2_score){
      score = score + 1
      score_label.innerHTML = score
    }
    else if(cur_selected == 0){
      score = 0
      score_label.innerHTML = score
    }
    else if (cur_selected == 1 && mov2_score > mov1_score){
      score = score + 1
      score_label.innerHTML = score
    }
    else {
      score = 0
      score_label.innerHTML = score
    }
  }
  else{
    if (cur_selected == 0 && mov1_score > mov2_score){
      score = 0
      score_label.innerHTML = score
    }
    else if(cur_selected == 0){
      score = score + 1
      score_label.innerHTML = score
    }
    else if (cur_selected == 1 && mov2_score > mov1_score){
      score = 0
      score_label.innerHTML = score
    }
    else {
      score = score + 1
      score_label.innerHTML = score
    }
  }


}


const getMovie = (year) => {
  const url = `${baseURL}?apikey=${apiKey}&type=movie&y=${year}&s=*&plot=full`;
  console.log(url)
  // return fetch(url).then(response => response.json());
  fetch(url)
	  .then(response => response.json())
	  console.log(data)
	  .then(data => {
	    const topTen = data.Search.slice(0, 10);
	    const movieIndex = Math.floor(Math.random() * topTen.length);
	    const movieId = topTen[movieIndex].imdbID;
	    const posterUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`;
	    fetch(posterUrl)
	      .then(response => response.json())
	      .then(data => {
	        const poster = data.Poster;
	        document.getElementById('movie1').setAttribute('src', poster);
	        document.getElementById('label1').textContent = data.Title;
	      });
	  })
	  .catch(error => console.log(error));
};

async function getMovieList() {
  const response = await fetch('movies.txt');
  const data = await response.text();
  const movies = data.split('\n');
  return movies;
}

const getRandomYear = () => {
  const years = ['2022'];
  const index = Math.floor(Math.random() * years.length);
  return years[index];
};

const getTwoMovies = async () => {
  const years = [getRandomYear(), getRandomYear()];
  const [movie1] = await Promise.all([
    getMovie(years[0]),
  ]);
  return [movie1];
};

const generateImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

// const displayMovies = async () => {
//   const [movie1] = await getTwoMovies();

//   const placeholder1 = document.getElementById('placeholder1');
//   const placeholder2 = document.getElementById('placeholder2');

//   console.log(movie1)
//   //console.log(movie2)
//   const image1 = generateImage(movie1.Poster);
//   //const image2 = generateImage(movie2.Poster);

//   placeholder1.innerHTML = '';
//   placeholder2.innerHTML = '';

//   placeholder1.appendChild(image1);
//   //placeholder2.appendChild(image2);

//   const label1 = document.getElementById('label1');
//   //const label2 = document.getElementById('label2');

//   label1.innerHTML = movie1.Title;
//   //label2.innerHTML = movie2.Title;
// };

async function getMovieData(title) {
  console.log(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`)
  const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`);
  const data = await response.json();
  //const poster = data.Poster;
  return data;
}

const dispMovies = async () => {
	getMovieList().then(movies => {
    all_movies = movies
		mov_len = movies.length - 1
		const placeholder1 = document.getElementById('placeholder1');
  		const placeholder2 = document.getElementById('placeholder2');
  		const label1 = document.getElementById('label1');
  		const label2 = document.getElementById('label2');
  		const description1 = document.getElementById('description1');
  		const description2 = document.getElementById('description2');
  		const bar1 = document.getElementById('bar1');
  		const bar2 = document.getElementById('bar2');

  		// Do something with the movies array
  		rand1 = Math.floor(Math.random() * mov_len);
  		rand2 = Math.floor(Math.random() * mov_len);
  		while(rand1 == rand2){
  			rand2 = Math.floor(Math.random() * mov_len);
  		}
  		mov1_idx = rand1
      mov2_idx = rand2
  		// console.log(rand1)
    // 	console.log(movies[rand1])
    // 	console.log(rand2)
    // 	console.log(movies[rand2])
    // 	console.log(movies)

    	getMovieData(movies[rand1]).then(data => {
    		console.log(data)
  			//console.log(data.Poster);
  			const image1 = generateImage(data.Poster);
  			placeholder1.innerHTML = '';
  			label1.innerHTML = data.Title;
  			//console.log(data.Ratings[1])
  			description1.innerHTML = data.Ratings[1]["Value"]
        rating_int = parseInt(data.Ratings[1]["Value"])
        mov1_score = rating_int
  			placeholder1.appendChild(image1);
        console.log("Movie 1 Rating:")
        console.log(Math.round( rating_int * 445 / 100 ) - 445 + "px")
        bar1.style.height = Math.round( rating_int * 445 / 100 ) + "px"
        bar1.style.bottom = Math.round( rating_int * 445 / 100 ) - 445 + "px"
        console.log("% value: " + Math.round( rating_int * 445 / 100 ))
		});

		getMovieData(movies[rand2]).then(data => {
			console.log(data)
  			//console.log(data.Poster);
  			const image2 = generateImage(data.Poster);
  			placeholder2.innerHTML = '';
  			label2.innerHTML = data.Title;
  			//console.log(data.Ratings[1]["Value"])
        description2.innerHTML = "";
  			// description2.innerHTML = data.Ratings[1]["Value"]
        rating_int = parseInt(data.Ratings[1]["Value"])
        mov2_score = rating_int
        bar2.style.height = "0px"
        bar2.style.bottom = "-445px"
     //    bar2.style.height = Math.round( rating_int * 445 / 100 ) + "px"
     //    bar2.style.bottom = Math.round( rating_int * 445 / 100 ) - 445 + "px"
  			placeholder2.appendChild(image2);
		});
  		
	});
}

dispMovies();