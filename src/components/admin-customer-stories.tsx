"use client";

import { useEffect, useState } from "react";
import type { CustomerStory, StoryKind } from "@/lib/story-types";

const api = "/api/admin/customer-stories";
const field = "mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5";
const button = "rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-700 disabled:opacity-40";

export function AdminCustomerStories() {
  const [stories, setStories] = useState<CustomerStory[]>([]);
  const [kind, setKind] = useState<StoryKind>("delivery");
  const [editor, setEditor] = useState<CustomerStory | "new" | null>(null);
  const [preview, setPreview] = useState("");
  const [removal, setRemoval] = useState<CustomerStory | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imageVersion, setImageVersion] = useState(0);

  async function load() {
    const res = await fetch(api, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setStories(data.stories);
    setImageVersion(version => version + 1);
  }

  useEffect(() => {
    load().catch(err => setError(err.message)).finally(() => setBusy(false));
  }, []);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function mutate(method: string, body?: BodyInit, query = "") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(api + query, { method, body, headers: method === "PATCH" ? { "Content-Type": "application/json" } : undefined });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditor(null);
      setRemoval(null);
      setPreview("");
      setNotice("Changes saved.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  const rows = stories.filter(story => story.kind === kind);
  const existing = typeof editor === "object" ? editor : null;
  const currentImage = existing?.imageUrl ? `${existing.imageUrl}?v=${imageVersion}` : "";
  return (
    <section className="space-y-6 text-slate-100">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Customer stories</h2>
          <p className="mt-1 text-sm text-slate-400">Manage the delivery gallery and testimonial cards on Home.</p>
        </div>
        <button type="button" disabled={busy} className={button} onClick={() => {setEditor("new"); setPreview(""); setRemoval(null);}}>Add story</button>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Story section">
        {(["delivery", "testimonial"] as const).map(tab => <button key={tab} type="button" aria-pressed={kind === tab}
          className={`${button} ${kind === tab ? "bg-slate-700" : ""}`} onClick={() => {setKind(tab); setEditor(null); setPreview(""); setRemoval(null);}}>
          {tab === "delivery" ? "Delivery stories" : "Testimonials"}
        </button>)}
      </div>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {notice && <p role="status" className="text-sm text-emerald-300">{notice}</p>}
      {editor && <form key={existing?.id ?? "new"} className="rounded-xl border border-slate-700 p-5 space-y-4"
        onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          data.set("isActive", data.has("isActive") ? "true" : "false");
          void mutate("POST", data);
        }}>
        <h3 className="font-semibold">{existing ? "Edit story" : "New story"}</h3>
        {existing && <input type="hidden" name="id" value={existing.id}/>}
        {existing?.isDemo && <p className="text-sm text-amber-200">This entry retains its demo label. Add a new story for a real customer.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Customer name<input name="customerName" className={field} required maxLength={100} defaultValue={existing?.customerName}/></label>
          <label className="text-sm">Location or rider context<input name="location" className={field} required maxLength={100} defaultValue={existing?.location}/></label>
          <label className="text-sm">Section<select name="kind" className={field} defaultValue={existing?.kind ?? kind}>
            <option value="delivery">Delivery stories</option><option value="testimonial">Testimonials</option>
          </select></label>
          <label className="text-sm">Photo (JPEG, PNG or WebP, up to 3 MB)
            <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className={field} required={!existing}
              onChange={event => {
                const file = event.target.files?.[0];
                if (file && file.size > 3 * 1024 * 1024) {
                  event.target.value = "";
                  setError("Choose a photo under 3 MB.");
                  setPreview("");
                  return;
                }
                setError("");
                setPreview(file ? URL.createObjectURL(file) : "");
              }}/>
          </label>
        </div>
        {(preview || currentImage) && <img src={preview || currentImage} alt="Story photo preview" className="h-36 w-32 rounded-lg object-cover"/>}
        <label className="block text-sm">Quote or delivery caption<textarea name="testimonial" className={field} required maxLength={220} rows={3} defaultValue={existing?.testimonial}/></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={existing?.isActive}/> Publish on Home</label>
        <p className="text-xs text-slate-400">Use approved customer photos and quotes for published stories.</p>
        <div className="flex gap-2">
          <button className={button} disabled={busy}>Save story</button>
          <button type="button" className={button} onClick={() => {setEditor(null); setPreview("");}}>Cancel</button>
        </div>
      </form>}
      {removal && <div role="group" aria-label="Confirm story deletion" className="rounded-xl border border-rose-800 p-4">
        <p className="text-sm">Delete the story for {removal.customerName} and its uploaded photo?</p>
        <div className="mt-3 flex gap-2">
          <button type="button" className={button} disabled={busy} onClick={() => void mutate("DELETE", undefined, `?id=${encodeURIComponent(removal.id)}`)}>Delete story</button>
          <button type="button" className={button} onClick={() => setRemoval(null)}>Cancel</button>
        </div>
      </div>}
      {!rows.length && <p className="text-sm text-slate-400">{busy ? "Loading stories…" : "There are no stories in this section."}</p>}
      <ul className="divide-y divide-slate-700 rounded-xl border border-slate-700">
        {rows.map((story, index) => <li key={story.id} className="flex flex-wrap items-center gap-4 p-4">
          <img src={`${story.imageUrl}?v=${imageVersion}`} alt="" className="size-16 rounded-lg object-cover"/>
          <div className="min-w-[150px] flex-1">
            <p className="font-semibold">{story.customerName}</p>
            <p className="text-xs text-slate-300">{story.location} · {story.isActive ? "Published" : "Hidden"}{story.isDemo && " · Demo"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-label={`Move ${story.customerName} up`} disabled={busy || index === 0} className={button} onClick={() => void mutate("PATCH", JSON.stringify({id: story.id, move: -1}))}>↑</button>
            <button type="button" aria-label={`Move ${story.customerName} down`} disabled={busy || index === rows.length - 1} className={button} onClick={() => void mutate("PATCH", JSON.stringify({id: story.id, move: 1}))}>↓</button>
            <button type="button" disabled={busy} className={button} onClick={() => void mutate("PATCH", JSON.stringify({id: story.id, isActive: !story.isActive}))}>{story.isActive ? "Hide" : "Publish"}</button>
            <button type="button" className={button} onClick={() => {setEditor(story); setPreview(""); setRemoval(null);}}>Edit</button>
            <button type="button" className={button} onClick={() => {setRemoval(story); setEditor(null); setPreview("");}}>Delete…</button>
          </div>
        </li>)}
      </ul>
    </section>
  );
}
