import { DEFAULT_PRESET } from "../../packages/cosmo-pd101/src/lib/synth/presetStorage";

function analyze(obj: any, path = "") {
    const type = typeof obj;
    const stats = {
        path,
        type,
        keys: 0,
        children: 0,
        size: 0
    };

    if (obj === null) {
        stats.type = "null";
        return stats;
    }

    if (type === "object") {
        const keys = Object.keys(obj);
        stats.keys = keys.length;
        for (const key of keys) {
            stats.children++;
            const childStats = analyze(obj[key], path ? `${path}.${key}` : key);
            stats.size += childStats.size;
            // Note: this is a very simplified size estimate
        }
    }

    return stats;
}

console.log("Analyzing DEFAULT_PRESET...");
const stats = analyze(DEFAULT_PRESET);
console.log(JSON.stringify(stats, null, 2));
