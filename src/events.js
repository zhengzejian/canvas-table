import { debounce, cloneDeep } from 'lodash'
import { loadImage } from '../utils'
import { rowHeight } from '../config'
import textFlexWidget from '../widget/text-flex'
const MIN_COLUMN_WIDTH = 40 // 列的最小宽度
export default {
  mounted () {
    this.activeRowIndex = null // 活动行，画活动行的时候需要
    this.moveRowIndex = null // 鼠标移动到某一行的index
    this.mouseConfig = { // 鼠标停留在某一行，某一列的数据存储
      isDivide: false,
      divideCol: {},
      divideMovex: 0,
      headCol: {},
      isMove: false
    }
    // 鼠标拖动选择配置
    this.mouseDragConfig = {
      isTableHeader: true,
      starty: 0,
      startIndex: 0,
      selectArr: [],
      oldSelectArr: [],
      dragCount: 0
    }
    // 鼠标点击的时候，存储点击行和列
    this.clickCell = {
      col: {},
      row: {}
    }
    this.checkedRow = []
    this.isCanvasMove = true // 鼠标否在canvas上移动
    this.tooltipTimer = null // 显示提示tooltip，的防抖参数
    this.tooltipPosition = { // tooltip 位置计算
      x: 0,
      y: 0,
      text: '',
      col: {},
      row: {},
      isLast: false
    }
    // 图片显示缓存
    this.cachedImages = {}
    this.moveDeb = () => { }
    this.keyDownBottom = 0 // 计数器，控制无限点击向下箭头键
    this.keyDownTop = 0 // 计数器，控制无限点击向上箭头键
    this.keyDownTimer = debounce((index, oldIndex) => {
      this.subCurrentChange(index, oldIndex)
    }, 200, { leading: true })
    this.catchEditMode = {}
    this.slotTooltip = {
      left: 0,
      top: 0,
      row: null,
      column: null,
      value: null,
      show: false,
      isLast: false
    }
  },
  methods: {
    // canvas事件函数
    canvasEvents () {
      this.handleMouseMove()
      this.addEvents()
    },
    // 添加事件
    addEvents () {
      const { canvas, box, divideTag, editCell } = this
      canvas.addEventListener('mousedown', this.handleMouseDown)
      canvas.addEventListener('mouseup', this.handleMouseUp)
      canvas.addEventListener('click', this.handleCanvasClick)
      canvas.addEventListener('contextmenu', this.handleCanvasContextMenu)
      canvas.addEventListener('dblclick', this.handleCanvasDbclick)
      divideTag.addEventListener('mousedown', this.divideTagMouseDown)
      divideTag.addEventListener('mouseleave', this.divideTagMouseLeave)
      box.addEventListener('mouseleave', this.handleCanvasMouseLeave)
      canvas.addEventListener('keydown', this.canvasKeydown)
      canvas.addEventListener('keyup', this.canvasKeyUp)
      editCell.addEventListener('blur', this.resetEditCell)
    },
    // 移除事件
    removeEvents () {
      const { canvas, box, divideTag, editCell } = this
      canvas.removeEventListener('mousedown', this.handleMouseDown)
      canvas.removeEventListener('mouseup', this.handleMouseUp)
      canvas.removeEventListener('click', this.handleCanvasClick)
      canvas.removeEventListener('contextmenu', this.handleCanvasContextMenu)
      canvas.removeEventListener('dblclick', this.handleCanvasDbclick)
      box.removeEventListener('mouseleave', this.handleCanvasMouseLeave)
      divideTag.removeEventListener('mousedown', this.divideTagMouseDown)
      divideTag.removeEventListener('mouseleave', this.divideTagMouseLeave)
      canvas.removeEventListener('mousemove', this.moveDeb)
      canvas.removeEventListener('keydown', this.canvasKeydown)
      canvas.removeEventListener('keyup', this.canvasKeyUp)
      editCell.removeEventListener('blur', this.resetEditCell)
    },
    canvasKeydown (e) {
      const { keyCode } = e
      const oldIndex = this.activeRowIndex
      switch (keyCode) {
        case 16: // shift 键
          this.isWheelMove = true
          break
        case 40: // 方向键↓
          this.activeRowIndex += 1
          if (this.activeRowIndex >= this.allRowData.length) {
            this.activeRowIndex = this.allRowData.length
            this.keyDownBottom += 1 // 计数器，控制无限点击
          }
          this.keyDownTop = 0
          this.toMoveActiveRowIndex(this.activeRowIndex, oldIndex)
          break
        case 38: // 方向键↑
          this.activeRowIndex -= 1
          if (this.activeRowIndex <= 1) {
            this.activeRowIndex = 1
            this.keyDownTop += 1
          }
          this.keyDownBottom = 0
          this.toMoveActiveRowIndex(this.activeRowIndex, oldIndex)
          break
        case 13: // 回车键
          let rowData = this.data[this.activeRowIndex - 1]
          this.$emit('row-dblclick', rowData)
          break
      }
    },
    // 键盘事件
    canvasKeyUp (e) {
      this.isWheelMove = false
    },
    // 鼠标按下事件
    handleMouseDown (e) {
      this.updatedBoxPosition()
      const { boxPosition } = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      this.mouseConfig.isMove = false
      this.slotTooltip.show = false
      this.handleHeaderPoint(x, y)
      this.resetEditCell()
    },
    divideTagMouseDown (e) {
      this.closeEditMode()
      this.updatedBoxPosition()
      this.showDivideLine = true
      this.isDivideMouseMoveFlag = true
      const { boxPosition } = this
      const x = e.clientX - boxPosition.left
      this.mouseConfig.isMove = false
      this.slotTooltip.show = false
      this.dealHeaderPoint(x)
      this.divideMove()
    },
    divideTagMouseLeave () {
      this.showDivideTag = false
    },
    // 鼠标抬起
    handleMouseUp () {
      const { mouseDragConfig } = this
      mouseDragConfig.isTableHeader = true
      mouseDragConfig.selectArr = []
      mouseDragConfig.oldSelectArr = []
    },
    // 鼠标点击事件
    handleCanvasClick (e) {
      this.updatedBoxPosition()
      // clearTimeout(this.clickTimer)
      if (!this.flatData.length) {
        return
      }
      const { boxPosition } = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      if (y > this.headerHeight) {
        this.dealClick(x, y, e)
      }
    },
    // 鼠标双击事件
    handleCanvasDbclick (e) {
      this.updatedBoxPosition()
      // clearTimeout(this.clickTimer)
      if (!this.flatData.length) {
        return
      }
      const { boxPosition, displayRowData, excludeSort } = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      if (displayRowData.length > 0 && y > this.headerHeight) {
        const { row, col } = this.getRowAndCol(x, y, x <= this.fixedLeftWidth / this.ratio)
        const { value, column, rowData } = this.getOriginData(col, row)
        let isSelection = col.key === excludeSort.$$selection
        let isOperation = col.key === excludeSort.$$operation
        if (!isSelection && !isOperation && !col._showButton && !col._showUpload && !col._showImage && !col._showCheckbox) {
          this.$emit('row-dblclick', rowData, column, value)
        } else if (col._showButton && typeof col.dbclick === 'function') {
          this.$emit('btn-dbclick', rowData, col)
        }
        this.resetEditCell()
        this.paint()
      }
    },
    // 鼠标右击事件
    handleCanvasContextMenu (e) {
      this.updatedBoxPosition()
      clearTimeout(this.clickTimer)
      this.tooltip.show = false
      const { boxPosition, scroll, ratio, flatData, fixedLeftWidth, excludeSort } = this
      const y = e.clientY - boxPosition.top
      const x = e.clientX - boxPosition.left
      // 如果右击 在表头 或者 在操作列左边 的位置 就不派发事件
      if (y <= this.headerHeight || x <= this.excludeSortWidth / ratio) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // 获取点击的行和列
      const { row, col } = this.getRowAndCol(x, y, x <= fixedLeftWidth / ratio)
      // 如果右击事件 是在 可交互列上 就不派发事件
      let isSelection = col.key === excludeSort.$$selection
      let isOperation = col.key === excludeSort.$$operation
      if (isSelection || isOperation || col._showImage || col._showUpload || col._showCheckbox) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      if (typeof row.index === 'number' && col.key) {
        const text = flatData[row.index][col.key]
        const left = col.fixed === 'left' ? col.x : col.x - scroll.disx
        this.editPosition = {
          text,
          left: left / ratio,
          top: (row.y - scroll.disy) / ratio + 1,
          width: (col.width / ratio) + 1
        }
        setTimeout(_ => this.editCell.select())
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    },
    // 鼠标移动事件
    handleMouseMove () {
      const { canvas } = this
      const mfn = e => {
        this.isPaintImage = false
        // 更新box的位置，以防滚动造成的box位置差异
        this.updatedBoxPosition()
        // 获取 鼠标相对于box的位置
        const y = e.clientY - this.boxPosition.top
        const x = e.clientX - this.boxPosition.left
        if (this.isCanvasMove) {
          // 处理鼠标移动事件
          this.dealMouseMove(x, y)
        }
      }
      this.moveDeb = debounce(mfn, 16.67, { leading: true })
      canvas.addEventListener('mousemove', this.moveDeb)
    },
    // 分割线事件
    divideMove () {
      document.addEventListener('mousemove', this.divideMouseMove)
      document.addEventListener('mouseup', this.divideMouseUp)
    },
    // 限制拖动的宽度
    divideLimtColumWidth (e) {
      // this.updatedBoxPosition()
      const { ratio, mouseConfig, scroll, boxPosition } = this
      const disx = scroll.disx
      let x = e.clientX - boxPosition.left
      const limit = MIN_COLUMN_WIDTH * ratio
      // 设置分割线最少不小于 40px
      const left = (mouseConfig.divideCol.x - disx + limit) / ratio
      // 设置分割线不大于 canvas 宽度
      // const right = (canvas.width - limit) / ratio
      this.mouseConfig.isMove = true
      if (x < left) {
        x = left
      }
      // else if (x >= right) {
      //   x = right
      // }
      return x
    },
    // 分割线移动移动事件
    divideMouseMove (e) {
      if (!this.isDivideMouseMoveFlag) {
        return
      }
      this.setMouseStyle('col-resize')
      this.isCanvasMove = false
      this.updatedDivideTag(this.divideLimtColumWidth(e))
      // this.paint({ dividex: x * ratio })
    },
    // 分割线鼠标抬起事件
    divideMouseUp (e) {
      document.removeEventListener('mousemove', this.divideMouseMove)
      document.removeEventListener('mouseup', this.divideMouseUp)
      this.setMouseStyle('default')
      if (this.mouseConfig.isMove) {
        this.mouseConfig.divideMovex = this.divideLimtColumWidth(e)
        this.isCanvasMove = true
        // this.setMouseStyle('default')
        const { ratio, scroll } = this
        const divideCol = this.mouseConfig.divideCol
        const disx = scroll.disx
        const w = (disx - divideCol.x) / ratio + this.mouseConfig.divideMovex
        const cx = (divideCol.x + divideCol.width - disx) / ratio - this.mouseConfig.divideMovex
        let index = divideCol._index
        this.allColData[index].width = w * ratio
        this.colWidthMap[divideCol.key] = w
        this.$emit('col-resize', divideCol.key, w)
        let len = this.allColData.length
        for (let i = index + 1; i < len; i++) {
          this.allColData[i].x = this.allColData[i].x - (cx * ratio)
        }
        if (this.showHScrollbar && cx > 0 && this.displayCol[this.displayCol.length - 1]._index === this.allColData[len - 1]._index) {
          this.scroll.disx -= cx
          if (this.displayCol[0].x - cx < 0) {
            this.scroll.disx = 0
            this.hScrollbar.style.left = 0
          }
        }
        // 二级表头处理
        if (divideCol._parentkey) {
          divideCol._parent.width -= cx
        }
        // 二级表头处理
        this.allColData.forEach(item => {
          if (item._pindex === 0) {
            item._parent.x = item.x
          }
        })
        this.initScroll()
        this.getDisplayCol()
        this.handleShowText()
        this.paint()
      } else {
        this.paint()
      }
      this.mouseConfig.isDivide = false
      this.showDivideLine = false
      this.showDivideTag = false
    },
    // 鼠标移出canvas事件
    handleCanvasMouseLeave () {
      // this.moveRowIndex = null
      // if (!this.flatData.length) {
      //   return
      // }
      // this.paint()
      this.setTooltipPosition()
      this.showDivideTag = false
    },
    // 计算鼠标所在的点位置
    handleHeaderPoint (x, y) {
      const { mouseConfig, selection } = this
      this.isDivideMouseMoveFlag = true // 不可拖拽分割线控制
      // 不是表头
      if (y >= this.headerHeight) {
        const { col, row } = this.getRowAndCol(x, y, true)
        this.mouseDragConfig.isTableHeader = (!(col.key === '$$selection')) && selection
        this.mouseDragConfig.startIndex = row.index
        this.isDivideMouseMoveFlag = false
        return
      }
      this.mouseDragConfig.isTableHeader = true
      // 处理按下表头相关的信息
      this.dealHeaderPoint(x)
      // 如果按下位置在鼠标 分割线位置，并且不是左边固定列的分割线位置
      let col = mouseConfig.headCol
      let key = col.key
      if (key === this.excludeSort.$$selection) {
        this.dealSelectRow()
        this.paint()
        return
      }

      let remoteSort = col.sortKeys && col.sortKeys.length === 2
      let isButtonSort = !col._showButton || (col._showButton && !col.button)

      if (col.textFlexWidget) {
        col.customHeaderClick = true
        let handel = textFlexWidget.handleClick.bind(this)
        handel({ col, sortFunc: this.handleSort, x, y })
      }

      // 2021-03-31 customHeaderClick 可以自定义点击事件
      if (remoteSort && isButtonSort && !col._showImage && !col._showCheckbox && !col._showUpload && !col.customHeaderClick) {
        // 如果是二级表头需要点击到二级头才行
        if (col._parent && col._parentkey) {
          if (y >= this.headerHeight / 2) {
            this.handleSort()
            // this.paint()
          }
        } else {
          this.handleSort()
          // this.paint()
        }
      }
      if (col.customHeaderClick || (col._parent && col._parent.customHeaderClick)) {
        this.$emit('header-click', { col, sortFunc: this.handleSort, x, y })
      }
    },
    // 处理选择行
    dealSelectRow () {
      const { flatData } = this
      if (this.checkedRow.length === 0) {
        this.checkedRow = cloneDeep(flatData)
      } else if (this.checkedRow.length > 0 && this.checkedRow.length < flatData.length) {
        this.checkedRow = cloneDeep(flatData)
      } else {
        this.checkedRow = []
      }
      this.emitChangeSelect()
    },
    // 处理鼠标单击函数
    dealClick (x, y, e) {
      const { ratio, flatData, excludeSort, mouseDragConfig } = this
      const { row, col } = this.getRowAndCol(x, y, x <= this.fixedLeftWidth / ratio)
      const oldActiveRowIndex = this.activeRowIndex
      this.clickCell.col = col
      this.clickCell.row = row
      this.activeRowIndex = flatData[row.index] ? flatData[row.index]._index : -1
      if (this.activeRowIndex === -1) {
        return
      }
      const { value, column, rowData } = this.getOriginData(col, row)
      if (col.key === excludeSort.$$selection) {
        // 只有点击复选框才选中
        this.handleCheckedRow(row)
      } else if (col.key === excludeSort.$$operation) {
        this.dealOperation({ col, row, x, rowData, column, value, e })
      } else if (col._showButton) {
        this.dealClickButton({ row, col, column, value, x, y, rowData })
      } else if (col._showCheckbox) {
        this.dealCheckbox(row, col)
      } else if (col._showUpload) {
        this.dealUpload(row, col)
      } else if (col._showImage) {
        this.dealClickImage(col, rowData)
      } else if (!col._showImage) {
        this.$emit('row-click', rowData, column, value)
        if (this.mode) {
          this.toEditMode(row, column, rowData, value)
        }
      }
      mouseDragConfig.dragCount = 0
      this.paint()
      this.subCurrentChange(this.activeRowIndex, oldActiveRowIndex)
    },
    // 分发current-change 函数
    subCurrentChange (x1, x2) {
      const obj1 = x1 < 0 ? null : this.data[x1 - 1]
      const obj2 = x2 < 0 ? null : this.data[x2 - 1]
      this.$emit('current-change', obj1, obj2)
    },
    // activeindex 上下移动
    toMoveActiveRowIndex (index, oldIndex) {
      const { allRowData, displayRow, showVScrollbar } = this
      let y = allRowData[index - 1].y
      if (y >= displayRow[displayRow.length - 1].y && this.keyDownBottom < 2 && showVScrollbar) {
        this.lockScrollBottom = 0
        this.toVWheel(rowHeight)
      } else if (y <= displayRow[0].y && this.keyDownTop < 2 && showVScrollbar) {
        this.lockScrollTop = 0
        this.toVWheel(-rowHeight)
      } else {
        this.paint()
      }
      this.keyDownTimer(index, oldIndex)
    },
    // 处理点击单元格方法
    handleCheckedRow (row) {
      if (!this.selection) {
        return false
      }
      const { checkedRow, flatData } = this
      let index = null
      const rowData = flatData[row.index]
      const isFind = checkedRow.some((item, i) => {
        index = i
        return item._gtableuuid === rowData._gtableuuid
      })
      if (!isFind) {
        this.checkedRow.push({ _index: rowData._index, _gtableuuid: rowData._gtableuuid })
      } else if (index !== null) {
        this.checkedRow.splice(index, 1)
      }
      this.emitChangeSelect()
    },
    // 分发选择事件
    emitChangeSelect () {
      const { checkedRow, data } = this
      let arr = []
      if (checkedRow.length > 0) {
        arr = checkedRow.map(item => data[item._index - 1])
      }
      this.$emit('selection-change', arr, checkedRow.length === data.length)
    },
    // 计算排序
    handleSort () {
      // 无数据时不可点击排序
      if (this.flatData.length === 0) {
        return
      }
      const { sortCol, mouseConfig } = this
      const col = mouseConfig.headCol
      sortCol.col = col
      if (sortCol.beforeCol._index !== col._index) {
        sortCol.num = 1
      } else {
        sortCol.num += 1
        if (sortCol.num > 2) {
          sortCol.num = 1
        }
      }
      this.moveRowIndex = null
      let onePage = this.page.total <= this.page.pageSize
      let autoSort = this.options.sortType === 'auto'
      let remoteSort = col.sortKeys && col.sortKeys.length === 2
      if (autoSort && onePage) {
        const c_rise = this.sortOptions[col.key] ? this.sortOptions[col.key].rise : null
        const c_down = this.sortOptions[col.key] ? this.sortOptions[col.key].down : null
        sortCol.num === 1 ? this.riseSort(c_rise) : this.downSort(c_down)
      } else if (remoteSort) {
        let order = sortCol.num === 1 ? 'ascending' : 'descending'
        this.$emit('sort-change', { remote: true, column: col, prop: col.key, order })
      }
    },
    // 处理头部位置
    dealHeaderPoint (x) {
      const { allColData, mouseConfig, scroll, ratio } = this
      // 如果鼠标位置在左边固定列
      if (x <= this.fixedLeftWidth / ratio) {
        // this.setMouseStyle('default')
        mouseConfig.isDivide = false
        for (let col of this.fixedLeftCol) {
          let w = (col.x + col.width) / ratio
          if (w > x) {
            mouseConfig.headCol = col
            break
          }
        }
      } else {
        for (let col of allColData) {
          let w = (col.x + col.width - scroll.disx) / ratio
          // 这位置是分割线位置
          if ((x < w && x >= w - 4) || (x >= w && x <= w + 4)) {
            mouseConfig.isDivide = true
            mouseConfig.divideCol = col
            mouseConfig.headCol = col
            // this.setMouseStyle('col-resize')
            break
          } else {
            // this.setMouseStyle('default')
            mouseConfig.isDivide = false
            if (w > x) {
              mouseConfig.headCol = col
              break
            }
          }
        }
      }
    },
    // 处理鼠标移动事件
    dealMouseMove (x, y) {
      const { ratio, mouseDragConfig, allColData, scroll, excludeSort, headerHeight, selection } = this
      const disx = scroll.disx
      const isLeft = x > (this.fixedLeftWidth / ratio) + 4
      const mindHeight = headerHeight / 2
      // 鼠标在表头，并且鼠标不是在分割线移动状态
      if (y <= headerHeight && isLeft) {
        this.setTooltipPosition()
        for (let col of allColData) {
          let w = (col.x + col.width - disx) / ratio
          if ((x < w && x > w - 4) || (x >= w && x < w + 4)) {
            // 这位置是分割线位置
            // 如果是二级表头，判读是不是最后一个，并且鼠标要在二级表头里面
            if (col._parentkey && !col._last) {
              this.updatedDivideTag(w - 4, mindHeight, y >= mindHeight)
            } else {
              this.updatedDivideTag(w - 4)
            }
            break
          }
          this.showDivideTag = false
          // this.setMouseStyle('default')
        }
        return
      }
      this.showDivideTag = false
      // 避免无数据时重绘
      if (!this.flatData.length || y <= this.headerHeight) {
        return
      }
      const { col, row } = this.getRowAndCol(x, y, !isLeft)
      // 鼠标按下拖动
      if (!mouseDragConfig.isTableHeader && selection) {
        mouseDragConfig.dragCount > 1 && this.dragRows(row)
        mouseDragConfig.dragCount += 1
      } else {
        let isSelection = col.key === excludeSort.$$selection
        let isOperation = col.key === excludeSort.$$operation
        if (col._showButton) {
          let mouseStyle = (this.buttonOptions[col.key] && this.buttonOptions[col.key].func) ? 'pointer' : 'default'
          this.setMouseStyle(mouseStyle)
        } else {
          let mouseStyle = (isSelection || isOperation || col._showCheckbox || col._showUpload) ? 'pointer' : 'default'
          this.setMouseStyle(mouseStyle)
        }
        if (!isSelection && !isOperation && !col._showImage && !col._showCheckbox) {
          this.setTooltip(col, row)
        }
      }
    },
    // 计算拖动选择行数
    dragRows (row) {
      const { mouseDragConfig, flatData, checkedRow } = this
      let i = mouseDragConfig.startIndex
      const old = mouseDragConfig.oldSelectArr
      const arr = []
      // 计算方法：
      // 1、取到前一次跟现在的交集
      // 2、现在跟选择的并集
      if (i <= row.index) {
        while (i <= row.index) {
          i++
          arr.push(i)
        }
      } else {
        let j = row.index
        while (j <= i) {
          j++
          arr.push(j)
        }
      }

      old.forEach(num => {
        if (!arr.includes(num)) {
          const rowData = flatData[num - 1]
          const i = checkedRow.findIndex(o => o._index === rowData._index)
          i >= 0 && checkedRow.splice(i, 1)
        }
      })

      arr.forEach(num => {
        const rowData = flatData[num - 1]
        const i = checkedRow.findIndex(item => item._index === rowData._index)
        i < 0 && checkedRow.push({ _index: rowData._index, _gtableuuid: rowData._gtableuuid })
      })
      mouseDragConfig.oldSelectArr = arr
      this.paint()
    },
    // 设置鼠标样式
    setMouseStyle (str) {
      this.canvas.style.cursor = str
    },
    // 显示tooltip
    setTooltip (col, row) {
      const { displayOverRowData, flatData, scroll, ratio, tooltipPosition, displayCol } = this
      const disx = scroll.disx
      const disy = scroll.disy
      const item = displayOverRowData.find(item => item._index === row.index)
      clearTimeout(this.tooltipTimer)
      if (tooltipPosition.col._index !== col._index || tooltipPosition.row.index !== row.index) {
        this.setTooltipPosition()
      }
      let x = (col.width / 2 + col.x - disx) / ratio
      let y = (row.y - disy) / ratio
      this.tooltipTimer = setTimeout(() => {
        if (item && col.key && item[col.key]) {
          let text = flatData[row.index][col.key]
          this.tooltipPosition.x = x
          this.tooltipPosition.y = y
          this.tooltipPosition.text = text
          this.tooltipPosition.col = col
          this.tooltipPosition.row = row
          this.tooltipPosition.isLast = (col._index === displayCol[displayCol.length - 1]._index)
          // 增加列配置showTooltip字段，控制tooltip是否显示，不显示配置为false
          if (col.showTooltip !== false) {
            this.setTooltipPosition(true)
          }
        } else {
          this.setTooltipPosition()
        }
      }, 1000)
      const flatRow = this.flatData[row.index]
      this.$emit('cell-move', { x, y, col, row: this.data[flatRow._index - 1], flatRow })
    },
    setSlotTooltip (rowData, col, val, x, y, row) {
      x = (col.width / 2 + col.x - this.scroll.disx) / this.ratio
      y = (row.y - this.scroll.disy + 15) / this.ratio
      this.slotTooltip.left = x
      this.slotTooltip.top = y
      this.slotTooltip.row = rowData
      this.slotTooltip.column = col
      this.slotTooltip.value = val
    },
    setTooltipPosition (show = false) {
      this.tooltip.content = this.tooltipPosition.text
      this.tooltip.left = this.tooltipPosition.x
      this.tooltip.top = this.tooltipPosition.y
      this.tooltip.show = show
      this.tooltip.isLast = this.tooltipPosition.isLast
    },
    // 加载图片
    async loadImage () {
      const { displayRow, getImageOptions, flatData } = this
      let ileng = getImageOptions.length
      if (getImageOptions.length > 0 && flatData.length > 0 && Object.keys(this.cachedImages).length < flatData.length * ileng) {
        for (let row of displayRow) {
          for (let key of getImageOptions) {
            if (!this.cachedImages[`${key}_${row.index}`]) {
              let img
              try {
                img = await loadImage(flatData[row.index][key])
              } catch (err) {
                img = null
              }
              this.cachedImages[`${key}_${row.index}`] = img
            }
          }
        }
        this.clearCanvas()
        this.paintActiveRow()
        this.paintLine()
        this.paintText()
        this.painHeader()
        this.paintFixedLeftColumn()
      }
    },
    dealClickButton (prams) {
      const { flatData, buttonDisabledRows } = this
      const { row, col, column, value, x, y, rowData } = prams
      const rowIndex = flatData[row.index]._index - 1
      if (!buttonDisabledRows[rowIndex] || !buttonDisabledRows[rowIndex][col.key]) {
        const mask = flatData[row.index].hasOwnProperty(col.key + 'Mask')
        const virtual = flatData[row.index].hasOwnProperty(col.key + 'Virtual')
        this.setSlotTooltip(flatData[row.index], column, value, x, y, row)
        this.$emit('cell-click', rowData, column, value, flatData[row.index], mask, virtual)
      }
    },
    dealOperation (prams) {
      const { flatData, allFixedRowData, ratio, fontSize } = this
      const { col, row, x, rowData, column, value, e } = prams
      const rowIndex = flatData[row.index]._index - 1
      const btnArr = allFixedRowData[rowIndex]
      let w = col.x / ratio
      let index = 0
      for (let btn of btnArr) {
        let str = typeof btn.label === 'function' ? btn.label(rowData) : btn.label
        w += (6 * ratio + str.length * fontSize) / ratio
        if (x < w + 6 * ratio) {
          break
        }
        index += 1
      }
      index = index >= btnArr.length ? btnArr.length - 1 : index
      this.$emit('row-edit', rowData, column, value, btnArr[index], e)
    },
    dealClickImage (col, row) {
      const obj = this.imageOptions[col.key]
      obj && obj.func && obj.func(row)
    },
    dealCheckbox (row, col) {
      const { checkboxRows, data } = this
      let opt = checkboxRows[row.index] && checkboxRows[row.index][col.key]
      if (opt && !opt.disabled) {
        opt.checked = !opt.checked
        this.$emit('cell-checkbox', data[row.index], col.key, opt)
      }
    },
    dealUpload (row, col) {
      const { uploadDisabledRows, data } = this
      if (!uploadDisabledRows[row.index].disabled) {
        this.$emit('cell-upload', data[row.index], col.key)
      }
    },
    // 编辑操作
    toEditMode (row, col, data) {
      const { scroll, flatData } = this
      clearTimeout(this.tooltipTimer)
      this.tooltip.show = false
      this.prevCatchEditMode = this.catchEditMode
      this.catchEditMode = { row, col }
      this.$emit('edit-mode', {
        left: col.x - scroll.disx,
        top: row.y - scroll.disy + 1,
        width: col.width + 1,
        row: data,
        col,
        index: row.index,
        value: flatData[row.index][col.key]
      })
    },
    closeEditMode () {
      this.$emit('close-edit-mode')
    },
    editRepaint (val, isMode) {
      let { row, col } = this.catchEditMode
      if (!isMode) {
        col = this.prevCatchEditMode.col
        row = this.prevCatchEditMode.row
      }
      if (this.mode && row && col) {
        this.flatData[row.index][col.key] = val
        this.calculate()
        this.closeEditMode()
      }
    }
  },
  beforeDestroy () {
    this.removeEvents()
    this.keyDownTimer = null
  }
}

