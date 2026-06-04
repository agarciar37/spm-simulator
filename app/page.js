"use client";

import Header from "@/components/Header";
import DashboardCards from "@/components/DashboardCards";
import DemandForm from "@/components/DemandForm";
import DemandList from "@/components/DemandList";
import ProjectList from "@/components/ProjectList";
import DemoActions from "@/components/DemoActions";
import StatsChart from "@/components/StatsChart";
import { useAppContext } from "@/context/AppContext";

export default function HomePage() {
  const { message } = useAppContext();

  return (
    <>
      <Header />
      <DashboardCards />

      {message && <div className="message-box">{message}</div>}

      <div className="grid-main">
        <div className="left-column">
          <DemoActions />
          <DemandForm />
        </div>

        <div className="right-column">
          <StatsChart />
        </div>
      </div>

      <DemandList />
      <ProjectList />
    </>
  );
}