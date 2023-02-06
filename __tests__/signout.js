import "@testing-library/jest-dom";

import SignOut from "@/pages/signout";

import React from "react";
import { render, screen } from "@testing-library/react";

import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("SignOut", () => {
  it("renders the loading component", () => {
    render(<SignOut />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("removes the token from localStorage", () => {
    localStorage.setItem("token", "test_token");
    render(<SignOut />);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("redirects to the homepage", () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({ push }));

    render(<SignOut />);
    expect(push).toHaveBeenCalledWith("/");
  });
});
