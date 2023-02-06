import React from "react";
import { render } from "@testing-library/react";
import BottomNavBar from "@/components/bottomnav";

const mockRouter = {
  pathname: "/discover",
};

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => mockRouter),
}));

describe("BottomNavBar component", () => {
  it("renders correctly for /discover path", () => {
    mockRouter.pathname = "/discover";
    const { asFragment } = render(<BottomNavBar />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly for /watchlist path", () => {
    mockRouter.pathname = "/watchlist";
    const { asFragment } = render(<BottomNavBar />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly for /ratings path", () => {
    mockRouter.pathname = "/ratings";
    const { asFragment } = render(<BottomNavBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
