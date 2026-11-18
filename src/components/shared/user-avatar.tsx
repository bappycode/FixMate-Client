import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

type UserAvatarProps = {
  name: string;
  image?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function UserAvatar({ name, image, size = "default", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback className="bg-tint font-semibold text-primary">{initialsOf(name)}</AvatarFallback>
    </Avatar>
  );
}
