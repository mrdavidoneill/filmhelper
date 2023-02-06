import "@testing-library/jest-dom";

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LogIn from "@/components/login";
import { fetchToken } from "@/shared/api";

const TOKEN = "some-token-login.js";
const CORRECT_USERNAME = "us";
const CORRECT_PASSWORD = "pw";
const BAD_USERNAME = "badus";
const BAD_PASSWORD = "badpw";

jest.mock("@/shared/api", () => ({
  fetchToken: jest.fn((username, password) => {
    if (username == CORRECT_USERNAME && password == CORRECT_PASSWORD) {
      return Promise.resolve({ token: TOKEN });
    } else {
      return Promise.resolve({});
    }
  }),
}));

const mockUseRouter = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => mockUseRouter(),
}));

describe("LogIn component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("token");
  });

  it("should submit the form with correct credentials", async () => {
    const setError = jest.fn();
    mockUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
    const { getByLabelText, getByText } = render(<LogIn setError={setError} />);

    fireEvent.change(getByLabelText(/Username.*\*/), {
      target: { value: CORRECT_USERNAME },
    });
    fireEvent.change(getByLabelText(/Password.*\*/), {
      target: { value: CORRECT_PASSWORD },
    });
    fireEvent.submit(getByText("Sign In"));

    await waitFor(() => {
      expect(fetchToken).toHaveBeenCalledWith(
        CORRECT_USERNAME,
        CORRECT_PASSWORD
      );
      expect(localStorage.getItem("token")).toEqual(TOKEN);
      expect(setError).not.toHaveBeenCalled();
    });
  });

  it("should show error when username is empty", async () => {
    const setError = jest.fn();
    mockUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
    const { getByLabelText, getByText } = render(<LogIn setError={setError} />);

    fireEvent.change(getByLabelText(/Password.*\*/), {
      target: { value: CORRECT_PASSWORD },
    });
    fireEvent.submit(getByText("Sign In"));

    await waitFor(() => {
      expect(localStorage.getItem("token")).not.toEqual(TOKEN);
      expect(setError).toHaveBeenCalled();
    });
  });

  it("should show error when password is empty", async () => {
    const setError = jest.fn();
    mockUseRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
    const { getByLabelText, getByText } = render(<LogIn setError={setError} />);

    fireEvent.change(getByLabelText(/Username.*\*/), {
      target: { value: CORRECT_USERNAME },
    });
    fireEvent.submit(getByText("Sign In"));

    await waitFor(() => {
      expect(localStorage.getItem("token")).not.toEqual(TOKEN);
      expect(setError).toHaveBeenCalled();
    });
  });

  it("should show an error message if token is not returned", async () => {
    const setError = jest.fn();

    const { getByLabelText, getByText } = render(<LogIn setError={setError} />);

    fireEvent.change(getByLabelText(/Username.*\*/), {
      target: { value: BAD_USERNAME },
    });
    fireEvent.change(getByLabelText(/Password.*\*/), {
      target: { value: BAD_PASSWORD },
    });
    fireEvent.submit(getByText("Sign In"));

    await waitFor(() => {
      expect(fetchToken).toHaveBeenCalledWith(BAD_USERNAME, BAD_PASSWORD);
      expect(localStorage.getItem("token")).toBeNull();
      expect(setError).toHaveBeenCalled();
    });
  });
});
