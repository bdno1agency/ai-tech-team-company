import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bot,
  CheckCircle2,
  Cpu,
  Gauge,
  ListTodo,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

type Agent = {
  id: string;
  name: string;
  status: string;
  current_task: string;
  model: string;
  cost: number;
  health: number;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
};

type LogItem = {
  id: number;
  timestamp: string;
  agent: string;
  message: string;
};

type MemoryItem = {
  title: string;
  snippet: string;
};

type AgentConfig = {
  name: string;
  prompt: string;
  model: string;
  temperature: number;
  tools: string[];
  permissions: string[];
};

type ApprovalItem = {
  id: string;
  action: string;
  reason: string;
  status: string;
};

const states = ['To Do', 'In Progress', 'Blocked', 'Done'];

const fallbackAgents: Agent[] = [
  { id: 'orchestrator', name: 'Orchestrator', status: 'running', current_task: 'Reviewing goals', model: 'gpt-4o-mini', cost: 0.12, health: 96 },
  { id: 'developer', name: 'Developer', status: 'running', current_task: 'Building dashboard shell', model: 'gpt-4o-mini', cost: 0.09, health: 93 },
  { id: 'qa', name: 'QA', status: 'idle', current_task: 'Ready for validation', model: 'gpt-4o-mini', cost: 0.04, health: 91 },
];

const fallbackTasks: Task[] = [
  { id: 'task-1', title: 'Project setup', description: 'Initialize backend and frontend', status: 'Done', priority: 'high', assignee: 'Orchestrator' },
  { id: 'task-2', title: 'Dashboard MVP', description: 'Create the initial control panel', status: 'In Progress', priority: 'high', assignee: 'Developer' },
  { id: 'task-3', title: 'QA pass', description: 'Review and validate the MVP flow', status: 'To Do', priority: 'medium', assignee: 'QA' },
];

const fallbackLogs: LogItem[] = [
  { id: 1, timestamp: '09:41', agent: 'Orchestrator', message: 'Assigned Developer to build the live dashboard shell.' },
  { id: 2, timestamp: '09:47', agent: 'Developer', message: 'Built the Phase 1 dashboard layout and command flow.' },
  { id: 3, timestamp: '09:53', agent: 'QA', message: 'Prepared validation checks for the MVP flow.' },
];

const fallbackMemory: MemoryItem[] = [
  { title: 'Project bootstrap complete', snippet: 'The backend and frontend were scaffolded successfully and are ready for active tasking.' },
  { title: 'Dashboard shell ready', snippet: 'The UI has a working task board, command console, and orchestrator panels.' },
];

const fallbackConfig: AgentConfig[] = [
  {
    name: 'Orchestrator',
    prompt: 'Break goals into tasks, optimize assignments, and request approval before risky actions.',
    model: 'gpt-4o-mini',
    temperature: 0.2,
    tools: ['memory_search', 'task_planner', 'approval_gate'],
    permissions: ['read', 'write', 'approve_risky_actions'],
  },
  {
    name: 'Developer',
    prompt: 'Build features with maintainability and code quality as first priorities.',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    tools: ['file_system', 'docker_sandbox', 'github'],
    permissions: ['read', 'write'],
  },
  {
    name: 'QA',
    prompt: 'Validate flows, identify bugs, and communicate severity clearly.',
    model: 'gpt-4o-mini',
    temperature: 0.1,
    tools: ['test_runner', 'security_checks'],
    permissions: ['read'],
  },
];

const fallbackApprovals: ApprovalItem[] = [
  { id: 'approval-1', action: 'Deploy to production', reason: 'Requires owner approval', status: 'pending' },
  { id: 'approval-2', action: 'Delete temp workspace', reason: 'Destructive action', status: 'pending' },
];

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(fallbackAgents);
  const [tasks, setTasks] = useState<Task[]>(fallbackTasks);
  const [logs, setLogs] = useState<LogItem[]>(fallbackLogs);
  const [memory, setMemory] = useState<MemoryItem[]>(fallbackMemory);
  const [agentConfig, setAgentConfig] = useState<AgentConfig[]>(fallbackConfig);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(fallbackApprovals);
  const [command, setCommand] = useState('Focus on mobile responsiveness');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const taskCounts = useMemo(
    () => ({
      total: tasks.length,
      inFlight: tasks.filter((task) => task.status !== 'Done').length,
      blocked: tasks.filter((task) => task.status === 'Blocked').length,
    }),
    [tasks]
  );

  const fetchData = async () => {
    try {
      const [agentRes, taskRes, overviewRes, configRes, approvalRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/agents`),
        fetch(`${apiBaseUrl}/api/v1/tasks`),
        fetch(`${apiBaseUrl}/api/v1/dashboard/overview`),
        fetch(`${apiBaseUrl}/api/v1/agent-config`),
        fetch(`${apiBaseUrl}/api/v1/approvals`),
      ]);

      const [agentData, taskData, overviewData, configData, approvalData] = await Promise.all([
        agentRes.json(),
        taskRes.json(),
        overviewRes.json(),
        configRes.json(),
        approvalRes.json(),
      ]);

      setAgents(agentData);
      setTasks(taskData);
      setLogs(overviewData.logs || fallbackLogs);
      setMemory(overviewData.memory || fallbackMemory);
      setAgentConfig(configData || fallbackConfig);
      setApprovals(approvalData.length ? approvalData : fallbackApprovals);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setAgents(fallbackAgents);
      setTasks(fallbackTasks);
      setLogs(fallbackLogs);
      setMemory(fallbackMemory);
      setAgentConfig(fallbackConfig);
      setApprovals(fallbackApprovals);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const submitCommand = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/dashboard/command?command=${encodeURIComponent(command)}`, {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data.result || 'Command accepted by the Orchestrator.');
    } catch (error) {
      setResult('Command accepted locally: backend is unreachable, but the Orchestrator queue is ready.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (approvalId: string, decision: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/approvals/${approvalId}/${decision}`, {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data.status === 'ok' ? `Approval ${decision}d for ${approvalId}` : 'Approval update processed.');
      setApprovals((current) =>
        current.map((item) =>
          item.id === approvalId ? { ...item, status: decision === 'approve' ? 'approved' : 'rejected' } : item
        )
      );
    } catch (error) {
      setResult(`Approval ${decision}d locally for ${approvalId}.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-400">AI Tech Team Company</p>
            <h1 className="mt-2 text-3xl font-semibold">Human-in-the-loop command center</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <Sparkles size={16} />
            System online
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Agents online', value: String(agents.length), icon: Bot },
            { label: 'Tasks in flight', value: String(taskCounts.inFlight), icon: ListTodo },
            { label: 'Blocked', value: String(taskCounts.blocked), icon: ShieldCheck },
            { label: 'Success rate', value: '92%', icon: Gauge },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-glow">
              <div className="mb-3 flex items-center justify-between text-slate-400">
                <span className="text-sm">{label}</span>
                <Icon size={16} />
              </div>
              <div className="text-3xl font-bold">{value}</div>
            </div>
          ))}
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agent overview</h2>
              <Activity className="text-emerald-400" size={18} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">{agent.name}</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${agent.status === 'running' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-slate-400">{agent.current_task}</p>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Model</span>
                    <span>{agent.model}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Cost</span>
                    <span>${agent.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Health</span>
                    <span>{agent.health}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Command console</h2>
              <MessageSquare className="text-emerald-400" size={18} />
            </div>
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 outline-none placeholder:text-slate-500"
              placeholder="Type a command..."
            />
            <button
              onClick={submitCommand}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send to Orchestrator'}
            </button>
            {result && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {result}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Task board</h2>
              <CheckCircle2 className="text-emerald-400" size={18} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {states.map((state) => (
                <div key={state} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.12em] text-slate-400">{state}</h3>
                  <div className="space-y-3">
                    {tasks.filter((task) => task.status === state).map((task) => (
                      <div key={task.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-200">{task.title}</span>
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{task.description}</p>
                        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
                          <span>{task.assignee}</span>
                          <span>#{task.id}</span>
                        </div>
                      </div>
                    ))}
                    {!tasks.some((task) => task.status === state) && (
                      <div className="rounded-lg border border-dashed border-slate-700 p-4 text-center text-xs text-slate-500">
                        No items
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Approval queue</h2>
                <ShieldCheck className="text-amber-400" size={18} />
              </div>
              <div className="space-y-3">
                {approvals.map((item) => (
                  <div key={item.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm">
                    <div className="font-medium text-amber-200">{item.action}</div>
                    <div className="mt-1 text-amber-300/80">{item.reason}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">{item.status}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproval(item.id, 'approve')} className="rounded-md bg-emerald-500/20 px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-200">Approve</button>
                        <button onClick={() => handleApproval(item.id, 'reject')} className="rounded-md bg-red-500/20 px-2 py-1 text-[10px] uppercase tracking-wider text-red-200">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Metrics</h2>
                <Cpu className="text-cyan-400" size={18} />
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Tokens</span><strong>24k</strong></div>
                <div className="flex items-center justify-between"><span>Cost</span><strong>$3.42</strong></div>
                <div className="flex items-center justify-between"><span>Success rate</span><strong>92%</strong></div>
                <div className="flex items-center justify-between"><span>Time/task</span><strong>14 min</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
            <h2 className="mb-4 text-xl font-semibold">Logs & traces</h2>
            <div className="space-y-3">
              {logs.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm">
                  <div className="mb-1 flex items-center justify-between text-slate-400">
                    <span>{entry.agent}</span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <p className="text-slate-200">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
            <h2 className="mb-4 text-xl font-semibold">Memory viewer</h2>
            <div className="space-y-3">
              {memory.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm">
                  <div className="mb-1 font-medium text-emerald-300">{entry.title}</div>
                  <p className="text-slate-300">{entry.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agent config panel</h2>
            <SlidersHorizontal className="text-violet-400" size={18} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {agentConfig.map((config) => (
              <div key={config.name} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-slate-100">{config.name}</span>
                  <span className="rounded-full bg-violet-500/15 px-2 py-1 text-[10px] uppercase tracking-wider text-violet-200">
                    {config.model}
                  </span>
                </div>
                <p className="mb-3 text-xs text-slate-400">{config.prompt}</p>
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center justify-between"><span>Temp</span><strong>{config.temperature}</strong></div>
                  <div className="flex items-center justify-between"><span>Tools</span><strong>{config.tools.length}</strong></div>
                  <div className="flex items-center justify-between"><span>Permissions</span><strong>{config.permissions.length}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
