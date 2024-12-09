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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // Reduced debounce time for testing
    return () => clearTimeout(timer);
  }, [search]);
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Update fetch effect
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        if (debouncedSearch) {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${debouncedSearch}`
          );
          if (!response.ok) {
            setFilteredCountries([]);
            return;
          }
          const data = await response.json();
          setFilteredCountries(data);
        } else {
          const response = await fetch('https://restcountries.com/v3.1/all');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCountries(data);
          setFilteredCountries([]);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search for Countries'
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
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
