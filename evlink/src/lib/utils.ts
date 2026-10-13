export { cn } from "cn"

export function getInitials(name: string | null) {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}