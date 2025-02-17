import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdsListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2" >
          <Skeleton height={56} width="100%"/>
        </div>

      {[...Array(4)].map((_, index) => (
        <div className="space-y-2" key={index} >
          <Skeleton height={256} width="100%"/>
        </div>
      ))}
    </div>
  );
};

const AdsInfoSkeleton = () => {
  return (
    <div className="space-y-4 px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-64 w-full">
            <Skeleton height="100%" width="100%" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="space-y-2">
          <Skeleton height={36} width="100%" />
          <Skeleton height={36} width="100%" />
          <Skeleton height={36} width="100%" />
        </div>
        
        <div className="space-y-2">
          <Skeleton height={256} width="100%" />
        </div>

        <div className="space-y-2">
          <Skeleton height={256} width="100%" />
        </div>
      </div>
    </div>
  );
};


export { AdsListSkeleton, AdsInfoSkeleton };