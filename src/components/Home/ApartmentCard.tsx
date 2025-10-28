import { Apartment } from '@/utils';
import Image from 'next/image';


interface ApartmentCardProps {
    apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
    // Use the first image as the primary display image, with a fallback.
    const displayImage = apartment.image_urls?.[0] || '/placeholder-image.png';

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image src={displayImage} alt={apartment.name} width={400} height={250} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{apartment.name}</h3>
                <p className="text-gray-600 mb-2">{apartment.location}</p>
                <p className="text-lg font-bold text-blue-600">Ksh {Number(apartment.price).toLocaleString()}/mo</p>
            </div>
        </div>
    );
}