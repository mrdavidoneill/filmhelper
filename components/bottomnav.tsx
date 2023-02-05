import React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import MovieIcon from "@mui/icons-material/Movie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RateReviewIcon from "@mui/icons-material/RateReview";

const PATHS = ["/discover", "/watchlist", "/ratings"];

export default function BottomNavBar() {
  const router = useRouter();
  const [value] = React.useState<number>(PATHS.indexOf(router.pathname));

  return (
    <Box>
      <BottomNavigation className="w-full " showLabels value={value}>
        <BottomNavigationAction
          href="discover"
          label="Discover"
          icon={<MovieIcon />}
        />
        <BottomNavigationAction
          href="watchlist"
          label="Watch List"
          icon={<VisibilityIcon />}
        />
        <BottomNavigationAction
          href="rate"
          label="My Ratings"
          icon={<RateReviewIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
