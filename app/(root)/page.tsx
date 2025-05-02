import { getLoggedInUser } from "../lib/actions/auth.actions"

export default async function Home() {
  const user = await getLoggedInUser()
  return (
    <div>
      <h1>Hello {user?.email}</h1>
    </div>
  )
}