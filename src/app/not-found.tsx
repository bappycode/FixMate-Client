import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NotFoundState } from "@/components/shared/not-found-state";

// The 404 page for any unknown route on the public site. It carries its own navbar and
// footer, because the root layout only provides the <html> and <body>.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <NotFoundState href="/" linkLabel="Back to Home" />
      </main>
      <Footer />
    </>
  );
}
