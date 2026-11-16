// jsdom ne fournit pas TextEncoder/TextDecoder, utilisés par react-router
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, { TextDecoder, TextEncoder });
