import Header from "@/components/Header/Header";
import LineBanner from '@/components/LineBanner';

export default function RootLayout({ children }) {
  return (
    <>
      <LineBanner />
      <Header isLogin={children.props.isLogin} brandCheck={children.props.brandCheck} />
      {children}
    </>
  );
}


