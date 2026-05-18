import type { useSynthStore } from "@/features/synth/synthStore";
import type { PolyMode } from "@/lib/synth/bindings/synth";

export type { PolyMode };

export type UseSynthStateResult = ReturnType<typeof useSynthStore>;
