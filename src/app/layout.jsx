import "./globals.css";

export const metadata = {
  title: "HydroCarbon Visualizer",
  description: "Interactive OOP visualizer for hydrocarbon inheritance and polymorphism."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
