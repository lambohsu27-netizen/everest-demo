import React, { useRef, useState } from 'react'
import { Paper, Popover } from '@mui/material'

function MyPopper({
  children,
  id,
  maxWidth,
  placement = 'bottom',
  target,
  haveValue,
  onOpen,
}) {
  const popperRef = useRef(null) // Referensi untuk instance SimpleBar
  let anchorOrigin
  let transformOrigin
  const style = {
    '&.MuiModal-root': {
      height: '100vh',
    },
    '&.MuiPopover-root .MuiPaper-root': {
      boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
      border: '1px solid #EAECF0',
      borderRadius: '12px',
      // boxShadow: 'unset',
      // border: 'unset',
      // borderRadius: 'unset',
      // backgroundColor: 'unset',
      overflow: 'hidden',
      // height: '90vh',
    },
  }

  if (placement === 'top-start') {
    anchorOrigin = { vertical: 'top', horizontal: 'left' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'top') {
    anchorOrigin = { vertical: 'top', horizontal: 'center' }
    transformOrigin = { vertical: 'bottom', horizontal: 'center' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'top-end') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '-8px'
  } else if (placement === 'left-start') {
    anchorOrigin = { vertical: 'top', horizontal: 'left' }
    transformOrigin = { vertical: 'top', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginLeft = '-8px'
  } else if (placement === 'left') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'left-end') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'bottom-start') {
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' }
    transformOrigin = { vertical: 'top', horizontal: 'left' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'bottom') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'bottom-end') {
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' }
    transformOrigin = { vertical: 'top', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'right-start') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'right') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  } else if (placement === 'right-end') {
    anchorOrigin = { vertical: 'top', horizontal: 'right' }
    transformOrigin = { vertical: 'bottom', horizontal: 'right' }
    style['&.MuiPopover-root .MuiPaper-root'].marginTop = '8px'
  }

  // const previousAnchorElPosition = useRef(undefined);
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  const show = (event) => {
    // const rect = event.currentTarget.getBoundingClientRect();
    // const selection = window.getSelection();
    // // Skip if selection has a length of 0
    // // if (!selection || selection.anchorOffset === selection.focusOffset) return;

    // const getBoundingClientRect = () => {
    //     if (selection.rangeCount === 0 && previousAnchorElPosition.current) {
    //         setOpen(false);
    //         return previousAnchorElPosition.current;
    //     }
    //     return selection.getRangeAt(0).getBoundingClientRect();
    // };

    setAnchorEl(event?.currentTarget ?? event)
    setOpen(true)
    onOpen && onOpen()
    // setAnchorEl({ getBoundingClientRect });
  }
  const close = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const recalculate = () => {
    console.log(popperRef)
    console.log(popperRef.current)
    popperRef.current.updatePosition()
  }

  // useEffect(() => {
  //     if (anchorEl) {
  //         if (typeof anchorEl === 'object') {
  //             previousAnchorElPosition.current = anchorEl.getBoundingClientRect();
  //         } else {
  //             previousAnchorElPosition.current = anchorEl().getBoundingClientRect();
  //         }
  //     }
  // }, [anchorEl]);

  // useEffect(() => {
  //     if (popperRef && popperRef.current) {
  //         popperRef.current.show = show;
  //     }
  // }, []);
  return (
    <div className={`${haveValue ? 'rounded-[10px] !bg-green-300' : ''}`}>
      {target && target(open, show)}
      <Popover
        action={popperRef}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        placement={placement}
        sx={style}
      >
        {children && children(open, anchorEl, show, close, recalculate)}
      </Popover>
    </div>
  )
}

export default MyPopper
