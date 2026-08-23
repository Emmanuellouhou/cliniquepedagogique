import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Paperclip, Send } from "lucide-react";
import { Avatar, Badge, Card, EmptyState, Reveal } from "../components/ui";
import { useApp } from "../lib/store";
import { fullName, fmtDateTime, type User } from "../lib/data";

const ROLE_LABEL: Record<string, string> = {
  admin: "Direction",
  professional: "Professionnel",
  parent: "Parent",
  student: "Élève",
  teacher: "Enseignant",
};

export function MessagesPage() {
  const state = useApp();
  const me = state.currentUser!;
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(() => searchParams.get("to"));
  const [draft, setDraft] = useState("");
  const [attach, setAttach] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /* Contacts autorisés selon le rôle */
  const contacts: User[] = useMemo(() => {
    if (me.role === "admin") {
      return state.users.filter((u) => u.id !== me.id && (u.role === "professional" || u.role === "parent"));
    }
    if (me.role === "professional") {
      const myStudents = state.students.filter((s) => s.professionalId === me.id);
      const parentIds = new Set(myStudents.map((s) => s.parentId));
      return state.users.filter((u) => u.id !== me.id && (u.role === "admin" || parentIds.has(u.id) || u.role === "professional"));
    }
    if (me.role === "parent") {
      const myChildren = state.students.filter((s) => s.parentId === me.id);
      const proIds = new Set(myChildren.map((s) => s.professionalId));
      return state.users.filter((u) => proIds.has(u.id));
    }
    if (me.role === "teacher") {
      const myStudents = state.students.filter((s) => s.school === me.school);
      const proIds = new Set(myStudents.map((s) => s.professionalId));
      return state.users.filter((u) => u.id !== me.id && (u.role === "admin" || proIds.has(u.id)));
    }
    return [];
  }, [me, state.users, state.students]);

  const thread = useMemo(() => {
    if (!selected) return [];
    return state.messages
      .filter((m) => (m.senderId === me.id && m.receiverId === selected) || (m.senderId === selected && m.receiverId === me.id))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [state.messages, me.id, selected]);

  useEffect(() => {
    if (selected) state.markThreadRead(me.id, selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, state.messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length, selected]);

  const lastMessageOf = (otherId: string) =>
    state.messages
      .filter((m) => (m.senderId === me.id && m.receiverId === otherId) || (m.senderId === otherId && m.receiverId === me.id))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  const unreadFrom = (otherId: string) => state.messages.filter((m) => m.senderId === otherId && m.receiverId === me.id && !m.read).length;

  const selectedUser = contacts.find((c) => c.id === selected);

  const send = () => {
    if (!selected || (!draft.trim() && !attach)) return;
    state.sendMessage(me.id, selected, draft.trim() || "Pièce jointe partagée.", attach ?? undefined);
    setDraft("");
    setAttach(null);
  };

  if (contacts.length === 0) {
    return <EmptyState icon={<MessageSquare size={26} />} title="Messagerie" text="Aucune conversation disponible pour votre rôle pour le moment." />;
  }

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine-500">Échanges sécurisés</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-pine-950 sm:text-3xl">Messagerie</h2>
          <p className="mt-1 text-sm text-pine-600">Échangez avec les professionnels, les familles ou la direction — dans le respect de la confidentialité.</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card className="grid overflow-hidden lg:grid-cols-[300px_1fr]" style={{ minHeight: 540 }}>
          {/* Liste des contacts */}
          <aside className={`border-pine-100 lg:border-r ${selected ? "hidden lg:block" : "block"}`}>
            <p className="border-b border-pine-100 bg-pine-50/60 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-pine-500">Conversations</p>
            <div className="max-h-[470px] overflow-y-auto nice-scroll">
              {contacts.map((c) => {
                const last = lastMessageOf(c.id);
                const unread = unreadFrom(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={`flex w-full items-center gap-3 border-b border-pine-50 px-4 py-3.5 text-left transition-colors cursor-pointer ${selected === c.id ? "bg-pine-50" : "hover:bg-pine-50/60"}`}
                  >
                    <Avatar name={fullName(c)} size={40} color={c.avatarColor} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-bold text-pine-900">{fullName(c)}</span>
                        {unread > 0 && <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-marigold-400 px-1 text-[9px] font-bold text-pine-950">{unread}</span>}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-pine-400">{ROLE_LABEL[c.role]}</span>
                      {last && <span className={`mt-0.5 block truncate text-[11px] ${unread > 0 ? "font-bold text-pine-800" : "text-pine-500"}`}>{last.attachment ? `Pièce jointe : ${last.attachment}` : last.content}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Conversation */}
          <section className={`${selected ? "flex" : "hidden lg:flex"} flex-col`}>
            {!selectedUser ? (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <span className="rounded-2xl bg-pine-100 p-5 text-pine-500"><MessageSquare size={30} /></span>
                <p className="mt-4 font-display text-lg font-bold text-pine-900">Sélectionnez une conversation</p>
                <p className="mt-1 max-w-xs text-sm text-pine-500">Vos échanges avec les familles et l'équipe apparaissent ici, en toute confidentialité.</p>
              </div>
            ) : (
              <>
                <header className="flex items-center gap-3 border-b border-pine-100 bg-pine-50/60 px-4 py-3">
                  <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-pine-600 hover:bg-pine-100 lg:hidden cursor-pointer" aria-label="Retour">
                    <ArrowLeft size={17} />
                  </button>
                  <Avatar name={fullName(selectedUser)} size={38} color={selectedUser.avatarColor} />
                  <div>
                    <p className="text-[13px] font-bold text-pine-900">{fullName(selectedUser)}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-pine-400">{ROLE_LABEL[selectedUser.role]}{selectedUser.specialty ? ` · ${selectedUser.specialty}` : ""}</p>
                  </div>
                  <Badge bg="#dcebe4" fg="#175745">Confidentiel</Badge>
                </header>
                <div className="flex-1 space-y-3 overflow-y-auto nice-scroll bg-paper/60 p-4" style={{ maxHeight: 380, minHeight: 320 }}>
                  {thread.length === 0 && (
                    <p className="py-10 text-center text-sm text-pine-500">Démarrez la conversation : présentez-vous ou posez votre question.</p>
                  )}
                  {thread.map((m) => {
                    const mineMsg = m.senderId === me.id;
                    return (
                      <div key={m.id} className={`flex ${mineMsg ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-soft animate-fade-up ${mineMsg ? "rounded-br-md bg-pine-800 text-paper" : "rounded-bl-md border border-pine-100 bg-white text-ink"}`}>
                          <p className="text-[13px] leading-relaxed">{m.content}</p>
                          {m.attachment && (
                            <span className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold ${mineMsg ? "bg-pine-700 text-marigold-200" : "bg-pine-50 text-pine-700"}`}>
                              <Paperclip size={12} /> {m.attachment}
                            </span>
                          )}
                          <p className={`mt-1.5 text-[9px] font-semibold uppercase tracking-wide ${mineMsg ? "text-pine-300" : "text-pine-400"}`}>{fmtDateTime(m.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
                <footer className="border-t border-pine-100 bg-white p-3.5">
                  {attach && (
                    <span className="mb-2 inline-flex items-center gap-2 rounded-lg bg-marigold-100 px-3 py-1.5 text-[11px] font-bold text-marigold-800">
                      <Paperclip size={12} /> {attach}
                      <button onClick={() => setAttach(null)} className="ml-1 text-marigold-700 hover:text-marigold-900 cursor-pointer" aria-label="Retirer la pièce jointe">✕</button>
                    </span>
                  )}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => setAttach(attach ? null : `Document-${selectedUser.lastName.toLowerCase()}.pdf`)}
                      aria-label="Joindre un document"
                      className={`rounded-xl p-2.5 transition-colors cursor-pointer ${attach ? "bg-marigold-200 text-marigold-800" : "text-pine-500 hover:bg-pine-100"}`}
                    >
                      <Paperclip size={18} />
                    </button>
                    <textarea
                      rows={1}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                      placeholder={`Écrire à ${selectedUser.firstName}…`}
                      className="flex-1 resize-none rounded-xl border border-pine-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-pine-300 focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-100"
                      aria-label="Votre message"
                    />
                    <button
                      onClick={send}
                      disabled={!draft.trim() && !attach}
                      aria-label="Envoyer"
                      className="rounded-xl bg-pine-700 p-3 text-paper shadow-soft transition-all hover:bg-pine-600 hover:-translate-y-px disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <Send size={17} />
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </Card>
      </Reveal>
    </div>
  );
}
