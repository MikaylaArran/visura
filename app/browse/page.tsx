import type { Metadata } from "next";
import { Suspense } from "react";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import AssetCard from "@/components/ui/AssetCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import { Asset, Region, AssetType } from "@/types";

export const metadata: Metadata = {
  title: "Browse Images",
  description: "Search and download thousands of free authentic African images.",
};

interface Props {
  searchParams: Promise<{ q?: string; region?: string; type?: string }>;
}

async function getAssets(q?: string, region?: string, type?: string): Promise<Asset[]> {
  try {
    let query = supabase
      .from("assets")
      .select(`*, profiles(username, full_name, avatar_url)`)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,country.ilike.%${q}%`
      );
    }
    if (region) query = query.eq("region", region);
    if (type) query = query.eq("type", type);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return filterMock(q, region, type);
    }

    return data as Asset[];
  } catch {
    return filterMock(q, region, type);
  }
}

function filterMock(q?: string, region?: string, type?: string): Asset[] {
  return MOCK_ASSETS.filter((a: Asset) => {
    const matchQ = q
      ? a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())) ||
        a.country.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchRegion = region ? a.region === (region as Region) : true;
    const matchType = type ? a.type === (type as AssetType) : true;
    return matchQ && matchRegion && matchType;
  });
}

export default async function BrowsePage({ searchParams }: Props) {
  const { q, region, type } = await searchParams;
  const assets = await getAssets(q, region, type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#2C1A0E] mb-2">
          {q ? `Results for "${q}"` : "Browse Images"}
        </h1>
        <p className="text-[#7A6050] text-sm">
          {assets.length} asset{assets.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <Suspense>
        <div className="mb-6">
          <SearchBar />
        </div>
        <div className="mb-8">
          <FilterBar />
        </div>
      </Suspense>

      {assets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[#A08060]">
          <p className="text-5xl mb-4">🌍</p>
          <p className="text-lg font-medium text-[#5C4A38]">No results found</p>
          <p className="text-sm mt-1">Try different keywords or remove filters</p>
        </div>
      )}
    </div>
  );
}