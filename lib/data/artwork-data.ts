import type { CategoryData, CategoryKey } from "@/lib/types/artwork";

export const FOLDER_NAME_MAP: Record<CategoryKey, string> = {
	landscape: "landscape",
	human: "Human",
	spheres: "spheres",
	"architecture-of-destruction": "architecture of destruction",
	"my-dutch-heroes": "my Dutch Heroes",
	"still-life": "Still life",
	"master-copy": "Master Copy",
};

export const artworkCategories: CategoryData[] = [
	{
		key: "landscape",
		slug: "landscape",
		folderName: "landscape",
		previewImage: "IMG_7665-gigapixel-standard-scale-4_00x.jpg",
		artworks: [
			{
				id: "landscape-1",
				filename:
					"IMG_2021011tali 3_143422-topaz-sharpen-gigapixel-art-scale-4_00x.jpg",
				title: "Landscape I",
			},
			{
				id: "landscape-2",
				filename: "IMG_2tail 0200924_134249-gigapixel-standard-scale-4_00x.jpg",
				title: "Landscape II",
			},
			{
				id: "landscape-3",
				filename: "IMG_2tali 0200930_135912-gigapixel-standard-scale-4_00x.jpg",
				title: "Landscape III",
			},
			{
				id: "landscape-4",
				filename: "IMG_2tali 0201224_120905-gigapixel-standard-scale-4_00x.jpg",
				title: "Landscape IV",
			},
			{
				id: "landscape-5",
				filename: "IMG_7665-gigapixel-standard-scale-4_00x.jpg",
				title: "Landscape V",
			},
			{
				id: "landscape-6",
				filename: "IMG_7670-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Landscape VI",
			},
			{
				id: "landscape-7",
				filename: "Itali MG_20201103_132237-gigapixel-art-scale-4_00x.jpg",
				title: "Landscape VII",
			},
			{
				id: "landscape-8",
				filename: "Itali MG-20210122-WA0004-gigapixel-art-scale-4_00x.jpg",
				title: "Landscape VIII",
			},
			{
				id: "landscape-9",
				filename: "tail IMG_20201103_132248-gigapixel-art-scale-4_00x.jpg",
				title: "Landscape IX",
			},
			{
				id: "landscape-10",
				filename: "tali IMG_1347-gigapixel-standard-scale-4_00x.jpg",
				title: "Landscape X",
			},
			{
				id: "landscape-11",
				filename: "tali IMG_7671-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Landscape XI",
			},
			{
				id: "landscape-12",
				filename: "tali-gigapixel-low_res-scale-4_00x.jpg",
				title: "Landscape XII",
			},
		],
	},
	{
		key: "human",
		slug: "human",
		folderName: "Human",
		previewImage: "tali IMG_7666-gigapixel-art-scale-4_00x-cropped.jpg",
		artworks: [
			{
				id: "human-1",
				filename:
					"PHOTO-2025-12-11-20tali -57-21 7-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study I",
			},
			{
				id: "human-2",
				filename: "IMG_7682-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study II",
			},
			{
				id: "human-3",
				filename:
					"PHOTO-2025-12-11-20tali -57-21 6-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study III",
			},
			{
				id: "human-4",
				filename:
					"PHOTO-2025-12-11-20tali -57-21 7-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study IV",
			},
			{
				id: "human-5",
				filename:
					"PHOTO-2025-12-11-2tali 0-57-21 9-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study V",
			},
			{
				id: "human-6",
				filename:
					"PHOTO-2025-12-11-tali 20-59-08-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study VI",
			},
			{
				id: "human-7",
				filename:
					"PHOTO-2025-12-11-tali 21-01-48-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Human Study VII",
			},
			{
				id: "human-8",
				filename:
					"PHOTO-2025-12-1tali 1-20-57-21 10-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study VIII",
			},
			{
				id: "human-9",
				filename:
					"PHOTO-2025-12-1tali 1-20-57-21 12-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study IX",
			},
			{
				id: "human-10",
				filename:
					"PHOTO-2025-12-1tali 1-20-57-21 15-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study X",
			},
			{
				id: "human-11",
				filename:
					"PHOTO-2025-12-tali 11-20-57-21 11-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study XI",
			},
			{
				id: "human-12",
				filename:
					"PHOTO-2025-12-tali 11-20-57-21 14-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study XII",
			},
			{
				id: "human-13",
				filename:
					"PHOTO-2025-12-tali 11-20-57-21 5-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study XIII",
			},
			{
				id: "human-14",
				filename:
					"PHOTO-2025-1tali 2-11-20-57-22-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study XIV",
			},
			{
				id: "human-15",
				filename: "tali IMG_7666-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Human Study XV",
			},
			{
				id: "human-16",
				filename: "tali IMG_7677-gigapixel-art-scale-4_00x.jpg",
				title: "Human Study XVI",
			},
		],
	},
	{
		key: "spheres",
		slug: "spheres",
		folderName: "spheres",
		previewImage:
			"detail 2/PHOTO-2025-tali 12-13-16-42-49 4-gigapixel-standard-scale-4_00x.jpg",
		artworks: [
			{
				id: "sphere-1",
				filename:
					"detail 1/PHOTO-2025-tail 12-13-16-42-49 2-gigapixel-standard-scale-4_00x.jpg",
				title: "Sphere I",
				detailImages: [
					"detail 1/PHOTO-2025-12-13-tali 16-42-49-gigapixel-standard-scale-4_00x-cropped.jpg",
					"detail 1/tali IMG_7762-gigapixel-standard-scale-4_00x.jpg",
				],
			},
			{
				id: "sphere-2",
				filename:
					"detail 2/PHOTO-2025-tali 12-13-16-42-49 4-gigapixel-standard-scale-4_00x.jpg",
				title: "Sphere II",
				detailImages: [
					"detail 2/PHOTO-202tali 5-12-13-16-42-50-gigapixel-standard-scale-4_00x.jpg",
				],
			},
			{
				id: "sphere-3",
				filename: "Itali MG_7767-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Sphere III",
				detailImages: [
					"detail 2/PHOTO-2025-tali 12-13-16-42-49 4-gigapixel-standard-scale-4_00x.jpg",
					"detail 2/PHOTO-202tali 5-12-13-16-42-50-gigapixel-standard-scale-4_00x.jpg",
				],
			},
			{
				id: "sphere-4",
				filename: "Itali MG_7768-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Sphere IV",
			},
			{
				id: "sphere-5",
				filename:
					"PHOTO-20tali 25-12-13-16-42-48-gigapixel-standard-scale-4_00x.jpg",
				title: "Sphere V",
			},
			{
				id: "sphere-6",
				filename: "tali IMG_7763-gigapixel-standard-scale-4_00x.jpg",
				title: "Sphere VI",
			},
			{
				id: "sphere-7",
				filename: "tali IMG_7764-gigapixel-standard-scale-4_00x.jpg",
				title: "Sphere VII",
			},
		],
	},
	{
		key: "architecture-of-destruction",
		slug: "architecture-of-destruction",
		folderName: "architecture of destruction",
		previewImage:
			"PHOTO-2025-12-11-21tali -00-03 3-gigapixel-standard-scale-4_00x-cropped.jpg",
		artworks: [
			{
				id: "architecture-1",
				filename:
					"PHOTO-2025-12-11-21tali -00-03 2-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Architecture of Destruction I",
			},
			{
				id: "architecture-2",
				filename:
					"PHOTO-2025-12-11-21tali -00-03 3-gigapixel-standard-scale-4_00x-cropped.jpg",
				title: "Architecture of Destruction II",
			},
			{
				id: "architecture-3",
				filename:
					"PHOTO-202tali 5-12-11-21-00-03-gigapixel-standard-scale-4_00x.jpg",
				title: "Architecture of Destruction III",
			},
		],
	},
	{
		key: "my-dutch-heroes",
		slug: "my-dutch-heroes",
		folderName: "my Dutch Heroes",
		previewImage: "IMG_1431-gigapixel-standard-scale-4_00x.jpg",
		artworks: [
			{
				id: "dutch-1",
				filename: "IMG_1431-gigapixel-standard-scale-4_00x.jpg",
				title: "My Dutch Heroes I",
			},
			{
				id: "dutch-2",
				filename: "IMG_2tali0210429_145826-gigapixel-standard-scale-4_00x.jpg",
				title: "My Dutch Heroes II",
			},
			{
				id: "dutch-3",
				filename: "taliIMG_1457-gigapixel-standard-scale-4_00x.jpg",
				title: "My Dutch Heroes III",
			},
		],
	},
	{
		key: "still-life",
		slug: "still-life",
		folderName: "Still life",
		previewImage: "taliIMG_20201103_132030-topaz-sharpen-enhance-2x.jpeg",
		artworks: [
			{
				id: "still-1",
				filename: "taliIMG_20201103_132030-topaz-sharpen-enhance-2x.jpeg",
				title: "Still Life I",
			},
			{
				id: "still-2",
				filename: "taliIMG_20201103_132103-topaz-sharpen-enhance-2x.jpeg",
				title: "Still Life II",
			},
		],
	},
	{
		key: "master-copy",
		slug: "master-copy",
		folderName: "Master Copy",
		previewImage: "tali IMG_7686-gigapixel-art-scale-4_00x-cropped.jpg",
		artworks: [
			{
				id: "master-1",
				filename: "tali IMG_7686-gigapixel-art-scale-4_00x-cropped.jpg",
				title: "Study After Master",
			},
		],
	},
];

export function getCategoryBySlug(slug: string): CategoryData | undefined {
	return artworkCategories.find((cat) => cat.slug === slug);
}

export function getCategoryByKey(key: CategoryKey): CategoryData | undefined {
	return artworkCategories.find((cat) => cat.key === key);
}
