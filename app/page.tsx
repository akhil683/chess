import HomeLeaderboard from "@/components/Home/home.component";
import { getLeaderboard } from "./actions/getLeaderboard";

export default async function Home() {
  const leaderboard = await getLeaderboard();
  return (
    <section className="flex justify-center items-center">
      <HomeLeaderboard leaderboard={leaderboard} />
    </section>
  );
}
