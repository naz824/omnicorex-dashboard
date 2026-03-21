# OmnicoreX Memory System

Persistent, cross-session memory for the OmnicoreX agent system. This directory is committed to GitHub for cross-machine synchronization and version history.

## Architecture

```
memory/
├── MEMORY.md              # Active working memory (loaded into every session)
├── sessions/              # Session handoff ledgers
│   └── YYYY-MM-DD_HH-MM.md  # Individual session summaries
├── learnings/             # Extracted knowledge from sessions
│   ├── clients.jsonl      # Client preferences, interactions, history
│   ├── market.jsonl       # Market insights, industry trends
│   ├── templates.jsonl    # Successful templates (emails, proposals, designs)
│   ├── objections.jsonl   # Common objections and effective rebuttals
│   ├── patterns.jsonl     # Code patterns, design patterns that work
│   └── competitive.jsonl  # Competitor analysis and positioning
├── context/               # Active project context
│   ├── active-projects.json   # Currently active projects with status
│   ├── pipeline.json          # Current sales pipeline state
│   └── pending-actions.json   # Queued actions awaiting completion
├── entities/              # Knowledge graph entities (JSON-LD)
│   ├── people.jsonl       # Contacts, leads, clients
│   ├── companies.jsonl    # Business entities
│   └── relationships.jsonl # Entity relationships
└── snapshots/             # Periodic full state snapshots
    └── YYYY-MM-DD.json    # Daily state snapshot
```

## How It Works

### Session Lifecycle

1. **Session Start** — `hooks/pre-session.sh` loads MEMORY.md + latest session handoff + pending actions
2. **During Session** — Agent writes to memory via MCP memory server + local JSONL files
3. **Session End** — `hooks/on-stop.sh` creates session handoff, extracts learnings, commits to GitHub

### Memory Tiers

- **Tier 1: MEMORY.md** — Hot memory, loaded into every session context. Contains current state, active projects, key decisions. Max 5,000 tokens.
- **Tier 2: Session Handoffs** — Warm memory. Most recent 3 sessions auto-loaded. Older sessions searchable via MCP.
- **Tier 3: Learnings** — Cold memory. Searchable JSONL files organized by category. Queried on-demand by agents.
- **Tier 4: Entities** — Knowledge graph. People, companies, relationships stored as JSON-LD for semantic queries.

### GitHub Sync

Memory files are committed to the repo after each session. This provides:
- Version history of all memory changes
- Cross-machine synchronization
- Backup and recovery
- Audit trail of what the agent learned

### MCP Integration

The `@modelcontextprotocol/server-memory` MCP server provides real-time memory operations:
- `store_memory` — Save a key-value pair
- `retrieve_memory` — Get a stored value
- `search_memory` — Semantic search across memory
- `list_memories` — Browse stored memories

The `mcp-memory-service` (doobidoo) provides advanced features:
- Semantic embeddings for similarity search
- Knowledge graph with entity-relation-observation triples
- Auto-consolidation of related memories
- Web dashboard for memory visualization
