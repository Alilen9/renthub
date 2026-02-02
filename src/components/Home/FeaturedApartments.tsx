"use client";

import { useState, useEffect } from 'react';

import { fetchApartments } from '@/services/houseService';
import { Apartment } from '@/utils';
import ApartmentCard from './ApartmentCard';


export default function FeaturedApartments() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadApartments() {
            setLoading(true);
            // Fetch the first 3 apartments for the "featured" section
            const data = await fetchApartments(3);
            setApartments(data);
            setLoading(false);
        }
        loadApartments();
    }, []);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-black">
                    Featured Properties
                </h2>
                {loading ? (
                    <p className="text-center text-gray-600">Loading properties...</p>
                ) : apartments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {apartments.map((apartment) => (
                            <ApartmentCard key={apartment.id} apartment={apartment} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No featured properties available at the moment.</p>
                )}
            </div>
        </section>
    );
}