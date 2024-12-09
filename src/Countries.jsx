import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  
  const api = 'https://restcountries.com/v3.1/all';
  const filteredCountriesApi = `https://restcountries.com/v3.1/name/${search}`;

  // Fetching countries when the component loads or when search changes
  useEffect(() => {
    if (search.length > 0) {
      // Fetch countries based on search query
      fetch(filteredCountriesApi)
        .then((res) => res.json())
        .then((data) => setFilteredCountries(data))
        .catch((err) => {
          console.error("Error fetching countries:", err);
          // You can add additional error state handling if necessary
        });
    } else {
      // Fetch all countries if no search term
      fetch(api)
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((err) => {
          console.error("Error fetching countries:", err);
          // You can add additional error state handling if necessary
        });
    }
  }, [search]); // Dependency on search state

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
