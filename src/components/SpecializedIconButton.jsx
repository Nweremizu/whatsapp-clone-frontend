import { IconButton } from "@mui/material";

function SpecializedIconButton({ children, onClick, style, ...props }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{ borderRadius: "5px", ...style }}
      {...props}
    >
      {children}
    </IconButton>
  );
}

export default SpecializedIconButton;
