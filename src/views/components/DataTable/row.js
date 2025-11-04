/* eslint-disable react/no-array-index-key */
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDrag, useDrop } from "react-dnd";
import _ from "lodash"

export const ItemTypes = {
  ROW: "row",
  TILE: "tile"
};

const LEFT_SPACE = 30

const Row = ({ columns, row, rowIndex, currentPage, itemsPerPage, resolve, selectable, classTr, renderSelectOne, onClick, isDrag, renderDataTree, level, isParentShow, onDrop, onCollapse }) => {
  const dragRef = useRef(null);
  const [isOpen, setIsOpen] = useState(row.defaultShow)
  const [isHidden, setIsHidden] = useState(level > 0)
  useEffect(() => {
    setIsHidden(!isParentShow)
  }, [isParentShow])
  const [{ isOverCurrent, draggingItem }, drop] = useDrop({
    accept: [ItemTypes.ROW, ItemTypes.TILE],
    drop(item) {
      // Validate user layout valid for action
      onDrop(row, item)
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      draggingItem: monitor.getItem()
    })
  });
  // config dragType
  const dragType = ItemTypes.TILE
  // find userData of current cell
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TILE,
    item: {
      type: ItemTypes.TILE,
      value: row,
      cellData: row,
      dragType
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(dragRef))
  // config background change when drag item
  let backgroundColor = "rgba(255,255,255,.5)";
  const draggingItemId = _.get(draggingItem, "value.id", undefined);
  const isSameTile = draggingItemId === row.id;
  if (isOverCurrent && !isSameTile) {
    backgroundColor = "rgb(245,245,245,.8)";
  }

  return (
    <>
      <tr
        ref={isDrag ? dragRef : null}
        onClick={() => {
          if (onClick) {
            onClick(row)
          }
        }}
        // style={{ backgroundColor }}
        className={`${classTr} ${isHidden ? "datatable__tr__hidden" : `datatable__tr__show`} `}
        key={rowIndex}
      >
        {
          !isHidden ? (
            <>

              {renderSelectOne(selectable, rowIndex, classTr)}
              {
                columns.map((column, columnIndex) => {
                  const { renderItem } = column;
                  // eslint-disable-next-line radix
                  const value = (column.key === '#') ? (rowIndex + 1) + ((parseInt(currentPage) - 1) * itemsPerPage) : resolve(column.key, row);
                  const classTd = `datatable__td-${column.key}`;
                  const hasChild = !columnIndex && row.children && row.children.length
                  return (
                    <td
                      key={columnIndex}
                      colSpan={column.colSpan || 1}
                      style={column.style}
                      className={classTd}
                    >
                      <div role="presentation"
                        onClick={() => {
                          if (hasChild) {
                            setIsOpen(!isOpen)
                            onCollapse(row.children, isOpen)
                          }
                        }}
                        style={{ marginLeft: !columnIndex ? `${level * LEFT_SPACE}px` : "0px" }}
                        className={`${hasChild ? "datatable__td__parent" : `${isDrag && !level && !columnIndex ? "datatable__td__parent__second" : ""}`}`}
                      >

                        {
                          renderItem
                            ? renderItem(row, rowIndex, value)
                            : value
                        }
                      </div>
                    </td>
                  );
                })
              }
            </>
          ) : null
        }
      </tr>
      {
        !isHidden && isOpen && row.children && row.children.length ? (
          renderDataTree(row.children, columns, level, isOpen)
        ) : null
      }
    </>
  )
};

Row.propTypes = {
  columns: PropTypes.array,
  row: PropTypes.object,
  rowIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
  ]),
  currentPage: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
  ]),
  itemsPerPage: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
  ]),
  resolve: PropTypes.func,
  selectable: PropTypes.bool,
  classTr: PropTypes.string,
  renderSelectOne: PropTypes.func,
  onClick: PropTypes.func,
  isDrag: PropTypes.bool,
  renderDataTree: PropTypes.func,
  level: PropTypes.number,
  isParentShow: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.any,
  ]),
  onDrop: PropTypes.func,
  onCollapse: PropTypes.func,
};

Row.defaultProps = {
  columns: [],
  row: {},
  rowIndex: 0,
  currentPage: 0,
  itemsPerPage: 20,
  resolve: () => { },
  selectable: false,
  classTr: "",
  renderSelectOne: () => {
    return ""
  },
  onClick: () => { },
  isDrag: false,
  renderDataTree: () => { },
  level: 0,
  isParentShow: false,
  onDrop: () => { },
  onCollapse: () => { },
}

export default Row;
