import { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/loading";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    router.push("/");
  }, [router]);

  return <Loading />;
}
