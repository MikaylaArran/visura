"use client";
import { Asset } from "@/types";
import { Download, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LICENSE_COLOURS: Record<string, string> = {
  standard: "bg-[#EAF0E8] text-[#2E6E48]",
  extended: "bg-[#FBF0E2] text-[#C85A1A]",
  editorial: "bg-[#E6EEF7] text-[#185FA5]",
};

export default function AssetCard({ asset }: { asset: Asset }) {
  const aspect = asset.height / asset.width;
  const heightClass = aspect > 1.2 ? "h-64" : aspect < 0.7 ? "h-40" : "h-52";

  return (
    <Link
      href={`/browse/${asset.id}`}
      className="group block rounded-xl overflow-hidden border border-[#E2D8C8] bg-white hover:shadow-md transition-shadow duration-200"
    >
      <div className={`relative ${heightClass} w-full bg-[#E8DECE] overflow-hidden`}>
        <Image
          src={asset.previewUrl}
          alt={asset.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <p className="text-white text-xs font-medium truncate">{asset.title}</p>
        </div>
        <span
          className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${LICENSE_COLOURS[asset.license]}`}
        >
          {asset.license}
        </span>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-[#2C1A0E] truncate">{asset.title}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="flex items-center gap-1 text-xs text-[#A08060]">
            <MapPin size={11} />
            {asset.country}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A08060]">
            <Download size={11} />
            {asset.downloads}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#7A6050]">by {asset.contributorName}</span>
          <span className="text-sm font-medium text-[#C85A1A]">
            ${(asset.price / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
