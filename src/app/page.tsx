// app/page.tsx — HOME ("Build"). The civic-tech dataset / build landing.
// MCP · REST API · Showcase · Code & examples · License.
// Tailwind v4 utilities + the tokens in globals.css. Mostly static; the only
// interactive bit is the CopyButton client island.
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { Hero, SectionHeading } from "../components/Hero";
import { Button } from "../components/Button";
import {
  Arrow, Search, ExtLink, Sparkles, Database, Plug, Shield, GitHub, Grid,
} from "../components/icons";

// Stable public host of the directory API + MCP, fronted by a Cloudflare edge that
// routes /mcp and /api/* to the origin box. Cutover-stable (origin can move
// staging → directory → apex without changing this URL).
const API_BASE = "https://civictech.guide";

const PATHS = [
  { tag: "Query it", Icon: Sparkles, title: "MCP Server", desc: "Connect Claude, Cursor, or any MCP client to live, curated civic-tech data in one config block.", link: "Open setup", href: "#mcp" },
  { tag: "Pull it", Icon: Database, title: "REST API", desc: "Fetch and filter listings, categories, and facets as clean JSON. No key for public reads.", link: "See endpoints", href: "#api" },
  { tag: "See it", Icon: Plug, title: "Showcase", desc: "Explore products, bots, and research already built on the directory — then make your own.", link: "Browse builds", href: "#showcase" },
];

const FEATURES = [
  { Icon: Search, title: "Semantic + faceted search", desc: "Query by keyword, category, country, project type, or status." },
  { Icon: Database, title: "Structured project records", desc: "Full listing detail with links, tags, funding, and impact evidence." },
  { Icon: Sparkles, title: "Always current", desc: "Reads the live directory — no stale snapshots to maintain." },
];
const ASKS = ['"Find active govtech projects in Kenya"', '"Open-source participatory budgeting tools"', '"Who works on election integrity?"'];

const ENDPOINTS = [
  { verb: "GET", path: "/api/v1/projects/search", desc: "Search & filter listings" },
  { verb: "GET", path: "/api/v1/projects/:slug", desc: "Single project detail" },
  { verb: "GET", path: "/api/v1/projects/export", desc: "Bulk export (paginated)" },
  { verb: "GET", path: "/api/v1/categories", desc: "Category index + counts" },
  { verb: "GET", path: "/api/v1/facets", desc: "Filter option values" },
];

const SHOWCASE = [
  { kind: "Reference app", title: "CTFG Directory", desc: "Search and explore thousands of curated civic-tech projects — our own flagship app, built on the dataset.", Icon: Grid, href: API_BASE, flagship: true },
  { kind: "Mashup", title: "CTFG PilotCity Mashup", desc: "Blends the Field Guide dataset with PilotCity to connect civic tech with project-based learning.", Icon: Sparkles, href: "https://luxury-syrniki-bfc3ca.netlify.app" },
  { kind: "Recommendation engine", title: "CTFG Taxonomy Recommender", desc: "Suggests the right Field Guide categories and tags for any project, powered by the directory's taxonomy.", Icon: Database, href: "https://github.com/Civic-Tech-Field-Guide/ctfg-guidefinder" },
];
const TINTS = ["#574FD9", "#01B583", "#877DFF"];

// Open-source packages are being prepared; shown as "coming soon" until published.
const REPOS = [
  { name: "@civictechguide/mcp", desc: "One-line native MCP server (npx). Until it ships, connect to the hosted MCP endpoint below via mcp-remote.", lang: "JavaScript", href: "https://github.com/sarapis", soon: true },
  { name: "api-examples", desc: "Copy-paste fetch snippets in curl, Python, and JS.", lang: "Python", href: "https://github.com/sarapis", soon: true },
  { name: "data", desc: "Export scripts and JSON dumps of the full directory under CC BY.", lang: "JSON", href: "https://github.com/sarapis", soon: true },
  { name: "notebooks", desc: "Jupyter notebooks for analysing the dataset.", lang: "Jupyter", href: "https://github.com/sarapis", soon: true },
];

// Works today: bridge any stdio MCP client to the hosted Streamable-HTTP endpoint
// with mcp-remote. (A native @civictechguide/mcp package is coming soon.)
const MCP_CONFIG = `"mcpServers": {
  "civictech-guide": {
    "command": "npx",
    "args": [
      "-y", "mcp-remote",
      "${API_BASE}/mcp"
    ]
  }
}`;
const CURL = `# Search active projects — no key required
curl "${API_BASE}/api/v1/projects/search?q=participatory+budgeting&limit=5"`;

export default function DevelopersPage() {
  return (
    <>
      <Hero overline="Build With Us" title="The largest civic tech dataset, open for builders">
        <p className="text-lg text-ink-soft leading-normal max-w-[62ch]">
          Thousands of curated projects using tech for the common good — queryable by an MCP server,
          a REST API, and open code. Plug the Field Guide into your agents, research, and products.
        </p>
        <div className="flex gap-3.5 flex-wrap justify-center mt-2.5">
          <Button href="#mcp" size="lg">Get the MCP server</Button>
          <Button href="#api" variant="outlined" size="lg">Explore the API</Button>
        </div>
      </Hero>

      {/* CHOOSE YOUR PATH */}
      <section className="py-[84px] px-10">
        <SectionHeading title="Three ways in" sub="Pick the entry point that matches how you build." />
        <div className="grid grid-cols-3 gap-6 max-w-[1120px] mx-auto max-md:grid-cols-1">
          {PATHS.map((p) => (
            <Link key={p.title} href={p.href} className="group relative flex flex-col gap-3.5 p-8 bg-surface border border-border rounded-2xl transition hover:shadow-pill hover:-translate-y-[3px]">
              <span className="grid place-items-center w-[52px] h-[52px] rounded-[13px] bg-primary-tint text-primary"><p.Icon className="w-[26px] h-[26px]" /></span>
              <span className="text-xs font-semibold tracking-[0.12em] uppercase text-ink-faint">{p.tag}</span>
              <h3 className="text-[23px] font-medium tracking-[-0.01em]">{p.title}</h3>
              <p className="text-[15px] text-ink-soft leading-[1.55] flex-1">{p.desc}</p>
              <span className="inline-flex items-center gap-1.5 font-ui font-bold text-sm tracking-[0.04em] uppercase text-primary">{p.link} <Arrow className="w-[15px] h-[15px] transition-transform group-hover:translate-x-[3px]" /></span>
            </Link>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* MCP */}
      <section id="mcp" className="py-[84px] px-10">
        <div className="max-w-[1120px] mx-auto grid grid-cols-[1fr_1.1fr] gap-12 items-center max-md:grid-cols-1">
          <div>
            <span className="overline">Model Context Protocol</span>
            <h2 className="h-section my-3.5">Give your agent the whole Guide</h2>
            <p className="text-lg text-ink-soft leading-normal">Drop the CTFG MCP server into Claude, Cursor, or any MCP client and your assistant can search listings, pull project detail, and traverse categories — grounded in real, curated data.</p>
            <div className="flex flex-col gap-5 mt-[26px]">
              {FEATURES.map((f) => (
                <div key={f.title} className="grid grid-cols-[24px_1fr] gap-3.5">
                  <f.Icon className="w-[22px] h-[22px] text-primary mt-0.5" />
                  <div><b className="block text-base mb-[3px]">{f.title}</b><span className="text-sm text-ink-soft leading-snug">{f.desc}</span></div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5 mt-5">
              {ASKS.map((a) => <span key={a} className="text-[13px] bg-surface border border-border rounded-pill px-3.5 py-2">{a}</span>)}
            </div>
            <p className="mt-5">
              <Link href="/developers/mcp" className="inline-flex items-center gap-1.5 font-ui font-bold text-sm tracking-[0.04em] uppercase text-primary hover:underline">
                Full MCP integration docs <Arrow className="w-[15px] h-[15px]" />
              </Link>
            </p>
            <p className="text-[13px] text-ink-soft mt-3 leading-snug">
              Hosted endpoint (no key): <code className="text-[12px] bg-bg-alt px-1.5 py-0.5 rounded break-all">{API_BASE}/mcp</code>. A native <code className="text-[12px] bg-bg-alt px-1.5 py-0.5 rounded">@civictechguide/mcp</code> package is coming soon.
            </p>
          </div>
          <CodeBlock name="claude_desktop_config.json" code={MCP_CONFIG} />
        </div>
      </section>

      <hr className="divider" />

      {/* API */}
      <section id="api" className="py-[84px] px-10 bg-bg-alt">
        <SectionHeading title="REST API" sub="Clean JSON over HTTPS. Public read endpoints, no key required for basic search." />
        <div className="max-w-[1120px] mx-auto grid grid-cols-2 gap-10 items-start max-md:grid-cols-1">
          <div className="flex flex-col border border-border rounded-[14px] overflow-hidden bg-surface">
            {ENDPOINTS.map((e) => (
              <div key={e.path} className="grid grid-cols-[72px_1fr_auto] gap-[18px] items-center px-[22px] py-[18px] border-t border-border-soft first:border-t-0 max-md:grid-cols-[60px_1fr]">
                <span className="font-ui font-bold text-xs tracking-[0.06em] text-green">{e.verb}</span>
                <span className="font-mono text-[15px] text-ink">{e.path}</span>
                <span className="text-sm text-ink-soft text-right max-md:hidden">{e.desc}</span>
              </div>
            ))}
          </div>
          <CodeBlock name="terminal" code={CURL} />
        </div>
      </section>

      <hr className="divider" />

      {/* SHOWCASE */}
      <section id="showcase" className="py-[84px] px-10">
        <SectionHeading title="Built with the Guide" sub="Tools, research, and bots already running on the directory’s data." />
        <div className="max-w-[1120px] mx-auto grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {SHOWCASE.map((s, i) => {
            const internal = s.href.startsWith("/");
            return (
              <div key={s.title} className={`relative flex flex-col bg-surface border rounded-[14px] overflow-hidden transition hover:shadow-pill hover:-translate-y-0.5 ${s.flagship ? "border-primary" : "border-border"}`}>
                {internal
                  ? <Link href={s.href} aria-label={s.title} className="absolute inset-0 z-[1]" />
                  : <a href={s.href} aria-label={s.title} className="absolute inset-0 z-[1]" />}
                <div className="aspect-video grid place-items-center text-white" style={{ background: `linear-gradient(135deg, ${TINTS[i % 3]}, ${TINTS[(i + 1) % 3]})` }}><s.Icon className="w-10 h-10 opacity-90" /></div>
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <span className={`text-xs font-semibold tracking-[0.1em] uppercase ${s.flagship ? "text-primary" : "text-ink-faint"}`}>{s.kind}</span>
                  <h3 className="text-lg font-medium">{s.title}</h3>
                  <p className="text-sm text-ink-soft leading-snug flex-1">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      {/* CODE & EXAMPLES */}
      <section className="py-[84px] px-10 bg-bg-alt">
        <SectionHeading title="Code & examples" sub="Open-source starters and dumps — being packaged for release (coming soon)." />
        <div className="max-w-[1120px] mx-auto grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {REPOS.map((r) => (
            <div key={r.name} className="relative grid grid-cols-[44px_1fr] gap-4 p-6 bg-surface border border-border rounded-[14px] transition hover:shadow-pill">
              <a href={r.href} aria-label={r.name} className="absolute inset-0" />
              <span className="grid place-items-center w-11 h-11 rounded-[11px] bg-ink text-white"><GitHub className="w-[22px] h-[22px]" /></span>
              <div>
                <h3 className="flex items-center gap-2 text-[17px] font-semibold mb-[5px]">{r.name} {r.soon && <span className="text-[10px] font-bold uppercase tracking-[0.08em] bg-primary-tint text-primary px-1.5 py-0.5 rounded">Soon</span>} <ExtLink className="w-[15px] h-[15px] shrink-0 text-ink-soft" /></h3>
                <p className="text-sm text-ink-soft leading-snug">{r.desc}</p>
                <div className="flex gap-[18px] mt-3 text-[13px] text-ink-soft">
                  <span className="inline-flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> {r.lang}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* LICENSE */}
      <section className="py-[84px] px-10">
        <div className="max-w-[1120px] mx-auto grid grid-cols-[auto_1fr_auto] gap-7 items-center p-8 border border-border rounded-2xl bg-surface max-md:grid-cols-1 max-md:text-center max-md:justify-items-center">
          <span className="grid place-items-center w-14 h-14 rounded-[14px] bg-mint-tint text-green"><Shield className="w-7 h-7" /></span>
          <div>
            <h3 className="text-xl font-semibold mb-1.5">Free to build on — CC BY 4.0</h3>
            <p className="text-sm text-ink-soft leading-[1.55] max-w-[64ch]">The Field Guide data is free to use, re-use, adapt, and modify for any purpose, including commercially, as long as you link back with attribution.</p>
          </div>
          <Button href="https://civictech.guide/guiding-principles/" variant="outlined" size="md">Read the terms</Button>
        </div>
      </section>
    </>
  );
}

// Dark code panel with a window bar + copy button.
function CodeBlock({ name, code }: { name: string; code: string }) {
  return (
    <div className="rounded-[14px] overflow-hidden border border-[#2A2A33] bg-[#15151B]">
      <div className="flex items-center gap-2 px-4 py-[13px] border-b border-[#2A2A33]">
        <span className="w-[11px] h-[11px] rounded-full bg-[#FF5F57]" />
        <span className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E]" />
        <span className="w-[11px] h-[11px] rounded-full bg-[#28C840]" />
        <span className="ml-2 text-[13px] text-[#9A9AA6] font-body">{name}</span>
        <CopyButton text={code} />
      </div>
      <pre className="m-0 p-5 overflow-x-auto"><code className="font-mono text-sm leading-[1.7] text-[#E6E6EC] whitespace-pre">{code}</code></pre>
    </div>
  );
}
