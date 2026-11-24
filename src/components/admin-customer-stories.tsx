"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, ImageOff, Images, Plus, RefreshCw } from "lucide-react";
import type { CustomerStory, StoryKind } from "@/lib/story-types";

const api = "/api/admin/customer-stories";
const field = "mt-1.5 w-full rounded-xl border border-slate-600 bg-[#0d121b] p-2.5 text-slate-100 focus:border-emerald-400";
const button = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-40";
const primary = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-[#071a12] hover:bg-emerald-300 disabled:opacity-40";
const sections = { delivery: "Delivery stories", testimonial: "Testimonials" };

function imageSource(path: string, version: number) {
  return path + (path.includes("?") ? "&" : "?") + "v=" + version;
}

export function AdminCustomerStories() {
  const router = useRouter();
  const [stories, setStories] = useState<CustomerStory[]>([]);
  const [kind, setKind] = useState<StoryKind>("delivery");
  const [editor, setEditor] = useState<CustomerStory | "new" | null>(null);
  const [preview, setPreview] = useState("");
  const [removal, setRemoval] = useState<CustomerStory | null>(null);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error" | "reauth">("loading");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imageVersion, setImageVersion] = useState(0);
  const editorHeading = useRef<HTMLHeadingElement>(null);
  const deleteConfirmation = useRef<HTMLDivElement>(null);
  const canEdit = listStatus === "ready" && !saving;

  const returnToSignIn = useCallback(() => {
    setListStatus("reauth");
    router.replace("/admin/login?section=stories&expired=1");
  }, [router]);

  const load = useCallback(async (signal?: AbortSignal) => {
    setListStatus("loading");
    try {
      const response = await fetch(api, { cache: "no-store", signal });
      if (signal?.aborted) return;
      if (response.status === 401) {
        returnToSignIn();
        return;
      }
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (signal?.aborted) return;
      setStories(data.stories);
      setImageVersion(version => version + 1);
      setListStatus("ready");
    } catch {
      if (!signal?.aborted) setListStatus("error");
    }
  }, [returnToSignIn]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { if (editor) editorHeading.current?.focus(); }, [editor]);
  useEffect(() => { if (removal) deleteConfirmation.current?.focus(); }, [removal]);

  async function mutate(method: "POST" | "PATCH" | "DELETE", body?: BodyInit, query = "") {
    if (!canEdit) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(api + query, {
        method, body, headers: method === "PATCH" ? { "Content-Type": "application/json" } : undefined,
      });
      if (response.status === 401) {
        returnToSignIn();
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "The change could not be saved.");
      }
      setEditor(null);
      setRemoval(null);
      setPreview("");
      setNotice(method === "DELETE" ? "Story deleted." : "Changes saved.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function chooseEditor(story: CustomerStory | "new" | null) {
    setEditor(story);
    setRemoval(null);
    setError("");
    setPreview("");
  }

  const rows = stories.filter(story => story.kind === kind);
  const existing = typeof editor === "object" ? editor : null;
  const currentImage = existing?.imageUrl ? imageSource(existing.imageUrl, imageVersion) : "";

  return (
    <section aria-labelledby="story-manager-title" className="space-y-5 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141a25] p-5 sm:p-6">
        <div>
          <h2 id="story-manager-title" className="text-xl font-bold">Manage homepage stories</h2>
          <p className="mt-1 max-w-lg text-sm text-slate-300">Choose which delivery photos and testimonials appear on the homepage, and set their order.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/#customer-stories" target="_blank" rel="noopener noreferrer" className={button}>
            <ExternalLink size={15} aria-hidden="true"/> Preview homepage
          </a>
          <button type="button" disabled={!canEdit} className={primary} onClick={() => chooseEditor("new")}>
            <Plus size={17} aria-hidden="true"/> Add story
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Story section">
          {(["delivery", "testimonial"] as const).map(tab => (
            <button key={tab} type="button" aria-pressed={kind === tab} disabled={saving}
              className={button + " aria-pressed:border-emerald-400/70 aria-pressed:bg-emerald-400/10 aria-pressed:text-emerald-200"}
              onClick={() => { setKind(tab); chooseEditor(null); setNotice(""); }}>
              {sections[tab]}
              {listStatus === "ready" && <span className="rounded-full bg-white/10 px-2 text-xs">{stories.filter(story => story.kind === tab).length}</span>}
            </button>
          ))}
        </div>
        {listStatus === "ready" && <button type="button" className={button} disabled={saving} onClick={() => void load()}>
          <RefreshCw size={14} aria-hidden="true"/> Refresh stories
        </button>}
      </div>

      {listStatus === "reauth" && <p role="status" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">Your session expired. Taking you to sign in.</p>}
      {listStatus === "loading" && <p role="status" className="rounded-xl border border-white/10 bg-[#141a25] p-4 text-sm text-slate-300">Loading customer stories…</p>}
      {listStatus === "error" && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
        <p>Customer stories could not be loaded.</p>
        <button type="button" className={button} onClick={() => void load()}>Try again</button>
      </div>}
      {error && listStatus === "ready" && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{notice}</p>}

      {editor && listStatus === "ready" && (
        <form key={existing?.id ?? "new"} className="rounded-2xl border border-emerald-400/30 bg-[#141a25] p-5 sm:p-6"
          onSubmit={event => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            data.set("isActive", data.has("isActive") ? "true" : "false");
            void mutate("POST", data);
          }}>
          <h3 ref={editorHeading} tabIndex={-1} className="scroll-mt-24 text-lg font-bold">{existing ? "Edit story" : "New story"}</h3>
          {existing && <input type="hidden" name="id" value={existing.id}/>}
          {existing?.isDemo && <p className="mt-2 text-sm text-amber-200">This sample keeps its demo label. Add a new story for a real customer.</p>}
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_13rem]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">Customer name<input name="customerName" className={field} required maxLength={100} defaultValue={existing?.customerName}/></label>
              <label className="text-sm">Location or rider context<input name="location" className={field} required maxLength={100} defaultValue={existing?.location}/></label>
              <label className="text-sm">Section<select name="kind" className={field} defaultValue={existing?.kind ?? kind}>
                <option value="delivery">Delivery stories</option><option value="testimonial">Testimonials</option>
              </select></label>
              <label className="text-sm">Photo
                <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className={field} required={!existing}
                  aria-describedby="admin-story-image-format" onChange={event => {
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
                <span id="admin-story-image-format" className="mt-1 block text-xs text-slate-400">JPEG, PNG or WebP · up to 3 MB</span>
              </label>
              <label className="text-sm sm:col-span-2">Quote or delivery caption<textarea name="testimonial" className={field} required maxLength={220} rows={3} defaultValue={existing?.testimonial}/></label>
            </div>
            <div className="grid min-h-28 place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#0d121b] text-sm text-slate-400">
              {preview || currentImage ? <img src={preview || currentImage} alt="Story photo preview" className="max-h-64 w-full object-contain"/>
                : <span className="flex items-center gap-2 p-4"><ImageOff size={17} aria-hidden="true"/> Photo preview</span>}
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={existing?.isActive}/> Publish on homepage</label>
          <p className="mt-2 text-xs text-slate-400">Publish approved customer photos and quotes.</p>
          <div className="mt-5 flex gap-2">
            <button type="submit" className={primary} disabled={!canEdit}>{saving ? "Saving…" : "Save story"}</button>
            <button type="button" className={button} disabled={saving} onClick={() => chooseEditor(null)}>Cancel</button>
          </div>
        </form>
      )}

      {removal && listStatus === "ready" && (
        <div ref={deleteConfirmation} tabIndex={-1} role="group" aria-label="Confirm story deletion" className="scroll-mt-24 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4">
          <p className="text-sm">Delete the story for {removal.customerName} and its uploaded photo?</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className={button + " text-rose-200"} disabled={!canEdit} onClick={() => void mutate("DELETE", undefined, "?id=" + encodeURIComponent(removal.id))}>Delete story</button>
            <button type="button" className={button} disabled={saving} onClick={() => setRemoval(null)}>Cancel</button>
          </div>
        </div>
      )}

      {listStatus === "ready" && rows.length === 0 && (
        <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-white/20 p-8 text-center">
          <Images size={26} aria-hidden="true" className="text-emerald-300"/>
          <p className="text-sm text-slate-300">{kind === "delivery" ? "No delivery stories yet." : "No testimonials yet."}</p>
          <button type="button" className={button} onClick={() => chooseEditor("new")} disabled={!canEdit}>Add the first story</button>
        </div>
      )}
      {listStatus === "ready" && rows.length > 0 && (
        <ul className="grid gap-3 xl:grid-cols-2" aria-label={sections[kind]}>
          {rows.map((story, index) => (
            <li key={story.id} className="min-w-0 rounded-2xl border border-white/10 bg-[#141a25] p-4">
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4">
                {story.imageUrl
                  ? <img src={imageSource(story.imageUrl, imageVersion)} alt="" loading="lazy" className="h-24 w-full rounded-xl object-cover"/>
                  : <span className="grid h-24 place-items-center rounded-xl bg-[#0d121b] text-slate-400"><ImageOff size={22} aria-label="No photo"/></span>}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{story.customerName}</h3>
                    <span className={"rounded-full px-2 py-0.5 text-xs font-semibold " + (story.isActive ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-slate-300")}>{story.isActive ? "Published" : "Hidden"}</span>
                    {story.isDemo && <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-xs text-amber-200">Demo</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{story.location}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">{story.testimonial}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                <button type="button" className={button} disabled={!canEdit} onClick={() => chooseEditor(story)}>Edit</button>
                <button type="button" className={button} disabled={!canEdit} onClick={() => void mutate("PATCH", JSON.stringify({ id: story.id, isActive: !story.isActive }))}>{story.isActive ? "Hide" : "Publish"}</button>
                <button type="button" aria-label={"Move " + story.customerName + " up"} disabled={!canEdit || index === 0} className={button} onClick={() => void mutate("PATCH", JSON.stringify({ id: story.id, move: -1 }))}><ArrowUp size={16} aria-hidden="true"/></button>
                <button type="button" aria-label={"Move " + story.customerName + " down"} disabled={!canEdit || index === rows.length - 1} className={button} onClick={() => void mutate("PATCH", JSON.stringify({ id: story.id, move: 1 }))}><ArrowDown size={16} aria-hidden="true"/></button>
                <button type="button" className={button + " text-rose-200"} disabled={!canEdit}
                  onClick={() => { chooseEditor(null); setRemoval(story); }}>Delete…</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
