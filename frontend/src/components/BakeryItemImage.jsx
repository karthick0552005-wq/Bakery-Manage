import React, { useState } from 'react';

export default function BakeryItemImage({ src, alt, className = "" }) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-muted flex items-center justify-center ${className}`}>
      {src && !error ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop" 
            alt="Bakery Item Placeholder" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
        </div>
      )}
    </div>
  );
}
