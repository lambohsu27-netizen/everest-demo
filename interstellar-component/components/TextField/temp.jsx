
// const MyTextField = ({
//     id, type = "text", placeholder, name, value, control,
//     isRealtime, readOnly, disabled, startAdornment, endAdornment,
//     onChangeForm, onKeyDown, onFocusForm, onTapForm,
// }) => {
//     const style = {
//         '& .MuiInputBase-root': {
//             borderRadius: '8px',
//             padding: '10px 14px',
//             display: "flex",
//             gap: "8px",
//             alignItems: "center",
//             boxShadow: '0px 1px 2px 0px #1018280D',
//             backgroundColor: '#FFFFFF',
//             border: '1px solid #D0D5DD',
//             "& .MuiInputBase-input::placeholder": {
//                 fontSize: "16px",
//                 fontFamily: "'Inter', sans-serif",
//                 fontWeight: "400",
//                 lineHeight: "24px",
//                 wordWrap: "break-word",
//                 color: "#667085",
//                 opacity: 1,
//             },
//             "&.Mui-focused": {
//                 border: '1px solid #D6BBFB',
//                 boxShadow: '0px 0px 0px 4px #72C8EB3D',
//             },
//             '& .MuiInputBase-input': {
//                 padding: "0px"
//             },
//             '&.Mui-disabled': {
//                 backgroundColor: '#F9FAFB',
//                 cursor: 'not-allowed',
//             },
//             '&.Mui-disabled .MuiInputBase-input': {
//                 WebkitTextFillColor: '#667085',
//                 color: '##667085',
//             },
//             '& .MuiInputAdornment-root': {
//                 marginRight: "0px",
//                 marginLeft: "0px",
//             },
//             '& fieldset': {
//                 padding: 0,
//                 border: 'none',
//             },
//             '&:hover fieldset': {
//                 border: 'none',
//             },
//             "&.Mui-focused fieldset": {
//                 border: 'none',
//             },
//             "&.Mui-disabled fieldset": {
//                 border: 'none',
//             },
//         },
//     };


//     return (
//         <>
//             {control ? <Controller name={name} control={control} render={({ field: { value, onChange, ...field } }) => (
//                 <MuiTextField name={name} id={id} value={value ?? ''} type={type} placeholder={placeholder}
//                     variant="outlined" autoComplete="off" fullWidth
//                     disabled={disabled}
//                     onChange={(e) => {
//                         var { target: { value } } = e;
//                         onChange(value);
//                         onChangeForm && onChangeForm(e);
//                     }}
//                     onKeyDown={onKeyDown}
//                     onFocus={onFocusForm}
//                     onClick={onTapForm}
//                     sx={style}
//                     InputProps={{
//                         readOnly: Boolean(readOnly),
//                         startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
//                         endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
//                     }}
//                 />
//             )} /> : isRealtime ? <TextField id={id} name={name} value={value ?? ''} type={type} placeholder={placeholder}
//                 variant="outlined" autoComplete="off" fullWidth
//                 disabled={disabled}
//                 onChange={onChangeForm}
//                 onKeyDown={onKeyDown}
//                 onFocus={onFocusForm}
//                 onClick={onTapForm}
//                 sx={style}
//                 InputProps={{
//                     readOnly: Boolean(readOnly),
//                     startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
//                     endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
//                 }}
//             /> : <TextField id={id} name={name} defaultValue={value ?? ''} type={type} placeholder={placeholder}
//                 variant="outlined" autoComplete="off" fullWidth
//                 disabled={disabled}
//                 onChange={onChangeForm}
//                 onKeyDown={onKeyDown}
//                 onFocus={onFocusForm}
//                 onClick={onTapForm}
//                 sx={style}
//                 InputProps={{
//                     readOnly: Boolean(readOnly),
//                     startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
//                     endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
//                 }}
//             />}
//         </>

//     );
// };

// export default MyTextField;