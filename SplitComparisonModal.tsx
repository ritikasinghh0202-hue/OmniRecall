import React, { useState } from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  X, 
  Split, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const SplitComparisonModal: React.FC = () => {
  const { isCompareModalOpen, setIsCompareModalOpen, personas } = useSupport();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('alex-rivera');

  if (!isCompareModalOpen) return null;

  const persona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const comparisons: Record<string, {
    query: string;
    stateless: {
      response: string;
      timeSpent: string;
      frustrationChange: string;
      outcome: string;
    };
    memoryAware: {
      response: string;
      timeSpent: string;
      frustrationChange: string;
      outcome: string;
      retrievedNodes: string[];
    };
  }> = {
    'alex-rivera': {
      query: "It's happening again! CoreDNS pod restarts are failing on our production nodes.",
      stateless: {
        timeSpent: "14 mins back-and-forth",
        frustrationChange: "+20% (Spikes to 95/100)",
        outcome: "Customer churn risk; Alex forced to repeat cluster architecture and past solutions.",
        response: `Hello! Thank you for contacting Cloud Support Tier-1.

Before we can assist you with your DNS issue, please provide:
1. What operating system and kernel version are you running?
2. Which cloud host or virtualization platform is this deployed on?
3. What is the full reproduction path and container engine version?

**Basic Troubleshooting:**
- Please flush your workstation DNS cache using 'ipconfig /flushdns' or 'systemd-resolve --flush-caches'.
- Reboot your network switch and check if the pods recover.
- If the issue continues, please upload your full cluster logs for our engineering team to review within 24-48 business hours.`
      },
      memoryAware: {
        timeSpent: "45 seconds to resolution",
        frustrationChange: "-15% (Reduced to 60/100)",
        outcome: "Zero repetitive questions. Exact verified CLI command applied in 1 click.",
        retrievedNodes: ["Ubuntu 22.04 LTS / AWS EKS v1.28", "Past Ticket #TICK-8842", "CoreDNS DaemonSet Playbook", "High Frustration Tone Filter"],
        response: `[DIRECT CLI MODE — Skipping pleasantries per Frustration 75/100]

Environment loaded: **Ubuntu 22.04 LTS** on **AWS EKS (K8s v1.28)** with **Docker v24.0.7**.

Referencing past ticket **#TICK-8842** (Oct 14): upstream CoreDNS socket exhaustion was resolved by setting a 3s forward timeout and 60s cache TTL across 6 replicas.

Run this immediately to restore the verified configuration:

\`\`\`bash
# 1. Inspect forward timeout & cache config
kubectl get configmap coredns -n kube-system -o jsonpath='{.data.Corefile}' | grep -E "cache|forward"

# 2. Re-apply verified one-liner patch & restart deployment
kubectl -n kube-system patch configmap coredns --type merge -p '{"data":{"Corefile":".:53 {\\n    errors\\n    health\\n    ready\\n    kubernetes cluster.local in-addr.arpa ip6.arpa {\\n       pods insecure\\n       fallthrough in-addr.arpa ip6.arpa\\n       ttl 30\\n    }\\n    forward . /etc/resolv.conf {\\n       max_concurrent 1000\\n       timeout 3s\\n    }\\n    cache 60\\n    loop\\n    reload\\n    loadbalance\\n}"}}'
kubectl rollout restart deployment/coredns -n kube-system
\`\`\`

Are PodAntiAffinity rules still holding on us-east-1?`
      }
    },
    'priya-nair': {
      query: "It's happening again! Webhook settlement latency is climbing over 4 seconds on our queue.",
      stateless: {
        timeSpent: "22 mins back-and-forth",
        frustrationChange: "+20% (Spikes to 50/100)",
        outcome: "Violates SOC2 change protocol; bot proposes destructive client reinstall.",
        response: `Hi Priya! Thank you for reaching out to Technical Support.

We do not have your database details on file for this session. Please tell us:
1. What database engine and version are you connecting to?
2. Are you connecting over SSL or plain TCP?
3. Could you reinstall your database client and restart your local computer?

Once you verify your account credentials, our billing and backend team will inspect the webhook endpoint.`
      },
      memoryAware: {
        timeSpent: "1 min to verify",
        frustrationChange: "-12% (Calm at 18/100)",
        outcome: "Immediate reference to Ticket #TICK-9041 and application.yml batch queue parameters with audit trail safety.",
        retrievedNodes: ["Windows 11 Enterprise (23H2)", "PostgreSQL 15.4 / Okta SSO", "Past Ticket #TICK-9041", "Micro-Batching Playbook"],
        response: `Good morning Priya. Loaded your **Apex Clearing Solutions** profile: **PostgreSQL 15.4** on Windows 11 Enterprise with Okta SSO.

Recalling ticket **#TICK-9041** (Oct 22): settlement latency exceeding 4.2s was resolved by switching to micro-batches (50 payloads per 200ms transaction window). Also tracking open SCIM ticket **#TICK-9188**.

**Step 1: Check active connection states in PostgreSQL 15**
\`\`\`sql
SELECT pid, usename, client_addr, state, query_start, age(clock_timestamp(), query_start)
FROM pg_stat_activity
WHERE query ILIKE '%webhook_settlement%' AND state != 'idle';
\`\`\`

**Step 2: Confirm micro-batch queue parameters**
Verify that 'webhook.batch.size=50' and 'webhook.flush.interval.ms=200' in application.yml have not drifted.

Audit log timestamp generated for your compliance file.`
      }
    },
    'marcus-vance': {
      query: "It's happening again! SQLite database locked error on vessel gateway #402.",
      stateless: {
        timeSpent: "35 mins + $40 in satellite fees",
        frustrationChange: "+20% (Spikes to 80/100)",
        outcome: "Bot suggests downloading 500MB dump over satellite WAN ($0.08/MB) and deleting WAL file, which corrupts database.",
        response: `Hello Marcus! We see you are getting a database lock error.

Can you please:
1. Tell us what operating system the gateway is running?
2. Upload the entire 500MB debug dump and log folder so we can inspect it?
3. Try deleting the '.db-wal' file and reboot the machine?

Please let us know once you complete these steps.`
      },
      memoryAware: {
        timeSpent: "30 seconds (128 bytes WAN)",
        frustrationChange: "-15% (Reduced to 45/100)",
        outcome: "Compact SSH one-liner under 128 bytes. Prevents catastrophic .db-wal file deletion.",
        retrievedNodes: ["Debian 12 RT Edge Gateway", "Python 3.11 / Starlink Satellite", "Past Ticket #TICK-8120", "WAL Mode Playbook"],
        response: `Marcus — copy that. Pulling profile: **Edge Linux Gateway (Debian 12 RT)** with **Python 3.11** over **Satellite WAN link**.

Referencing **#TICK-8120**: GPS reader and engine diagnostics caused simultaneous write contention. Proven fix is Write-Ahead Logging (WAL) with 30s timeout.

Low-bandwidth command (<128 bytes):
\`\`\`bash
sqlite3 /var/data/telemetry.db "PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=30000;"
sqlite3 /var/data/telemetry.db "PRAGMA journal_mode;"
\`\`\`

⚠️ **Caution:** Do NOT delete /var/data/telemetry.db-wal while the daemon is running.`
      }
    }
  };

  const comp = comparisons[persona.id] || comparisons['alex-rivera'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">1-Click Split Comparison Demo</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Side-by-Side Impact
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Witness how persistent memory transforms enterprise technical support
              </p>
            </div>
          </div>

          {/* Persona selector tabs inside modal */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  p.id === selectedPersonaId
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name.split(' ')[0]} ({p.role.split(' ')[0]})
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Complaint Query Banner */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center space-x-3 text-xs shrink-0">
          <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-slate-800 text-cyan-400 border border-slate-700 shrink-0">
            Incoming User Complaint
          </span>
          <p className="text-slate-200 font-medium italic truncate">
            "{comp.query}"
          </p>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 overflow-y-auto">
          {/* LEFT: Stateless Bot */}
          <div className="flex flex-col rounded-xl border border-rose-900/50 bg-slate-950/70 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-rose-950/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Standard Stateless Bot (No Memory)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-400 font-mono">
                Session Amnesia
              </span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mb-0.5">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>Time to Resolution</span>
                </span>
                <span className="font-bold text-rose-300 text-xs">{comp.stateless.timeSpent}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-rose-400" />
                  <span>Frustration Impact</span>
                </span>
                <span className="font-bold text-rose-300 text-xs">{comp.stateless.frustrationChange}</span>
              </div>
            </div>

            {/* Outcome badge */}
            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-[11px] text-rose-300 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{comp.stateless.outcome}</span>
            </div>

            {/* Response Content */}
            <div className="flex-1 flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Actual Bot Response:
              </span>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-64 flex-1">
                {comp.stateless.response}
              </div>
            </div>
          </div>

          {/* RIGHT: Memory-Aware Agent */}
          <div className="flex flex-col rounded-xl border border-cyan-800/60 bg-slate-950/70 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-cyan-950/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  OmniRecall Memory-Aware Agent
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono">
                Persistent Graph
              </span>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mb-0.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Time to Resolution</span>
                </span>
                <span className="font-bold text-emerald-300 text-xs">{comp.memoryAware.timeSpent}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mb-0.5">
                  <TrendingDown className="w-3 h-3 text-emerald-400" />
                  <span>Frustration Impact</span>
                </span>
                <span className="font-bold text-emerald-300 text-xs">{comp.memoryAware.frustrationChange}</span>
              </div>
            </div>

            {/* Outcome badge */}
            <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{comp.memoryAware.outcome}</span>
            </div>

            {/* Retrieved memory chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-slate-400 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Auto-Injected:</span>
              </span>
              {comp.memoryAware.retrievedNodes.map((n, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-mono">
                  {n}
                </span>
              ))}
            </div>

            {/* Response Content */}
            <div className="flex-1 flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Actual Agent Response:
              </span>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 font-mono text-[11px] text-cyan-100/90 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-64 flex-1">
                {comp.memoryAware.response}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong className="text-slate-200">92% faster resolution</strong>
            </span>
            <span className="flex items-center space-x-1.5">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <strong className="text-slate-200">Zero customer repetition</strong>
            </span>
            <span className="hidden sm:flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <strong className="text-slate-200">Live Write-Back Loop</strong>
            </span>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            Back to Interactive Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
