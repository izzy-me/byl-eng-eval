"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Role, Results, RoleId, isRoleId } from "@/lib/types";


type RoleWithScore = Role & { score: number };
const navItems = ["core", "intermediate", "peripheral"] as const;
type NavItem = (typeof navItems)[number];


export default function BreakdownPage() {
  const [results, setResults] = useState<Results | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sortedRoles, setSortedRoles] = useState<RoleWithScore[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | null>(null);
  const [selectedNav, setSelectedNav] = useState<NavItem>("core");



  useEffect(() => {
    async function fetchData() {
      try {
        //fetch user results
        const resResults = await fetch("/api/userResults?userId=24601");
        if (!resResults.ok) throw new Error("Failed to fetch user results");
        const resultsData: Results = await resResults.json()

        //fetch all roles
        const resRoles = await fetch("/api/roles");
        if (!resRoles.ok) throw new Error("Failed to fetch roles");
        const rolesData: { roles: Role[] } = await resRoles.json();

        setResults(resultsData);
        setRoles(rolesData.roles);

        //combine results with scores and filter only valid RoleIds
        const rolesWithScores: RoleWithScore[] = rolesData.roles
          .filter(role => isRoleId(role.id))
          .map((role) => ({
            ...role,
            score: resultsData[role.id] ?? 0,
          }));

        rolesWithScores.sort((a, b) => b.score - a.score);

        setSortedRoles(rolesWithScores);
        setSelectedRoleId(rolesWithScores[0]?.id ?? null);

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [])

  //Loading state
  if (!results || sortedRoles.length == 0 || !selectedRoleId) return <div>Loading...</div>;

  //core and peripheral
  const coreRoles = sortedRoles.slice(0, 4).map(r => r.id);
  const peripheralRoles = sortedRoles.slice(-3).map(r => r.id);

  function getRoleAlignment(roleId: RoleId) {
    if (coreRoles.includes(roleId)) return "core";
    if (peripheralRoles.includes(roleId)) return "peripheral";
    return "intermediate";
  }

  // Update selectedNav when a role is clicked
  function handleRoleClick(roleId: RoleId) {
    setSelectedRoleId(roleId);
    const alignment = getRoleAlignment(roleId);
    setSelectedNav(alignment);
  }

  const selectedRole = sortedRoles.find(r => r.id === selectedRoleId);
  if (!selectedRole) return <div>Loading role...</div>;

  const highestScore = sortedRoles[0].score;
  const lowestScore = sortedRoles[sortedRoles.length - 1].score

  //description based on alignment and ranking
  function getRoleDescription(role: RoleWithScore) {
    return role.role_desc;
  }

  //get "most like when"
  function getMostLikeWhen(role: RoleWithScore){
    return role.most_like_when;
  }

  //get core drive
  function getCoreDrive(role: RoleWithScore){
    return role.core_drive;
  }

  //get understanding role alignment
  function getUnderstandingRoleAlignment(role: RoleWithScore){
    const alignment = getRoleAlignment(role.id);
    if (role.score === highestScore) return role.top_rank_desc;
    if (role.score === lowestScore) return role.bottom_rank_desc;
    if (alignment === "core") return role.high_rank_desc;
    if (alignment === "peripheral") return role.low_rank_desc;
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f5f0] font-sans text-[#10131a]">
      <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#fde68a]/70 blur-3xl" />
      <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-[#a5b4fc]/40 blur-3xl" />
      <div className="absolute -bottom-30 left-1/3 h-80 w-80 rounded-full bg-[#fecdd3]/60 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-20 sm:px-10">
        <section className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6b7280]">
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Your Breakdown
          </h1>
        </section>

        {/* Navigation bar for role alignment */}
        <section className="flex border-b border-gray-300 mb-4 space-x-6">
          {navItems.map(item => {
            const isSelected = item === selectedNav;
            return (
              <button
                key={item}
                onClick={() => setSelectedNav(item)}
                className={`pb-2 font-semibold ${isSelected
                    ? "text-black border-b-2 border-gray-700"
                    : "text-gray-500"
                  }`}
              >
                {`${item.charAt(0).toUpperCase() + item.slice(1)} Roles`}
              </button>
            );
          })}
        </section>
        {/* Role bar */}
        <section className="overflow-x-auto">
          <div className="flex w-max gap-4">
            {sortedRoles.map(role => {
              const alignment = getRoleAlignment(role.id);
              const bgColor =
                alignment === "core"
                  ? "bg-blue-500 text-white"
                  : alignment === "peripheral"
                    ? "bg-gray-300"
                    : "bg-yellow-200";

              const isSelected = role.id === selectedRoleId;

              // Calculate position on the Low-High scale (0-100)
              const minScore = lowestScore;
              const maxScore = highestScore;
              const normalizedPosition = ((role.score - minScore) / (maxScore - minScore)) * 100;


              return (
                <button
                  key={role.id}
                  className={`flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border shadow-sm text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    isSelected 
                      ? "w-40 scale-110 border-black/30 bg-white ring-2 ring-black font-bold" 
                      : "w-32 bg-white/60"
                  }`}
                  onClick={() => handleRoleClick(role.id)}
                >
                  <Image
                    src={`/roles/${role.id}.svg`}
                    alt={`${role.name} symbol`}
                    width={isSelected ? 48 : 36}
                    height={isSelected ? 48 : 36}
                  />
                  <span className={isSelected ? "text-base" : ""}>{role.name}</span>
                  
                  {/* Alignment bar */}
                  <div className="w-full mt-1">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full">
                      <div 
                        className="absolute top-0 h-1.5 bg-gradient-to-r from-red-400 to-green-500 rounded-full"
                        style={{ width: `${normalizedPosition}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected role details */}
        <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <h2 className="text-2xl font-semibold">{selectedRole.name}</h2>
          <p className="mt-4 text-gray-800">{getRoleDescription(selectedRole)}</p>

          {/* You Feel Most Like You When */}
          
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">You Feel Most Like You When...</h2>
              <p className="mt-2 text-gray-800">{getMostLikeWhen(selectedRole)}</p>
            </div>
          
          
          {/* Core Drive */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold">Core Drive</h2>
              <p className="mt-2 text-gray-800">{selectedRole.core_drive}</p>
            </div>
            

            </section>

            {/* Role Alignment Card */}
        <section className="rounded-[28px] border border-black/10 bg-white/80 p-8 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10">
          <h2 className="text-3xl font-semibold mb-8">Role Alignment</h2>
          
          {/* Alignment Scale */}
          <div className="relative mb-12">
            {/* Labels */}
            <div className="flex justify-between text-lg text-gray-600 mb-4">
              <span>Low</span>
              <span>Neutral</span>
              <span>High</span>
            </div>
            
            {/* Gradient bar */}
            <div className="relative h-32 rounded-3xl overflow-visible bg-gradient-to-r from-red-100 via-yellow-100 to-green-200">
              {/* Neutral divider line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 -translate-x-1/2" />
              
              {/* Score indicator */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                style={{ left: `${((selectedRole.score - lowestScore) / (highestScore - lowestScore)) * 100}%` }}
              >
                <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-gray-800">
                  <span className="text-4xl font-bold text-gray-900">{selectedRole.score}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Understanding text */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Understanding Your {getRoleAlignment(selectedRole.id) === "core" ? "High" : getRoleAlignment(selectedRole.id) === "peripheral"} Role Alignment
            </h3>
            <p className="text-gray-800 text-lg">
           {getUnderstandingRoleAlignment(selectedRole)}</p>

            
          </div>
        </section>
        </main>
        </div>
  );  
        
}