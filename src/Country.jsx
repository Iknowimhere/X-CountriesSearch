export const Country = ({ flag, name, abbr }) => {
  return (
    <div
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
      className="countryCard"
    >
      <img src={flag} alt={abbr} height={100} width={100} />
      <h2>{name}</h2>
    </div>
  );
};
