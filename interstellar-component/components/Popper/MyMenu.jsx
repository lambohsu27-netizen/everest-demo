import React, { useState } from 'react'
import { Menu, MenuItem, TableCell, TableRow, IconButton } from '@mui/material'
import { ShoppingBag02, User02 } from '@untitled-ui/icons-react'

function MyMenu({ data }) {
  const style = {
    '&.MuiPopover-root .MuiPaper-root': {
      boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
      border: '1px solid #EAECF0',
      borderRadius: '12px',
      width: 'max-content',
      '.MuiList-root.MuiList-padding': {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  }

  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 })
  const [isContextMenuOpen, setContextMenuOpen] = useState(false)

  // Menangani klik kanan pada tabel
  const handleContextMenu = (event) => {
    event.preventDefault()
    setAnchorPosition({ top: event.clientY, left: event.clientX })
    setContextMenuOpen(true)
  }

  // Menangani tutup menu konteks
  const handleClose = () => {
    setContextMenuOpen(false)
  }

  return (
    <>
      <table>
        <tbody>
          {data.map((item) => (
            <TableRow key={item.id} onContextMenu={handleContextMenu}>
              <TableCell>{item.name}</TableCell>
              {/* Tambahkan sel lain sesuai kebutuhan */}
            </TableRow>
          ))}
        </tbody>
      </table>

      {/* Menu Konteks */}
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        sx={style}
        open={isContextMenuOpen}
        onClose={handleClose}
      >
        <div className="flex h-max w-max flex-col">
          <button onClick={(e) => {}} className="py flex items-center px-1.5">
            <div className="flex items-center gap-3 px-2.5 py-[9px] text-gray-light/700">
              <User02 className="size-4" stroke="currentColor" />
              <p className="text-sm-medium">Team huddle</p>
            </div>
          </button>
          <hr className="border-gray-light/200" />
          <button onClick={(e) => {}} className="py flex items-center px-1.5">
            <div className="flex items-center gap-3 px-2.5 py-[9px] text-gray-light/700">
              <ShoppingBag02 className="size-4" stroke="currentColor" />
              <p className="text-sm-medium">Merchant</p>
            </div>
          </button>
        </div>
      </Menu>
    </>
  )
}

export default MyMenu
