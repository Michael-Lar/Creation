import { Suspense } from 'react';
import { cookies } from 'next/headers';
import HomeClient from "@/components/HomeClient";

// Dynamically rendered so we can read the preloaderShown cookie per-request.
// This lets the server omit the Preloader from the HTML for returning visitors,
// preventing the hydration mismatch that caused the animation to replay on back navigation.
export default async function Home() {
  const cookieStore = await cookies();
  const initialPreloaderShown = !!cookieStore.get('preloaderShown')?.value;
  return (
    <Suspense>
      <HomeClient initialPreloaderShown={initialPreloaderShown} />
    </Suspense>
  );
}
