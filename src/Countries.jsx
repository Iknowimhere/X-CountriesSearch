import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const api = 'https://restcountries.com/v3.1/all';
  // const filteredCountriesApi = `https://restcountries.com/v3.1/name/${search}`;


  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust debounce delay as needed
    return () => clearTimeout(timer);
  }, [search]);

  let filteredCountriesApi = `https://restcountries.com/v3.1/name/${debouncedSearch}`;
  useEffect(() => {
    if (search.length > 0) {
      // Fetch countries based on search query
      fetch(filteredCountriesApi)
        .then((res) => {
          if (!res.ok && !res.status === 200) {
            throw new Error("Network response was not ok");
          }
          return res.json()
        })
        .then((data) => {
            const matchedCountries = data.filter((country) =>
              country.name.common.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setFilteredCountries(matchedCountries); // Set the filtered countries
        })
        .catch((err) => {
          console.error("Error fetching countries:", err);
        });
    } else {
      fetch(api)
        .then((res) => {
          if (!res.ok && !res.status === 200) {
            throw new Error("Network response was not ok");
          }
          return res.json()
        })
        .then((data) => setCountries(data))
        .catch((err) => {
          console.error("Error fetching countries:", err);
        });
    }
  }, [debouncedSearch]); // Dependency on search state

  return (
    <div className='countries-container'>
      {/* Search input field */}
      <div className="search" style={{ margin: '2em 0', width: '100%', padding: '1em 0', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          style={{ width: '40%', padding: '1em' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search for Countries'
        />
      </div>

      {/* Displaying the countries or filtered countries */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1em',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {(filteredCountries.length > 0 ? filteredCountries : countries).map((country) => (
          <Country
            key={country.name.common}
            flag={country.flags.svg}
            name={country.name.common}
            abbr={country.cca2}
          />
        ))}
      </div>
    </div>
  );
};
