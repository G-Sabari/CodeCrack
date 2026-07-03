import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Copy, RefreshCcw, Loader2, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import type { Analysis } from "./ATSAnalysisView";

interface Msg { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Improve my resume",
  "Rewrite my projects with impact",
  "Why is my ATS score low?",
  "Suggest skills for a Java Developer role",
  "Optimize my resume for Amazon",
  "Recommend certifications for me",
  "Suggest projects for placement",
  "How can I increase my ATS score?",
];

export function AIResumeAssistant({ resumeText, jobDescription, analysis }: { resumeText: string; jobDescription: string; analysis: Analysis | null }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase.from("resume_chats").select("role,content").eq("user_id", user.id).order("created_at", { ascending: true }).limit(50);
      if (data) setMessages(data.map((r: any) => ({ role: r.role, content: r.content })));
    })();
  }, [user]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    if (user) supabase.from("resume_chats").insert({ user_id: user.id, role: "user", content: msg });

    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resume-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          userMessage: msg,
          resumeText,
          jobDescription,
          analysisSummary: analysis ? JSON.stringify({
            ats_score: analysis.ats_score, match_score: analysis.match_score,
            weaknesses: analysis.weaknesses, priority_improvements: analysis.priority_improvements,
            missing_keywords: analysis.missing_keywords, missing_skills: analysis.missing_skills,
          }) : "",
          history: next.slice(-10),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Chat failed");
      }
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            const d = j?.choices?.[0]?.delta?.content;
            if (d) {
              acc += d;
              setMessages((m) => { const cp = [...m]; cp[cp.length - 1] = { role: "assistant", content: acc }; return cp; });
            }
          } catch {}
        }
      }
      if (user && acc) supabase.from("resume_chats").insert({ user_id: user.id, role: "assistant", content: acc });
    } catch (e: any) {
      toast.error(e.message || "Assistant failed");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[75vh]">
      <div className="p-4 border-b flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2"><Sparkles className="w-4 h-4 text-primary" /></div>
        <div>
          <p className="font-semibold">AI Resume Assistant</p>
          <p className="text-xs text-muted-foreground">Resume-aware, JD-aware, streaming answers</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <Bot className="w-12 h-12 text-primary mx-auto opacity-70" />
              <p className="text-sm text-muted-foreground">Ask anything about your resume, career, or placements.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>{s}</Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
              <div className={`rounded-lg px-3 py-2 max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{m.content || (loading && i === messages.length - 1 ? "…" : "")}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                )}
                {m.role === "assistant" && m.content && (
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => { navigator.clipboard.writeText(m.content); toast.success("Copied"); }}>
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    {i === messages.length - 1 && !loading && (
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => {
                        const lastUser = [...messages].reverse().find((x) => x.role === "user");
                        if (lastUser) { setMessages(messages.slice(0, -1)); send(lastUser.content); }
                      }}>
                        <RefreshCcw className="w-3 h-3 mr-1" /> Regenerate
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {m.role === "user" && <div className="rounded-full bg-muted p-2 h-8 w-8 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>}
            </div>
          ))}
          {loading && messages[messages.length - 1]?.content === "" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pl-11"><Loader2 className="w-4 h-4 animate-spin" /> Thinking…</div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask about your resume, ATS score, projects…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="min-h-[44px] max-h-32"
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
