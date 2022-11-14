import React, { useState } from 'react';
// import './Pagination.scss';
import './Pagination.css';
const Pagination = ({ numberOfPages, currentPage, setCurrentPage, pageLimit }) => {
  const pageNumbers = [];
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i);
  }

  const goToNextPage = () => {
    if (currentPage != numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const goToPreviousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <div className="pagination">
      {/* previous button */}
      <button
        onClick={goToPreviousPage}
        className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
      >
        prev
      </button>

      {/* show page numbers */}
      {getPaginationGroup().map((item, index) => (
        <button
          key={index}
          onClick={changePage}
          className={`paginationItem ${currentPage === item ? 'active' : null}`}
        >
          <span>{item}</span>
        </button>
      ))}

      {/* next button */}
      <button
        onClick={goToNextPage}
        className={`next ${currentPage === numberOfPages ? 'disabled' : ''}`}
      >
        next
      </button>
    </div>
  );
}

export default Pagination;