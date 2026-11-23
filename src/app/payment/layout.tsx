import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { requireRole } from "@/lib/session";

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");

  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:py-16">{children}</main>
      <Footer />
    </>
  );
}
