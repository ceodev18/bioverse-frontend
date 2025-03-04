const API_URL = process.env.REACT_APP_API_URL;

export async function getData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

export async function postData<T, B>(endpoint: string, body: B): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to post to ${endpoint}`);
  return res.json();
}
