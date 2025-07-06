import SessionWrapper from "@/components/sessionWrapper";

export default function RootLayout({ children }) {
  return (
      <html>
      <body>
      <SessionWrapper>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      <title>{'Yet Another Useless | Blog'}</title>
      {children}
      </SessionWrapper>
      </body>
      </html>
  );
}
