import React from 'react';

interface LoadingProps {
  size: number;
}

export const LoadingScreen: React.FC<LoadingProps> = ({ size }) => {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      className="flex justify-center"
    >
      <div className="w-[50%] h-10 flex justify-center self-center">
        <div
          style={{ width: `${size}px`, height: `${size}px` }}
          className="animate-spin"
        >
          <div
            className="h-full w-full border-4 border-t-skin-primary
                 border-b-skin-primary rounded-[50%]"
          ></div>
        </div>
      </div>
    </div>
  );
};
