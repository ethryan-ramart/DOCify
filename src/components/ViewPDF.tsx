'use client'

import { useState } from 'react';
import Loading from './Loading';

export default function ViewPDF({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full min-h-screen">
      {loading && <LoadingContainer />}
      <iframe
        src={`https://docs.google.com/gview?url=${url}&embedded=true`}
        onLoad={() => setLoading(false)}
        className={`w-full h-full ${loading ? 'hidden' : ''}`}
      />
    </div>
  );
}

function LoadingContainer() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loading />
    </div>
  );
}