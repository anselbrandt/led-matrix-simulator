import React from 'react';

export default function Debug(props) {
  const keys = Object.keys(props);
  const values = Object.values(props);
  return (
    <React.Fragment>
      {keys.map((key, index) => (
        <div>{`${key}: ${values[index].toString()}`}</div>
      ))}
    </React.Fragment>
  );
}
