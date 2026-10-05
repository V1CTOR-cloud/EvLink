export function formatDate(value: string | null) {
    if (!value) {
        return null;
    }

    return new Date(value).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}