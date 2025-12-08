import React from 'react';

interface WeaponCardProps {
  name: string;
  imageUrl?: string;
  kills?: string;
  className?: string;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ 
  name, 
  imageUrl, 
  kills,
  className 
}) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 hover:border-red-500/50 transition-colors ${className}`}>
      {imageUrl && (
        <div className="flex justify-center mb-3">
          <img 
            src={imageUrl} 
            alt={name}
            className="h-16 w-auto object-contain"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <h3 className="text-white text-sm font-bold mb-2 text-center">{name}</h3>
      {kills && (
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Kills</div>
          <div className="text-lg font-semibold text-white">{kills}</div>
        </div>
      )}
    </div>
  );
};

