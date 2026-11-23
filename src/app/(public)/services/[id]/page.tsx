import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, House, MapPin, Store, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { RepairRequestPanel, type Viewer } from "@/components/services/repair-request-panel";
import { UserAvatar } from "@/components/shared/user-avatar";
import { isRole, ROLE_LABELS } from "@/lib/roles";
import { getService } from "@/lib/services-api";
import { getSession } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const details = await getService(id);
  return { title: details ? details.service.title : "Service not found" };
}

function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;

  const details = await getService(id);
  if (!details) notFound();
  const { service, technician } = details;

  const session = await getSession();
  let viewer: Viewer = { kind: "guest" };
  if (session) {
    const role = isRole(session.user.role) ? session.user.role : "customer";
    viewer =
      role === "customer"
        ? { kind: "customer", name: session.user.name, email: session.user.email, phone: session.user.phone ?? "" }
        : { kind: "blocked", roleLabel: ROLE_LABELS[role] };
  }

  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

  return (
    <Container className="py-8 sm:py-12">
      <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to all services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-tint px-3 py-1 text-sm font-semibold text-primary">{service.category}</span>
            <h1 className="text-3xl font-bold sm:text-4xl">{service.title}</h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Fact icon={Clock} label="Estimated duration" value={service.estimatedDuration} />
            <Fact icon={ModeIcon} label="Service mode" value={service.serviceMode} />
            <Fact icon={MapPin} label="Service area" value={service.serviceArea} />
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">About this service</h2>
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">{service.description}</p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Your technician</h2>
            <div className="flex items-start gap-4 rounded-xl border bg-card p-5">
              <UserAvatar name={technician.name} image={technician.image} className="size-16" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-lg font-semibold">{technician.name}</p>
                {technician.area ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" aria-hidden /> {technician.area}
                  </p>
                ) : null}
                <p className="mt-1 text-muted-foreground">
                  {technician.bio || "This technician has not added a bio yet."}
                </p>
              </div>
            </div>
          </section>
        </div>

        <RepairRequestPanel
          serviceId={service._id}
          basePrice={service.basePrice}
          estimatedDuration={service.estimatedDuration}
          viewer={viewer}
        />
      </div>
    </Container>
  );
}
