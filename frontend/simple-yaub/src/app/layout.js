export default function RootLayout({ children }) {
  return (
      <html>
      <body>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      <title>{'Yet Another Useless | Blog'}</title>
      {children}
      </body>
      </html>
  );
}
