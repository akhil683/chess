import { IPlayer } from "@/type";
import { useState } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface PlayerSelectorProps {
  players: IPlayer[];
  selectedPlayerId: string;
  onPlayerSelect: (playerId: string) => void;
  placeholder: string;
  excludePlayerId?: string;
  label: string;
}

export default function PlayerSelector({
  players,
  selectedPlayerId,
  onPlayerSelect,
  placeholder,
  excludePlayerId,
  label,
}: PlayerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedPlayer = players.find(
    (player) => player.rollNumber === selectedPlayerId,
  );
  const availablePlayers = players.filter(
    (player) => player.rollNumber !== excludePlayerId,
  );

  const filteredPlayers = availablePlayers.filter((player) => {
    const searchTerm = searchValue.toLowerCase();
    return (
      player.name.toLowerCase().includes(searchTerm) ||
      player.department.toLowerCase().includes(searchTerm) ||
      player.rollNumber.toLowerCase().includes(searchTerm) ||
      player.rating.toString().includes(searchTerm)
    );
  });
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPlayer ? (
              <div className="flex items-center justify-between w-full">
                <span>{selectedPlayer.name}</span>
                <span className="text-muted-foreground">
                  ({selectedPlayer.rating})
                </span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search players..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No players found.</CommandEmpty>
              <CommandGroup>
                {filteredPlayers.map((player: IPlayer) => (
                  <CommandItem
                    key={player.rollNumber}
                    value={player.rollNumber}
                    onSelect={() => {
                      onPlayerSelect(player.rollNumber);
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPlayerId === player.rollNumber
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.department} • {player.rollNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{player.rating}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.stats.totalGames} games
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
