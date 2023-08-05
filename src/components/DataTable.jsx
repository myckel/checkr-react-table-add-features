import { useState, useMemo, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Pagination, SelectItemsPerPage } from './Pagination'

export const DataTable = ({
  data,
  nameFilterChange,
  alpha2CodeFilterChange,
  capitalFilterChange,
  nameFilter,
  alpha2CodeFilter,
  capitalFilter,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  columns,
  setColumns
}) => {
  const [sortConfig, setSortConfig] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const tableRef = useRef()

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setColumns(items)
  }
  const sortedData = useMemo(() => {
    const sortableData = [...data]
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [data, sortConfig])

  const totalItems = sortedData.length

  const handleSort = (key) => {
    let direction = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleRowClick = (alpha2Code) => {
    setSelectedRow(alpha2Code)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRow(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <table className='table table-striped'>
          <Droppable droppableId='columns' direction='horizontal'>
            {(provided) => (
              <thead {...provided.droppableProps} ref={provided.innerRef}>
                <tr>
                  {columns.map((col, index) => (
                    <Draggable
                      key={col.key}
                      draggableId={col.key}
                      index={index}
                    >
                      {(provided) => (
                        <th
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className='th-header'
                        >
                          <div
                            className='col text-center'
                            onClick={() =>
                              col.key !== 'flag' && handleSort(col.key)
                            }
                          >
                            {col.name}
                          </div>
                        </th>
                      )}
                    </Draggable>
                  ))}
                </tr>
                <tr>
                  <th className='th-header'>
                    <div className='col text-center'>
                      <input
                        onChange={nameFilterChange}
                        onClick={(e) => e.stopPropagation()}
                        value={nameFilter}
                        type='text'
                        placeholder='Filter by Name'
                      />
                    </div>
                  </th>
                  <th className='th-header'>
                    <div className='col text-center'>
                      <input
                        onChange={alpha2CodeFilterChange}
                        value={alpha2CodeFilter}
                        onClick={(e) => e.stopPropagation()}
                        type='text'
                        placeholder='Filter by Alpha Code'
                      />
                    </div>
                  </th>
                  <th className='th-header'>
                    <div className='col text-center'>
                      <input
                        onChange={capitalFilterChange}
                        value={capitalFilter}
                        onClick={(e) => e.stopPropagation()}
                        type='text'
                        placeholder='Filter by Capital'
                      />
                    </div>
                  </th>
                </tr>
                {provided.placeholder && <tr>{provided.placeholder}</tr>}
              </thead>
            )}
          </Droppable>
          <tbody ref={tableRef}>
            {paginatedData.map((item) => (
              <tr
                key={item.alpha2Code}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRowClick(item.alpha2Code)
                }}
                className={selectedRow === item.alpha2Code ? 'highlight' : ''}
              >
                {columns.map((column) => {
                  if (column.key === 'flag') {
                    return (
                      <td key={column.key} className='text-center'>
                        <img
                          className='flag'
                          alt={`${item.alpha2Code}-flag`}
                          src={item.flags.svg}
                        />
                      </td>
                    )
                  } else {
                    return (
                      <td
                        key={column.key}
                        title={item[column.key]}
                        className='text-center'
                      >
                        {item[column.key]}
                      </td>
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <SelectItemsPerPage
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <Pagination
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  handlePageChange={handlePageChange}
                  currentPage={currentPage}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DragDropContext>
  )
}
