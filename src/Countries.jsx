import React, { useEffect, useState } from 'react';

const CountryCard = ({ name, flag }) => (
  <div
    className='countryCard'
    style={{ border: '1px solid #ccc', padding: '1em', textAlign: 'center' }}
  >
    <img
      src={flag}
      alt={`${name} flag`}
      style={{ width: '100px', height: 'auto' }}
    />
    <h3>{name}</h3>
  </div>
);

export const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data); // Initially display all countries
      } catch (error) {
        console.error('Error fetching countries:', error);
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
      setFilteredCountries(filtered.slice(0, 3)); // Show max 3 results
    } else {
      setFilteredCountries(countries); // Show all countries if search is cleared
    }
  };

  return (
    <div>
      <input
        type='text'
        placeholder='Search for Countries'
        value={search}
        onChange={handleSearch}
        style={{
          margin: '1em auto',
          padding: '0.5em',
          width: '50%',
          display: 'block',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1em',
          marginTop: '1em',
        }}
      >
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
