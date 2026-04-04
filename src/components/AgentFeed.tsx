import { Bot, Search, CheckCircle2, Loader2, Radio } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const typeConfig = {
  idle: { icon: Radio, color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  processing: { icon: Loader2, color: 'text-accent', dot: 'bg-accent' },
  searching: { icon: Search, color: 'text-warning', dot: 'bg-warning' },
  healed: { icon: CheckCircle2, color: 'text-success', dot: 'bg-success' },
  error: { icon: Bot, color: 'text-destructive', dot: 'bg-destructive' },
};

export function AgentFeed() {
  const { agentMessages } = useAppStore();
  const latest = agentMessages[0];
  const config = typeConfig[latest?.type || 'idle'];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Bot className="h-4 w-4 text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Agent Feed
        </span>
        <div className={`ml-auto h-2 w-2 rounded-full ${config.dot} ${
          latest?.type === 'processing' || latest?.type === 'searching'
            ? 'animate-pulse-glow'
            : ''
        }`} />
      </div>

      <div className="space-y-2">
        {agentMessages.slice(0, 4).map((msg, i) => {
          const msgConfig = typeConfig[msg.type];
          const Icon = msgConfig.icon;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 animate-fade-in-up ${
                i === 0 ? 'opacity-100' : 'opacity-50'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Icon
                className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${msgConfig.color} ${
                  msg.type === 'processing' ? 'animate-spin' : ''
                }`}
              />
              <p className="font-mono text-xs leading-relaxed text-foreground">
                {msg.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
