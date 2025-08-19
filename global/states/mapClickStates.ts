// global/states/mapClickState.ts
import { atom } from "recoil";

export type MapClick = { lat: number; lng: number } | null;

export const mapClickState = atom<MapClick>({
  key: "mapClickState",
  default: null,
});