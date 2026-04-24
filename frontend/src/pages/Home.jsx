import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBakery } from '@/store/BakeryContext';

export default function Home() {
  const { user } = useBakery();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'kitchen') navigate('/kitchen');
      else navigate('/customer');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='animate-pulse flex flex-col items-center gap-4'>
        <div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center overflow-hidden border-2 border-white/20'>
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=100&auto=format&fit=crop" 
            alt="Loading" 
            className="w-full h-full object-cover"
          />
        </div>
        <p className='font-display font-black text-xl'>Redirecting you to your portal...</p>
      </div>
    </div>
  );
}
