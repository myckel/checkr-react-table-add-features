import React from 'react'
import { ITEMS_PER_PAGE_OPTIONS } from '../constants'

export const Pagination = ({
  itemsPerPage,
  totalItems,
  handlePageChange,
  currentPage
}) => {
  const pageNumbers = []
  const pageCount = Math.ceil(totalItems / itemsPerPage)

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav aria-label='Page navigation example'>
      <ul className='pagination'>
        <li className='page-item'>
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className='page-link'
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className='page-item'>
            <button
              className='page-link'
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li className='page-item'>
          <button
            onClick={() =>
              currentPage < pageCount && handlePageChange(currentPage + 1)
            }
            className='page-link'
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export const SelectItemsPerPage = ({ itemsPerPage, setItemsPerPage }) => {
  return (
    <select
      value={itemsPerPage}
      onChange={(e) => setItemsPerPage(Number(e.target.value))}
    >
      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
