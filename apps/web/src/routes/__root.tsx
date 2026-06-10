import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "@topsun-status/ui/styles/globals.css?url";

export const Route = createRootRouteWithContext()({
  component: RootDocument,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      {
        href: `${import.meta.env.VITE_CDN_URL}/icon.svg`,
        rel: "icon",
        type: "image/svg+xml",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Acompanhe seus projetos — TOPSUN Energia",
      },
    ],
  }),
});

function RootDocument() {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="relative min-h-svh w-full">
          <div className="bg-primary absolute inset-x-2 top-2 -z-10 h-[64vh] overflow-hidden rounded-4xl md:h-[40vh]">
            <img
              alt="Sunny"
              className="absolute inset-0 hidden w-5xl -translate-x-48 -translate-y-48 2xl:block"
              src={`${import.meta.env.VITE_CDN_URL}/sunny.png`}
              fetchPriority="high"
            />
          </div>
          <div className="relative z-10 container mx-auto max-w-2xl px-4 py-12">
            <div className="mx-auto mb-12 w-full max-w-lg">
              <Link to="/">
                <img
                  alt="TOPSUN Energia"
                  className="mx-auto mb-6 w-[256px]"
                  src={`${import.meta.env.VITE_CDN_URL}/logo.png`}
                  fetchPriority="high"
                />
              </Link>
            </div>

            <Outlet />
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
