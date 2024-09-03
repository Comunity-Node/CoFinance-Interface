import ServerLayout from './ServerLayout';
import ClientWrapper from './RootLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ServerLayout>
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </ServerLayout>
  );
}
