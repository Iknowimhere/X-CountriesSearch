import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Debounce for user input
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        let response;
        if (debouncedSearch) {
          response = await fetch(
            `https://restcountries.com/v3.1/name/${debouncedSearch}`
          );
          if (response.ok) {
            const data = await response.json();
            setFilteredCountries(data.slice(0, 3)); // Limit to 3 results
          } else {
            setFilteredCountries([]);
          }
        } else {
          response = await fetch('https://restcountries.com/v3.1/all');
          if (response.ok) {
            const data = await response.json();
            setCountries(data);
            setFilteredCountries(data); // Display all countries by default
          } else {
            throw new Error('Failed to fetch countries');
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err.message);
        setFilteredCountries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [debouncedSearch]);

  return (
    <div className='countries-container'>
      <div
        className='search'
        style={{
          margin: '2em 0',
          width: '100%',
          padding: '1em 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <input
          type='text'
          style={{ width: '40%', padding: '1em' }}
          value={search}
          onChange={handleSearch}
          placeholder='Search for Countries'
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1em',
            padding: '1em',
          }}
        >
          {(filteredCountries.length > 0 ? filteredCountries : countries).map(
            (country) => (
              <Country
                key={country.cca2}
                flag={country.flags.svg}
                name={country.name.common}
                abbr={country.cca2}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};
