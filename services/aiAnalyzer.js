export async function analyzeRepo(repo) {
  const prompt = `
You are a senior engineering reviewer.

Analyze this GitHub repository:

Name: ${repo.name}
Stars: ${repo.stars}
Forks: ${repo.forks}
Language: ${repo.language}
Last updated: ${repo.updatedAt}

Return ONLY valid JSON:

{
  "health_score": number (0-100),
  "summary": string,
  "risks": [string],
  "recommendations": [string],
  "growth_potential": "low | medium | high"
}
`;