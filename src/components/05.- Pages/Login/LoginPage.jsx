import { AuthLayout } from "../../04.- Templates/AuthLayout";
import { LoginBox } from "../../03.- Organisms/LoginBox";
import "./LoginPage.css"; 

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginBox />
    </AuthLayout>
  );
};