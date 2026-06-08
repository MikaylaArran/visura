import { Suspense } from "react";
import { MOCK_ASSETS } from "@/lib/mock-data";
import AssetCard from "@/components/ui/AssetCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import { Asset, Region, AssetType } from "@/types";

interface Props {
  searchParams: Promise<{ q?: string; region?: string; type?: string }>;
}

export default async function BrowsePage({ searchParams }: Props) {
  const { q, region, type } = await searchParams;

  const filtered = MOCK_ASSETS.filter((a: Asset) => {
    const matchQ = q
      ? a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())) ||
        a.country.toLowerCase().includes(q.toLowerCase())
      : true;
    const matchRegion = region ? a.region === (region as Region) : true;
    const matchType = type ? a.type === (type as AssetType) : true;
    return matchQ && matchRegion && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#2C1A0E] mb-2">
          {q ? `Results for "${q}"` : "Browse Images"}
        </h1>
        <p className="text-[#7A6050] text-sm">
          {filtered.length} asset{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search */}
      <Suspense>
        <div className="mb-6">
          <SearchBar />
        </div>
        {/* Filters */}
        <div className="mb-8">
          <FilterBar />
        </div>
      </Suspense>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((asset) => (
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
