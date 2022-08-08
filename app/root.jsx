import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getEnv } from "./env.server";

export const links = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }) {
  return json({
    user: await getUser(request),
    ENV: getEnv(),
  });
}

export default function App() {
  const data=useLoaderData()
   console.log(ENV)
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />

        <Links />
      </head>

      <body className="h-full">
        <Outlet />

        <ScrollRestoration />

        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data.ENV
            )}`,
          }}
/>
        <LiveReload />
      </body>
    </html>
  );
}
