import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  OCEAN TIDE DROP — AI SURFER COMMAND CENTER
//  GitHub API + Anthropic AI Repo Analysis
// ═══════════════════════════════════════════════════════

const GITHUB_USER = "Floridadoll1313";

// Animated ocean wave SVG background
function OceanBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
      background: "linear-gradient(180deg, #00000f 0%, #000a1a 40%, #001020 100%)"
    }}>
      {/* Star field */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 2 + 1 + "px",
          height: Math.random() * 2 + 1 + "px",
          borderRadius: "50%",
          background: `rgba(${Math.random() > 0.7 ? "100,220,255" : "255,255,255"},${Math.random() * 0.7 + 0.3})`,
          top: Math.random() * 60 + "%",
          left: Math.random() * 100 + "%",
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: Math.random() * 3 + "s"
        }} />
      ))}
      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />
      {/* Horizon glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(0deg, rgba(0,180,255,0.08) 0%, transparent 100%)"
      }} />
    </div>
  );
}

// Scanline overlay
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)"
    }} />
  );
}

// Neon text component
function NeonText({ children, color = "#00d4ff", size = "1rem", weight = "700", glow = true, style = {} }) {
  return (
    <span style={{
      fontFamily: "'Orbitron', 'Courier New', monospace",
      fontSize: size,
      fontWeight: weight,
      color,
      textShadow: glow ? `0 0 10px ${color}, 0 0 20px ${color}80, 0 0 40px ${color}40` : "none",
      letterSpacing: "0.05em",
      ...style
    }}>
      {children}
    </span>
  );
}

// Status badge
function StatusBadge({ status }) {
  const map = {
    success: { color: "#00ff88", label: "🟢 LIVE" },
    failure: { color: "#ff3366", label: "🔴 FAIL" },
    pending: { color: "#ffaa00", label: "🟡 BUILDING" },
    unknown: { color: "#666", label: "⚪ UNKNOWN" },
    active: { color: "#00d4ff", label: "🔵 ACTIVE" },
  };
  const s = map[status] || map.unknown;
  return (
    <span style={{
      fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", fontWeight: "700",
      color: s.color, textShadow: `0 0 8px ${s.color}`,
      border: `1px solid ${s.color}40`, borderRadius: "4px",
      padding: "2px 8px", background: `${s.color}10`
    }}>
      {s.label}
    </span>
  );
}

// Glass card
function GlassCard({ children, style = {}, hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "rgba(0,212,255,0.06)"
          : "rgba(0,10,30,0.7)",
        border: `1px solid ${hovered ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.15)"}`,
        borderRadius: "12px",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 0 30px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.03)"
          : "0 4px 20px rgba(0,0,0,0.5)",
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Repo card component
function RepoCard({ repo, onAnalyze, analyzing }) {
  const [expanded, setExpanded] = useState(false);
  const daysSince = Math.floor((Date.now() - new Date(repo.pushed_at)) / (1000 * 60 * 60 * 24));
  const activity = daysSince === 0 ? "today" : daysSince === 1 ? "yesterday" : `${daysSince}d ago`;

  return (
    <GlassCard style={{ padding: "20px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
            <NeonText color="#00d4ff" size="0.95rem">{repo.name}</NeonText>
            {repo.private && (
              <span style={{ fontSize: "0.55rem", color: "#ff6600", border: "1px solid #ff660040", borderRadius: "4px", padding: "1px 6px" }}>🔒 PRIVATE</span>
            )}
            <StatusBadge status="active" />
          </div>
          {repo.description && (
            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(180,220,255,0.7)", margin: "0 0 10px", lineHeight: 1.4 }}>
              {repo.description}
            </p>
          )}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { icon: "⭐", val: repo.stargazers_count, label: "stars" },
              { icon: "🐛", val: repo.open_issues_count, label: "issues" },
              { icon: "🔀", val: repo.forks_count, label: "forks" },
              { icon: "🕐", val: activity, label: "push" },
            ].map(({ icon, val, label }) => (
              <div key={label} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(150,200,255,0.8)" }}>
                {icon} <span style={{ color: "#00d4ff" }}>{val}</span> <span style={{ opacity: 0.5 }}>{label}</span>
              </div>
            ))}
            {repo.language && (
              <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(150,200,255,0.8)" }}>
                💻 <span style={{ color: "#00ffaa" }}>{repo.language}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={() => onAnalyze(repo)}
            disabled={analyzing}
            style={{
              fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", fontWeight: "700",
              color: "#00d4ff", background: "transparent",
              border: "1px solid rgba(0,212,255,0.5)", borderRadius: "6px",
              padding: "6px 12px", cursor: analyzing ? "wait" : "pointer",
              transition: "all 0.2s",
              textShadow: "0 0 8px #00d4ff"
            }}
          >
            {analyzing ? "SCANNING..." : "⚡ ANALYZE"}
          </button>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", fontWeight: "700",
              color: "#888", background: "transparent",
              border: "1px solid rgba(100,100,100,0.4)", borderRadius: "6px",
              padding: "6px 12px", textDecoration: "none", textAlign: "center",
              transition: "all 0.2s"
            }}
          >
            ↗ GITHUB
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

// AI Analysis Panel
function AIAnalysisPanel({ result, repo, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!result) return null;

  // Parse health score from result
  const scoreMatch = result.match(/(\d{1,3})%|score[:\s]+(\d{1,3})/i);
  const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : null;
  const scoreColor = score >= 80 ? "#00ff88" : score >= 60 ? "#ffaa00" : "#ff3366";

  return (
    <GlassCard ref={panelRef} style={{ padding: "24px", marginTop: "16px", borderColor: "rgba(0,255,136,0.3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <NeonText color="#00ff88" size="0.7rem">⚡ AI WAVE REPORT</NeonText>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", color: "rgba(0,255,136,0.6)", marginTop: "4px" }}>
            ANALYSIS: {repo?.name?.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {score !== null && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.4rem", fontWeight: "900", color: scoreColor, textShadow: `0 0 20px ${scoreColor}` }}>
                {score}%
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>HEALTH</div>
            </div>
          )}
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(255,50,100,0.4)", borderRadius: "6px",
            color: "#ff3366", fontFamily: "monospace", fontSize: "0.7rem", padding: "4px 10px", cursor: "pointer"
          }}>✕ CLOSE</button>
        </div>
      </div>
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: "0.78rem", lineHeight: 1.7,
        color: "rgba(180,230,255,0.9)", whiteSpace: "pre-wrap",
        borderTop: "1px solid rgba(0,212,255,0.15)", paddingTop: "16px"
      }}>
        {result}
      </div>
    </GlassCard>
  );
}

// Nav sidebar
function Sidebar({ activeNav, setActiveNav }) {
  const navItems = [
    { id: "dashboard", icon: "🌊", label: "DASHBOARD" },
    { id: "repos", icon: "📦", label: "REPOS" },
    { id: "deployments", icon: "🚀", label: "DEPLOY" },
    { id: "agents", icon: "🤖", label: "AI AGENTS" },
    { id: "activity", icon: "⚡", label: "ACTIVITY" },
    { id: "members", icon: "👥", label: "CREW" },
    { id: "settings", icon: "⚙️", label: "SETTINGS" },
  ];

  return (
    <div style={{
      width: "200px", flexShrink: 0, padding: "20px 12px",
      borderRight: "1px solid rgba(0,212,255,0.1)",
      display: "flex", flexDirection: "column", gap: "4px"
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", padding: "16px 0 24px", borderBottom: "1px solid rgba(0,212,255,0.1)", marginBottom: "12px" }}>
        <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🌊</div>
        <NeonText color="#00d4ff" size="0.65rem" style={{ display: "block", letterSpacing: "0.15em" }}>OCEAN TIDE DROP</NeonText>
        <div style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", letterSpacing: "0.1em" }}>
          AI SURFER CONSOLE
        </div>
      </div>

      {navItems.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveNav(id)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 14px", borderRadius: "8px",
            background: activeNav === id ? "rgba(0,212,255,0.12)" : "transparent",
            border: activeNav === id ? "1px solid rgba(0,212,255,0.3)" : "1px solid transparent",
            color: activeNav === id ? "#00d4ff" : "rgba(150,200,255,0.5)",
            fontFamily: "'Orbitron', monospace", fontSize: "0.58rem", fontWeight: "700",
            letterSpacing: "0.08em", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
            textShadow: activeNav === id ? "0 0 8px #00d4ff" : "none"
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
          {activeNav === id && <span style={{ marginLeft: "auto", color: "#00d4ff" }}>▶</span>}
        </button>
      ))}

      {/* Bull Hooper memorial */}
      <div style={{
        marginTop: "auto", padding: "14px", borderTop: "1px solid rgba(0,212,255,0.1)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "1rem", marginBottom: "4px" }}>🌊</div>
        <div style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(100,160,200,0.6)", lineHeight: 1.5 }}>
          In memory of<br />
          <span style={{ color: "rgba(0,212,255,0.8)" }}>Johnny "Bull" Hooper</span><br />
          Salvo, NC
        </div>
      </div>
    </div>
  );
}

// Dashboard overview page
function DashboardPage({ repos, profile, loading }) {
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalIssues = repos.reduce((a, r) => a + r.open_issues_count, 0);
  const langs = {};
  repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
  const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "REPOSITORIES", value: repos.length, color: "#00d4ff", icon: "📦" },
    { label: "TOTAL STARS", value: totalStars, color: "#ffcc00", icon: "⭐" },
    { label: "OPEN ISSUES", value: totalIssues, color: "#ff6644", icon: "🐛" },
    { label: "FOLLOWERS", value: profile?.followers || "–", color: "#00ff88", icon: "👥" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <NeonText color="#00d4ff" size="1.4rem">COMMAND BRIDGE</NeonText>
        <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(0,212,255,0.5)", marginTop: "6px" }}>
          {profile ? `${GITHUB_USER} · ${profile.name || ""}` : "Loading profile..."} · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "28px" }}>
        {stats.map(({ label, value, color, icon }) => (
          <GlassCard key={label} style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{icon}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.6rem", fontWeight: "900", color, textShadow: `0 0 20px ${color}` }}>
              {loading ? "—" : value}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", marginTop: "4px", letterSpacing: "0.1em" }}>
              {label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Profile + top lang */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <GlassCard style={{ padding: "20px" }}>
          <NeonText color="#00d4ff" size="0.65rem" style={{ display: "block", marginBottom: "14px", letterSpacing: "0.12em" }}>
            🧬 OPERATOR PROFILE
          </NeonText>
          {profile ? (
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <img src={profile.avatar_url} alt="avatar" style={{
                width: "52px", height: "52px", borderRadius: "50%",
                border: "2px solid rgba(0,212,255,0.4)",
                boxShadow: "0 0 16px rgba(0,212,255,0.3)"
              }} />
              <div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", color: "#fff", fontWeight: "700" }}>{profile.login}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.7)", marginTop: "4px" }}>{profile.bio || "OTD Realmwalker"}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(150,200,255,0.5)", marginTop: "4px" }}>
                  📍 {profile.location || "Hatteras Island, NC"}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(0,212,255,0.5)" }}>Loading...</div>
          )}
        </GlassCard>
        <GlassCard style={{ padding: "20px" }}>
          <NeonText color="#00ff88" size="0.65rem" style={{ display: "block", marginBottom: "14px", letterSpacing: "0.12em" }}>
            💻 TECH STACK SCAN
          </NeonText>
          {Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([lang, count]) => (
            <div key={lang} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(180,230,255,0.8)", width: "90px" }}>{lang}</div>
              <div style={{ flex: 1, height: "4px", background: "rgba(0,212,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "2px",
                  background: "linear-gradient(90deg, #00d4ff, #00ff88)",
                  width: `${(count / repos.length) * 100}%`,
                  boxShadow: "0 0 8px #00d4ff"
                }} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(0,212,255,0.7)", width: "30px" }}>{count}</div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
export default function OTDCommandCenter() {
  const [activeNav, setActiveNav] = useState("repos");
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [analysisResults, setAnalysisResults] = useState({});
  const [analyzing, setAnalyzing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("pushed");
  const analysisRef = useRef({});

  // Fetch GitHub data
  async function fetchGitHub(pat) {
    setLoading(true);
    setError("");
    try {
      const headers = pat ? { Authorization: `token ${pat}` } : {};

      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { headers })
      ]);

      if (!profileRes.ok) throw new Error(`GitHub API: ${profileRes.status} – ${profileRes.status === 403 ? "Rate limited. Add a PAT token." : "Error fetching data"}`);
      if (!reposRes.ok) throw new Error(`Repos API: ${reposRes.status}`);

      const profileData = await profileRes.json();
      const reposData = await reposRes.json();

      setProfile(profileData);
      setRepos(reposData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGitHub(""); }, []);

  // AI analysis
  async function analyzeRepo(repo) {
    setAnalyzing(repo.name);
    try {
      const prompt = `You are the OTD AI Surfer — a sharp, ocean-themed technical advisor for Ocean Tide Drop (otdaisurfer.surf), a Cloudflare-deployed React/Vite platform built by Floridadoll1313 (Hatteras Island, NC). 

Analyze this GitHub repository and provide a WAVE REPORT:

Repository: ${repo.name}
Description: ${repo.description || "No description"}
Language: ${repo.language || "Unknown"}
Stars: ${repo.stargazers_count}
Open Issues: ${repo.open_issues_count}
Forks: ${repo.forks_count}
Last Push: ${new Date(repo.pushed_at).toLocaleDateString()}
Topics: ${repo.topics?.join(", ") || "None"}
Is Fork: ${repo.fork}
Default Branch: ${repo.default_branch}
Size: ${repo.size} KB

Return a structured WAVE REPORT with these sections:

🌊 HEALTH SCORE: X% (give a realistic percentage based on the data)

📡 SIGNAL READ:
(2-3 sentences on what this repo appears to be and its purpose)

✅ STRONG CURRENTS:
(2-3 bullet points on what's working well)

⚠️ RIP CURRENTS (Risks):
(2-3 bullet points on potential issues or concerns)

🚀 NEXT WAVE (Recommendations):
(2-3 concrete action items)

🤙 SURFER'S NOTE:
(One punchy, motivating closing line in the OTD voice — ocean/surf metaphor, hype the builder)

Keep it punchy, technical, and ocean-coded. Use the data provided. Don't make up specific code details you can't know.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Analysis unavailable.";
      setAnalysisResults(prev => ({ ...prev, [repo.name]: text }));
    } catch (e) {
      setAnalysisResults(prev => ({ ...prev, [repo.name]: `⚠️ Analysis failed: ${e.message}` }));
    } finally {
      setAnalyzing(null);
    }
  }

  // Filter + sort repos
  const filteredRepos = repos
    .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "issues") return b.open_issues_count - a.open_issues_count;
      return new Date(b.pushed_at) - new Date(a.pushed_at); // pushed (default)
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #00000f; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0,212,255,0.2); }
          50% { border-color: rgba(0,212,255,0.5); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 3px; }
      `}</style>

      <OceanBackground />
      <Scanlines />

      <div style={{
        position: "relative", zIndex: 2, minHeight: "100vh",
        display: "flex", flexDirection: "column"
      }}>
        {/* Top bar */}
        <div style={{
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(0,5,15,0.6)", backdropFilter: "blur(12px)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <NeonText color="#00d4ff" size="0.6rem" style={{ letterSpacing: "0.2em" }}>
              ◈ OTD AI SURFER CONSOLE ◈
            </NeonText>
            <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(0,212,255,0.4)" }}>
              v2.6.26 · {GITHUB_USER}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* PAT input */}
            <input
              type="password"
              placeholder="GitHub PAT (optional, for private repos)"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (setToken(tokenInput), fetchGitHub(tokenInput))}
              style={{
                fontFamily: "monospace", fontSize: "0.6rem",
                background: "rgba(0,20,40,0.8)", border: "1px solid rgba(0,212,255,0.2)",
                color: "#aad4ff", borderRadius: "6px", padding: "5px 10px", width: "220px",
                outline: "none"
              }}
            />
            <button
              onClick={() => { setToken(tokenInput); fetchGitHub(tokenInput); }}
              style={{
                fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", fontWeight: "700",
                color: "#00d4ff", background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.3)", borderRadius: "6px",
                padding: "5px 12px", cursor: "pointer"
              }}
            >
              ⟳ SYNC
            </button>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: loading ? "#ffaa00" : "#00ff88", textShadow: `0 0 8px ${loading ? "#ffaa00" : "#00ff88"}` }}>
              {loading ? "◌ SCANNING..." : `● ${repos.length} REPOS LOADED`}
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

          {/* Content area */}
          <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", maxHeight: "calc(100vh - 50px)" }}>
            {error && (
              <GlassCard style={{ padding: "16px", marginBottom: "20px", borderColor: "rgba(255,50,50,0.4)", background: "rgba(255,0,0,0.05)" }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#ff6655" }}>⚠️ {error}</span>
                {error.includes("Rate limit") && (
                  <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,180,150,0.7)", marginTop: "6px" }}>
                    GitHub limits unauthenticated requests to 60/hr. Enter a GitHub PAT above to get 5,000/hr.
                  </div>
                )}
              </GlassCard>
            )}

            {/* DASHBOARD */}
            {activeNav === "dashboard" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <DashboardPage repos={repos} profile={profile} loading={loading} />
              </div>
            )}

            {/* REPOS */}
            {activeNav === "repos" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <NeonText color="#00d4ff" size="1.2rem">REPOSITORIES</NeonText>
                    <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px" }}>
                      {filteredRepos.length} of {repos.length} repos · {GITHUB_USER}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      placeholder="🔍 Search repos..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        fontFamily: "monospace", fontSize: "0.7rem",
                        background: "rgba(0,20,40,0.8)", border: "1px solid rgba(0,212,255,0.2)",
                        color: "#aad4ff", borderRadius: "8px", padding: "8px 14px", width: "200px", outline: "none"
                      }}
                    />
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      style={{
                        fontFamily: "monospace", fontSize: "0.65rem",
                        background: "rgba(0,20,40,0.8)", border: "1px solid rgba(0,212,255,0.2)",
                        color: "#aad4ff", borderRadius: "8px", padding: "8px 12px", outline: "none", cursor: "pointer"
                      }}
                    >
                      <option value="pushed">Sort: Recent Push</option>
                      <option value="stars">Sort: Stars</option>
                      <option value="issues">Sort: Issues</option>
                      <option value="name">Sort: Name</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px", fontFamily: "'Orbitron', monospace", fontSize: "0.8rem", color: "rgba(0,212,255,0.5)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "12px", animation: "twinkle 1s ease-in-out infinite" }}>🌊</div>
                    SCANNING REPOSITORIES...
                  </div>
                ) : (
                  filteredRepos.map(repo => (
                    <div key={repo.id}>
                      <RepoCard
                        repo={repo}
                        onAnalyze={analyzeRepo}
                        analyzing={analyzing === repo.name}
                      />
                      {analysisResults[repo.name] && (
                        <AIAnalysisPanel
                          result={analysisResults[repo.name]}
                          repo={repo}
                          onClose={() => setAnalysisResults(prev => { const n = { ...prev }; delete n[repo.name]; return n; })}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DEPLOYMENTS */}
            {activeNav === "deployments" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <NeonText color="#00d4ff" size="1.2rem">DEPLOYMENT TRACKER</NeonText>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", marginBottom: "24px" }}>
                  Active Cloudflare Workers & Pages
                </div>
                {[
                  { name: "ocean2", status: "success", url: "otdaisurfer.surf", note: "Primary SPA Worker" },
                  { name: "aisurfer13", status: "success", url: "aisurfer13.workers.dev", note: "API Worker" },
                  { name: "otdaisurfer13", status: "success", url: "otdaisurfer13.workers.dev", note: "Legacy Worker" },
                ].map(d => (
                  <GlassCard key={d.name} style={{ padding: "20px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                          <NeonText color="#00d4ff">{d.name}</NeonText>
                          <StatusBadge status={d.status} />
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(150,200,255,0.7)" }}>
                          🌐 {d.url} · {d.note}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`https://${d.url}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.55rem", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "6px", padding: "6px 12px", textDecoration: "none" }}>
                          ↗ VISIT
                        </a>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* AI AGENTS */}
            {activeNav === "agents" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <NeonText color="#00d4ff" size="1.2rem">AI AGENT NETWORK</NeonText>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", marginBottom: "24px" }}>
                  OTD Autonomous Intelligence Layer
                </div>
                {[
                  { name: "WAVE ANALYST", icon: "🌊", desc: "GitHub repo health scoring & code review", status: "active", power: "Claude Sonnet 4" },
                  { name: "DEPLOY SCOUT", icon: "🚀", desc: "Cloudflare Workers deployment monitoring", status: "active", power: "Cloudflare API" },
                  { name: "SAND DOLLAR ORACLE", icon: "🪙", desc: "Stripe payment & membership analytics", status: "pending", power: "Stripe API" },
                  { name: "NEURAL NEXUS BOT", icon: "🧠", desc: "AI learning path recommendations", status: "pending", power: "Claude + Supabase" },
                ].map(agent => (
                  <GlassCard key={agent.name} style={{ padding: "20px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <div style={{ fontSize: "2rem" }}>{agent.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <NeonText color="#00ff88" size="0.85rem">{agent.name}</NeonText>
                          <StatusBadge status={agent.status} />
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(180,230,255,0.7)", marginBottom: "4px" }}>{agent.desc}</div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(0,212,255,0.5)" }}>Powered by: {agent.power}</div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* ACTIVITY */}
            {activeNav === "activity" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <NeonText color="#00d4ff" size="1.2rem">RECENT ACTIVITY</NeonText>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", marginBottom: "24px" }}>
                  Repository push timeline
                </div>
                {repos.slice(0, 12).map((repo, i) => (
                  <div key={repo.id} style={{
                    display: "flex", gap: "16px", alignItems: "flex-start",
                    paddingBottom: "16px", marginBottom: "16px",
                    borderBottom: "1px solid rgba(0,212,255,0.08)"
                  }}>
                    <div style={{ width: "2px", background: i === 0 ? "#00d4ff" : "rgba(0,212,255,0.2)", borderRadius: "1px", alignSelf: "stretch" }} />
                    <div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", color: i === 0 ? "#00d4ff" : "rgba(150,200,255,0.8)" }}>
                          {repo.name}
                        </span>
                        {repo.language && <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#00ff88" }}>{repo.language}</span>}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(120,180,220,0.6)" }}>
                        Last push · {new Date(repo.pushed_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CREW / MEMBERS */}
            {activeNav === "members" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <NeonText color="#00d4ff" size="1.2rem">THE CREW</NeonText>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", marginBottom: "24px" }}>
                  OTD Core Team
                </div>
                {[
                  { name: "Floridadoll1313", role: "Creative Architect & Realmwalker", icon: "👁️", note: "Founder · Hatteras Island, NC", color: "#00d4ff" },
                  { name: "Marlin", role: "Co-Founder & Chief Vibe Officer", icon: "🐕", note: "Chihuahua · Chief Emotional Officer", color: "#ffcc00" },
                  { name: 'Johnny "Bull" Hooper', role: "Guardian Spirit", icon: "🌊", note: "Salvo, NC · In memoriam · Always in the current", color: "rgba(150,200,255,0.7)" },
                ].map(m => (
                  <GlassCard key={m.name} style={{ padding: "20px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <div style={{ fontSize: "2.2rem" }}>{m.icon}</div>
                      <div>
                        <NeonText color={m.color} size="0.9rem" style={{ display: "block", marginBottom: "4px" }}>{m.name}</NeonText>
                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.6rem", color: "rgba(0,212,255,0.7)", marginBottom: "4px" }}>{m.role}</div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(150,200,255,0.5)" }}>{m.note}</div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* SETTINGS */}
            {activeNav === "settings" && (
              <div style={{ animation: "slideIn 0.4s ease" }}>
                <NeonText color="#00d4ff" size="1.2rem">SYSTEM SETTINGS</NeonText>
                <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginTop: "4px", marginBottom: "24px" }}>
                  OTD Platform Configuration
                </div>
                {[
                  { label: "GITHUB USER", value: GITHUB_USER, color: "#00d4ff" },
                  { label: "PLATFORM", value: "Cloudflare Workers + Pages", color: "#00ff88" },
                  { label: "FRAMEWORK", value: "React + Vite + TypeScript + Tailwind v4", color: "#00ff88" },
                  { label: "AUTH / DB", value: "Supabase (mkgnyarwiscttobnytin)", color: "#ffaa00" },
                  { label: "PAYMENTS", value: "Stripe (Live)", color: "#00ff88" },
                  { label: "DOMAIN", value: "otdaisurfer.surf", color: "#00d4ff" },
                  { label: "MEMBERSHIP TIERS", value: "Initiate $17 · Automator $35 · Architect $75 · Omniscient $150", color: "#ffcc00" },
                ].map(({ label, value, color }) => (
                  <GlassCard key={label} style={{ padding: "16px 20px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(150,200,255,0.5)", letterSpacing: "0.1em" }}>{label}</div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color }}>{value}</div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
