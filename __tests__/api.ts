import { expect } from "@jest/globals";
import fetch from "jest-fetch-mock";
fetch.enableMocks();
import {
  getFilmWatchList,
  getAPIRequest,
  postAPIRequest,
  fetchToken,
} from "@/shared/api";

describe("postAPIRequest", () => {
  it("should return JSON data from API", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    const mockResponse = { token: "test_token" };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const result = await postAPIRequest({ body: {}, resource: "test" });
    expect(result).toEqual(mockResponse);
  });

  it("should throw error if API returns non-200 status code", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    fetch.mockRejectOnce(new Error("API error"));
    await expect(
      postAPIRequest({ body: {}, resource: "test" })
    ).rejects.toThrow("API error");
  });
});

describe("fetchToken", () => {
  it("should return token from API", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    const mockResponse = { token: "test_token" };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const result = await fetchToken("username", "password");
    expect(result).toEqual(mockResponse);
  });
});

describe("getAPIRequest", () => {
  it("should return JSON data from API", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    const mockResponse = { data: [{ id: 1, name: "Test" }] };
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const result = await getAPIRequest({
      token: "test_token",
      resource: "test",
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw error if API returns non-200 status code", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    fetch.mockRejectOnce(new Error("API error"));
    await expect(
      getAPIRequest({ token: "test_token", resource: "test" })
    ).rejects.toThrow("API error");
  });
});

describe("getFilmWatchList", () => {
  it("should return the film watch list from API", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    const mockResponse = [
      { id: 1, name: "The Shawshank Redemption", watched: true },
      { id: 2, name: "The Godfather", watched: false },
    ];
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const result = await getFilmWatchList("test_token");
    expect(result).toEqual(mockResponse);
  });

  it("should throw error if API returns non-200 status code", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:1234";
    fetch.mockRejectOnce(new Error("API error"));
    await expect(getFilmWatchList("test_token")).rejects.toThrow("API error");
  });
});
