import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { NotFoundState } from "@/components/shared/not-found-state";

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
