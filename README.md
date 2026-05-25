# sonner-toast

[npm version](https://www.npmjs.com/package/sonner-toast)
[license](https://github.com/nunesunil/sonner-toast/blob/main/LICENSE)

An opinionated toast component for React 19. API and styling are compatible with [Sonner](https://sonner.emilkowal.ski/) — use the same `toast()` calls, `<Toaster />` props, and `data-sonner-*` CSS hooks.

## Features

- Stacked toasts with swipe-to-dismiss and expand-on-hover
- Promise toasts (`loading` → `success` / `error`)
- Action and cancel buttons
- Light, dark, and system theme
- Multiple positions and optional multiple toasters
- `useSonner()` for headless / custom UIs
- Full TypeScript types

## Install

```bash
pnpm add sonner-toast
npm install sonner-toast
yarn add sonner-toast
```

**Peer dependencies:** `react` and `react-dom` ^19.

## Quick start

Styles load automatically when you import from the package (Vite, Next.js, webpack, etc. follow the CSS side-effect in `dist/index.js`). No separate stylesheet import is required.

Render a toaster and fire a toast:

```tsx
import { Toaster, toast } from "sonner-toast";

export function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <button type="button" onClick={() => toast("Changes saved")}>
        Show toast
      </button>
    </>
  );
}
```

### Next.js / RSC

`Toaster` and `toast` are client-only. Place `<Toaster />` in a Client Component (e.g. `app/providers.tsx` with `"use client"`). Importing `sonner-toast` in that file is enough for styles — your bundler picks up the package CSS automatically.

If styles are missing (unusual bundler setups), import the stylesheet explicitly:

```ts
import "sonner-toast/style.css";
```

## `toast` API


| Method                             | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| `toast(message, options?)`         | Default toast                                |
| `toast.success(message, options?)` | Success variant                              |
| `toast.error(message, options?)`   | Error variant                                |
| `toast.info(message, options?)`    | Info variant                                 |
| `toast.warning(message, options?)` | Warning variant                              |
| `toast.loading(message, options?)` | Loading variant (no auto-dismiss by default) |
| `toast.message(message, options?)` | Alias for default                            |
| `toast.promise(promise, data)`     | Loading → success/error flow                 |
| `toast.custom(jsx, options?)`      | Fully custom content                         |
| `toast.dismiss(id?)`               | Dismiss one toast or all                     |
| `toast.getToasts()`                | Active toasts                                |
| `toast.getHistory()`               | Internal toast list                          |


All methods return a toast `id` (except `dismiss` / getters). Reusing the same `id` in `options` updates an existing toast instead of duplicating it.

### Examples

**Typed variants**

```tsx
toast.success("Profile updated");
toast.error("Something went wrong", { description: "Try again in a minute." });
```

**Promise**

```tsx
toast.promise(saveSettings(), {
  loading: "Saving…",
  success: "Saved",
  error: "Failed to save",
});
```

**Action button**

```tsx
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => undo(),
  },
});
```

**Custom duration / dismiss**

```tsx
toast("Pinned", { duration: Infinity });
toast.dismiss(toastId);
```

**Custom UI**

```tsx
toast.custom((id) => (
  <div>
    Custom toast {id}
  </div>
));
```

### `ExternalToast` options

Common fields: `id`, `description`, `duration`, `icon`, `closeButton`, `dismissible`, `position`, `className`, `classNames`, `style`, `onDismiss`, `onAutoClose`, `toasterId`, `richColors`, `invert`, `action`, `cancel`, `unstyled`, `testId`.

## `<Toaster />`


| Prop                 | Default              | Description                                                                           |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `position`           | `"bottom-right"`     | `top-left`, `top-right`, `bottom-left`, `bottom-right`, `top-center`, `bottom-center` |
| `theme`              | `"light"`            | `"light"`, `"dark"`, or `"system"`                                                    |
| `expand`             | `false`              | Expand stack on hover                                                                 |
| `richColors`         | `false`              | Stronger type colors                                                                  |
| `closeButton`        | `false`              | Show close button on toasts                                                           |
| `duration`           | `4000`               | Default auto-close (ms); use `Infinity` to persist                                    |
| `visibleToasts`      | `3`                  | Max visible stacked toasts                                                            |
| `gap`                | `14`                 | Gap between toasts (px)                                                               |
| `offset`             | viewport padding     | Offset from screen edges                                                              |
| `mobileOffset`       | `16px`               | Offset on small screens                                                               |
| `invert`             | `false`              | Invert toast colors                                                                   |
| `hotkey`             | `["altKey", "KeyT"]` | Expand/focus toaster                                                                  |
| `dir`                | auto                 | `"ltr"`, `"rtl"`, or `"auto"`                                                         |
| `id`                 | —                    | Scope toasts to this toaster (`toasterId` on toast)                                   |
| `toastOptions`       | —                    | Defaults passed to every toast                                                        |
| `icons`              | —                    | Override success/info/warning/error/loading/close icons                               |
| `className`, `style` | —                    | Styles on the toast list                                                              |
| `swipeDirections`    | from `position`      | Allowed swipe dismiss directions                                                      |


```tsx
<Toaster
  theme="system"
  position="top-center"
  expand
  richColors
  closeButton
  toastOptions={{ duration: 5000 }}
/>
```

## `useSonner()`

Subscribe to the toast store without rendering `<Toaster />` — useful for custom layouts or debugging.

```tsx
import { useSonner } from "sonner-toast";

function ToastDebugger() {
  const { toasts } = useSonner();
  return <pre>{JSON.stringify(toasts.map((t) => t.id), null, 2)}</pre>;
}
```

You still need `<Toaster />` somewhere if you want the default UI.

## Styling

Default styles are bundled with the JS entry (`import './style.css'` in the published build). You can also import `sonner-toast/style.css` directly when you want explicit control (e.g. link tags, strict CSP). Selectors match Sonner (`[data-sonner-toaster]`, `[data-sonner-toast]`, `.sonner-*`). Override via:

- `className` / `toastOptions.className` on `<Toaster />`
- `classNames` on toasts (`toast`, `title`, `description`, `actionButton`, etc.)
- `unstyled` for unstyled toasts
- Global CSS targeting `data-sonner-*` attributes

## Exports

```ts
import {
  toast,
  Toaster,
  useSonner,
  type ToasterProps,
  type ExternalToast,
  type ToastT,
  type ToastClassnames,
  type ToastToDismiss,
  type Action,
} from "sonner-toast";
```

## Development

```bash
pnpm install
pnpm run build      # dist/
pnpm run typecheck
pnpm run dev        # watch build
```

## License

MIT — see [LICENSE](LICENSE).