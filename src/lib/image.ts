export function normalizeImageSrc(image: unknown): string {
    const raw = typeof image === "string" ? image.trim() : "";
    if (!raw) return "";

    // Keep already-good sources
    if (raw.startsWith("data:image/")) return raw;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

    // If it already points to /images/, keep it (but flatten accidental /images/assets/)
    if (raw.startsWith("/images/")) {
        return raw.replace(/^\/images\/assets\//, "/images/");
    }

    // Extract the filename from legacy stored paths like:
    // - "@/assets/product-coir-block.jpg"
    // - "src/assets/product-coir-block.jpg"
    // - "/assets/product-coir-block-ABCD1234.jpg"
    let filename = raw.split("?")[0].split("#")[0].split("/").pop();
    if (!filename) return raw;

    // Strip Vite hash suffixes: name-<hash>.ext -> name.ext
    const hashSuffix = /^(.*)-[a-zA-Z0-9]{8,}(\.(?:png|jpe?g|webp|gif|svg))$/;
    const match = filename.match(hashSuffix);
    if (match) {
        filename = `${match[1]}${match[2]}`;
    }

    return `/images/${filename}`;
}
