# OmniRecall: Memory-First Customer Support Agent

> **Live Interactive Portfolio Demo for LinkedIn Visitors, Engineering Leaders & Tech Recruiters**  
> 🌐 **Live Demo:** [https://memory-support-agentmemory-support.vercel.app](https://memory-support-agentmemory-support.vercel.app)

---

## 💡 Overview

In enterprise technical support (B2B SaaS, Cloud Infrastructure, FinTech, and IoT/Edge), **over 68% of customer churn and escalation frustration** stems from customers being forced to repeatedly explain their operating systems, software versions, cloud architectures, and past troubleshooting steps to tier-1 agents.

**OmniRecall** demonstrates how an AI Support Agent equipped with persistent long-term memory, real-time context injection, and sentiment adaptation eliminates repetitive tier-1 friction by remembering:
- Exact technical environments (OS, runtime, cloud provider, and microservice tags)
- Historical incident tickets and their verified resolutions
- "What Worked Before" proven CLI playbooks
- Real-time customer sentiment & frustration levels (0–100)
- Automatic write-back loops that extract new environment components and playbook fixes dynamically from live conversations.

---

## ⚡ Key Features

### 1. 1-Click Split Comparison Demo Modal
- Side-by-side comparison handling the exact same customer complaint (`"It's happening again!"`):
  - **Left (Stateless Bot):** Session amnesia, asks repetitive OS/stack questions, recommends previously failed troubleshooting steps (+20% frustration spike, 14–35 minutes wasted).
  - **Right (OmniRecall Agent):** Zero repetition, references past ticket IDs (`#TICK-8842`, `#TICK-9041`, `#TICK-8120`), auto-injects verified CLI one-liners, and adapts communication tone (92% faster resolution).

### 2. Pre-Loaded Enterprise Personas (LocalStorage Sandbox)
- **Alex Rivera (DevOps Lead - CloudScale Systems):** Ubuntu 22.04 LTS, Docker v24, AWS EKS (K8s v1.28). Past Tickets: CoreDNS upstream timeout `#TICK-8842` & AWS IAM STS token expiry `#TICK-8719`. Frustration: 75/100 (Direct CLI Mode).
- **Priya Nair (FinTech Ops - Apex Clearing Solutions):** Windows 11 Enterprise, PostgreSQL 15.4, Okta SSO. Past Tickets: Webhook latency batching `#TICK-9041` & SCIM sync `#TICK-9188`. Frustration: 30/100 (Compliance & audit-first).
- **Marcus Vance (Fleet Systems Manager - OrbitLogistics Maritime):** Edge Linux Gateway (Debian 12 RT), Python 3.11, Satellite WAN (Starlink/Iridium). Past Tickets: Packet drop `#TICK-7650` & SQLite lock cleared via WAL mode `#TICK-8120`. Frustration: 60/100 (Bandwidth-conscious, compact SSH one-liners).

### 3. Dual-Mode Response Engine
- **Built-in Deterministic AI Engine:** Works 100% out-of-the-box in any browser without needing API keys.
- **BYO Key Integration:** Optional modal supporting live Google Gemini (`gemini-2.5-flash`) or OpenAI (`gpt-4o-mini`) API keys with instant fallback.

### 4. Real-Time Memory Mutation (Write-Back Loop)
- **Auto-Memory Extraction:** Automatically detects mentions of newly deployed technologies (e.g. `Redis 7.2`, `Cilium 1.15`, `PgBouncer 1.21`) or configuration fixes (`setting X fixed Y`) and updates the customer profile in real time.
- **Sentiment & Frustration Tracking:** Increases frustration (+20) when stateless bots repeat questions, and decreases frustration (-12 to -15) when the agent provides immediate context-aware solutions.
- **Resolve & Archive to Memory:** Summarizes the active chat session into a newly archived ticket card in the right panel.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4 (Dark Slate enterprise theme)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Storage:** LocalStorage persistence with 1-click "Reset Demo Data"

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/omni-recall.git
cd omni-recall

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Public Deployment

This project is pre-configured with `vercel.json` for single-command deployment to Vercel:

```bash
npx vercel
```
Live URL: [https://memory-support-agentmemory-support.vercel.app](https://memory-support-agentmemory-support.vercel.app)
