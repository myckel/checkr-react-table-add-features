import { useLocalStorage } from './UseLocalStorage'

export const useColumnFilters = (initialFilters) => {
  const [storedFilters, setStoredFilters] = useLocalStorage(
    'filters',
    initialFilters
  )

  const filters = {}
  Object.keys(storedFilters).forEach((filterName) => {
    const filterValue = storedFilters[filterName]
    const setFilterValue = (newValue) => {
      setStoredFilters({
        ...storedFilters,
        [filterName]: newValue
      })
    }

    filters[filterName] = { value: filterValue, setter: setFilterValue }
  })

  const handleFilterChange = (filterName) => (event) => {
    filters[filterName].setter(event.target.value)
  }

  const clearAllFilters = () => {
    const newFilters = {}
    Object.keys(filters).forEach((filterName) => {
      newFilters[filterName] = ''
    })
    setStoredFilters(newFilters)
  }

  return { filters, handleFilterChange, clearAllFilters }
}
