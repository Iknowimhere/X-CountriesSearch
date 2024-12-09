import { useEffect, useState } from 'react';
import { Country } from './Country';

export const Countries = () => {
  let [countries, setCountries] = useState([]);
  let [search, setSearch] = useState('')
  let [filteredCountries, setFilteredCountries] = useState([])
  const [debouncedSearch, setDebouncedSearch] = useState('');
  let api = 'https://restcountries.com/v3.1/all';
  let filteredCountriesApi = `https://restcountries.com/v3.1/name/${search}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Adjust debounce delay as needed
    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {


    // Choose the appropriate URL based on the search term
    const url = debouncedSearch ? filteredCountriesApi : api;


    fetch(url)
      .then((res) => {
        if (!res.ok && !res.status === 200) {
          throw new Error('Network response was not ok');
        }
        return res.json()
      })
      .then((data) => {
        if (debouncedSearch) {
          const matchedCountries = data.filter((country) => country.name.common.toLowerCase().includes(debouncedSearch.toLowerCase()));
          setFilteredCountries(matchedCountries)
        } else {
          setCountries(data)
        }
      }).catch((err) => {
        console.log('Error fetching filtered Countries', err)
      })
  }, [debouncedSearch]);

  const countriesToDisplay = filteredCountries.length > 0 ? filteredCountries : countries;

  return (
    <div className='countries-container'>
      <div className="search" style={{ margin: '2em 0', width: '100%', padding: '1em 0', display: 'flex', justifyContent: 'center' }}>
        <input type="text" style={{ width: '40%', padding: '1em' }} name="" id="" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search for Countries' />
      </div>
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
        {countriesToDisplay?.map((country) => (
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
