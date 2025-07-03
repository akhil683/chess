import { Crown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { IPlayer } from "@/type";
import { formatDate } from "@/lib/utils";

export default function PlayerProgress({ player }: { player: IPlayer }) {
  return (
    <TabsContent value="progress">
      <Card>
        <CardHeader>
          <CardTitle>Rating Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Rating Journey
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {player.stats.ratingLow}
                  </p>
                  <p className="text-xs text-muted-foreground">Starting</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {player.rating}
                  </p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <Crown className="w-8 h-8 text-yellow-500" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {player.stats.ratingPeak}
                  </p>
                  <p className="text-xs text-muted-foreground">Peak</p>
                </div>
              </div>
            </div>

            {/* <div className="space-y-2"> */}
            {/*   <h4 className="font-medium">Rating History</h4> */}
            {/*   {player.ratingHistory.map((entry, index) => ( */}
            {/*     <div */}
            {/*       key={index} */}
            {/*       className="flex items-center justify-between p-2 rounded bg-muted/30" */}
            {/*     > */}
            {/*       <span className="text-sm">{formatDate(entry.date)}</span> */}
            {/*       <div className="flex items-center space-x-2"> */}
            {/*         <span className="font-medium">{entry.rating}</span> */}
            {/*         {index > 0 && ( */}
            {/*           <span */}
            {/*             className={`text-xs ${ */}
            {/*               entry.rating > player.ratingHistory[index - 1].rating */}
            {/*                 ? "text-green-600" */}
            {/*                 : entry.rating < */}
            {/*                     player.ratingHistory[index - 1].rating */}
            {/*                   ? "text-red-600" */}
            {/*                   : "text-gray-600" */}
            {/*             }`} */}
            {/*           > */}
            {/*             {entry.rating > */}
            {/*               player.ratingHistory[index - 1].rating && "+"} */}
            {/*             {entry.rating - player.ratingHistory[index - 1].rating} */}
            {/*           </span> */}
            {/*         )} */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   ))} */}
            {/* </div> */}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
