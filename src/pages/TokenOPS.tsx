import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatCurrencyExact, formatCompactCurrency } from "@/utils/format";
import { Cpu, Database, Layers, Lightbulb, Search, Sparkles, TrendingUp, Users } from "lucide-react";

const summaryCards = [
  { label: "Total Tokens", value: "16.4M", delta: "+12%", icon: Sparkles },
  { label: "Prompt Tokens", value: "9.8M", delta: "+9%", icon: Lightbulb },
  { label: "Completion Tokens", value: "4.6M", delta: "+14%", icon: Layers },
  { label: "Cached Tokens", value: "1.2M", delta: "-3%", icon: Database },
  { label: "Embedding Tokens", value: "820K", delta: "+7%", icon: Cpu },
  { label: "Total Cost", value: "$18.2K", delta: "+8%", icon: TrendingUp },
  { label: "Avg Tokens / Request", value: "1.4K", delta: "-2%", icon: Users },
  { label: "Estimated Savings", value: "$3.1K", delta: "+22%", icon: Sparkles },
];

const usageTrend = [
  { period: "Jan 1", prompt: 1400, completion: 620, total: 2020 },
  { period: "Jan 2", prompt: 1620, completion: 740, total: 2360 },
  { period: "Jan 3", prompt: 1510, completion: 680, total: 2190 },
  { period: "Jan 4", prompt: 1790, completion: 810, total: 2600 },
  { period: "Jan 5", prompt: 1680, completion: 760, total: 2440 },
  { period: "Jan 6", prompt: 1860, completion: 910, total: 2770 },
  { period: "Jan 7", prompt: 1720, completion: 840, total: 2560 },
];

const distribution = [
  { name: "Prompt", value: 59, tokens: 9800000, cost: 9200 },
  { name: "Completion", value: 28, tokens: 4600000, cost: 4200 },
  { name: "Embedding", value: 8, tokens: 820000, cost: 760 },
  { name: "Cached", value: 4, tokens: 160000, cost: 80 },
  { name: "Reasoning", value: 1, tokens: 82000, cost: 40 },
];

const providerData = [
  { provider: "OpenAI", requests: 82000, tokens: 9100000, cost: 10240, latency: 240, success: "99.2%", trend: "+8%" },
  { provider: "Anthropic", requests: 36000, tokens: 4200000, cost: 4440, latency: 310, success: "98.7%", trend: "+5%" },
  { provider: "Gemini", requests: 18000, tokens: 1620000, cost: 1680, latency: 280, success: "99.0%", trend: "+10%" },
  { provider: "Groq", requests: 9000, tokens: 860000, cost: 720, latency: 210, success: "98.9%", trend: "-2%" },
  { provider: "Azure OpenAI", requests: 7200, tokens: 640000, cost: 620, latency: 290, success: "99.1%", trend: "+3%" },
];

const modelComparison = [
  { model: "gpt-4.1-mini", requests: 36000, prompt: 5200000, completion: 2600000, cost: 4200, latency: 280, quality: 91 },
  { model: "gpt-4o", requests: 22000, prompt: 3200000, completion: 1480000, cost: 3740, latency: 310, quality: 88 },
  { model: "claude-3.5", requests: 16000, prompt: 2340000, completion: 970000, cost: 2900, latency: 330, quality: 85 },
  { model: "gemini-1.5", requests: 12000, prompt: 1740000, completion: 690000, cost: 2160, latency: 300, quality: 82 },
];

const topConsumers = {
  users: [
    { name: "Nina Patel", requests: 1820, tokens: 290000, cost: 310, active: "2h ago" },
    { name: "Team Orion", requests: 1560, tokens: 264000, cost: 280, active: "4h ago" },
  ],
  projects: [
    { name: "AI Assist", requests: 3200, tokens: 520000, cost: 560, active: "1h ago" },
    { name: "RAG Search", requests: 2700, tokens: 430000, cost: 460, active: "3h ago" },
  ],
  agents: [
    { name: "PromptRefiner", requests: 1180, tokens: 190000, cost: 210, active: "30m ago" },
    { name: "CacheWatcher", requests: 980, tokens: 170000, cost: 170, active: "5h ago" },
  ],
  apiKeys: [
    { name: "key_live_abc123", requests: 830, tokens: 133000, cost: 140, active: "2h ago" },
    { name: "key_dev_xyz789", requests: 520, tokens: 88000, cost: 92, active: "6h ago" },
  ],
};

const promptAnalysis = [
  { label: "Largest Prompt", value: "14.8K tokens" },
  { label: "Average Prompt Size", value: "2.3K tokens" },
  { label: "Longest Conversation", value: "38 turns" },
  { label: "Repeated Prompts", value: "17%" },
  { label: "Prompt Efficiency Score", value: "74/100" },
];

const contextStats = [
  { label: "Current Context", value: "9.2K" },
  { label: "Maximum Context", value: "16K" },
  { label: "Remaining Context", value: "6.8K" },
  { label: "Usage %", value: "58%" },
];

const cacheStats = [
  { label: "Cache Hit Rate", value: "72%" },
  { label: "Cache Miss", value: "28%" },
  { label: "Tokens Saved", value: "1.1M" },
  { label: "Money Saved", value: "$880" },
];

const recommendations = [
  { title: "Reduce Prompt Length", savings: "42%", priority: "High" },
  { title: "Remove Duplicate Instructions", savings: "18%", priority: "Medium" },
  { title: "Use Cached Prompt", savings: "11%", priority: "Medium" },
  { title: "Switch Model: GPT-5 → GPT-4.1-mini", savings: "63%", priority: "High" },
  { title: "Compress RAG Context", savings: "35%", priority: "Medium" },
  { title: "Summarize Conversation", savings: "28%", priority: "Medium" },
  { title: "Reduce Output Tokens", savings: "16%", priority: "Low" },
];

const forecastData = [
  { date: "Tomorrow", tokens: 241000, cost: 240 },
  { date: "Next Week", tokens: 1640000, cost: 1620 },
  { date: "Next Month", tokens: 7400000, cost: 7200 },
  { date: "Quarter", tokens: 22800000, cost: 22200 },
];

const anomalyCards = [
  { title: "Abnormal Token Spike", severity: "Critical" },
  { title: "Large Prompt", severity: "High" },
  { title: "Infinite Loop", severity: "Medium" },
  { title: "Prompt Injection", severity: "High" },
  { title: "Repeated Requests", severity: "Low" },
  { title: "Cost Spike", severity: "Critical" },
];

const alerts = [
  { rule: "Daily Tokens > 2 Million", channel: "Email" },
  { rule: "Monthly Cost > $1000", channel: "Slack" },
  { rule: "Context Usage > 90%", channel: "Webhook" },
  { rule: "Prompt > 15K Tokens", channel: "Teams" },
  { rule: "Cache Hit < 20%", channel: "Email" },
];

const costBreakdown = [
  { category: "Provider", value: 41 },
  { category: "Department", value: 23 },
  { category: "Project", value: 17 },
  { category: "User", value: 10 },
  { category: "Agent", value: 9 },
  { category: "Model", value: 12 },
];

const ragAnalysis = [
  { label: "Embedding Tokens", value: "820K" },
  { label: "Retrieved Chunks", value: "1.9K" },
  { label: "Average Chunk Size", value: "320 tokens" },
  { label: "Knowledge Hits", value: "88%" },
  { label: "Context Compression", value: "64%" },
];

const apiUsage = [
  { key: "key_live_abc123", requests: 830, tokens: 133000, cost: 140, errors: 2, rateLimit: "95%", latency: 240 },
  { key: "key_dev_xyz789", requests: 520, tokens: 88000, cost: 92, errors: 0, rateLimit: "100%", latency: 260 },
];

const optimizedPrompt = `Optimize the following prompt for token efficiency while preserving meaning. Use concise wording and remove duplicates.`;
const currentPrompt = `Write a detailed marketing plan for a new AI platform. Include target audience, budget, channels, messaging, timelines, KPIs, and metrics. Repeat important details and include examples.`;

const colors = ["#16a34a", "#0ea5e9", "#f97316", "#8b5cf6", "#ec4899", "#facc15"];

function tokenFormatter(value: number) {
  return value.toLocaleString();
}

export default function TokenOPS() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const [promptValue, setPromptValue] = useState(currentPrompt);
  const [optimizedValue] = useState(optimizedPrompt);

  const tabData = useMemo(() => {
    const map = {
      users: topConsumers.users,
      projects: topConsumers.projects,
      agents: topConsumers.agents,
      apiKeys: topConsumers.apiKeys,
    } as const;
    return map[activeTab];
  }, [activeTab]);

  const filteredTabData = tabData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-background/70 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Token-OPS</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Analyze, optimize, and reduce AI token usage across all providers.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_auto]">
            <div className="relative">
              <Input
                placeholder="Search user, project, agent, api key..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border border-border/60 bg-background/80">
            <CardHeader className="flex items-start justify-between gap-3 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <card.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={card.delta.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>{card.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Token Usage Trend</CardTitle>
            <CardDescription>Daily prompt, completion, and total token trends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageTrend} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="prompt" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
            <CardDescription>Prompt, completion, embedding, and cache share.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={55} paddingAngle={4}>
                  {distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provider Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerData.map((row) => (
                    <TableRow key={row.provider}>
                      <TableCell className="font-medium">{row.provider}</TableCell>
                      <TableCell>{row.requests.toLocaleString()}</TableCell>
                      <TableCell>{row.tokens.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrencyExact(row.cost)}</TableCell>
                      <TableCell>{row.latency} ms</TableCell>
                      <TableCell>{row.success}</TableCell>
                      <TableCell className={row.trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>{row.trend}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Prompt Tokens</TableHead>
                    <TableHead>Completion Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelComparison.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-medium">{model.model}</TableCell>
                      <TableCell>{model.requests.toLocaleString()}</TableCell>
                      <TableCell>{model.prompt.toLocaleString()}</TableCell>
                      <TableCell>{model.completion.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(model.cost)}</TableCell>
                      <TableCell>{model.latency} ms</TableCell>
                      <TableCell>{model.quality}/100</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Token Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="users">Top Users</TabsTrigger>
                <TabsTrigger value="projects">Top Projects</TabsTrigger>
                <TabsTrigger value="agents">Top Agents</TabsTrigger>
                <TabsTrigger value="apiKeys">Top API Keys</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <div className="grid gap-3">
                  {filteredTabData.map((row) => (
                    <div key={row.name} className="rounded-xl border border-border/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">{row.name}</p>
                          <p className="text-xs text-muted-foreground">Last active {row.active}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{row.requests.toLocaleString()} req</p>
                          <p>{row.tokens.toLocaleString()} tok</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {promptAnalysis.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Context Window Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contextStats.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{item.label}</span><span>{item.value}</span></div>
                {item.label === "Usage %" ? <Progress value={58} /> : <Progress value={Math.min(100, Number(item.value.replace(/\D/g, "")))} />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cache Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cacheStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Optimization Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Prompt</p>
                <div className="rounded-xl border border-border/60 bg-muted p-3 text-sm leading-6">{promptValue}</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Optimized Prompt</p>
                <div className="rounded-xl border border-border/60 bg-background p-3 text-sm leading-6">{optimizedValue}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="mt-1 text-xl font-semibold">55%</p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="mt-1 text-xl font-semibold">91/100</p>
                </div>
              </div>
              <Button onClick={() => setPromptValue(optimizedPrompt)}>Apply Optimized Prompt</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recommendations.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Estimated Savings {item.savings}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">Priority {item.priority}</span>
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => formatCompactCurrency(value)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="tokens" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid gap-3">
              {forecastData.map((item) => (
                <div key={item.date} className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.date}</span>
                  <span>{formatCompactCurrency(item.cost)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.rule} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{alert.rule}</p>
                <p className="text-xs text-muted-foreground">Channel: {alert.channel}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anomaly Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {anomalyCards.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">Severity: {item.severity}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={costBreakdown} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RAG Token Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ragAnalysis.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Key</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiUsage.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="font-medium">{item.key}</TableCell>
                      <TableCell>{item.requests.toLocaleString()}</TableCell>
                      <TableCell>{item.tokens.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(item.cost)}</TableCell>
                      <TableCell>{item.errors}</TableCell>
                      <TableCell>{item.rateLimit}</TableCell>
                      <TableCell>{item.latency} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
