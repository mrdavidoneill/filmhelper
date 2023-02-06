import "@testing-library/jest-dom";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SignIn from "@/pages/signin";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/shared/theme";

jest.mock("@/components/login", () => {
  return function DummyLogin({ setError }) {
    return (
      <button onClick={() => setError("error message")}>Dummy login</button>
    );
  };
});

describe("SignIn", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <SignIn />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("shows an error message", () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <SignIn />
      </ThemeProvider>
    );
    fireEvent.click(getByText("Dummy login"));
    expect(getByText("Error: error message")).toBeInTheDocument();
  });

  it("dismisses the error message", () => {
    const { getByTestId, getByText, queryByText } = render(
      <ThemeProvider theme={theme}>
        <SignIn />
      </ThemeProvider>
    );

    // mock error in login component
    fireEvent.click(getByText("Dummy login"));
    expect(getByText("Error: error message")).toBeInTheDocument();

    // find and click close button
    fireEvent.click(getByTestId("CloseIcon"));

    // assert error message is not displayed
    expect(queryByText("Error: error message")).not.toBeInTheDocument();
  });
});
