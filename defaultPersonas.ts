import type { CustomerPersona, ChatMessage, RetrievalLogEntry } from '../types';

export const INITIAL_PERSONAS: CustomerPersona[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    role: 'DevOps Lead',
    company: 'CloudScale Systems',
    avatarSeed: 'alex',
    initials: 'AR',
    environment: {
      os: 'Ubuntu 22.04 LTS',
      runtime: 'Docker v24.0.7',
      infra: 'AWS EKS (K8s v1.28)',
      additionalTags: ['CoreDNS 1.10', 'Calico CNI', 'Helm v3.12', 'Terraform Cloud'],
    },
    frustrationLevel: 75,
    frustrationTrend: 'increasing',
    personalityNotes: 'Prefers direct CLI fixes and kubectl snippets. Strongly hates generic Tier-1 greeting scripts, polite fluff, or asking for OS/version info that was already documented.',
    pastTickets: [
      {
        id: 't-101',
        ticketNumber: 'TICK-8842',
        title: 'Intermittent DNS timeout during pod rolling restart',
        status: 'resolved',
        date: 'Oct 14, 2026',
        category: 'Networking / DNS',
        summary: 'Under high traffic, CoreDNS upstream resolvers reached socket exhaustion causing 504 gateway timeouts.',
        resolution: 'Patched CoreDNS deployment configmap: set forward timeout to 3s with cache TTL 60s and scaled replicas from 2 to 6 with PodAntiAffinity.',
        keyTakeaway: 'Always check CoreDNS configmap and DaemonSet node distribution before suggesting node reboot.',
      },
      {
        id: 't-102',
        ticketNumber: 'TICK-8719',
        title: 'CI/CD pipeline auth token expiry mid-deployment',
        status: 'resolved',
        date: 'Sep 28, 2026',
        category: 'IAM / Authentication',
        summary: 'AWS IAM OIDC token bearer expired during 45-minute blue/green canary rollout.',
        resolution: 'Configured automated STS assume-role token refresh in GitHub Actions runner using 2-hour duration.',
        keyTakeaway: 'Use IAM STS role refresh CLI snippet; do not ask customer to regenerate permanent root credentials.',
      },
    ],
    playbooks: [
      {
        issue: 'CoreDNS timeout / DNS lookup failure',
        provenFix: 'kubectl -n kube-system patch configmap coredns --type merge -p \'{"data":{"Corefile":"... autopath cache 60 ..."}}\' && kubectl rollout restart deployment/coredns -n kube-system',
        cautionNote: 'Do NOT tell Alex to clear local DNS cache; this is a Kube-DNS daemonset contention.',
      },
      {
        issue: 'AWS EKS STS Token Invalidation',
        provenFix: 'aws sts assume-role-with-web-identity --role-arn arn:aws:iam::account:role/EKS-Deployer --role-session-name GHA-Runner --duration-seconds 7200',
        cautionNote: 'Alex already verified IAM policies; issue is token lifetime TTL.',
      },
    ],
    quickPrompts: [
      'The CoreDNS timeout is happening again during pod restart.',
      'Our CI/CD pipeline auth token expired mid-canary rollout.',
      'FYI we deployed Cilium 1.15 and Redis 7.2 today; setting max_inflight=250 fixed the ingress drop.',
      'What was the exact kubectl patch we used last month?',
    ],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'FinTech Ops Specialist',
    company: 'Apex Clearing Solutions',
    avatarSeed: 'priya',
    initials: 'PN',
    environment: {
      os: 'Windows 11 Enterprise (23H2)',
      runtime: 'PostgreSQL 15.4 (EnterpriseDB)',
      infra: 'SSO via Okta / Azure Hybrid',
      additionalTags: ['pgAdmin 4', 'Kafka 3.5', 'TLS 1.3 Strict', 'SOC2 Compliant'],
    },
    frustrationLevel: 30,
    frustrationTrend: 'stable',
    personalityNotes: 'Calm, methodical, compliance-oriented. Appreciates structured step-by-step confirmation, audit logging references, and rollback precautions.',
    pastTickets: [
      {
        id: 't-201',
        ticketNumber: 'TICK-9041',
        title: 'Payment settlement webhook latency spike (>4.2s)',
        status: 'resolved',
        date: 'Oct 22, 2026',
        category: 'Integrations / Latency',
        summary: 'Webhook receiver triggered individual atomic DB writes per event, causing write amplification.',
        resolution: 'Configured batch ingestion queue (micro-batches of 50 payloads per 200ms transaction window). Reduced latency to 140ms.',
        keyTakeaway: 'Priya requires SOC2 audit confirmation when changing webhook payload queue limits.',
      },
      {
        id: 't-202',
        ticketNumber: 'TICK-9188',
        title: 'Okta SCIM group membership sync discrepancy',
        status: 'open',
        date: 'Nov 02, 2026',
        category: 'Identity / SSO',
        summary: 'New compliance officers not automatically added to the Audit-Reviewers group in PostgreSQL RBAC.',
        resolution: 'Under active review with Identity team; manual bridge script running every 6 hours.',
        keyTakeaway: 'Currently awaiting scheduled Okta schema refresh.',
      },
    ],
    playbooks: [
      {
        issue: 'Webhook queue ingestion latency',
        provenFix: 'Adjust application.yml: webhook.batch.size=50 and webhook.flush.interval.ms=200; verify in pg_stat_activity.',
        cautionNote: 'Must retain idempotency key validation per audit requirements.',
      },
      {
        issue: 'Okta SCIM sync lag',
        provenFix: 'Invoke SCIM delta sync endpoint via PowerShell with bearer token to force user group attribute push.',
        cautionNote: 'Requires approval hash from Security Ops before manual sync trigger.',
      },
    ],
    quickPrompts: [
      'The webhook latency is creeping up in our batch settlement queue.',
      'Can you give me the status of our open Okta SCIM sync ticket?',
      'We added PgBouncer 1.21 to our stack, and setting pool_mode=transaction solved the lock.',
      'Need the step-by-step verification query for PostgreSQL 15 connection pool.',
    ],
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Fleet Systems Manager',
    company: 'OrbitLogistics Maritime & Edge',
    avatarSeed: 'marcus',
    initials: 'MV',
    environment: {
      os: 'Edge Linux Gateway (Debian 12 RT)',
      runtime: 'Python 3.11 Telemetry Daemon',
      infra: 'Satellite WAN link (Starlink + Iridium Fallback)',
      additionalTags: ['SQLite 3.42 WAL', 'MQTT Mosquitto', 'Cellular Geofence', 'Arm64 SoC'],
    },
    frustrationLevel: 60,
    frustrationTrend: 'decreasing',
    personalityNotes: 'Direct, time-sensitive, operational mindset. Dealing with remote hardware and bandwidth constraints ($0.08/MB over Iridium). Values compact payload answers.',
    pastTickets: [
      {
        id: 't-301',
        ticketNumber: 'TICK-7650',
        title: 'Telemetry packet drops during satellite beam switchover',
        status: 'resolved',
        date: 'Aug 12, 2026',
        category: 'Satellite Networking',
        summary: 'Starlink handoff caused 12-second socket drop where TCP syn timeouts clogged the local buffer.',
        resolution: 'Implemented local MQTT persistent offline buffer queue on Edge Gateway with 48hr spool to NVMe disk.',
        keyTakeaway: 'Never recommend downloading full telemetry dump over WAN; use diff sync only.',
      },
      {
        id: 't-302',
        ticketNumber: 'TICK-8120',
        title: 'SQLite database locked error on high-frequency GPS ping',
        status: 'resolved',
        date: 'Sep 05, 2026',
        category: 'Embedded Storage',
        summary: 'Simultaneous writes from GPS reader and engine diagnostics caused database locked (busy_timeout 5000ms exceeded).',
        resolution: 'Enabled WAL mode: PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=30000;',
        keyTakeaway: 'The WAL mode fix worked flawlessly. SQLite PRAGMA commands are the proven fix.',
      },
      {
        id: 't-303',
        ticketNumber: 'TICK-8409',
        title: 'Python telemetry daemon memory leak on remote vessels',
        status: 'resolved',
        date: 'Sep 21, 2026',
        category: 'Software Daemon',
        summary: 'Uncollected cyclic references in custom Starlink socket wrapper caused 500MB RAM exhaustion after 14 days.',
        resolution: 'Fixed cyclic reference in socket connection handler; added gc.collect() on connection resets.',
        keyTakeaway: 'Remote fleet runs headless Debian 12 with strictly 1GB memory limit.',
      },
    ],
    playbooks: [
      {
        issue: 'SQLite Database is Locked (Code 5)',
        provenFix: 'Run WAL mode validation: sqlite3 /var/data/telemetry.db "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=30000;"',
        cautionNote: 'Do not remove the .db-wal file while daemon process is running; it corrupts in-flight fleet logs.',
      },
      {
        issue: 'Satellite link packet loss / high latency',
        provenFix: 'systemctl restart edge-telemetry-spooler.service; verify /var/log/mqtt-buffer.log for backlog drain rate.',
        cautionNote: 'Bandwidth is billed per megabyte; keep verification payload under 20KB.',
      },
    ],
    quickPrompts: [
      'The database lock issue is back on vessel gateway #402.',
      'Our satellite link is dropping packets during ocean transit handoff.',
      'We installed WireGuard VPN on unit #402; setting MTU=1280 fixed the packet fragmentation.',
      'The Python telemetry daemon memory is climbing again on unit #118.',
    ],
  },
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'alex-rivera': [
    {
      id: 'm-alex-1',
      sender: 'customer',
      personaId: 'alex-rivera',
      content: 'Hey, I am seeing intermittent DNS timeouts again in our production cluster during our noon canary rollouts.',
      timestamp: '11:42 AM',
      mode: 'memory-aware',
    },
    {
      id: 'm-alex-2',
      sender: 'agent',
      personaId: 'alex-rivera',
      content: `[DIRECT CLI MODE — Skipping pleasantries per Frustration 75/100]

Environment loaded: **Ubuntu 22.04 LTS** • **AWS EKS (K8s v1.28)** • **Docker v24.0.7**.

Referencing past ticket **#TICK-8842** (Oct 14): we resolved this exact CoreDNS socket exhaustion by patching the CoreDNS ConfigMap (3s forward timeout, 60s cache TTL) and scaling to 6 replicas with PodAntiAffinity.

Run this immediately to verify if your ConfigMap or replica count drifted:

\`\`\`bash
# 1. Check current CoreDNS replica count & pod distribution
kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide

# 2. Inspect forward timeout & cache config
kubectl get configmap coredns -n kube-system -o jsonpath='{.data.Corefile}' | grep -E "cache|forward"
\`\`\`

Next logical step based on **What Worked Before**: re-apply the verified ConfigMap patch if a Helm/Terraform run overwrote it:

\`\`\`bash
kubectl -n kube-system patch configmap coredns --type merge -p '{"data":{"Corefile":"... autopath cache 60 forward . /etc/resolv.conf { timeout 3s } ..."}}'
kubectl rollout restart deployment/coredns -n kube-system
\`\`\``,
      timestamp: '11:42 AM',
      mode: 'memory-aware',
      retrievedMemoryIds: ['env-alex-rivera', 'ticket-TICK-8842', 'playbook-coredns', 'sentiment-alex-rivera'],
      retrievalLatencyMs: 14,
      tokensUsed: 428,
      toneAdaptation: 'Direct CLI Mode (Frustration 75% > 65% threshold)',
      llmSource: 'Deterministic Engine',
    },
  ],
  'priya-nair': [
    {
      id: 'm-priya-1',
      sender: 'customer',
      personaId: 'priya-nair',
      content: 'Hello, our payment settlement webhook latency is starting to climb again on our settlement queue.',
      timestamp: '10:15 AM',
      mode: 'memory-aware',
    },
    {
      id: 'm-priya-2',
      sender: 'agent',
      personaId: 'priya-nair',
      content: `Good morning Priya. I have your profile active: **Apex Clearing Solutions** running **PostgreSQL 15.4** on **Windows 11 Enterprise (23H2)** with **SSO via Okta**.

Reviewing your past ticket **#TICK-9041** from Oct 22: you previously experienced webhook latency exceeding 4.2s caused by atomic unbatched writes, which we resolved by configuring micro-batching (50 payloads per 200ms transaction window). Also noting open ticket **#TICK-9188** (Okta SCIM sync).

Here is the structured verification procedure aligned with your SOC2 compliance requirements:

**Step 1: Check active connection states in PostgreSQL 15**
\`\`\`sql
SELECT pid, usename, client_addr, state, query_start, age(clock_timestamp(), query_start)
FROM pg_stat_activity
WHERE query ILIKE '%webhook_settlement%' AND state != 'idle'
ORDER BY query_start ASC;
\`\`\`

**Step 2: Confirm micro-batch queue parameters (What Worked Before)**
Verify that \`webhook.batch.size=50\` and \`webhook.flush.interval.ms=200\` are still active in \`application.yml\`.

Would you like me to generate an audit log entry for this inspection for your SOC2 compliance file?`,
      timestamp: '10:15 AM',
      mode: 'memory-aware',
      retrievedMemoryIds: ['env-priya-nair', 'ticket-TICK-9041', 'ticket-TICK-9188', 'playbook-batch'],
      retrievalLatencyMs: 16,
      tokensUsed: 485,
      toneAdaptation: 'Step-by-Step Consultative Mode (Frustration 30% ≤ 65%)',
      llmSource: 'Deterministic Engine',
    },
  ],
  'marcus-vance': [
    {
      id: 'm-marcus-1',
      sender: 'customer',
      personaId: 'marcus-vance',
      content: 'The database lock issue is back on vessel gateway unit #402. Need immediate resolution.',
      timestamp: '09:04 AM',
      mode: 'memory-aware',
    },
    {
      id: 'm-marcus-2',
      sender: 'agent',
      personaId: 'marcus-vance',
      content: `Marcus — copy that. Pulling telemetry gateway profile: **Edge Linux Gateway (Debian 12 RT)** with **Python 3.11 Telemetry Daemon** over **Satellite WAN link (Starlink + Iridium Fallback)**.

Referencing **#TICK-8120**: simultaneous writes from the GPS reader and engine diagnostics daemon exceeded SQLite's 5000ms busy timeout. What worked before was switching SQLite into WAL mode with a 30s timeout.

Here is the low-bandwidth CLI command to apply directly over SSH:

\`\`\`bash
# 1. Clear lock and enforce Write-Ahead Logging (compact payload: 128 bytes)
sqlite3 /var/data/telemetry.db "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=30000;"

# 2. Confirm WAL status
sqlite3 /var/data/telemetry.db "PRAGMA journal_mode;"
# Expected output: wal
\`\`\`

⚠️ **Caution:** Do not delete \`/var/data/telemetry.db-wal\` manually while the Python telemetry daemon is active; let the checkpoint drain naturally over Starlink.`,
      timestamp: '09:04 AM',
      mode: 'memory-aware',
      retrievedMemoryIds: ['env-marcus-vance', 'ticket-TICK-8120', 'playbook-sqlite', 'sentiment-marcus-vance'],
      retrievalLatencyMs: 12,
      tokensUsed: 390,
      toneAdaptation: 'Time-Sensitive Operational Mode (Frustration 60%)',
      llmSource: 'Deterministic Engine',
    },
  ],
};

export const INITIAL_RETRIEVAL_LOGS: RetrievalLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '11:42:04 AM',
    query: 'intermittent DNS timeouts again in our production cluster during our noon canary rollouts',
    personaId: 'alex-rivera',
    injectedNodeCount: 4,
    nodes: [
      {
        id: 'env-alex-rivera',
        title: 'Environment: AWS EKS v1.28 + Ubuntu 22.04 + Docker v24',
        type: 'ENVIRONMENT',
        score: 0.98,
        snippet: 'Production cluster running CoreDNS 1.10 with Calico CNI on Ubuntu 22.04 LTS.',
        matchedKeyword: 'cluster / DNS',
      },
      {
        id: 'ticket-TICK-8842',
        title: 'Past Ticket #TICK-8842: CoreDNS upstream socket timeout',
        type: 'HISTORICAL_TICKET',
        score: 0.95,
        snippet: 'Resolved on Oct 14: Patched CoreDNS configmap (forward timeout 3s, cache 60s) & scaled to 6 replicas.',
        matchedKeyword: 'DNS timeouts',
      },
      {
        id: 'playbook-coredns',
        title: 'Playbook: CoreDNS Kube-DNS daemonset patch',
        type: 'PLAYBOOK_SOLUTION',
        score: 0.93,
        snippet: 'kubectl -n kube-system patch configmap coredns --type merge ... rollout restart deployment/coredns',
        matchedKeyword: 'canary rollouts',
      },
      {
        id: 'sentiment-alex-rivera',
        title: 'Customer Persona: High frustration (75/100) — Direct CLI only',
        type: 'CUSTOMER_SENTIMENT',
        score: 0.89,
        snippet: 'Frustration > 65%: Skip pleasantries, provide direct copy-paste CLI commands.',
        matchedKeyword: 'tone_adaptation',
      },
    ],
  },
];
