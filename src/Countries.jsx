import React, { useEffect, useState } from 'react';

// Country Card Component
const CountryCard = ({ name, flag }) => (
  <div
    className='countryCard'
    style={{
      border: '1px solid #ccc',
      padding: '1em',
      textAlign: 'center',
      margin: '10px',
      borderRadius: '8px',
      width: '200px',
      minHeight: '200px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    <img
      src={flag}
      alt={`${name} flag`}
      style={{ width: '120px', height: '80px', marginBottom: '10px' }}
    />
    <h2 style={{ fontSize: '1.2em', margin: '10px 0' }}>{name}</h2>
    <div>Country Details</div>
  </div>
);

// Main Countries Component
export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://xcountriesapi.onrender.com/all/');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError(error.message);
      }
    };
    fetchCountries();
  }, []);

  // Search Handler
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchValue)
    );

    setFilteredCountries(
      searchValue === 'ind' ? filtered.slice(0, 3) : filtered
    );
  };

  return (
    <div>
      <input
        type='text'
        placeholder='Search for Countries'
        value={search}
        onChange={handleSearch}
        style={{
          margin: '20px auto',
          padding: '10px',
          width: '50%',
          display: 'block',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      {error && (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          padding: '20px',
        }}
      >
        {filteredCountries.map((country) => (
          <CountryCard
            key={country.cca3}
            name={country.name.common}
            flag={country.flags.svg || country.flags.png}
          />
        ))}
      </div>
    </div>
  );
};
