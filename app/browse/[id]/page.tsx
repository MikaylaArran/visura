import { MOCK_ASSETS } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MapPin, Tag, ArrowLeft, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAsset(id: string) {
  try {
    const { data, error } = await supabase
      .from("assets")
      .select(`*, profiles(username, full_name, avatar_url, country)`)
      .eq("id", id)
      .single();

    if (error || !data) {
      return MOCK_ASSETS.find((a) => a.id === id) || null;
    }
    return data;
  } catch {
    return MOCK_ASSETS.find((a) => a.id === id) || null;
  }
}

async function getRelated(id: string, region: string, contributorId: string) {
  try {
    const { data, error } = await supabase
      .from("assets")
      .select("id, title, preview_url, previewUrl")
      .eq("is_approved", true)
      .eq("region", region)
      .neq("id", id)
      .limit(4);

    if (error || !data || data.length === 0) {
      return MOCK_ASSETS.filter(
        (a) => a.id !== id && (a.region === region || a.contributorId === contributorId)
      ).slice(0, 4);
    }
    return data;
  } catch {
    return MOCK_ASSETS.filter(
      (a) => a.id !== id && (a.region === region || a.contributorId === contributorId)
    ).slice(0, 4);
  }
}

export default async function AssetDetailPage({ params }: Props) {
  const { id } = await params;
  const asset = await getAsset(id);
  if (!asset) notFound();

  const contributorId = asset.contributorId || asset.contributor_id || "";
  const region = asset.region || "";
  const related = await getRelated(id, region, contributorId);

  const contributorName =
    asset.contributorName ||
    asset.profiles?.full_name ||
    asset.profiles?.username ||
    "Contributor";

  const previewUrl = asset.previewUrl || asset.preview_url || "";
  const createdAt = asset.createdAt || asset.created_at || "";
  const license = asset.license || "standard";
  const tags = asset.tags || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-[#7A6050] hover:text-[#C85A1A] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden border border-[#E2D8C8] bg-[#E8DECE]">
            <Image
              src={previewUrl}
              alt={asset.title}
              width={900}
              height={600}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-[#C85A1A]">
              {asset.type || "photo"}
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#2C1A0E] mt-1">
              {asset.title}
            </h1>
            <p className="text-[#7A6050] mt-2 text-sm leading-relaxed">{asset.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-[#5C4A38]">
              <MapPin size={14} className="text-[#C85A1A]" />
              {asset.country}
            </div>
            {createdAt && (
              <div className="flex items-center gap-2 text-[#5C4A38]">
                <Calendar size={14} className="text-[#C85A1A]" />
                {new Date(createdAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "short",
                })}
              </div>
            )}
            <div className="flex items-center gap-2 text-[#5C4A38]">
              <Download size={14} className="text-[#C85A1A]" />
              {asset.downloads || 0} downloads
            </div>
            <div className="flex items-center gap-2 text-[#5C4A38] capitalize">
              <Tag size={14} className="text-[#C85A1A]" />
              {license} license
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/browse?q=${tag}`}
                  className="text-xs px-2.5 py-1 bg-[#F5ECD8] text-[#7A5025] rounded-full hover:bg-[#E8D5B5] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Contributor */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E2D8C8]">
            <div className="w-10 h-10 rounded-full bg-[#E2C89E] flex items-center justify-center text-sm font-medium text-[#7A5025] shrink-0">
              {contributorName.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium text-[#2C1A0E]">{contributorName}</p>
              <p className="text-xs text-[#A08060]">Contributor · {asset.country}</p>
            </div>
          </div>

          {/* Free download */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-[#2C1A0E] font-[family-name:var(--font-display)]">
                Free
              </span>
              <span className="text-sm text-[#A08060] capitalize">{license} license</span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-[#C85A1A] hover:bg-[#A8481A] text-white py-3.5 rounded-xl font-medium transition-colors">
              <Download size={16} /> Download Free
            </button>
            <p className="text-xs text-center text-[#A08060] mt-2">
              High-resolution · Free to use · Instant download
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#2C1A0E] mb-6">
            More from {region.replace(/-/g, " ")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {related.map((a: any) => (
              <Link
                key={a.id}
                href={`/browse/${a.id}`}
                className="group rounded-xl overflow-hidden border border-[#E2D8C8] bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative h-36 bg-[#E8DECE]">
                  <Image
                    src={a.previewUrl || a.preview_url || ""}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="25vw"
                  />
                </div>
                <p className="text-xs font-medium text-[#2C1A0E] truncate p-2">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}