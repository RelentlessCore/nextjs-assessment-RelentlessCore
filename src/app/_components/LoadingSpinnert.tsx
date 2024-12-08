import React from "react";

function LoadingSpinnert() {
  return (
    <div className="flex h-full w-full items-center justify-center text-center">
      <div
        className="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-[#6366F1] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default LoadingSpinnert;
