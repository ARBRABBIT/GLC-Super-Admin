import { useState } from "react";
import { MaintenanceNavbar } from "../components/MaintenanceNavbar";
import { ProjectsTimelineCard } from "../components/ProjectsTimelineCard";
import { ProjectDistributionCard } from "../components/ProjectDistributionCard";
import { OperationsOverviewCard } from "../components/OperationsOverviewCard";
import { PipelineStepper } from "../components/PipelineStepper";
import {
  INITIAL_PROJECTS_TIMELINE,
  INITIAL_PROJECT_DISTRIBUTION,
  INITIAL_PIPELINE_STAGES,
} from "../data/maintenanceData";
import type { ProjectTimelineItem } from "../types/maintenance.types";
import { toast } from "sonner";

export default function MaintenanceDashboard() {
  const [timelineItems] = useState<ProjectTimelineItem[]>(INITIAL_PROJECTS_TIMELINE);
  const [distribution] = useState(INITIAL_PROJECT_DISTRIBUTION);
  const [pipelineStages] = useState(INITIAL_PIPELINE_STAGES);

  const handleProjectClick = (project: ProjectTimelineItem) => {
    toast.info(`Inspecting ${project.title}`, {
      description: `Current Progress: ${project.progressPercentage}% (${project.status})`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <MaintenanceNavbar activeTab="dashboard" />

      {/* ── Main Dashboard Body (Full Screen) ─────────────────────────────── */}
      <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 flex flex-col">
        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[24px] sm:text-[30px] leading-tight text-[#1A1C1D] m-0">
            Maintenance Officer Dashboard
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[14px] sm:text-[15px] text-[#7A8699] font-normal mt-1 m-0">
            Manage and track Service Requests &amp; Work Orders across all mandals.
          </p>
        </div>

        {/* ── Top Row: 3 Modular Cards Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Projects Timeline (Span 4) */}
          <div className="lg:col-span-4 h-full">
            <ProjectsTimelineCard
              items={timelineItems}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* 2. Project Distribution Donut (Span 3) */}
          <div className="lg:col-span-3 h-full">
            <ProjectDistributionCard
              totalProjects={distribution.totalProjects}
              categories={distribution.categories}
            />
          </div>

          {/* 3. Operations Overview Area Chart (Span 5) */}
          <div className="md:col-span-2 lg:col-span-5 h-full">
            <OperationsOverviewCard initialYear={2026} />
          </div>
        </div>

        {/* ── Bottom Section: Pipeline Stepper ───────────────────────────────── */}
        <PipelineStepper stages={pipelineStages} />
      </main>
    </div>
  );
}
