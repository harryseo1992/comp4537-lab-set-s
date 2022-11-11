import React from 'react';

const Pagination = ({ numberOfPages, currentPage, setCurrentPage }) => {

  const pageNumbers = [...Array(numberOfPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage != numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className='page-item'>
          <a className='page-link'
             onClick={prevPage}
             href='#'
          >
            Previous
          </a>
        </li>
        {pageNumbers.map(pageNumber => {
          <li key={pageNumber}
              className= {`page-item ${currentPage == pageNumber ? 'active' : ''} `}
          >
            <a onClick={() => setCurrentPage(pageNumber)}
               className='page-link'
               href='#'
            >
              {pageNumber}
            </a>
          </li>
        })}
        <li className='pageitem'>
          <a className='page-link'
             onClick={nextPage}
             href='#'
          >
            next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;