// types/global.d.ts
export {};

declare global {
  // Dodajemy własne pole do globalThis
  var __CHAT_CONTROLLERS: Map<string, ReadableStreamDefaultController> | undefined;
}
