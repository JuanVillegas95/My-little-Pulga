

export const metadata = {
  title: "Studio",
  description: "Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
  );
}
