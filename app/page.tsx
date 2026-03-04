import { Suspense } from 'react';
import HomeClient from "@/components/HomeClient";

// Suspense is required because HomeClient uses useSearchParams()
export default function Home() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
