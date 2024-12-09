import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState(null);

  const api = 'https://restcountries.com/v3.1/all';

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        if (debouncedSearch) {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${debouncedSearch}`
          );
          if (response.status === 200) {
            const data = await response.json();
            const matchedCountries = data.filter((country) =>
              country.name.common
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase())
            );
            setFilteredCountries(matchedCountries);
            setError(null);
          } else {
            setFilteredCountries([]);
            setError('No countries found');
          }
        } else {
          const response = await fetch(api);
          if (response.status === 200) {
            const data = await response.json();
            setCountries(data);
            setFilteredCountries([]);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Error fetching countries');
      }
    };

    fetchCountries();
  }, [debouncedSearch]);

  const displayedCountries =
    filteredCountries.length > 0 ? filteredCountries : countries;

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
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search for Countries'
          data-testid='country-search'
        />
      </div>

      {error && (
        <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
      )}

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
        {displayedCountries.map((country) => (
          <Country
            key={country.cca2}
            flag={country.flags.svg}
            name={country.name.common}
            abbr={country.cca2}
          />
        ))}
      </div>
    </div>
  );
};
