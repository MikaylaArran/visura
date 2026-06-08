"use client";
import { useState, useRef } from "react";
import { Upload, ImagePlus, X, CheckCircle, ChevronDown } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const REGIONS = [
  { value: "west-africa", label: "West Africa" },
  { value: "east-africa", label: "East Africa" },
  { value: "southern-africa", label: "Southern Africa" },
  { value: "north-africa", label: "North Africa" },
  { value: "central-africa", label: "Central Africa" },
  { value: "india", label: "India" },
];

const ASSET_TYPES = [
  { value: "photo", label: "Photo" },
  { value: "vector", label: "Vector / Illustration" },
  { value: "video", label: "Video" },
];

const LICENSES = [
  { value: "standard", label: "Standard — web & print up to 500k copies" },
  { value: "extended", label: "Extended — unlimited commercial use" },
  { value: "editorial", label: "Editorial — news & media only" },
];

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    region: "",
    country: "",
    tags: "",
    type: "photo",
    license: "standard",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.region) e.region = "Please select a region";
    if (!form.country.trim()) e.country = "Country is required";
    if (!file) e.file = "Please upload an image";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setError(null);
    setLoading(true);

    try {
      const ext = file!.name.split(".").pop();
      const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(filePath, file!);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);

      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = preview!;
      });

      const { error: dbError } = await supabase.from("assets").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        region: form.region,
        country: form.country.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        type: form.type,
        license: form.license,
        file_url: publicUrl,
        preview_url: publicUrl,
        width: dimensions.width,
        height: dimensions.height,
        downloads: 0,
        is_approved: true,
      });

      if (dbError) throw dbError;

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setSubmitted(false);
    setPreview(null);
    setFileName(null);
    setFile(null);
    setError(null);
    setForm({ title: "", description: "", region: "", country: "", tags: "", type: "photo", license: "standard" });
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle size={56} className="text-[#2E6E48] mx-auto mb-6" />
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#2C1A0E] mb-3">
          Upload successful!
        </h1>
        <p className="text-[#7A6050] mb-8">
          Your image is now live on AfriStock and available for download.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#C85A1A] hover:bg-[#A8481A] text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Upload another
          </button>
          
          <a
            href="/browse"
            className="bg-[#2C1A0E] hover:bg-[#C85A1A] text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            View gallery
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#2C1A0E]">
          Contribute to AfriStock
        </h1>
        <p className="text-[#7A6050] mt-2">Share your vision with the world.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors overflow-hidden
              ${preview ? "border-[#C85A1A]" : "border-[#E2D8C8] hover:border-[#C85A1A]"}
              ${errors.file ? "border-red-400" : ""}`}
            style={{ minHeight: 280 }}
          >
            {preview ? (
              <>
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setFileName(null); setFile(null); }}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1 hover:bg-white transition-colors"
                >
                  <X size={14} className="text-[#2C1A0E]" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs p-2 truncate">
                  {fileName}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                <ImagePlus size={40} className="text-[#C4A882] mb-3" />
                <p className="text-sm font-medium text-[#5C4A38]">Drag & drop your image</p>
                <p className="text-xs text-[#A08060] mt-1">or click to browse</p>
                <p className="text-xs text-[#C4A882] mt-3">JPEG, PNG, TIFF · min 4MP recommended</p>
              </div>
            )}
          </div>
          {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
        </div>

        <div className="lg:col-span-3 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Fishermen at dawn, Elmina"
              className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm outline-none transition-colors
                focus:border-[#C85A1A] ${errors.title ? "border-red-400" : "border-[#E2D8C8]"}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe what's in the image, where it was taken, and the story behind it…"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2D8C8] bg-white text-sm outline-none resize-none focus:border-[#C85A1A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Region *</label>
              <div className="relative">
                <select
                  value={form.region}
                  onChange={(e) => set("region", e.target.value)}
                  className={`w-full appearance-none px-4 py-2.5 rounded-xl border bg-white text-sm outline-none focus:border-[#C85A1A] transition-colors
                    ${errors.region ? "border-red-400" : "border-[#E2D8C8]"}
                    ${!form.region ? "text-[#C4A882]" : "text-[#2C1A0E]"}`}
                >
                  <option value="">Select region</option>
                  {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none" />
              </div>
              {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Country *</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="e.g. Ghana"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm outline-none focus:border-[#C85A1A] transition-colors
                  ${errors.country ? "border-red-400" : "border-[#E2D8C8]"}`}
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="market, street, people, Lagos (comma separated)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2D8C8] bg-white text-sm outline-none focus:border-[#C85A1A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">Asset type</label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#E2D8C8] bg-white text-sm text-[#2C1A0E] outline-none focus:border-[#C85A1A] transition-colors"
                >
                  {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-1.5">License</label>
              <div className="relative">
                <select
                  value={form.license}
                  onChange={(e) => set("license", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#E2D8C8] bg-white text-sm text-[#2C1A0E] outline-none focus:border-[#C85A1A] transition-colors"
                >
                  {LICENSES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#C85A1A] hover:bg-[#A8481A] disabled:opacity-60 text-white py-3.5 rounded-xl font-medium transition-colors mt-2"
          >
            {loading ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Uploading…</>
            ) : (
              <><Upload size={16} /> Submit for Review</>
            )}
          </button>

          <p className="text-xs text-[#A08060] text-center">
            By submitting, you confirm you own the rights to this content and agree to our{" "}
            <a href="#" className="underline hover:text-[#C85A1A]">contributor terms</a>.
          </p>
        </div>
      </form>
    </div>
  );
}