"use client";
import { useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState("idle");
  const [sliceExpr, setSliceExpr] = useState("-");
  const [result, setResult] = useState("-");
  const [visual, setVisual] = useState("");

  const appendLog = (msg: string) => setLog((prev) => [msg, ...prev]);

  const highlightPicked = (orig: string, picks: number[]) => {
    return orig
      .split("")
      .map((ch, i) => (picks.includes(i) ? <span className="bg-purple-500/30 rounded px-1 mx-0.5" key={i}>{ch}</span> : <span key={i}>{ch}</span>));
  };

  const sliceWord = async () => {
    if (!word.trim()) {
      appendLog("Please type a word first.");
      return;
    }
    setStatus("checking...");
    setSliceExpr("-");
    setResult("-");
    setVisual("");

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const data = await res.json();

      setStatus(data.valid ? "valid word" : "invalid word");
      setSliceExpr(data.slice_expr || "-");

      if (data.magic) {
        setResult("patte (MAGIC!)");
        setVisual(highlightPicked(data.original, data.picks));
        appendLog("MAGIC: Backend returned 'patte'");
      } else if (!data.valid) {
        setResult(data.message || "Not valid");
        appendLog(data.message || "Not valid");
      } else {
        setResult(`'${data.sliced}'`);
        setVisual(highlightPicked(data.original, data.picks));
        appendLog(`Used slice: ${data.slice_expr} — Result: ${data.sliced}`);
      }
    } catch (err) {
      appendLog(`Error: ${err}`);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 shadow-lg">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Word Slice Game</h1>
          <p className="text-sm text-white/70">Type a meaningful English word. Small chance to magically form "patte".</p>

          <div className="flex gap-2 mt-2">
            <input value={word} onChange={(e) => setWord(e.target.value)} type="text" className="flex-1 px-4 py-2 rounded-lg bg-white/10 outline-none" placeholder="Type a word..." />
            <button onClick={sliceWord} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold">Slice it</button>
          </div>

          <div className="mt-4 space-y-1 max-h-64 overflow-y-auto">
            {log.map((l, i) => <p key={i} className="text-sm">{l}</p>)}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
            <div><strong>Status:</strong> {status}</div>
            <div><strong>Slice used:</strong> {sliceExpr}</div>
            <div><strong>Result:</strong> {result}</div>
            <div className="flex flex-wrap gap-1 mt-2">{visual}</div>
          </div>
        </div>
      </div>
    </div>
  );
}