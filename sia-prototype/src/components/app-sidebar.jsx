"use client"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  CalendarClockIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
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
      plan: "PJIAE workspace",
    },
  ],
  navMain: [
    {
      id: "overview",
      title: "Overview",
      icon: <LayoutDashboardIcon />,
    },
    {
      id: "employees",
      title: "Employees",
      icon: <UsersRoundIcon />,
    },
    {
      id: "appraisal-cycle",
      title: "Appraisal Cycle",
      icon: <CalendarClockIcon />,
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
        <SidebarGroup>
          <SidebarGroupLabel>HR</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeView === item.id}
                  tooltip={item.title}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
