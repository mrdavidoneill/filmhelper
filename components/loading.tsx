import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

export default function Loading() {
  const theme = useTheme();

  return (
    <div
      className="flex h-screen flex-grow justify-center items-center"
      style={{ backgroundColor: theme.palette.background.default }}
    >
      <CircularProgress size={"4rem"} />
    </div>
  );
}
