"use client"
import { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

interface ProductGalleryProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: any[];
    productName: string;
    isOutOfStock: boolean | 0 | undefined;
}

export default function ProductGallery({
    images,
    productName,
    isOutOfStock
}: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!images?.length) return null;

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""
                }`}>
                <Image
                    src={imageUrl(images[selectedImageIndex]).url()}
                    alt={`${productName} - Main view`}
                    fill
                    className="object-contain transition-transform duration-300 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                        <button
                            key={img._key || index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${index === selectedImageIndex
                                ? "border-blue-500 scale-105"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            aria-label={`View ${productName} image ${index + 1}`}
                        >
                            <Image
                                src={imageUrl(img).width(200).url()}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 25vw, 200px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}