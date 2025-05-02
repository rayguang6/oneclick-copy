import { getLoggedInUser } from "@/app/lib/actions/auth.actions";

export default async function Home() {
  const user = await getLoggedInUser();
  return <div>Home</div>;
}
