import type {
  CustomerPersona,
  SupportMode,
  ChatMessage,
  RetrievalLogEntry,
  LLMConfig,
  PlaybookItem,
  PastTicket,
  MemoryToast,
} from '../types';

export interface MemoryMutationResult {
  newEnvTags: string[];
  newPlaybooks: PlaybookItem[];
  frustrationDelta: number;
  toasts: MemoryToast[];
}

export interface GenerationResult {
  message: ChatMessage;
  logEntry?: RetrievalLogEntry;
  highlightedNodeIds: string[];
  mutation: MemoryMutationResult;
}

const KNOWN_TECH_KEYWORDS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bcilium\s*v?(\d+(?:\.\d+)*)?/i, label: 'Cilium' },
  { pattern: /\bredis\s*v?(\d+(?:\.\d+)*)?/i, label: 'Redis' },
  { pattern: /\bpgbouncer\s*v?(\d+(?:\.\d+)*)?/i, label: 'PgBouncer' },
  { pattern: /\bwireguard(?:\s+vpn)?/i, label: 'WireGuard VPN' },
  { pattern: /\bistio\s*v?(\d+(?:\.\d+)*)?/i, label: 'Istio' },
  { pattern: /\bnginx\s*v?(\d+(?:\.\d+)*)?/i, label: 'Nginx' },
  { pattern: /\bprometheus\s*v?(\d+(?:\.\d+)*)?/i, label: 'Prometheus' },
  { pattern: /\bgrafana\s*v?(\d+(?:\.\d+)*)?/i, label: 'Grafana' },
  { pattern: /\benvoy\s*v?(\d+(?:\.\d+)*)?/i, label: 'Envoy Proxy' },
  { pattern: /\bdatadog/i, label: 'Datadog' },
  { pattern: /\bopentelemetry/i, label: 'OpenTelemetry' },
  { pattern: /\btailscale/i, label: 'Tailscale' },
  { pattern: /\bcloudflare/i, label: 'Cloudflare' },
  { pattern: /\bclickhouse/i, label: 'ClickHouse' },
  { pattern: /\barc\s*runner/i, label: 'GitHub ARC' },
  { pattern: /\bargocd/i, label: 'ArgoCD' },
];

export function extractMemoriesFromMessage(
  userQuery: string,
  persona: CustomerPersona,
  mode: SupportMode
): MemoryMutationResult {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const newEnvTags: string[] = [];
  const newPlaybooks: PlaybookItem[] = [];
  const toasts: MemoryToast[] = [];

  const existingTagsLower = new Set(
    [
      persona.environment.os,
      persona.environment.runtime,
      persona.environment.infra,
      ...persona.environment.additionalTags,
    ].map((t) => t.toLowerCase())
  );

  // 1. Check known tech keywords with optional version numbers
  for (const tech of KNOWN_TECH_KEYWORDS) {
    const match = userQuery.match(tech.pattern);
    if (match) {
      const version = match[1] ? ` ${match[1]}` : '';
      const candidate = `${tech.label}${version}`.trim();
      if (!existingTagsLower.has(candidate.toLowerCase())) {
        newEnvTags.push(candidate);
        existingTagsLower.add(candidate.toLowerCase());
      }
    }
  }

  // 2. Also check generic patterns like "upgraded to X", "deployed X", "added X", "using X"
  const genericEnvRegex = /(?:deployed|added|installed|upgraded to|switched to)\s+([A-Z][A-Za-z0-9_-]+(?:\s+v?\d+(?:\.\d+)+)?)/g;
  let envMatch: RegExpExecArray | null;
  while ((envMatch = genericEnvRegex.exec(userQuery)) !== null) {
    const candidate = envMatch[1].trim();
    if (
      candidate.length > 2 &&
      candidate.length <= 28 &&
      !existingTagsLower.has(candidate.toLowerCase())
    ) {
      newEnvTags.push(candidate);
      existingTagsLower.add(candidate.toLowerCase());
    }
  }

  for (const tag of newEnvTags) {
    toasts.push({
      id: `toast-env-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: 'New Memory Saved • Environment',
      detail: `Added "${tag}" to ${persona.name}'s Known Environment`,
      category: 'environment',
      timestamp: timeStr,
    });
  }

  // 3. Detect solved fixes / playbooks ("setting X=Y fixed the Z" or "fixed by X")
  const fixPattern1 = /(?:setting|configuring|applying|running|enabling)\s+([^.,;]+?)\s+(?:fixed|solved|resolved|cleared|mitigated)\s+(?:the\s+)?([^.,;]+)/i;
  const fixPattern2 = /(?:fixed|solved|resolved|cleared)\s+(?:the\s+)?([^.,;]+?)\s+(?:by|via|with|using)\s+([^.,;]+)/i;

  const m1 = userQuery.match(fixPattern1);
  const m2 = userQuery.match(fixPattern2);

  if (m1) {
    const provenFix = m1[1].trim();
    const issueRaw = m1[2].trim();
    const issue = issueRaw.charAt(0).toUpperCase() + issueRaw.slice(1);
    const alreadyExists = persona.playbooks.some(
      (pb) => pb.provenFix.toLowerCase() === provenFix.toLowerCase()
    );
    if (!alreadyExists) {
      const pbItem: PlaybookItem = {
        issue: issue.length > 4 ? issue : 'Customer-Reported Configuration Fix',
        provenFix,
        cautionNote: 'Auto-extracted from live customer conversation write-back loop.',
        isNew: true,
      };
      newPlaybooks.push(pbItem);
      toasts.push({
        id: `toast-pb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: 'New Memory Saved • Playbook',
        detail: `Saved proven fix "${provenFix}" for "${pbItem.issue}"`,
        category: 'playbook',
        timestamp: timeStr,
      });
    }
  } else if (m2) {
    const issueRaw = m2[1].trim();
    const provenFix = m2[2].trim();
    const issue = issueRaw.charAt(0).toUpperCase() + issueRaw.slice(1);
    const alreadyExists = persona.playbooks.some(
      (pb) => pb.provenFix.toLowerCase() === provenFix.toLowerCase()
    );
    if (!alreadyExists) {
      const pbItem: PlaybookItem = {
        issue: issue.length > 4 ? issue : 'Verified Session Workaround',
        provenFix,
        cautionNote: 'Auto-extracted from live customer conversation write-back loop.',
        isNew: true,
      };
      newPlaybooks.push(pbItem);
      toasts.push({
        id: `toast-pb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: 'New Memory Saved • Playbook',
        detail: `Saved proven fix "${provenFix}" for "${pbItem.issue}"`,
        category: 'playbook',
        timestamp: timeStr,
      });
    }
  }

  // 4. Calculate Sentiment / Frustration shift
  let frustrationDelta = 0;
  if (mode === 'stateless') {
    frustrationDelta = +20; // Stateless bot asks repetitive questions -> +20 frustration
  } else {
    // Memory-aware agent resolves contextually -> -12 points (within 10-15 range)
    frustrationDelta = -12;
  }

  return {
    newEnvTags,
    newPlaybooks,
    frustrationDelta,
    toasts,
  };
}

export function buildSystemPromptForLLM(persona: CustomerPersona, mode: SupportMode): string {
  if (mode === 'stateless') {
    return `You are a generic Tier-1 Stateless Customer Support Bot with zero access to customer history or environment.
Always ask the customer for their operating system, software version, and cloud provider from scratch.
Suggest basic, repetitive troubleshooting they have already tried (such as rebooting their machine, clearing local DNS cache, or deleting database lock files). Keep it around 90-120 words.`;
  }

  const highFrustration = persona.frustrationLevel > 65;

  return `You are OmniRecall, a Memory-Aware Tier-3 Support Engineer Agent.
The customer's live memory graph is injected below:
- Customer: ${persona.name} (${persona.role} at ${persona.company})
- Environment: OS=${persona.environment.os}, Runtime=${persona.environment.runtime}, Infra=${persona.environment.infra}, Tags=[${persona.environment.additionalTags.join(', ')}]
- Frustration Level: ${persona.frustrationLevel}/100 (${highFrustration ? 'HIGH FRUSTRATION > 65%: Skip all pleasantries, start with [DIRECT CLI MODE], and give immediate CLI commands' : 'CALM/MODERATE: Provide structured, reassuring step-by-step guidance'})
- Past Tickets:
${persona.pastTickets.map((t) => `  * ${t.ticketNumber} (${t.status}): ${t.title} | Resolution: ${t.resolution} | Takeaway: ${t.keyTakeaway}`).join('\n')}
- What Worked Before Playbooks:
${persona.playbooks.map((p) => `  * Issue: ${p.issue} -> Proven Fix: ${p.provenFix} (${p.cautionNote || ''})`).join('\n')}

STRICT RULES:
1. Reference their exact environment (${persona.environment.os}, ${persona.environment.infra}) without asking.
2. Reference their relevant past ticket by ID (e.g. #${persona.pastTickets[0]?.ticketNumber || 'TICK-1001'}) and immediately propose the next logical step based on "What Worked Before".
3. Adapt tone strictly to Frustration Level (${persona.frustrationLevel}/100).`;
}

async function callLiveLLM(
  userQuery: string,
  persona: CustomerPersona,
  mode: SupportMode,
  llmConfig: LLMConfig
): Promise<string | null> {
  if (llmConfig.provider === 'simulated' || !llmConfig.apiKey.trim()) {
    return null;
  }

  const systemPrompt = buildSystemPromptForLLM(persona, mode);

  try {
    if (llmConfig.provider === 'gemini') {
      const modelName = llmConfig.model || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(llmConfig.apiKey.trim())}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userQuery }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return typeof text === 'string' && text.trim().length > 0 ? text.trim() : null;
    }

    if (llmConfig.provider === 'openai') {
      const modelName = llmConfig.model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${llmConfig.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return typeof text === 'string' && text.trim().length > 0 ? text.trim() : null;
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateSupportResponseAsync(
  userQuery: string,
  persona: CustomerPersona,
  mode: SupportMode,
  llmConfig: LLMConfig
): Promise<GenerationResult> {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Run live memory extraction write-back analysis on the user message
  const mutation = extractMemoriesFromMessage(userQuery, persona, mode);

  // Effective environment tags including any just-extracted ones
  const allAdditionalTags = [...persona.environment.additionalTags, ...mutation.newEnvTags];

  // Try optional live LLM if configured
  const liveText = await callLiveLLM(userQuery, persona, mode, llmConfig);
  const llmSourceLabel = liveText
    ? `${llmConfig.provider === 'gemini' ? 'Live Gemini API' : 'Live OpenAI API'} (${llmConfig.model})`
    : 'Deterministic Engine';

  if (mode === 'stateless') {
    // Persona-specific frustrating stateless responses that suggest basic troubleshooting they already tried
    let statelessFallback = '';
    if (persona.id === 'alex-rivera') {
      statelessFallback = `Hello! Thank you for contacting Technical Support.\n\nTo help us troubleshoot your issue, please provide:\n1. Your operating system and version (Windows, macOS, or Linux?)\n2. Whether you are using containers or virtual machines\n3. Your cloud hosting provider\n\n**Suggested Basic Troubleshooting:**\n- Have you tried flushing your local machine's DNS cache (\`ipconfig /flushdns\`)?\n- Have you tried restarting your home/office router and regenerating your root AWS credentials?\n\nOnce you reply with your system details, a Tier-1 agent will respond within 24–48 hours.`;
    } else if (persona.id === 'priya-nair') {
      statelessFallback = `Hi there! Welcome to Support.\n\nWe don't have any record of your environment in this chat session. Could you tell us:\n1. What database software and version you are using?\n2. What operating system your workstation runs?\n3. What identity provider you use for login?\n\n**Suggested Basic Troubleshooting:**\n- Have you tried rebooting your Windows computer and reinstalling your database client?\n- Try disabling SSL/TLS verification temporarily to see if webhooks go through faster.`;
    } else if (persona.id === 'marcus-vance') {
      statelessFallback = `Hello and thank you for reaching out!\n\nBefore we can look into your issue, please answer a few basic questions:\n1. What operating system and programming language are you using?\n2. Are you on a wired broadband or Wi-Fi connection?\n\n**Suggested Basic Troubleshooting:**\n- If SQLite says "database is locked", try deleting the \`.db-wal\` file manually and rebooting the device.\n- Also, please upload your full 500MB uncompressed system debug dump so our Tier-1 queue can inspect it.`;
    } else {
      statelessFallback = `Hello! Thank you for contacting Support.\n\nBefore we can assist you, could you please state:\n1. Your operating system and exact version\n2. Your runtime and infrastructure provider\n3. A full description of what you have tried so far\n\nHave you tried restarting your machine and clearing your browser cache?`;
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        personaId: persona.id,
        content: liveText || statelessFallback,
        timestamp: timeShort,
        mode: 'stateless',
        retrievedMemoryIds: [],
        retrievalLatencyMs: 4,
        tokensUsed: 118,
        toneAdaptation: 'Generic Tier-1 Script (Ignores Frustration & History)',
        llmSource: llmSourceLabel,
      },
      highlightedNodeIds: [],
      mutation,
    };
  }

  // Memory-Aware Mode
  const queryLower = userQuery.toLowerCase();
  const isHighFrustration = persona.frustrationLevel > 65;
  const toneAdaptation = isHighFrustration
    ? `Direct CLI Mode (Frustration ${persona.frustrationLevel}% > 65% — Pleasantries Skipped)`
    : `Consultative Step-by-Step Mode (Frustration ${persona.frustrationLevel}% ≤ 65%)`;

  const envNodeId = `env-${persona.id}`;
  const sentimentNodeId = `sentiment-${persona.id}`;
  const retrievedNodeIds: string[] = [envNodeId, sentimentNodeId];

  const logNodes: RetrievalLogEntry['nodes'] = [
    {
      id: envNodeId,
      title: `Environment: ${persona.environment.os} • ${persona.environment.infra}`,
      type: 'ENVIRONMENT',
      score: 0.99,
      snippet: `${persona.environment.os} | ${persona.environment.runtime} | Tags: ${allAdditionalTags.join(', ')}`,
      matchedKeyword: 'environment_context',
    },
    {
      id: sentimentNodeId,
      title: `Tone Calibration: Frustration ${persona.frustrationLevel}/100 (${isHighFrustration ? 'Direct CLI' : 'Step-by-Step'})`,
      type: 'CUSTOMER_SENTIMENT',
      score: 0.94,
      snippet: persona.personalityNotes,
      matchedKeyword: isHighFrustration ? 'frustration > 65%' : 'calm_preference',
    },
  ];

  // Match relevant tickets and playbooks
  let matchedTicket = persona.pastTickets[0];
  let matchedPlaybook = persona.playbooks[0];

  for (const t of persona.pastTickets) {
    const titleWords = t.title.toLowerCase().split(/\s+/);
    if (
      queryLower.includes(t.ticketNumber.toLowerCase()) ||
      titleWords.some((w) => w.length > 3 && queryLower.includes(w))
    ) {
      matchedTicket = t;
      break;
    }
  }

  for (const pb of [...mutation.newPlaybooks, ...persona.playbooks]) {
    const issueWords = pb.issue.toLowerCase().split(/\s+/);
    if (issueWords.some((w) => w.length > 3 && queryLower.includes(w))) {
      matchedPlaybook = pb;
      break;
    }
  }

  if (matchedTicket) {
    const tNodeId = `ticket-${matchedTicket.ticketNumber}`;
    retrievedNodeIds.push(tNodeId);
    logNodes.push({
      id: tNodeId,
      title: `Past Ticket #${matchedTicket.ticketNumber} (${matchedTicket.status.toUpperCase()}): ${matchedTicket.title}`,
      type: 'HISTORICAL_TICKET',
      score: 0.97,
      snippet: matchedTicket.resolution || matchedTicket.summary,
      matchedKeyword: matchedTicket.ticketNumber,
    });
  }

  if (matchedPlaybook) {
    const pbNodeId = `playbook-${persona.id}-0`;
    retrievedNodeIds.push(pbNodeId);
    logNodes.push({
      id: pbNodeId,
      title: `Playbook: ${matchedPlaybook.issue}`,
      type: 'PLAYBOOK_SOLUTION',
      score: 0.95,
      snippet: matchedPlaybook.provenFix,
      matchedKeyword: 'proven_fix',
    });
  }

  // Generate deterministic response if live LLM wasn't used
  let content = liveText || '';

  if (!content) {
    const memoryConfirmBanner =
      mutation.newEnvTags.length > 0 || mutation.newPlaybooks.length > 0
        ? `> 🧠 **Live Memory Write-Back:** Persisted ${[
            ...mutation.newEnvTags.map((t) => `Environment Tag \`${t}\``),
            ...mutation.newPlaybooks.map((p) => `Playbook Fix \`${p.provenFix}\``),
          ].join(' & ')} to your permanent profile.\n\n`
        : '';

    if (persona.id === 'alex-rivera') {
      const header = isHighFrustration
        ? `[DIRECT CLI MODE — Frustration ${persona.frustrationLevel}/100 > 65%: Skipping pleasantries]\n\n`
        : `Welcome back, Alex. Let's review your cluster state step-by-step.\n\n`;

      if (queryLower.includes('auth') || queryLower.includes('token') || queryLower.includes('pipeline') || queryLower.includes('expired')) {
        const t102 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-8719') || matchedTicket;
        retrievedNodeIds.splice(2, retrievedNodeIds.length - 2, 'ticket-TICK-8719', 'playbook-alex-rivera-1');
        content = `${memoryConfirmBanner}${header}Environment active: **${persona.environment.os}** • **${persona.environment.runtime}** • **${persona.environment.infra}** (${allAdditionalTags.join(', ')}).

Referencing past ticket **#${t102.ticketNumber}** (${t102.date}): your 45-minute blue/green canary rollout previously failed when the default OIDC token TTL expired mid-deployment.

**Next Logical Step (Based on What Worked Before):**
Execute the verified 2-hour STS assume-role refresh directly in your GitHub Actions runner:

\`\`\`bash
aws sts assume-role-with-web-identity \\
  --role-arn arn:aws:iam::392817291048:role/EKS-Canary-Deployer \\
  --role-session-name GHA-Runner-Canary \\
  --web-identity-token "\$ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
  --duration-seconds 7200 \\
  --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \\
  --output text
\`\`\`

 IAM policies are already validated — no root credential regeneration needed.`;
      } else {
        const t101 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-8842') || matchedTicket;
        content = `${memoryConfirmBanner}${header}Environment active: **${persona.environment.os}** • **${persona.environment.runtime}** • **${persona.environment.infra}** (${allAdditionalTags.join(', ')}).

Referencing past ticket **#${t101.ticketNumber}** (${t101.date}): we resolved this exact CoreDNS socket timeout by patching the CoreDNS ConfigMap (3s forward timeout, 60s cache TTL) and scaling to 6 replicas with PodAntiAffinity.

**Next Logical Step (Based on What Worked Before):**
Run this immediately to check if a recent Helm/Terraform run overwrote your ConfigMap or replica count:

\`\`\`bash
# 1. Verify CoreDNS pod distribution & replica count (target: 6 replicas)
kubectl get pods -n kube-system -l k8s-app=kube-dns -o wide

# 2. Re-apply the proven CoreDNS ConfigMap patch & rolling restart
kubectl -n kube-system patch configmap coredns --type merge -p '{"data":{"Corefile":".:53 {\\n    errors\\n    health\\n    ready\\n    kubernetes cluster.local in-addr.arpa ip6.arpa {\\n       pods insecure\\n       fallthrough in-addr.arpa ip6.arpa\\n       ttl 30\\n    }\\n    forward . /etc/resolv.conf {\\n       max_concurrent 1000\\n       timeout 3s\\n    }\\n    cache 60\\n    loop\\n    reload\\n    loadbalance\\n}"}}'
kubectl rollout restart deployment/coredns -n kube-system
\`\`\``;
      }
    } else if (persona.id === 'priya-nair') {
      const header = isHighFrustration
        ? `[DIRECT CLI MODE — Frustration ${persona.frustrationLevel}/100 > 65%: Immediate SQL & Config Fixes]\n\n`
        : `Hello Priya. I have loaded your **Apex Clearing Solutions** compliance profile (**${persona.environment.os}**, **${persona.environment.runtime}**, **${persona.environment.infra}**, tags: ${allAdditionalTags.join(', ')}).\n\n`;

      if (queryLower.includes('okta') || queryLower.includes('scim') || queryLower.includes('sso') || queryLower.includes('sync')) {
        const t202 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-9188') || matchedTicket;
        retrievedNodeIds.splice(2, retrievedNodeIds.length - 2, 'ticket-TICK-9188', 'playbook-priya-nair-1');
        content = `${memoryConfirmBanner}${header}Referencing open ticket **#${t202.ticketNumber}** (${t202.date} — *${t202.title}*):
The 6-hour delta bridge script is currently maintaining PostgreSQL RBAC parity while Okta completes the schema refresh.

**Next Logical Step (Based on What Worked Before):**
To force an immediate SCIM group attribute push for an upcoming audit review (with Security Ops approval hash), execute:

\`\`\`powershell
# Trigger Okta SCIM Delta Sync for PostgreSQL RBAC Audit-Reviewers
Invoke-RestMethod -Method POST -Uri "https://apex-clearing.okta.com/api/v1/apps/pg-rbac/scim/delta-sync" \`
  -Headers @{ Authorization = "Bearer \$env:OKTA_SCIM_TOKEN"; "X-SOC2-Audit-Hash" = "SHA256-APPROVED" }
\`\`\``;
      } else {
        const t201 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-9041') || matchedTicket;
        content = `${memoryConfirmBanner}${header}Referencing resolved ticket **#${t201.ticketNumber}** (${t201.date}): your previous >4.2s settlement webhook latency spike was caused by unbatched atomic writes, which we fixed by enabling micro-batching (50 payloads per 200ms window). Also tracking open ticket **#TICK-9188** (Okta SCIM sync).

**Next Logical Step (Based on What Worked Before):**
**Step 1: Verify active PostgreSQL 15.4 settlement workers**
\`\`\`sql
SELECT pid, usename, application_name, state, wait_event_type, wait_event
FROM pg_stat_activity
WHERE application_name ILIKE '%Webhook%' AND state != 'idle';
\`\`\`

**Step 2: Re-confirm micro-batch ingestion settings in \`application.yml\`**
\`\`\`yaml
webhook:
  batch:
    size: 50
    flush.interval.ms: 200
    idempotency.audit: strict # Required per SOC2 compliance
\`\`\``;
      }
    } else if (persona.id === 'marcus-vance') {
      const header = isHighFrustration
        ? `[DIRECT CLI MODE — Frustration ${persona.frustrationLevel}/100 > 65%: Low-Bandwidth Immediate Fix]\n\n`
        : `Marcus — copy that. Fleet profile loaded: **${persona.environment.os}**, **${persona.environment.runtime}**, over **${persona.environment.infra}** (${allAdditionalTags.join(', ')}).\n\n`;

      if (queryLower.includes('satellite') || queryLower.includes('packet') || queryLower.includes('handoff') || queryLower.includes('wan')) {
        const t301 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-7650') || matchedTicket;
        retrievedNodeIds.splice(2, retrievedNodeIds.length - 2, 'ticket-TICK-7650', 'playbook-marcus-vance-1');
        content = `${memoryConfirmBanner}${header}Referencing past ticket **#${t301.ticketNumber}** (${t301.date}): Starlink beam handoffs previously caused 12-second socket drops until we enabled the local 48-hour MQTT NVMe offline spooler.

**Next Logical Step (Based on What Worked Before — <160 bytes payload):**
Restart the spooler service and check backlog drain rate without pulling full logs over Iridium ($0.08/MB):

\`\`\`bash
systemctl restart edge-telemetry-spooler.service
tail -n 5 /var/log/mqtt-buffer.log
\`\`\``;
      } else if (queryLower.includes('memory') || queryLower.includes('python') || queryLower.includes('daemon') || queryLower.includes('118')) {
        const t303 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-8409') || matchedTicket;
        retrievedNodeIds.splice(2, retrievedNodeIds.length - 2, 'ticket-TICK-8409', 'playbook-marcus-vance-0');
        content = `${memoryConfirmBanner}${header}Referencing past ticket **#${t303.ticketNumber}** (${t303.date}): cyclic references in the Starlink socket wrapper caused RAM exhaustion on headless 1GB Debian 12 gateways.

**Next Logical Step (Based on What Worked Before):**
Trigger garbage collection via ` + '`SIGUSR1`' + ` and verify RSS memory footprint:

\`\`\`bash
pkill -SIGUSR1 -f telemetry_daemon.py && ps -o pid,rss,comm -C python3
\`\`\``;
      } else {
        const t302 = persona.pastTickets.find((t) => t.ticketNumber === 'TICK-8120') || matchedTicket;
        content = `${memoryConfirmBanner}${header}Referencing past ticket **#${t302.ticketNumber}** (${t302.date}): concurrent writes from the GPS reader and engine diagnostics daemon exceeded SQLite's 5000ms busy timeout. What worked before was enforcing Write-Ahead Logging (WAL) with a 30,000ms timeout.

**Next Logical Step (Based on What Worked Before — compact SSH one-liner):**
\`\`\`bash
sqlite3 /var/data/telemetry.db "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=30000;"
\`\`\`

⚠️ **Caution:** Do not delete \`/var/data/telemetry.db-wal\` while the Python 3.11 telemetry daemon is running.`;
      }
    } else {
      // Custom persona
      const header = isHighFrustration
        ? `[DIRECT CLI MODE — Frustration ${persona.frustrationLevel}/100 > 65%: Skipping pleasantries]\n\n`
        : `Hello ${persona.name}. Loaded your **${persona.company}** profile.\n\n`;
      const ticketRef = matchedTicket
        ? `Referencing past ticket **#${matchedTicket.ticketNumber}** (*${matchedTicket.title}*), which was resolved via: \`${matchedTicket.resolution}\`.`
        : 'All environment context loaded.';
      const pbFix = matchedPlaybook ? matchedPlaybook.provenFix : 'Check service health via CLI';

      content = `${memoryConfirmBanner}${header}Environment active: **${persona.environment.os}** • **${persona.environment.runtime}** • **${persona.environment.infra}** (${allAdditionalTags.join(', ')}).

${ticketRef}

**Next Logical Step (Based on What Worked Before):**
\`\`\`bash
${pbFix}
\`\`\``;
    }
  }

  const logEntry: RetrievalLogEntry = {
    id: `log-${Date.now()}`,
    timestamp,
    query: userQuery,
    personaId: persona.id,
    injectedNodeCount: logNodes.length,
    nodes: logNodes,
  };

  return {
    message: {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      personaId: persona.id,
      content,
      timestamp: timeShort,
      mode: 'memory-aware',
      retrievedMemoryIds: retrievedNodeIds,
      retrievalLatencyMs: Math.floor(Math.random() * 7) + 11,
      tokensUsed: 410 + Math.floor(Math.random() * 75),
      toneAdaptation,
      extractedMemories: [
        ...mutation.newEnvTags.map((t) => `Env: ${t}`),
        ...mutation.newPlaybooks.map((p) => `Playbook: ${p.provenFix}`),
      ],
      llmSource: llmSourceLabel,
    },
    logEntry,
    highlightedNodeIds: retrievedNodeIds,
    mutation,
  };
}

export function summarizeConversationToTicket(
  persona: CustomerPersona,
  messages: ChatMessage[]
): { ticket: PastTicket; playbook?: PlaybookItem } {
  const customerMessages = messages.filter((m) => m.sender === 'customer');
  const agentMessages = messages.filter((m) => m.sender === 'agent');

  const latestCustomerQuery =
    customerMessages[customerMessages.length - 1]?.content ||
    `Follow-up incident on ${persona.environment.infra}`;
  const latestAgentReply =
    agentMessages[agentMessages.length - 1]?.content ||
    `Applied verified playbook fix on ${persona.environment.os}`;

  // Extract a clean code snippet or resolution summary from the latest agent reply
  const codeBlockMatch = latestAgentReply.match(/```(?:[a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
  const commandLines = codeBlockMatch
    ? codeBlockMatch[1]
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
    : [];

  const extractedCommand =
    commandLines[0] ||
    persona.playbooks[0]?.provenFix ||
    `Verified configuration on ${persona.environment.os}`;

  const shortTitle =
    latestCustomerQuery.length > 58
      ? latestCustomerQuery.slice(0, 55).trim() + '...'
      : latestCustomerQuery;

  const ticketNumber = `TICK-${Math.floor(9200 + Math.random() * 799)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const newTicket: PastTicket = {
    id: `t-arch-${Date.now()}`,
    ticketNumber,
    title: shortTitle,
    status: 'resolved',
    date: dateStr,
    category: 'Live Archived Session',
    summary: `Customer reported: "${latestCustomerQuery}". Context engine matched ${persona.environment.os} / ${persona.environment.infra}.`,
    resolution: `Executed verified fix: ${extractedCommand}`,
    keyTakeaway: `Resolved in-session via Memory-First Playbook; customer frustration reduced to ${Math.max(10, persona.frustrationLevel - 15)}/100.`,
    isNewlyArchived: true,
  };

  return { ticket: newTicket };
}
