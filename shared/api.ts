const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function postAPIRequest({
  body,
  resource,
}: {
  body: Object;
  resource: string;
}) {
  const response = await fetch(`${API_BASE_URL}/${resource}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getAPIRequest({
  token,
  resource,
}: {
  token: string;
  resource: string;
}) {
  const response = await fetch(`${API_BASE_URL}/${resource}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return response.json();
}

export async function fetchToken(username: string, password: string) {
  return postAPIRequest({
    body: { username, password },
    resource: "api-token-auth",
  });
}

export async function getFilmWatchList(token: string) {
  return getAPIRequest({
    token,
    resource: "filmwatchlist",
  });
}
