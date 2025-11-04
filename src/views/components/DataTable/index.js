/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import Row from "./row"
import './table.scss';

function resolve(path, obj, separator = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}


function DataTable(props) {
  let selectedItems = [];
  let sortKey = 'none';
  let sortBy = 'none';
  let loaded = false;
  let setKey = false;
  const { className, orderBy, data, onClick, children, topChildren, isDrag, onDrop, onCollapse } = props;
  let tableRef = React.createRef();
  let selectedAll = React.createRef();

  function getClasses(className) {
    let classes = 'datatable__table';

    if (className) {
      classes += ` ${className}`;
    }
    return classes;
  }

  function getItemIndex(obj, arr) {
    for (let i = 0; i < arr.length; i += 1) {
      if (JSON.stringify(arr[i]) === JSON.stringify(obj)) { return i; }
    }
    return -1;
  }

  function setSelectAll(items, checked) {
    // eslint-disable-next-line
    for (let item of items) {
      item.checked = checked;
    }
  }

  function removeSelect() {
    const items = document.querySelectorAll('.datatable__table .checkbox__input');
    const { onSelect } = props;
    selectedItems = [];
    setSelectAll(items, false);
    // setState({ shouldUpdate: false });

    if (onSelect) {
      onSelect(selectedItems);
    }
  }

  function handleSort(key, sortable) {
    if (!sortable) { return; }

    if (key && props.sortable) {
      const ascClassName = 'datatable__sort--asc';
      const descClassName = 'datatable__sort--desc';
      // nếu đã sort trước đó

      if (sortKey) {
        // nếu sort trên 1 key khác
        const prevKeyElementThPArent = document.querySelector(".datatable__active");
        if (prevKeyElementThPArent) {
          prevKeyElementThPArent.classList.remove("datatable__active")
        }

        if (sortKey !== key) {
          sortBy = 'asc';

          // remove style của key cũ

          const prevKeyClassName = `datatable__sort--${sortKey}`;
          const prevKeyElement = document.querySelector(`.${prevKeyClassName}`);
          if (prevKeyElement) {
            prevKeyElement.classList.remove(ascClassName);
            prevKeyElement.classList.remove(descClassName);
          }


          const prevKeyElementTh = document.querySelector(`.datatable__title--${key}`);
          if (prevKeyElementTh && prevKeyElementTh.classList) {
            prevKeyElementTh.classList.add("datatable__active")
          }

          // add style cho key mới
          const keyClassName = `datatable__sort--${key}`;
          const keyElement = document.querySelector(`.${keyClassName}`);
          if (keyElement && keyElement.classList) {
            keyElement.classList.add(ascClassName);
          }

        } else {
          // nêu sort trên key cũ
          // update style cho key cũ

          const prevKeyClassName = `datatable__sort--${sortKey}`;
          const prevKeyElement = document.querySelector(`.${prevKeyClassName}`);

          const prevKeyElementTh = document.querySelector(`.datatable__title--${key}`);
          prevKeyElementTh.classList.add("datatable__active")
          sortBy = (sortBy === 'asc') ? 'desc' : 'asc';
          if (prevKeyElement) {
            prevKeyElement.classList.remove(ascClassName);
            prevKeyElement.classList.remove(descClassName);
          }
          prevKeyElement.classList.add(`datatable__sort--${sortBy}`);
          prevKeyElementTh.classList.add("datatable__active");
        }
      } else {
        sortBy = 'asc';
      }

      sortKey = key;
      const orderBy = `${sortKey}-${sortBy}`;
      const { onSort } = props;
      onSort(orderBy);
    }
  }

  function checkSelectAll(items) {
    // eslint-disable-next-line
    for (let item of items) {
      if (!item.checked) {
        return false;
      }
    }
    return true;
  }

  function initSortIcon(sortKey, sortBy) {
    const keyClassName = `datatable__sort--${sortKey}`;
    const keyParent = document.querySelector(`.datatable__title--${sortKey}`);
    const keyElement = document.querySelector(`.${keyClassName}`);
    const byClassName = `datatable__sort--${sortBy}`;
    const ascClassName = 'datatable__sort--asc';
    const descClassName = 'datatable__sort--desc';

    keyElement.classList.remove(ascClassName);
    keyElement.classList.remove(descClassName);
    keyElement.classList.add(byClassName);
    keyParent.classList.add('datatable__active');
  }

  function handleSelect(event, classTr) {
    const item = event.target;
    const items = document.getElementsByClassName('datatable__checkbox');
    const itemTr = document.getElementsByClassName(classTr);
    const itemIndex = item.getAttribute('data-index');
    const { data, onSelect } = props;
    const selectedItem = data[itemIndex];

    if (item.checked) {
      itemTr[0].classList.add('datatable__tr--active');
      const isSelectAll = checkSelectAll(items);

      selectedAll.checked = isSelectAll;
      selectedItems.push(selectedItem);
      // setState({ shouldUpdate: true });
    } else {
      const index = getItemIndex(selectedItem, selectedItems);

      itemTr[0].classList.remove('datatable__tr--active');
      selectedAll.checked = false;
      selectedItems.splice(index, 1);

      // if (selectedItems.length === 0) {
      //   setState({ shouldUpdate: false });
      // }
    }
    if (onSelect) {
      onSelect(selectedItems);
    }
  }

  function setKeys(orderBy) {

    if (!orderBy) { return null; }
    const [newSortKey, newSortBy] = orderBy.split('-');

    if (!sortKey || !sortBy) { return null; }

    sortKey = newSortKey;
    sortBy = newSortBy;
    setKey = true;

    return initSortIcon(sortKey, sortBy);
  }

  function handleSetAllActiveTr(itemsTr, checked) {
    // eslint-disable-next-line
    for (let item of itemsTr) {
      if (checked) {
        item.classList.add('datatable__tr--active');
      } else {
        item.classList.remove('datatable__tr--active');
      }
    }
  }

  function handleSelectAll(event) {
    const { checked } = event.target;
    const items = document.getElementsByClassName('datatable__checkbox');
    const itemsTr = document.getElementsByClassName('datatable__tr');
    const { data, onSelect } = props;

    if (checked) {
      selectedItems = [...data];

      handleSetAllActiveTr(itemsTr, true);
      setSelectAll(items, true);
      // setState({ shouldUpdate: true });
    } else {
      selectedItems = [];

      handleSetAllActiveTr(itemsTr, false);
      setSelectAll(items, false);
      // setState({ shouldUpdate: false });
    }

    if (onSelect) {
      onSelect(selectedItems);
    }
  }

  function renderSelectAll(selectable) {
    if (!selectable) { return null; }

    return (
      <th colSpan="1" className="datatable__title datatable__select">
        <label htmlFor="checkbox" className="checkbox datatable__select-all">
          <input
            className="checkbox__input"
            ref={(_ref) => { selectedAll = _ref; }}
            type="checkbox"
            onChange={event => handleSelectAll(event)}
          />
          <span className="checkbox__label" />
        </label>
      </th>
    );
  }

  function renderSortIcon(key, sortable) {
    if (!sortable) { return null; }

    let classes = 'datatable__sort';
    classes += ` datatable__sort--${key}`;

    return (
      <div className={classes} />
    );
  }

  function renderColumns(props) {
    const { selectable, columns } = props;

    return (
      <tr>
        {renderSelectAll(selectable)}
        {
          columns.map((column, index) => {

            return (
              <th
                key={index}
                colSpan={column.colSpan || 1}
                className={`datatable__title datatable__title--${column.key} ${column.className || ""}`}
                onClick={() => handleSort(column.key, column.sortable)}
                style={column.style}
              >
                {column.header}
                {renderSortIcon(column.key, column.sortable)}
              </th>
            )

          })
        }
      </tr>
    );
  }

  function renderSelectOne(selectable, rowIndex, classTr) {
    if (!selectable) { return null; }

    return (
      <td colSpan="1">
        <label htmlFor="checkbox__input" className="checkbox">
          <input
            type="checkbox"
            className="checkbox__input datatable__checkbox"
            onChange={event => handleSelect(event, classTr)}
            data-index={rowIndex}
          />
          <span className="checkbox__label" />
        </label>
      </td>
    );
  }

  function renderDataTree(data, columns, level, isParentShow) {
    const {
      selectable,
      currentPage,
      itemsPerPage
    } = props;
    const newLevel = level + 1
    return (
      data && Array.isArray(data) ? (

        <>
          {
            data.map((row, rowIndex) => {
              const classTr = `datatable__tr datatable__tr-${row.index}`;
              return (
                <Row
                  columns={columns}
                  row={row}
                  rowIndex={rowIndex}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  resolve={resolve}
                  selectable={selectable}
                  classTr={classTr}
                  renderSelectOne={renderSelectOne}
                  onClick={onClick}
                  isDrag={isDrag}
                  renderDataTree={renderDataTree}
                  level={newLevel}
                  isParentShow={isParentShow}
                  onDrop={onDrop}
                  onCollapse={onCollapse}
                />
              )
            })
          }
        </>
      ) : null);
  }

  function renderData(props) {
    const {
      data,
      selectable,
      columns = [],
      noDataText,
      currentPage,
      itemsPerPage,
      loading
    } = props;

    if (!data.length) {
      let colSpan = selectable ? 1 : 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const column of columns) {
        colSpan += (column.colSpan || 1);
      }

      const text = 'No data';
      loaded = true;
      if (noDataText) {
        return (
          <tr className="datatable__loading">
            <td
              colSpan={colSpan}
              className="datatable__nodata"
            >
              {noDataText}
            </td>
          </tr>
        )
      }

      return (
        <tr className="datatable__loading">
          <td
            colSpan={colSpan}
            className="datatable__nodata"
          >

            {text}
          </td>
        </tr>
      );
    }

    if (loading) {
      let colSpan = selectable ? 1 : 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const column of columns) {
        colSpan += (column.colSpan || 1);
      }

      const text = 'Loading ...';
      loaded = true;

      return (
        <tr>
          <td
            colSpan={colSpan}
            rowSpan={10}
            className="datatable__nodata"
          >
            {text}
          </td>
        </tr>
      );

    }

    return (
      data.map((row, rowIndex) => {
        const classTr = `datatable__tr datatable__tr-${row.index}`;
        return (
          <>
            <Row
              columns={columns}
              row={row}
              rowIndex={rowIndex}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              resolve={resolve}
              selectable={selectable}
              classTr={classTr}
              renderSelectOne={renderSelectOne}
              onClick={onClick}
              isDrag={isDrag}
              renderDataTree={renderDataTree}
              level={0}
              isParentShow
              onCollapse={onCollapse}
              onDrop={onDrop}
            />

          </>
        );
      })
    );
  }

  useEffect(() => {
    if (!setKey) {
      setKeys(orderBy);
    }
  }, [orderBy, setKey, setKeys]);

  useEffect(() => {

    const items = document.querySelectorAll('.datatable__tr--active');

    loaded = true;
    removeSelect();
    items.forEach((item) => {
      item.classList.remove('datatable__tr--active');
    });
  }, [data]);

  return (

    <div className="datatable">

      {topChildren}
      {/* table */}

      <DndProvider backend={HTML5Backend}>
        <table
          ref={(_ref) => { tableRef = _ref; }}
          border="0"
          cellPadding="0"
          cellSpacing="0"
          className={getClasses(className)}
        >
          <thead>
            {renderColumns(props)}
          </thead>
          <tbody>
            {renderData(props)}
          </tbody>
        </table>
      </DndProvider>
      {
        children
      }
    </div>

  );
}

DataTable.defaultProps = {
  sortable: false,
  selectable: false,
  currentPage: 1,
  itemsPerPage: 20,
  noDataText: 'No data',
  onSort: () => null,
  // onPageChange: () => null,
  onSelect: () => null,
  onClick: () => null,
  children: "",
  topChildren: "",
  isDrag: false,
  onDrop: () => { },
  loading: false,
  onCollapse: () => { }
  // onSelectAction: () => null
};

DataTable.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  currentPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number,
  noDataText: PropTypes.any,
  // onPageChange: PropTypes.func,
  onSelect: PropTypes.func,
  // onSelectAction: PropTypes.func,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  selectable: PropTypes.bool,
  sortable: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.element,
  topChildren: PropTypes.element,
  isDrag: PropTypes.bool,
  onDrop: PropTypes.func,
  loading: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export default DataTable;