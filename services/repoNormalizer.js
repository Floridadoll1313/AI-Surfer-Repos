export function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    issues: repo.open_issues_count,
    language: repo.language,
    updatedAt: repo.pushed_at,
    createdAt: repo.created_at,
    url: repo.html_url
  };
}