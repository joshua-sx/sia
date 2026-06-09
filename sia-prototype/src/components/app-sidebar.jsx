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
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        { title: "Overview", url: "#" },
        { title: "Action needed", url: "#" },
        { title: "Cycle health", url: "#" },
      ],
    },
    {
      title: "Appraisal Cycles",
      url: "#",
      icon: <FolderKanbanIcon />,
      items: [
        { title: "2026 Annual Cycle", url: "#" },
        { title: "Templates", url: "#" },
        { title: "Phase settings", url: "#" },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: <UsersRoundIcon />,
      items: [
        { title: "Directory", url: "#" },
        { title: "Reporting lines", url: "#" },
        { title: "Imports", url: "#" },
      ],
    },
    {
      title: "Goals",
      url: "#",
      icon: <GoalIcon />,
      items: [
        { title: "Goal review", url: "#" },
        { title: "Acknowledgments", url: "#" },
        { title: "AI writing help", url: "#" },
      ],
    },
    {
      title: "Reports & Audit",
      url: "#",
      icon: <FileTextIcon />,
      items: [
        { title: "Exports", url: "#" },
        { title: "Audit log", url: "#" },
        { title: "Permissions", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        { title: "Workspace", url: "#" },
        { title: "Notifications", url: "#" },
        { title: "Security", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Manager follow-ups",
      url: "#",
      icon: <ListChecksIcon />,
    },
    {
      name: "Overdue acknowledgments",
      url: "#",
      icon: <BellIcon />,
    },
    {
      name: "Locked records",
      url: "#",
      icon: <LockKeyholeIcon />,
    },
    {
      name: "Audit exports",
      url: "#",
      icon: <FileClockIcon />,
    },
    {
      name: "Help & support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
