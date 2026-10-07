import { useEffect, useState } from 'react';
import { Activity, Bot, CheckCircle2, Cpu, Gauge, ListTodo, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

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

const states = ['To Do', 'In Progress', 'Blocked', 'Done'];

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [command, setCommand] = useState('Focus on mobile responsiveness');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [agentRes, taskRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/v1/agents`),
        fetch(`${apiBaseUrl}/api/v1/tasks`),
      ]);

      const agentData = await agentRes.json();
      const taskData = await taskRes.json();

      setAgents(agentData);
      setTasks(taskData);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      setAgents([
        { id: 'orchestrator', name: 'Orchestrator', status: 'running', current_task: 'Reviewing goals', model: 'gpt-4o-mini', cost: 0.12, health: 96 },
        { id: 'developer', name: 'Developer', status: 'running', current_task: 'Building dashboard shell', model: 'gpt-4o-mini', cost: 0.09, health: 93 },
        { id: 'qa', name: 'QA', status: 'idle', current_task: 'Ready for validation', model: 'gpt-4o-mini', cost: 0.04, health: 91 },
      ]);
      setTasks([
        { id: 'task-1', title: 'Project setup', description: 'Initialize backend and frontend', status: 'Done', priority: 'high', assignee: 'Orchestrator' },
        { id: 'task-2', title: 'Dashboard MVP', description: 'Create the initial control panel', status: 'In Progress', priority: 'high', assignee: 'Developer' },
        { id: 'task-3', title: 'QA pass', description: 'Review and validate the MVP flow', status: 'To Do', priority: 'medium', assignee: 'QA' },
      ]);
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
      const response = await fetch(`${apiBaseUrl}/api/v1/dashboard/command?command=${encodeURIComponent(command)}` , {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data.result || 'Command accepted');
    } catch (error) {
      setResult('Command accepted locally: the backend is unreachable, but the command console is ready.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
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
            { label: 'Tasks in flight', value: String(tasks.filter((task) => task.status !== 'Done').length), icon: ListTodo },
            { label: 'Approval queue', value: '2', icon: ShieldCheck },
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
              className="h-28 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-500"
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
                        <div className="mb-2 flex items-center justify-between">
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
                {[
                  { action: 'Deploy to production', reason: 'Requires owner approval' },
                  { action: 'Delete temp workspace', reason: 'Destructive action' },
                ].map((item) => (
                  <div key={item.action} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm">
                    <div className="font-medium text-amber-200">{item.action}</div>
                    <div className="mt-1 text-amber-300/80">{item.reason}</div>
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
      </div>
    </div>
  );
}
