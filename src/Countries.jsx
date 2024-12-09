import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const api = 'https://restcountries.com/v3.1/all';

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch countries
  // Update the useEffect for API calls
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        if (debouncedSearch) {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${debouncedSearch}`
          );
          const data = await response.json();
          if (response.ok) {
            const matchedCountries = data.filter((country) =>
              country.name.common
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase())
            );
            setFilteredCountries(matchedCountries);
          } else {
            setFilteredCountries([]);
          }
        } else {
          const response = await fetch(api);
          const data = await response.json();
          if (response.ok) {
            setCountries(data);
            setFilteredCountries([]);
          }
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setFilteredCountries([]);
      }
    };

    fetchCountries();
  }, [debouncedSearch]);

  const displayedCountries = search ? filteredCountries : countries;

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
