import { serverApi } from "@/lib/api-server";
import CareerPathClient from "./client";
import { TestQuestion } from "@/types/api";

export default async function CareerPathPage() {
  let test4Questions: TestQuestion[] = [];
  let test5Questions: TestQuestion[] = [];

  try {
    // Fetch test 4 and test 5 questions server-side
    const [test4Response, test5Response] = await Promise.all([
      serverApi.getTest(4),
      serverApi.getTest(5),
    ]);

    if (test4Response.data?.questions) {
      test4Questions = test4Response.data.questions;
    }

    if (test5Response.data?.questions) {
      test5Questions = test5Response.data.questions;
    }
  } catch (error) {
    console.error("Error fetching career path test questions:", error);
  }

  return (
    <CareerPathClient
      test4Questions={test4Questions}
      test5Questions={test5Questions}
    />
  );
}
