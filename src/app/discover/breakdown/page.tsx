"use client";

import { useEffect, useState } from "react";
import { Role, Results, RoleId, isRoleId } from "@/lib/types";
import { error } from "console";

type RoleWithScore = Role & {score: number};

export default function BreakdownPage() {
  const [results, setResults] = useState<Results | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sortedRoles, setSortedRoles] = useState<RoleWithScore[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | null>(null);

  useEffect(() => {
    async function fetchData(){
      try {
        //fetch user results
        const resResults = await fetch("/api/userResults?userId=24601");
        if(!resResults.ok) throw new Error("Failed to fetch user results");
        const resultsData: Results = await resResults.json()

        //fetch all roles
        const resRoles = await fetch("/api/roles");
        if(!resRoles.ok) throw new Error("Failed to fetch roles");
        const rolesData:{roles: Role[]} = await resRoles.json();

        setResults(resultsData);
        setRoles(rolesData.roles);

        //combine results with scores and filter only valid RoleIds
        const rolesWithScores: RoleWithScore[] = rolesData.roles
          .filter(role => isRoleId(role.id))          
          .map((role) => ({
          ...role, 
          score: resultsData[role.id] ?? 0,
        }));

        rolesWithScores.sort((a,b) => b.score - a.score);
      
        setSortedRoles(rolesWithScores);
        setSelectedRoleId(rolesWithScores[0]?.id ?? null);

    } catch(error) {
      console.error(error);
    }
  }
    fetchData();
  }, [])

  //Loading state
  if(!results|| sortedRoles.length == 0 || !selectedRoleId) return <div>Loading...</div>;

  //core and peripheral
  const coreRoles = sortedRoles.slice(0,4).map(r => r.id);
  const peripheralRoles = sortedRoles.slice(-3).map(r => r.id);

  function getRoleAlignment(roleId: RoleId){
    if (coreRoles.includes(roleId)) return "core";
    if (peripheralRoles.includes(roleId)) return "peripheral";
    return "moderate";
  }

  const selectedRole = sortedRoles.find(r => r.id === selectedRoleId);
  const highestScore = sortedRoles[0].score;
  const lowestScore = sortedRoles[sortedRoles.length - 1].score

  //description based on alignment and ranking
  function getRoleDescription(role: RoleWithScore){
    const alignment = getRoleAlignment(role.id);

    if(role.score === highestScore) return role.top_rank_desc;
    if(role.score === lowestScore) return role.bottom_rank_desc;
    if(alignment === "core") return role.high_rank_desc;
    if(alignment === "peripheral") return role.low_rank_desc;
    return role.role_desc;
  }

  return(
    <div className="p-4 max-w-5xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Role Breakdown for User 24601</h1>

    {/* Horizontal role bar */}
    <div className="flex overflow-x-auto space-x-4 mb-6">
      {sortedRoles.map((role) => {
        const alignment = getRoleAlignment(role.id);
        const bgColor =
          alignment === "core"
            ? "bg-blue-500 text-white"
            : alignment === "peripheral"
            ? "bg-gray-300"
            : "bg-yellow-200";

        const isSelected = role.id === selectedRoleId;

        return (
          <button
            key={role.id}
            className={`px-4 py-2 rounded ${role.id === selectedRoleId ? "ring-2 ring-black" : ""} ${bgColor}`}
            onClick={() => setSelectedRoleId(role.id)}
          >
            {role.name}
          </button>
        );
      })}
    </div>

    {/* Selected role details */}
    {selectedRole && (
      <div className="p-6 border rounded bg-gray-50">
        <h2 className="text-2xl font-semibold">{selectedRole.name}</h2>
        <p className="text-gray-700 mt-2 font-medium">Score: {selectedRole.score}</p>
        <p className="mt-4 text-gray-800">{getRoleDescription(selectedRole)}</p>
        <p className="mt-2 italic text-sm">Alignment: {getRoleAlignment(selectedRole.id)}
        </p>
      </div>
    )}
  </div>
);
}

