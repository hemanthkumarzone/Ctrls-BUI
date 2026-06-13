import AuthNavbar from "../../components/marketing/AuthNavbar";
import AuthFooter from "../../components/marketing/AuthFooter";

const AuthLayout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">

      <AuthNavbar />

      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      <AuthFooter />

    </div>
  );
};

export default AuthLayout;