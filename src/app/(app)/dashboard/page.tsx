import DashboardSpaceCardSkeleton from "@/components/Skeleton/DashboardSpaceCard";
import CreateSpaceButton from "@/components/Space/CreateSpaceButton";
import ListStreams from "@/components/Space/ListSpace";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getSession } from "next-auth/react";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

async function Dashboard() {
  return (
    <div className="flex justify-center">
      <div className="main_container" style={{ height: "calc(100vh - 128px)" }}>
        <h1>
          <span className="text-2xl font-bold">Your Spaces</span>
        </h1>
        {/* <Suspense fallback={<DashboardSpaceCardSkeleton />}>
          <ListStreams />
        </Suspense> */}
      </div>
    </div>
  );
}

export default Dashboard;
