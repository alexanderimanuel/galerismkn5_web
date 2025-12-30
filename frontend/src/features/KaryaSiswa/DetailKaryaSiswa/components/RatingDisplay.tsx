import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function RatingDisplay({ rating, size = 'md', showNumber = true }: RatingDisplayProps) {
  const starSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      {showNumber && (
        <span className={`ml-2 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'} text-gray-600`}>
          ({rating}/5)
        </span>
      )}
    </div>
  );
}