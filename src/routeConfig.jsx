export const moduleConfigs = {
  people: {
    basePath: "/people",
    subNavbarKey: "people",
    links: [
      { name: "Home", path: "/people" },
      { name: "Time Tracker", path: "/people/timetracker" },
      { name: "Files", path: "/people/files" },
      { name: "Profile", path: "/people/profile" },
      { name: "Leave Tracker", path: "/people/leaveTracker" },
      { name: "Admin", path: "/people/leaveTrackerAdmin" },
    ],
  },
  leave: {
    basePath: "/leave",
    subNavbarKey: "leave",
    links: [
      { name: "Leave Summary", path: "/leave" },
      { name: "Leave Request", path: "/leave/timetracker" },
      { name: "Leave Management", path: "/leave/leaveTrackerAdmin" },
    ],
  },
  file: {
    basePath: "/file",
    subNavbarKey: "file",
    links: [
      { name: "Shared with me", path: "/file" },
      { name: "Shared with Role", path: "/role" },
    ],
  },
  time: {
    basePath: "/time",
    subNavbarKey: "time",
    links: [
      { name: "Time Tracker", path: "/time" },
      { name: "Approve Timelogs", path: "/role" },
    ],
  },
  ticket: {
    basePath: "/ticket",
    subNavbarKey: "ticket",
    links: [
      { name: "Raise Ticket", path: "/time" },
      { name: "All Tickets", path: "/role" },
    ],
  },
   project: {
    basePath: "/project",
    subNavbarKey: "project",
    links: [
      { name: "Project DashBoard", path: "/project/projectDashboard" },
      { name: "Projects", path: "/project/projects" },
      { name: "Project", path: "/project/projectDetailed" },
    ],
  },
};
