"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "../../../firbase/clientApp"; // Adjust the import path as needed
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function TeamSwitcher({ className, onTeamSelect }) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem("selectedTeam", selectedTeam.id);
    }
  }, [selectedTeam]);

  React.useEffect(() => {
    async function fetchTeams() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const teamsList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTeams(teamsList);
      setSelectedTeam(teamsList[0]);
      onTeamSelect(teamsList[0]);
    }
    fetchTeams();
  }, []);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedTeam?.profilePictureUrl}
                alt={selectedTeam?.firstName}
                className="grayscale"
              />
              <AvatarFallback>
                {selectedTeam?.firstName.charAt(0)}
                {selectedTeam?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {selectedTeam?.firstName} {selectedTeam?.lastName}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => {
                    setSelectedTeam(team);
                    onTeamSelect(team);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={team.profilePictureUrl}
                      alt={team.firstName}
                      className="grayscale"
                    />
                    <AvatarFallback>
                      {team.firstName.charAt(0)}
                      {team.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {team.firstName} {team.lastName}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTeam?.id === team.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            {/* <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList> */}
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
