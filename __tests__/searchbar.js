import "@testing-library/jest-dom";

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SearchAppBar from "../components/searchbar";

describe("SearchAppBar component", () => {
  it("renders correctly", () => {
    const onChange = jest.fn();
    const onKeyDown = jest.fn();
    const value = "";
    const { container } = render(
      <SearchAppBar value={value} onChange={onChange} onKeyDown={onKeyDown} />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders the input value correctly", () => {
    const value = "test";
    const { getByLabelText } = render(
      <SearchAppBar value={value} onChange={() => {}} onKeyDown={() => {}} />
    );
    expect(getByLabelText("search").value).toBe(value);
  });

  it("fires onChange event when the input value changes", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <SearchAppBar value="" onChange={onChange} onKeyDown={() => {}} />
    );
    fireEvent.change(getByLabelText("search"), { target: { value: "test" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("fires onKeyDown event when a key is pressed", () => {
    const onKeyDown = jest.fn();
    const { getByLabelText } = render(
      <SearchAppBar value="" onChange={() => {}} onKeyDown={onKeyDown} />
    );
    fireEvent.keyDown(getByLabelText("search"), { key: "Enter", code: 13 });
    expect(onKeyDown).toHaveBeenCalled();
  });
});
