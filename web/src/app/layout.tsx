'use client'

import './globals.css'
import { Provider } from 'react-redux'
import store from './lib/redux/store'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  useEffect(() => {
    const regex = /\/spreadsheets\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

    window.addEventListener("popstate", (e) => {
      if (regex.test(pathname) && !regex.test((e.target as Window).location.pathname)) {
        e.preventDefault();
        var r = confirm("You pressed a Back button! Are you sure?!");
        if (r) {
          history.back();
        } else {
          history.pushState(null, "", pathname);
        }
      }
    });

    window.addEventListener("beforeunload", (e) => {
      if (regex.test(pathname)) {
        e.preventDefault();
        alert("you have unsaved changes");
      }
    });
  }, [pathname])

  return (
    <html lang="en">
      <Provider store={store}>
        <body>{children}</body>
      </Provider>
    </html>
  )
}
