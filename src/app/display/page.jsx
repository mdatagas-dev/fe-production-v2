"use client";

import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const POLL_MS = 15_000;
const SHIFT_SLOTS = Array.from({ length: 24 }, (_, hour) => ({
  start: String(hour).padStart(2, "0") + ":00",
  end: hour === 23 ? "23:59" : String(hour + 1).padStart(2, "0") + ":00",
}));

const styles = String.raw`
  @import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;500;600&display=swap");
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg-root:#050810; --bg-header:#0a1435; --bg-card:#0b1220;
    --bg-table-hd:#090f20; --bg-cur:#0d2040; --bg-bar:#0a1020;
    --border:#1e2d55; --border-row:#172040;
    --blue:#1565C0; --blue-light:#60a5fa; --blue-text:#5c8fd4;
    --dim:#5a6a90; --dim2:#2e3d60; --base:#eef2ff;
    --red-t:#e53935; --emerald:#34d399; --amber:#fbbf24; --red:#ef4444;
    --fc:'Barlow Condensed','Arial Narrow',Arial,sans-serif;
    --fb:'Barlow',Arial,sans-serif;
  }
  html,body{height:100%;overflow:hidden;font-family:var(--fb);background:var(--bg-root);color:var(--base);user-select:none;}
  #app{display:flex;flex-direction:column;height:100vh;width:100%;overflow:hidden;}
  header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0;padding:8px 24px;background:var(--bg-header);border-bottom:2px solid var(--blue);}
  .logo-wrap{display:flex;align-items:center;gap:12px;}
  .logo-box{background:var(--blue);border-radius:6px;padding:6px 12px;}
  .logo-box span{font-family:var(--fc);font-weight:900;font-size:20px;color:#fff;letter-spacing:4px;}
  .co p:first-child{font-family:var(--fc);font-weight:700;font-size:15px;color:#fff;letter-spacing:1px;line-height:1.2;}
  .co p:last-child{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--blue-text);}
  .h-model{text-align:center;}
  .h-model .lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--dim);margin-bottom:4px;}
  .h-model .mn{font-family:var(--fc);font-weight:900;font-size:52px;line-height:1;letter-spacing:6px;color:#fff;text-transform:uppercase;transition:color .4s;}
  .h-clock{text-align:right;}
  .ct{font-family:var(--fc);font-weight:900;font-size:40px;line-height:1;letter-spacing:2px;color:#fff;font-variant-numeric:tabular-nums;}
  .cd{font-size:10px;color:var(--blue-text);margin-top:2px;text-transform:capitalize;}
  .status-pill{display:flex;align-items:center;gap:6px;background:var(--bg-card);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:10px;color:var(--dim);flex-shrink:0;}
  .status-dot{width:7px;height:7px;border-radius:50%;background:var(--emerald);animation:pulse2 2s infinite;}
  .status-pill.offline .status-dot{background:var(--red);animation:none;}
  .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px 20px 0;flex-shrink:0;}
  .card{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px solid var(--border);background:var(--bg-card);border-radius:12px;padding:10px 12px;gap:2px;}
  .card-lbl{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--dim);}
  .card-val{font-family:var(--fc);font-weight:900;font-size:40px;line-height:1;font-variant-numeric:tabular-nums;transition:color .3s;}
  .card-unit{font-size:10px;color:var(--dim);}
  .card-sub{font-size:10px;font-weight:600;color:var(--dim);}
  .card-src{margin-top:4px;font-size:8px;letter-spacing:1px;border:1px solid var(--border);border-radius:4px;padding:1px 6px;color:var(--dim2);background:#0a0f1f;}
  .tw{display:flex;flex-direction:column;flex:1;margin:10px 20px;border:1px solid var(--border);border-radius:12px;background:var(--bg-card);overflow:hidden;min-height:0;}
  .ttop{display:flex;align-items:center;justify-content:space-between;flex-shrink:0;padding:8px 16px;border-bottom:1px solid var(--border-row);}
  .ttop-title{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--dim);}
  .legend{display:flex;align-items:center;gap:12px;}
  .li{display:flex;align-items:center;gap:6px;font-size:9px;color:var(--dim);}
  .ld{display:inline-block;width:8px;height:8px;border-radius:2px;flex-shrink:0;}
  .ts{flex:1;overflow-y:auto;min-height:0;}
  .ts::-webkit-scrollbar{width:4px;}
  .ts::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
  table{width:100%;border-collapse:collapse;table-layout:fixed;}
  thead{position:sticky;top:0;z-index:10;}
  thead tr{background:var(--bg-table-hd);}
  thead th{padding:14px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim);border-bottom:1px solid var(--border);}
  thead th.l{text-align:left;padding-left:20px;}
  thead th.c{text-align:center;}
  tbody tr{border-bottom:1px solid var(--border-row);transition:background .2s;height:110px;}
  tbody tr:hover{background:#0c1628;}
  tbody tr.cur{background:var(--bg-cur);border-left:4px solid var(--blue);}
  tbody tr.fut{opacity:.35;}
  td{padding:0;text-align:center;vertical-align:middle;}
  td.l{text-align:left;padding-left:28px;}
  .cj{font-family:var(--fc);font-weight:700;font-variant-numeric:tabular-nums;}
  .cj.current{color:var(--blue-light);font-size:52px;}
  .cj.past,.cj.future{color:#8aabdc;font-size:46px;}
  .bl{display:inline-block;margin-left:12px;background:var(--blue);color:#fff;font-size:13px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:4px;vertical-align:middle;animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite;}
  .cn{font-family:var(--fc);font-weight:900;font-size:72px;font-variant-numeric:tabular-nums;}
  .dash{font-size:48px;color:var(--dim2);}
  .bw{margin:0 24px;height:18px;border-radius:99px;background:var(--bg-bar);overflow:hidden;}
  .bf{height:100%;border-radius:99px;transition:width .7s ease-out;}
  .tf{display:flex;align-items:center;justify-content:space-between;flex-shrink:0;padding:6px 16px;border-top:1px solid var(--border-row);}
  .tfs{font-size:9px;color:var(--dim2);letter-spacing:.5px;}
  .fbg{display:flex;gap:6px;}
  .sb{font-size:9px;padding:2px 8px;border-radius:4px;font-weight:600;}
  .ok{background:#052e16;color:var(--emerald);}
  .er{background:#450a0a;color:var(--red);}
  .tkw{flex-shrink:0;overflow:hidden;white-space:nowrap;background:var(--blue);border-top:1px solid #1976D2;padding:14px 0;}
  .tkt{display:inline-block;font-family:var(--fc);font-weight:700;font-size:32px;color:#fff;letter-spacing:6px;animation:ticker 38s linear infinite;}
  .ce{color:var(--emerald);} .ca{color:var(--amber);} .cr{color:var(--red);}
  .cb{color:var(--blue-light);} .ct2{color:var(--red-t);} .cdm{color:var(--dim);}
  .be{background:var(--emerald);} .ba{background:var(--amber);} .br{background:var(--red);}
  .bbl{background:var(--blue);} .bs{background:#334155;}
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  @keyframes pulse2{0%,100%{opacity:1;}50%{opacity:.3;}}
  @keyframes flash{0%{background:rgba(21,101,192,.35);}100%{background:transparent;}}
  .rfl{animation:flash .6s ease-out;}
  .mhist{display:flex;align-items:stretch;gap:8px;flex-shrink:0;padding:8px 20px 0;overflow-x:auto;}
  .mhist::-webkit-scrollbar{height:4px;}
  .mhist::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
  .mhist:empty{display:none;}
  .mchip{flex-shrink:0;display:flex;flex-direction:column;gap:2px;min-width:150px;border:1px solid var(--border);background:var(--bg-card);border-radius:10px;padding:8px 14px;transition:all .3s;}
  .mchip.active{border-color:var(--blue);background:var(--bg-cur);box-shadow:0 0 0 1px var(--blue);}
  .mchip-top{display:flex;align-items:center;justify-content:space-between;gap:10px;}
  .mchip-model{font-family:var(--fc);font-weight:900;font-size:22px;letter-spacing:2px;color:#fff;text-transform:uppercase;line-height:1;}
  .mchip-live{font-size:8px;font-weight:700;letter-spacing:1px;background:var(--blue);color:#fff;padding:2px 6px;border-radius:4px;animation:pulse 2s infinite;}
  .mchip-done{font-size:8px;font-weight:700;letter-spacing:1px;color:var(--dim);border:1px solid var(--border);padding:2px 6px;border-radius:4px;}
  .mchip-meta{display:flex;align-items:baseline;gap:8px;}
  .mchip-qty{font-family:var(--fc);font-weight:900;font-size:30px;line-height:1;font-variant-numeric:tabular-nums;color:var(--blue-light);}
  .mchip-qty span{font-size:11px;color:var(--dim);font-weight:600;}
  .mchip-sub{font-size:9px;color:var(--dim);letter-spacing:.5px;}
  .btn-export{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--border);border-radius:6px;padding:5px 12px;cursor:pointer;font-family:var(--fb);font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--dim);transition:all .2s;flex-shrink:0;}
  .btn-export:hover{border-color:var(--emerald);color:var(--emerald);background:rgba(52,211,153,0.06);}
  .btn-export:active{transform:scale(.97);}
  .filter-date{background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-family:var(--fb);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--dim);cursor:pointer;flex-shrink:0;color-scheme:dark;}
  .filter-date:hover{border-color:var(--emerald);color:var(--emerald);}
  .filter-date:focus{outline:none;border-color:var(--emerald);}
  @media (max-width:800px){
    header{flex-wrap:wrap;justify-content:center;gap:10px;padding:8px 12px;}
    .logo-wrap{gap:8px;}.co p:first-child{font-size:13px;}.h-model{order:3;width:100%;}.h-model .mn{font-size:38px;}
    .ct{font-size:30px;}.mhist{padding:8px 12px 0;}.tw{margin:8px 12px;}.ttop{align-items:flex-start;flex-wrap:wrap;gap:8px;padding:8px 12px;}
    .legend{flex-wrap:wrap;gap:6px 10px;}.ts{overflow:auto;}table{min-width:720px;}.tf{align-items:flex-start;flex-direction:column;gap:6px;padding:8px 12px;}.fbg{flex-wrap:wrap;}
    .tkw{padding:10px 0;}.tkt{font-size:24px;}
  }
  @media (max-width:480px){
    .co p:first-child{font-size:11px;}.co p:last-child{font-size:8px;}.logo-box{padding:5px 9px;}.status-pill{padding:4px 8px;}.ct{font-size:24px;}.cd{font-size:8px;}
    .h-model .mn{font-size:32px;}.mchip{min-width:136px;padding:7px 10px;}.tfs{font-size:8px;}.btn-export{padding:5px 9px;}.tkt{font-size:18px;}
  }

  /* Line picker: ported from uph-dashboard/public/lines.html. */
  #line-picker{--picker-bg:#070b14;--picker-card:#0e1626;--picker-cur:#13233f;--picker-border:#1e2c44;--picker-blue:#2563eb;--picker-blue-light:#60a5fa;--picker-dim:#64748b;--picker-green:#22c55e;--picker-red:#ef4444;width:100%;height:100vh;overflow-y:auto;background:var(--picker-bg);color:#fff;font-family:'Barlow',Arial,sans-serif;}
  #line-picker header{display:flex;align-items:center;gap:16px;padding:24px 32px;border:0;border-bottom:1px solid var(--picker-border);background:transparent;justify-content:flex-start;}
  #line-picker .logo-box{width:54px;height:54px;border-radius:12px;padding:0;background:linear-gradient(135deg,#2563eb,#1e40af);display:flex;align-items:center;justify-content:center;font-family:var(--fc);font-weight:900;font-size:22px;letter-spacing:1px;}
  #line-picker .logo-box span{font-size:22px;letter-spacing:1px;}
  #line-picker .co p:first-child{font-family:var(--fc);font-weight:900;font-size:22px;letter-spacing:2px;}
  #line-picker .co p:last-child{font-size:11px;color:var(--picker-dim);letter-spacing:2px;text-transform:uppercase;}
  #line-picker .wrap{max-width:1100px;margin:0 auto;padding:40px 32px;}
  #line-picker .title{font-family:var(--fc);font-weight:700;font-size:28px;letter-spacing:2px;text-transform:uppercase;color:var(--picker-dim);margin-bottom:24px;}
  #line-picker .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
  #line-picker .card{display:block;text-decoration:none;color:inherit;background:var(--picker-card);border:1px solid var(--picker-border);border-radius:16px;padding:24px;transition:all .2s;}
  #line-picker .card:hover{border-color:var(--picker-blue);background:var(--picker-cur);transform:translateY(-2px);}
  #line-picker .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
  #line-picker .card-name{font-family:var(--fc);font-weight:900;font-size:30px;letter-spacing:2px;text-transform:uppercase;line-height:1;}
  #line-picker .dot{width:11px;height:11px;border-radius:50%;flex-shrink:0;}#line-picker .dot.on{background:var(--picker-green);box-shadow:0 0 8px var(--picker-green);}#line-picker .dot.off{background:var(--picker-red);}
  #line-picker .card-meta{display:flex;align-items:baseline;gap:8px;margin-bottom:6px;}.card-total{font-family:var(--fc);font-weight:900;font-size:42px;line-height:1;color:var(--picker-blue-light);font-variant-numeric:tabular-nums;}.card-total span{font-size:13px;color:var(--picker-dim);font-weight:600;}.card-sub{font-size:12px;color:var(--picker-dim);letter-spacing:.5px;}
  #line-picker .empty{color:var(--picker-dim);padding:40px;text-align:center;}#line-picker .foot{text-align:center;color:var(--picker-dim);font-size:12px;margin-top:32px;}
`;

const rateClass = (rate) => (!rate && rate !== 0 ? "cdm" : rate >= 100 ? "ce" : rate >= 85 ? "ca" : "cr");
const rateBackground = (rate) => (rate === null ? "bs" : rate >= 100 ? "be" : rate >= 85 ? "ba" : "br");
const resultClass = (result, target) => (result === null || !target ? "cdm" : result >= target ? "ce" : "ca");
const jakartaClockParts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const jakartaPart = (date, type) => jakartaClockParts.formatToParts(date).find((part) => part.type === type)?.value;
const jakartaHour = (date) => Number(jakartaPart(date, "hour"));
const jakartaMinute = (date) => Number(jakartaPart(date, "minute"));
const jakartaDate = (date, options) => date.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", ...options });
const jakartaTime = (date, options) => date.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour12: false, ...options });

const toModels = (data) =>
  (data || []).map((model) => {
    const outputCounts = {};
    (model.uph || []).forEach((record) => {
      const hour = Number(record.time) === 24 ? 0 : Number(record.time);
      const count = Number(record.record) || 0;
      if (count > 0) outputCounts[String(hour).padStart(2, "0") + ":00"] = count;
    });
    return { model: model.model || "—", target: Number(model.suph) || 0, totalOutput: Number(model.total) || 0, outputCounts };
  });

const pickActiveModel = (models, now) => {
  if (!models.length) return null;
  const currentSlot = String(jakartaHour(now)).padStart(2, "0") + ":00";
  const current = models.find((model) => model.outputCounts[currentSlot] > 0);
  if (current) return current;
  const produced = models.filter((model) => Object.keys(model.outputCounts).length);
  if (!produced.length) return models[models.length - 1];
  return produced.slice().sort((a, b) => Object.keys(a.outputCounts).sort().pop().localeCompare(Object.keys(b.outputCounts).sort().pop())).pop();
};

const buildState = (response, line, now, lastUpdated) => {
  const models = toModels(response?.data);
  const active = pickActiveModel(models, now);
  const target = active?.target || 0;
  const currentHour = jakartaHour(now);
  const nowMinutes = currentHour * 60 + jakartaMinute(now);
  const combined = {};
  models.forEach((model) => Object.entries(model.outputCounts).forEach(([slot, count]) => { combined[slot] = (combined[slot] || 0) + count; }));
  const rows = SHIFT_SLOTS.map((slot) => {
    const [startHour, startMinute] = slot.start.split(":").map(Number);
    const [endHour, endMinute] = slot.end.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const status = nowMinutes >= end ? "past" : nowMinutes >= start ? "current" : "future";
    const resultUPH = status === "future" ? null : combined[slot.start] || 0;
    const achieveRate = resultUPH !== null && target > 0 ? (resultUPH / target) * 100 : null;
    const batches = status === "future" ? [] : models.map((model) => ({ model: model.model, output: model.outputCounts[slot.start] || 0 })).filter((batch) => batch.output > 0).sort((a, b) => b.output - a.output);
    return { ...slot, status, targetUPH: target || null, resultUPH, achieveRate, batches };
  });
  const summaries = models.map((model) => {
    const produced = Object.keys(model.outputCounts).sort();
    const achieveAvg = model.target > 0 && produced.length ? Number((produced.reduce((sum, slot) => sum + (model.outputCounts[slot] / model.target) * 100, 0) / produced.length).toFixed(1)) : null;
    return { ...model, active: active?.model === model.model, slotStart: produced[0] || null, slotEnd: produced[produced.length - 1] || null, achieveAvg };
  });
  return {
    models: summaries,
    rows,
    currentModel: active?.model || "",
    currentLine: line,
    currentTarget: target,
    totalOutput: active?.totalOutput || 0,
    shiftTotalOutput: models.reduce((sum, model) => sum + model.totalOutput, 0),
    currentShift: currentHour >= 7 && currentHour < 16 ? "Shift 1" : "Shift 2",
    lastUpdated,
  };
};

const csvCell = (value) => "\"" + String(value ?? "").replace(/"/g, "\"\"") + "\"";

function LinePicker({ error, lines }) {
  return <div id="line-picker">
    <header><div className="logo-box"><span>GAS</span></div><div className="co"><p>PT. GLOBAL ANUGERAH SETIA</p><p>Production Monitoring — Pilih Line</p></div></header>
    <div className="wrap"><div className="title">Line Produksi</div><div className="grid">
      {error ? <div className="empty">{error}</div> : !lines ? <div className="empty">Memuat…</div> : !lines.length ? <div className="empty">Belum ada produksi untuk shift ini.</div> : lines.map((item) => <a className="card" href={'/display?line=' + encodeURIComponent(item.line)} key={item.line}>
        <div className="card-top"><div className="card-name">{item.line}</div><div className={'dot ' + (item.total ? 'on' : 'off')} title={item.total ? 'Online' : 'Offline'} /></div>
        <div className="card-meta"><span className="card-total">{item.total}<span> unit shift</span></span></div><div className="card-sub">Target {item.target || '—'}/jam · LINE {item.line}</div>
      </a>)}
    </div><div className="foot">Klik salah satu line untuk membuka dashboard. Tiap line punya URL sendiri — bisa dibuka di perangkat mana saja.</div></div>
  </div>;
}

export default function DisplayPage() {
  const searchParams = useSearchParams();
  const requestedLine = searchParams.get("line") || "";
  const [response, setResponse] = useState(null);
  const [lines, setLines] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [now, setNow] = useState(() => new Date());
  const currentRowRef = useRef(null);
  const line = requestedLine;

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await fetchWithAuth(line ? apiBaseUrl + "/rdps/dashboard?keyword=" + encodeURIComponent(line) : apiBaseUrl + "/line", { cache: "no-store" });
        if (cancelled) return;
        if (result?.error || !Array.isArray(result?.data)) {
          setError(result?.error || "Gagal memuat data dashboard");
          return;
        }
        if (line) setResponse(result);
        else {
          const summaries = await Promise.all(result.data.filter(({ line: name, display }) => name && display !== false).map(async ({ line: subline }) => {
            const dashboard = await fetchWithAuth(apiBaseUrl + "/rdps/dashboard?keyword=" + encodeURIComponent(subline), { cache: "no-store" });
            const data = dashboard?.data || [];
            return { line: subline, total: data.reduce((sum, model) => sum + (Number(model.total) || 0), 0), target: Math.max(0, ...data.map((model) => Number(model.suph) || 0)) };
          }));
          if (cancelled) return;
          setLines(summaries);
        }
        setLastUpdated(new Date());
        setError("");
      } catch {
        if (!cancelled) setError("Gagal memuat data dashboard");
      }
    };
    load();
    const poll = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [line]);

  const state = useMemo(() => buildState(response, line, now, lastUpdated), [response, line, now, lastUpdated]);

  useEffect(() => {
    currentRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [lastUpdated]);

  const downloadCsv = () => {
    if (dateFilter) {
      window.alert("Ekspor riwayat berdasarkan tanggal belum tersedia dari scanning API.");
      return;
    }
    const rows = state.rows.filter((row) => row.status !== "future").map((row) => [
      jakartaDate(now), state.currentLine, state.currentModel, row.start, row.end,
      row.status === "current" ? "LIVE" : "Selesai",
      row.batches.map((batch) => batch.model + " (" + batch.output + ")").join(" · "),
      row.targetUPH ?? "", row.resultUPH ?? "", row.achieveRate === null ? "" : row.achieveRate.toFixed(1),
    ].map(csvCell).join(","));
    const csv = "\uFEFF" + [["Tanggal", "Line", "Model", "Slot Mulai", "Slot Selesai", "Status", "Batch (per jam)", "Target UPH", "Result UPH", "Achieve Rate (%)"].join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rekap_slot_" + jakartaDate(now).replace(/\//g, "-") + "_" + (state.currentLine || "line").replace(/\s+/g, "-") + ".csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const footerStatus = error
    ? "✗ " + error
    : state.lastUpdated
      ? "✓ Sumber: RDPS · " + state.currentLine + " · sync " + jakartaTime(state.lastUpdated)
      : "⟳ Menunggu data dari server…";
  const tableTitle = state.currentModel ? "Data Per Jam · " + state.currentModel : "Data Produksi Per Jam";
  const currentRow = state.rows.find((row) => row.status === "current");

  if (!line) return <><LinePicker error={error} lines={lines} /><style>{styles}</style></>;

  return (
    <div id="app">
      <header>
        <div className="logo-wrap">
          <div className="logo-box"><span>GAS</span></div>
          <div className="co">
            <p>PT. GLOBAL ANUGERAH SETIA</p>
            <p><a href="/display" id="line-label" style={{ color: "var(--blue-light)", textDecoration: "none", letterSpacing: "1px" }}>{state.currentLine ? "LINE: " + state.currentLine : "Electronic Manufacturing"}</a></p>
          </div>
        </div>
        <div className="h-model">
          <div className="lbl">Model</div>
          <div className="mn" id="model-name">{state.currentModel || "– – –"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className={"status-pill" + (error ? " offline" : "")} id="status-pill">
            <span className="status-dot" />
            <span id="status-text">{error ? "Terputus – Mencoba ulang…" : "Live · Terhubung ke Server"}</span>
          </div>
          <div className="h-clock">
            <div className="ct" id="clock-time">{jakartaTime(now, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
            <div className="cd" id="clock-date">{jakartaDate(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>
      </header>

      <div className="mhist" id="mhist">
        {state.models.map((model) => (
          <div className={"mchip" + (model.active ? " active" : "")} key={model.model}>
            <div className="mchip-top">
              <span className="mchip-model">{model.model || "—"}</span>
              <span className={model.active ? "mchip-live" : "mchip-done"}>{model.active ? "LIVE" : "SELESAI"}</span>
            </div>
            <div className="mchip-meta"><span className="mchip-qty">{model.totalOutput}<span> unit</span></span></div>
            <div className="mchip-sub">Target {model.target || "—"} · {model.slotStart ? model.slotStart + " – " + model.slotEnd : "—"} {model.achieveAvg === null ? "" : "· avg " + model.achieveAvg + "%"}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "none" }} aria-hidden="true">
        <span id="card-jam">{jakartaTime(now, { hour: "2-digit", minute: "2-digit" })}</span>
        <span id="card-target">{state.currentTarget || "–"}</span>
        <span id="card-result">{currentRow?.resultUPH ?? 0}</span>
        <span id="card-achieve">{currentRow?.achieveRate ?? "–"}</span>
        <span id="card-achieve-sub" />
      </div>

      <div className="tw">
        <div className="ttop">
          <div className="ttop-title" id="ttop-title">{tableTitle}</div>
          <div className="legend">
            <div className="li"><span className="ld bbl" />Jam berjalan</div>
            <div className="li"><span className="ld be" />≥ 100%</div>
            <div className="li"><span className="ld ba" />85–99%</div>
            <div className="li"><span className="ld br" />&lt; 85%</div>
          </div>
        </div>
        <div className="ts">
          <table>
            <colgroup>
              <col style={{ width: "20%" }} /><col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} /><col style={{ width: "15%" }} />
              <col style={{ width: "35%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="l">Jam</th><th className="c">Target UPH</th>
                <th className="c">Result UPH</th><th className="c">Achieve Rate</th>
                <th className="c">Progress</th>
              </tr>
            </thead>
            <tbody id="tbody">
              {state.rows.map((row) => {
                const progress = row.achieveRate === null ? 0 : Math.min(row.achieveRate, 100);
                return (
                  <tr className={row.status === "current" ? "cur" : row.status === "future" ? "fut" : ""} data-current={row.status === "current" ? "true" : undefined} key={row.start} ref={row.status === "current" ? currentRowRef : undefined}>
                    <td className="l"><span className={"cj " + row.status}>{row.start} – {row.end}</span>{row.status === "current" && <span className="bl">LIVE</span>}</td>
                    <td>{row.targetUPH ? <span className="cn ct2">{row.targetUPH}</span> : <span className="dash">—</span>}</td>
                    <td>{row.resultUPH !== null ? <span className={"cn " + resultClass(row.resultUPH, row.targetUPH)}>{row.resultUPH}</span> : <span className="dash">—</span>}</td>
                    <td>{row.achieveRate !== null ? <span className={"cn " + rateClass(row.achieveRate)}>{row.achieveRate.toFixed(1)}%</span> : <span className="dash">—</span>}</td>
                    <td><div className="bw"><div className={"bf " + rateBackground(row.achieveRate)} style={{ width: progress + "%" }} /></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="tf">
          <div className="tfs" id="footer-status">{footerStatus}</div>
          <div className="fbg">
            <div className="sb ok" id="b-total">Shift: {state.shiftTotalOutput} unit · Model aktif: {state.totalOutput}</div>
            <input className="filter-date" id="filter-date" onChange={(event) => setDateFilter(event.target.value)} title="Pilih tanggal untuk ekspor riwayat" type="date" value={dateFilter} />
            <button className="btn-export" onClick={downloadCsv} type="button">⬇ Export CSV</button>
          </div>
        </div>
      </div>

      <div className="tkw"><span className="tkt" id="ticker">{Array(6).fill("PT. GLOBAL ANUGERAH SETIA INDONESIA  ●  GROW ACHIEVE SUCCESS  ●  ").join("")}</span></div>
      <style>{styles}</style>
    </div>
  );
}
