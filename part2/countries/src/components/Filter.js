import React from 'react';

const Filter = ({ filterText, filterHandler }) => {
  return (
    <>
      <div>Find countries <input type='text' onChange={filterHandler} value={filterText} /></div>
    </>
  );
};

export default Filter;