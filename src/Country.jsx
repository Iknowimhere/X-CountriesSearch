export const Country = ({ flag, name, abbr }) => {
  return (
    <div
      className="countryCard"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '1em',
        gap: '1em',
        border: '1px solid grey',
        borderRadius: '1em',
        height: '200px',
        width: '200px',
      }}
      data-country={name}
    >
      <img 
        src={flag} 
        alt={`Flag of ${name}`} 
        height={100} 
        width={100} 
      />
      <h2>{name}</h2>
    </div>
  );
};
