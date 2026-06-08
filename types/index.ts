export type Region =
  | "all"
  | "west-africa"
  | "east-africa"
  | "southern-africa"
  | "north-africa"
  | "central-africa";

export type AssetType = "photo" | "vector" | "video";

export type License = "standard" | "extended" | "editorial";

export interface Asset {
  id: string;
  title: string;
  description: string;
  region: Region;
  country: string;
  tags: string[];
  type: AssetType;
  license: License;
  price: number; // in USD cents
  previewUrl: string;
  downloadUrl?: string;
  contributorId: string;
  contributorName: string;
  contributorAvatar?: string;
  width: number;
  height: number;
  createdAt: string;
  downloads: number;
}

export interface Contributor {
  id: string;
  name: string;
  bio: string;
  country: string;
  avatarUrl?: string;
  totalAssets: number;
  totalDownloads: number;
  joinedAt: string;
}

export interface UploadFormData {
  title: string;
  description: string;
  region: Region;
  country: string;
  tags: string;
  type: AssetType;
  license: License;
  price: number;
}
