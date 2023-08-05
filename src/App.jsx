import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import React, { useState, useEffect } from 'react'
import { DataTable } from './components/DataTable'
import { useLocalStorage } from './hooks/UseLocalStorage'
import { useCountriesData } from './hooks/UserCountryData'
import { useColumnFilters } from './hooks/UseColumnFilters'
import { columnMetadata } from './constants'

const initialColumnsOrder = [
  { key: 'name', name: 'Name' },
  { key: 'alpha2Code', name: 'Code' },
  { key: 'capital', name: 'Capital' },
  { key: 'flag', name: 'Flag' }
]

export default function App() {
  const { countries, refreshData } = useCountriesData()
  const [filter, setFilter] = useLocalStorage('filter', '')
  const { filters, handleFilterChange, clearAllFilters } = useColumnFilters([
    'nameFilter',
    'alpha2CodeFilter',
    'capitalFilter'
  ])
  const [currentPage, setCurrentPage] = useLocalStorage('currentPage', 1)
  const [itemsPerPage, setItemsPerPage] = useLocalStorage('itemsPerPage', 10)
  const [columns, setColumns] = useState(initialColumnsOrder)

  const [refresh, setRefresh] = useState(false)

  const handleClear = () => {
    clearAllFilters('')
    setFilter('')
    setItemsPerPage(10)
    setCurrentPage(1)
    setColumns(initialColumnsOrder)
  }

  const handleFetchClick = () => {
    handleClear()
    setRefresh((prevState) => !prevState)
  }

  useEffect(() => {
    refreshData()
  }, [refreshData, refresh])

  const filteredData = countries.filter((country) => {
    const name = country.name.toLowerCase()
    const alpha2Code = country.alpha2Code.toLowerCase()
    const capital = country.capital?.toLowerCase()

    const isGeneralFilterPass =
      filter.length === 0 ||
      name.includes(filter.toLowerCase()) ||
      alpha2Code.includes(filter.toLowerCase()) ||
      (capital && capital.includes(filter.toLowerCase()))

    const isNameFilterPass =
      filters.nameFilter.value.length === 0 ||
      name.includes(filters.nameFilter.value.toLowerCase())

    const isAlpha2CodeFilterPass =
      filters.alpha2CodeFilter.value.length === 0 ||
      alpha2Code.includes(filters.alpha2CodeFilter.value.toLowerCase())

    const isCapitalFilterPass =
      !capital ||
      filters.capitalFilter.value.length === 0 ||
      capital.includes(filters.capitalFilter.value.toLowerCase())

    return (
      isGeneralFilterPass &&
      isNameFilterPass &&
      isAlpha2CodeFilterPass &&
      isCapitalFilterPass
    )
  })

  return (
    <div className='App'>
      <div className='app-title'>
        <h1>Add some features!</h1>
      </div>
      <div className='container'>
        <div className='row align-items-start'>
          <div className='col'>
            <input
              type='text'
              placeholder='Global search'
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className='col'>
            <button
              type='button'
              className='btn btn-dark'
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <div className='col'>
            <button
              type='button'
              className='btn btn-dark'
              onClick={handleFetchClick}
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className='row align-items-start'>
          <div className='col'>
            <DataTable
              data={filteredData}
              columnMetadata={columnMetadata}
              nameFilter={filters.nameFilter.value}
              alpha2CodeFilter={filters.alpha2CodeFilter.value}
              capitalFilter={filters.capitalFilter.value}
              nameFilterChange={handleFilterChange('nameFilter')}
              alpha2CodeFilterChange={handleFilterChange('alpha2CodeFilter')}
              capitalFilterChange={handleFilterChange('capitalFilter')}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              columns={columns}
              setColumns={setColumns}
            />
          </div>
        </div>
        <div className='col'>
          <div>Current page: {currentPage}</div>
        </div>
      </div>
    </div>
  )
}
