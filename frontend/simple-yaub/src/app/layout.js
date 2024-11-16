export default function RootLayout({ children }) {
  return (
      <html>
      <body>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      <title>{'YAUB'}</title>
      {children}
      </body>
      </html>
  );
}
