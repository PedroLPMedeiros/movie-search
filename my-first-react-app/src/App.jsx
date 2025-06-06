import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import {useDebounce} from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = ()=>{

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce( ()=> setDebouncedSearchTerm(searchTerm), 500, 
  [searchTerm]);

  const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');


  const endpoint = query
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`;

  try {
    const response = await fetch(endpoint, API_OPTIONS);

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();
    setMovieList(data.results || []);

  } catch (error) {
    console.error(`Error fetching movies ${error}`);
    setErrorMessage('Error fetching movies. Please try again later');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(()=> {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return(
    <>
      <main>
        <div className="pattern"/>
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={fetchMovies}/>
          </header>

          <section className="all-movies">
            <h2 className="mt-[35px]">All Movies</h2>

           {isLoading? (
            <Spinner/>
           ): errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
           ): (
            <ul>
              {movieList.map( (movie)=> (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
           )} 
          </section>
        </div>
      </main>
    </>
  )
}

export default App