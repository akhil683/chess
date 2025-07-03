import { getLeaderboard } from "@/actions/getLeaderboard";
import AdminDashboard from "@/components/admin/admin-dashboard.component";
import { getRecentMatches } from "@/actions/getRecentMatches";

export default async function AdminPage() {
  const { data: recentMatches } = await getRecentMatches();
  const players = await getLeaderboard();
  return <AdminDashboard allPlayers={players} initialMatches={recentMatches} />;
}
