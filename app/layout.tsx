import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'كشري هند | طلبات الأونلاين ولائحة الطعام',
  description: 'الموقع الرسمي لمطعم كشري هند - اطلب أفضل طبق كشري وطواجن في مصر أونلاين مع خدمة التوصيل السريع ولائحة التحكم والإدارة.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-[#fcfbf7] text-slate-900 min-h-screen antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
