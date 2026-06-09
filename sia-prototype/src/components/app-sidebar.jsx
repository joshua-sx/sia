"use client"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BellIcon,
  ClipboardCheckIcon,
  FileClockIcon,
  FileTextIcon,
  FolderKanbanIcon,
  GoalIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  Settings2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Anita Sharma",
    email: "HR Officer",
    avatar: "",
  },
  teams: [
    {
      name: "SIA",
      logo: <ShieldCheckIcon />,
      plan: "PJIA workspace",
    },
    {
      name: "SIA Beta",
      logo: <SparklesIcon />,
      plan: "Design partner",
    },
  ],
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        { id: "dashboard", title: "Overview" },
        { id: "goals", title: "Action needed" },
        { id: "cycle", title: "Cycle health" },
      ],
    },
    {
      id: "cycle",
      title: "Appraisal Cycles",
      icon: <FolderKanbanIcon />,
      items: [
        { id: "cycle", title: "2026 Annual Cycle" },
        { id: "cycle", title: "Templates" },
        { id: "settings", title: "Phase settings" },
      ],
    },
    {
      id: "people",
      title: "People",
      icon: <UsersRoundIcon />,
      items: [
        { id: "people", title: "Directory" },
        { id: "people", title: "Reporting lines" },
        { id: "people", title: "Imports" },
      ],
    },
    {
      id: "goals",
      title: "Goals",
      icon: <GoalIcon />,
      items: [
        { id: "goals", title: "Goal review" },
        { id: "people", title: "Acknowledgments" },
        { id: "goals", title: "AI writing help" },
      ],
    },
    {
      id: "reports",
      title: "Reports & Audit",
      icon: <FileTextIcon />,
      items: [
        { id: "reports", title: "Exports" },
        { id: "reports", title: "Audit log" },
        { id: "settings", title: "Permissions" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Settings2Icon />,
      items: [
        { id: "settings", title: "Workspace" },
        { id: "settings", title: "Notifications" },
        { id: "settings", title: "Security" },
      ],
    },
  ],
  projects: [
    {
      id: "goals",
      name: "Manager follow-ups",
      icon: <ListChecksIcon />,
    },
    {
      id: "people",
      name: "Overdue acknowledgments",
      icon: <BellIcon />,
    },
    {
      id: "reports",
      name: "Locked records",
      icon: <LockKeyholeIcon />,
    },
    {
      id: "reports",
      name: "Audit exports",
      icon: <FileClockIcon />,
    },
    {
      id: "settings",
      name: "Help & support",
      icon: <LifeBuoyIcon />,
    },
  ],
}

export function AppSidebar({ activeView, onNavigate, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain activeView={activeView} items={data.navMain} onNavigate={onNavigate} />
        <NavProjects activeView={activeView} onNavigate={onNavigate} projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
