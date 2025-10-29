import SigninComponent from "@/components/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | CCED Universitas Lampung",
  description: "Masuk ke Dashboard CCED Universitas Lampung",
};

export default function SigninPage() {
  return (
    <>
      <SigninComponent />
    </>
  );
}
