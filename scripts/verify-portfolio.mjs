import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
let linkCount = 0
let hashCount = 0

function fail(message) {
  errors.push(message)
}

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'graphify-out') return []
      return markdownFiles(path)
    }
    return entry.name.endsWith('.md') ? [path] : []
  })
}

function localLinkTarget(markdownPath, rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, '').split('#', 1)[0]
  if (!target || /^(?:https?:|mailto:)/i.test(target)) return null
  try {
    return resolve(dirname(markdownPath), decodeURIComponent(target))
  } catch {
    fail(`${relative(root, markdownPath)} has an invalid link: ${rawTarget}`)
    return null
  }
}

const rootReadmePath = join(root, 'README.md')
const rootReadme = readFileSync(rootReadmePath, 'utf8')
if (/recruiter(?:-|\s)*(?:readiness\s+)?gate|recruiter-ready/i.test(rootReadme)) {
  fail('README.md contains internal recruiter-gate wording')
}

for (const markdownPath of markdownFiles(root)) {
  const markdown = readFileSync(markdownPath, 'utf8')
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = localLinkTarget(markdownPath, match[1])
    if (!target) continue
    linkCount += 1
    if (!existsSync(target)) fail(`${relative(root, markdownPath)} links to missing ${match[1]}`)
  }
}

const projects = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort()

for (const project of projects) {
  const projectRoot = join(root, project)
  const readmePath = join(projectRoot, 'README.md')
  const manifestPath = join(projectRoot, 'evidence', 'manifest.md')
  const summaryPath = join(projectRoot, 'evidence', 'verification', 'summary.md')

  for (const required of [readmePath, manifestPath, summaryPath]) {
    if (!existsSync(required)) fail(`${project} is missing ${relative(projectRoot, required)}`)
  }
  if (![readmePath, manifestPath, summaryPath].every(existsSync)) continue

  const projectReadme = readFileSync(readmePath, 'utf8')
  if (!projectReadme.includes('evidence/verification/summary.md')) {
    fail(`${project}/README.md does not link its verification summary`)
  }
  if (!projectReadme.includes('evidence/manifest.md')) {
    fail(`${project}/README.md does not link its evidence manifest`)
  }

  const summary = readFileSync(summaryPath, 'utf8')
  if (!/^- Result: Passed\s*$/m.test(summary)) fail(`${project} summary is not marked Passed`)
  const score = summary.match(/^- Score: (\d+)\/(\d+) points\s*$/m)
  if (!score || Number(score[1]) <= 0 || score[1] !== score[2]) {
    fail(`${project} summary does not contain a positive full score`)
  }

  const manifest = readFileSync(manifestPath, 'utf8')
  const rows = [...manifest.matchAll(/^\| \[[^\]]+\]\(([^)]+)\) \| (\d+) \| `([a-f0-9]{64})` \|$/gim)]
  if (rows.length === 0) fail(`${project} manifest has no hashed artifacts`)
  for (const [, rawTarget, documentedBytes, documentedHash] of rows) {
    const target = resolve(dirname(manifestPath), decodeURIComponent(rawTarget))
    if (!existsSync(target)) {
      fail(`${project} manifest references missing ${rawTarget}`)
      continue
    }
    const bytes = readFileSync(target)
    const actualHash = createHash('sha256').update(bytes).digest('hex')
    hashCount += 1
    if (statSync(target).size !== Number(documentedBytes)) {
      fail(`${project} byte count differs for ${rawTarget}`)
    }
    if (actualHash !== documentedHash.toLowerCase()) {
      fail(`${project} SHA-256 differs for ${rawTarget}`)
    }
  }
}

const listedProjects = [...rootReadme.matchAll(/^\| \[[^\]]+\]\(\.\/(\d{2}-[^/]+)\/\)/gm)].map(
  (match) => match[1]
)
if (new Set(listedProjects).size !== projects.length || projects.some((p) => !listedProjects.includes(p))) {
  fail('README.md project table does not list every project exactly once')
}

if (errors.length > 0) {
  console.error(`[portfolio-audit] FAIL — ${errors.length} finding(s)`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `[portfolio-audit] PASS — ${projects.length} projects, ${linkCount} local links, ${hashCount} verified artifact hashes`
  )
}
