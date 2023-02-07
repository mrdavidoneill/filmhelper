import { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/loading";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/discover");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return <Loading />;
}
