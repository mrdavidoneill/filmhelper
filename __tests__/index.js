import "@testing-library/jest-dom";

import { render, cleanup, screen } from "@testing-library/react";
import Index from "@/pages/index";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
describe("Index component", () => {
  afterEach(cleanup);

  it("renders the Loading component", () => {
    render(<Index />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("redirects to /discover if token is present in local storage", () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({ push }));
    localStorage.setItem("token", "dummyToken");
    render(<Index />);
    expect(push).toHaveBeenCalledWith("/discover");
  });

  it("redirects to /signin if token is not present in local storage", () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({ push }));
    localStorage.removeItem("token");
    render(<Index />);
    expect(push).toHaveBeenCalledWith("/signin");
  });
});
