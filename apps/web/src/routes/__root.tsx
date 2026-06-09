import { IconHelpFilled } from "@tabler/icons-react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Button } from "@topsun-status/ui/components/button";

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
        href: "/icon.svg",
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
          <div className="bg-primary absolute inset-0 -z-10 h-[33vh] w-full overflow-hidden">
            <img
              alt="Sunny"
              className="absolute inset-0 w-5xl -translate-x-48 -translate-y-48 lg:block"
              src="/sunny.png"
            />
          </div>
          <div className="relative z-10 container mx-auto max-w-2xl px-4 py-12">
            <div className="mx-auto mb-12 w-full max-w-lg">
              <Link to="/">
                <img
                  alt="TOPSUN Energia"
                  className="mx-auto mb-6 w-[256px]"
                  src="/logo.png"
                />
              </Link>
            </div>

            <Outlet />

            <Button
              className="h-12 w-full text-base font-bold"
              variant="outline"
            >
              <IconHelpFilled />
              Dúvidas? Fale com a TOPSUN no WhatsApp!
            </Button>
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
