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
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        if (debouncedSearch) {
          const response = await fetch(`https://restcountries.com/v3.1/name/${debouncedSearch}`);
          if (!response.ok) {
            setFilteredCountries([]);
            throw new Error('No countries found');
          }
          const data = await response.json();
          const matchedCountries = data.filter(country =>
            country.name.common.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
          setFilteredCountries(matchedCountries);
        } else {
          const response = await fetch(api);
          if (!response.ok) {
            throw new Error('Failed to fetch countries');
          }
          const data = await response.json();
          setCountries(data);
          setFilteredCountries([]);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err.message);
      }
    };

    fetchCountries();
  }, [debouncedSearch]);

  const displayedCountries = filteredCountries.length > 0 ? filteredCountries : countries;

  return (
    <div className='countries-container'>
      <div className="search" style={{ 
        margin: '2em 0', 
        width: '100%', 
        padding: '1em 0', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <input
          type="text"
          style={{ width: '40%', padding: '1em' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search for Countries'
        />
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1em',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {displayedCountries.map((country) => (
          <Country
            key={country.name.common}
            flag={country.flags.svg}
            name={country.name.common}
            abbr={country.cca2}
          />
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
