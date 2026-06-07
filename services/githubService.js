const GITHUB_USER = "Floridadoll1313";

export async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
  );

  if (!res.ok) throw new Error("GitHub fetch failed");

  return await res.json();
}