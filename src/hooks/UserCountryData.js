import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export const useCountriesData = () => {
  const [countries, setCountries] = useState([])
  const [refresh, setRefresh] = useState(false)

  const fetchData = useCallback(async () => {
    const result = await axios('https://restcountries.com/v2/all')
    setCountries(result.data)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData, refresh])

  const refreshData = () => {
    setRefresh((prevState) => !prevState)
  }

  return { countries, refreshData }
}
