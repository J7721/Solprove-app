"use client";
import { useEffect, useRef, useState } from "react";
import { getToken } from "../../../lib/supabaseBrowser";
import { LAUNCHED } from "../../../lib/launch";
import ComingSoon from "../../components/ComingSoon";

async function authHeaders() {
  const t = await getToken();
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

const card = { background: "#fff", border: "1px solid rgba(23,59,76,.08)", boxShadow: "0 1px 3px rgba(23,59,76,.05)", borderRadius: 16, padding: 28, marginBottom: 24 };
const btn = (bg = "#1f9d7c") => ({ background: bg, color: "#fff", border: "none", borderRadius: 9, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif" });
const btnGhost = { background: "#fff", color: "#173b4c", border: "1px solid rgba(23,59,76,.18)", borderRadius: 9, padding: "11px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif" };
const inputStyle = { padding: "11px 14px", borderRadius: 9, border: "1px solid rgba(23,59,76,.18)", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
const sectionLabel = { fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "#12181b" };

export default function Friends() {
  const [me, setMe] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [codeInput, setCodeInput] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [addMsg, setAddMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState(null);
  const pollRef = useRef(null);
  const threadEndRef = useRef(null);

  async function load() {
    setLoading(true); setError(null);
    const res = await fetch("/api/social", { headers: await authHeaders() });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Couldn't load friends."); return; }
    setMe(data.me);
    setFriends(data.friends);
  }
  useEffect(() => { load(); }, []);

  async function addByCode(e) {
    e.preventDefault();
    setAddBusy(true); setAddMsg(null);
    const res = await fetch("/api/social", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ code: codeInput }) });
    const data = await res.json();
    setAddBusy(false);
    if (!res.ok) { setAddMsg({ type: "err", text: data.error }); return; }
    setAddMsg({ type: "ok", text: `Added ${data.friend.username || "your friend"}!` });
    setCodeInput("");
    load();
  }

  async function runSearch(e) {
    e.preventDefault();
    setSearching(true);
    const res = await fetch(`/api/social/search?q=${encodeURIComponent(searchQuery)}`, { headers: await authHeaders() });
    const data = await res.json();
    setSearching(false);
    setSearchResults(res.ok ? data.results : []);
  }

  async function addById(userId) {
    const res = await fetch("/api/social", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ userId }) });
    if (res.ok) { setSearchResults((r) => r.filter((u) => u.id !== userId)); load(); }
  }

  async function copyCode() {
    if (!me?.inviteCode) return;
    try { await navigator.clipboard.writeText(me.inviteCode); } catch {}
  }

  function openChat(friend) {
    setSelectedFriend(friend); setMessages([]); setChatError(null);
  }

  async function loadMessages(friendId, silent = false) {
    if (!silent) setChatBusy(true);
    const res = await fetch(`/api/social/messages?friendId=${friendId}`, { headers: await authHeaders() });
    const data = await res.json();
    if (!silent) setChatBusy(false);
    if (res.ok) setMessages(data.messages);
  }

  useEffect(() => {
    if (!selectedFriend) return;
    loadMessages(selectedFriend.id);
    pollRef.current = setInterval(() => loadMessages(selectedFriend.id, true), 4000);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriend]);

  useEffect(() => { threadEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setChatError(null);
    const body = messageInput; setMessageInput("");
    const res = await fetch("/api/social/messages", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ friendId: selectedFriend.id, body }) });
    const data = await res.json();
    if (!res.ok) { setChatError(data.error); setMessageInput(body); return; }
    loadMessages(selectedFriend.id, true);
  }

  async function blockFriend(friendId) {
    if (!confirm("Block this person? They'll be removed as a friend and won't be able to message you again.")) return;
    await fetch("/api/social/block-report", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ action: "block", targetId: friendId }) });
    setSelectedFriend(null);
    load();
  }

  async function reportFriend(friendId) {
    const reason = prompt("What's happening? This goes to Solprove, not to them.");
    if (reason == null) return;
    await fetch("/api/social/block-report", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ action: "report", targetId: friendId, reason }) });
    alert("Thanks — we'll take a look.");
  }

  if (!LAUNCHED) return <ComingSoon />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 0 80px" }}>
      <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 700, color: "#12181b", margin: "0 0 6px" }}>Friends</h1>
      <p style={{ fontSize: 15.5, color: "#5b6b6f", margin: "0 0 28px" }}>Study alongside people you know — see streaks, cheer each other on.</p>

      {error && <div style={{ ...card, background: "rgba(226,121,60,.1)" }}><p style={{ margin: 0, color: "#c9622e" }}>{error}</p></div>}

      {!loading && me && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={sectionLabel}>Your invite code</div>
              <p style={{ fontSize: 13, color: "#5b6b6f", margin: "4px 0 0" }}>
                {me.ageBand === "under16"
                  ? "Share this with people you know — it's the only way anyone can add you."
                  : "Share this, or let 16+ friends find you by username search."}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: "#12181b", background: "#f1f0ea", padding: "8px 16px", borderRadius: 9 }}>{me.inviteCode}</span>
              <button style={btnGhost} onClick={copyCode}>Copy</button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(23,59,76,.08)" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#12181b" }}>Share my streak with friends</div>
              <div style={{ fontSize: 12.5, color: "#5b6b6f", marginTop: 2 }}>Off by default. When off, friends just see you on their list with no stats.</div>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={me.statsPublic} onChange={async (e) => {
                const statsPublic = e.target.checked;
                setMe((m) => ({ ...m, statsPublic }));
                await fetch("/api/social/settings", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ statsPublic }) });
              }} style={{ width: 18, height: 18 }} />
            </label>
          </div>

          {me.ageBand === "under16" && (
            <p style={{ fontSize: 12, color: "#5b6b6f", marginTop: 14, marginBottom: 0 }}>
              Under-16 account — friends can only be added by invite code, and only friends can message you. A parent can change this in{" "}
              <a href="/account" style={{ color: "#1f9d7c", fontWeight: 600 }}>Account settings</a>.
            </p>
          )}
        </div>
      )}

      <div style={card}>
        <div style={{ ...sectionLabel, marginBottom: 14 }}>Add a friend</div>
        <form onSubmit={addByCode} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input style={{ ...inputStyle, flex: 1, minWidth: 160, textTransform: "uppercase" }} placeholder="Enter invite code" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
          <button style={btn()} type="submit" disabled={addBusy}>{addBusy ? "Adding…" : "Add friend"}</button>
        </form>
        {addMsg && <p style={{ fontSize: 13, marginTop: 10, color: addMsg.type === "ok" ? "#157a61" : "#c9622e" }}>{addMsg.text}</p>}

        {me?.ageBand === "16plus" && (
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(23,59,76,.08)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#12181b", marginBottom: 10 }}>Or search by username</div>
            <form onSubmit={runSearch} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input style={{ ...inputStyle, flex: 1, minWidth: 160 }} placeholder="Search username" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button style={btnGhost} type="submit" disabled={searching}>{searching ? "Searching…" : "Search"}</button>
            </form>
            {searchResults.map((u) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                <span style={{ fontSize: 14, color: "#12181b" }}>{u.username}</span>
                <button style={btnGhost} onClick={() => addById(u.id)}>Add</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && friends.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: selectedFriend ? "260px 1fr" : "1fr", gap: 20 }}>
          <div style={card}>
            <div style={{ ...sectionLabel, marginBottom: 14 }}>Your friends ({friends.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {friends.map((f) => (
                <div key={f.id} onClick={() => openChat(f)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 9, cursor: "pointer",
                  background: selectedFriend?.id === f.id ? "rgba(31,157,124,.1)" : "transparent",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#12181b" }}>{f.username || "Student"}</span>
                  {f.statsShared ? (
                    <span style={{ fontSize: 12.5, color: "#5b6b6f" }}>🔥 {f.streak}</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9aa5a8" }}>private</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedFriend && (
            <div style={{ ...card, display: "flex", flexDirection: "column", height: 480 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#12181b" }}>{selectedFriend.username}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => reportFriend(selectedFriend.id)} style={{ background: "none", border: "none", color: "#5b6b6f", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Report</button>
                  <button onClick={() => blockFriend(selectedFriend.id)} style={{ background: "none", border: "none", color: "#c9622e", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Block</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                {chatBusy && <p style={{ fontSize: 13, color: "#5b6b6f" }}>Loading…</p>}
                {messages.map((m) => {
                  const mine = m.sender_id !== selectedFriend.id;
                  return (
                    <div key={m.id} style={{
                      alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "75%",
                      background: mine ? "#1f9d7c" : "#f1f0ea", color: mine ? "#fff" : "#12181b",
                      padding: "9px 13px", borderRadius: 12, fontSize: 14,
                    }}>{m.body}</div>
                  );
                })}
                <div ref={threadEndRef} />
              </div>

              {chatError && <p style={{ fontSize: 12.5, color: "#c9622e", margin: "8px 0 0" }}>{chatError}</p>}
              <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Message…" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                <button style={btn()} type="submit">Send</button>
              </form>
            </div>
          )}
        </div>
      )}

      {!loading && friends.length === 0 && (
        <div style={{ ...card, textAlign: "center", color: "#5b6b6f", fontSize: 14 }}>No friends yet — share your invite code above to get started.</div>
      )}
    </div>
  );
}
