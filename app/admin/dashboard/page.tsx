import { getLeaderboard } from "@/actions/getLeaderboard";
import AdminDashboard from "@/components/admin/admin-dashboard.component";

export default async function AdminPage() {
  const players = await getLeaderboard();
  return <AdminDashboard allPlayers={players} />;
}
