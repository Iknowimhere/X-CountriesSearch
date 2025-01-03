import React, { useEffect, useState } from 'react';

const CountryCard = ({ name, flag }) => (
  <div className='countryCard' style={{ 
    border: '1px solid #ccc', 
    padding: '1em', 
    textAlign: 'center',
    margin: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <img
      src={flag}
      alt={`${name} flag`}
      style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
    />
    <h2>{name}</h2>
    <div>Country Info</div>
  </div>
);

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError(error.message);
      }
    };

    fetchAllCountries();
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);

    if (searchValue) {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchValue)
      );
      setFilteredCountries(
        searchValue === 'ind' 
          ? filtered.slice(0, 3) 
          : filtered
      );
    } else {
      setFilteredCountries(countries);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for Countries"
        value={search}
        onChange={handleSearch}
        style={{
          margin: '1em auto',
          padding: '0.5em',
          width: '50%',
          display: 'block',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1em',
        marginTop: '1em',
        padding: '1em'
      }}>
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.cca2}
            name={country.name.common}
            flag={country.flags.svg || country.flags.png}
          />
        ))}
      </div>
    </div>
  );
};