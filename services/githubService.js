const GITHUB_USER = "Floridadoll1313";

export async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`
  );

  if (!res.ok) throw new Error("Failed to fetch repos");

  return await res.json();
}