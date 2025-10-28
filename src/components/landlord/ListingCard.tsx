"use client";

import React from "react";
import { ListingFile } from "./types";
import { Apartment } from "@/utils";
import  Image  from "next/image";

export interface ListingCardProps {
  apartment: Apartment;
  //onDelete?: () => void;
}

export default function ListingCard(
  { apartment }: ListingCardProps) {
  const previewImage =
    apartment.image_urls?.[0] || '/placeholder-image.png';


  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
     
      <Image 
      src={previewImage}
       alt={apartment.name}
        width={400} height={250}
        className="w-full h-40 object-cover" />
                  
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black">{apartment.name}</h2>
        <p className="text-gray-600 text-sm">{apartment.location}</p>
        <p className="text-rose-600 font-semibold mt-2">Ksh {apartment.price}</p>
      </div>
    </div>
  );
}
