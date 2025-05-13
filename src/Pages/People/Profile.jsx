"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Mail,
  Briefcase,
  Phone,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const profileData = {
  topCards: [
    {
      title: "Department Head",
      id: "MD-005",
      name: "Musharraf Sajjad",
      role: "Chief Technology Officer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      title: "Manager",
      id: "KAR-033",
      name: "Murtaza Mehmood",
      role: "Software Developer",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ],
  employees: [
    {
      id: 1,
      name: "Murtaza Mehmood",
      role: "Manager",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      email: "mmehmood@datasolutions.com",
      phone: "03123456789",
      department: "Backend",
      location: "Lahore",
      timezone: "(GMT+05:00)",
      shift: "Evening",
      about:
        "Experienced full-stack developer with focus on backend systems and architecture.",
      workExperience: {
        designation: "Full Stack Developer",
        company: "DevCore Solutions",
        description: "Designed and maintained backend APIs and database models.",
        type: "Full-time",
      },
      education: {
        degree: "BS Computer Science",
        institute: "FAST NUCES",
        duration: "2016 – 2020",
      },
      reportingManager: "MD-005 - Musharraf Sajjad",
    },
    {
      id: "KAR-039",
      name: "Zara Ejaz",
      role: "Software Developer",
      location: "Karachi",
      department: "Software Development",
      timezone: "(GMT+05:00)",
      email: "zeja@datasolutions.com",
      shift: "General",
      phone: "03257459999",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      about:
        "I'm a Frontend Developer currently working at FastSolutions, passionate about clean UI, React, and accessibility.",
      workExperience: {
        designation: "Frontend Developer",
        company: "FastSolutions Pvt. Ltd.",
        description:
          "Worked on building responsive UIs using React, Tailwind, and integrated with backend services.",
        type: "Full-time",
      },
      education: {
        degree: "Bachelors in Software Engineering",
        institute: "Bahria University, Karachi Campus",
        duration: "2021 – Present",
      },
      reportingManager: "KAR-033 - Murtaza Mehmood",
    },
  ],
  defaultProfile: {
    id: "KAR-039",
    name: "Zara Ejaz",
    role: "Software Developer",
    location: "Karachi",
    department: "Software Development",
    timezone: "(GMT+05:00)",
    email: "zeja@datasolutions.com",
    shift: "General",
    phone: "03257459999",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    about:
      "I'm a Frontend Developer currently working at FastSolutions, passionate about clean UI, React, and accessibility.",
    workExperience: {
      designation: "Frontend Developer",
      company: "FastSolutions Pvt. Ltd.",
      description:
        "Worked on building responsive UIs using React, Tailwind, and integrated with backend services.",
      type: "Full-time",
    },
    education: {
      degree: "Bachelors in Software Engineering",
      institute: "Bahria University, Karachi Campus",
      duration: "2021 – Present",
    },
    reportingManager: "KAR-033 - Murtaza Mehmood",
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProfile, setActiveProfile] = useState(profileData.defaultProfile);

  const filteredEmployees = profileData.employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profileCards = [
    { icon: MapPin, label: "Location", value: activeProfile.location, bg: "bg-green-100", iconColor: "text-green-600" },
    { icon: Briefcase, label: "Department", value: activeProfile.department, bg: "bg-yellow-100", iconColor: "text-yellow-600" },
    { icon: Clock, label: "Time Zone", value: activeProfile.timezone, bg: "bg-orange-100", iconColor: "text-orange-600" },
    { icon: Mail, label: "Email ID", value: activeProfile.email, bg: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: Briefcase, label: "Shift", value: activeProfile.shift, bg: "bg-indigo-100", iconColor: "text-indigo-600" },
    { icon: Phone, label: "Work phone", value: activeProfile.phone, bg: "bg-green-100", iconColor: "text-green-600" },
  ];

  return (
    <div className="overflow-hidden bg-primary p-5 border m-4 shadow-sm min-h-[700px] border-none rounded-lg">
      {/* Top Cards */}
      <div className="bg-background p-4 border-0 rounded-lg mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.topCards.map((card, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <img src={card.image} alt={card.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <div className="font-medium text-heading">{card.title}</div>
                <div className="text-sm text-text">{`${card.id}- ${card.name}`}</div>
                <div className="text-sm text-text">{card.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 p-4 bg-background rounded-lg">
          <h2 className="font-medium mb-2 text-text">Employees</h2>
          <div className="relative mb-4 text-text">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-2 pr-8 py-1 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center space-x-3 cursor-pointer hover:bg-muted p-2 rounded-md"
                onClick={() => setActiveProfile(employee)}
              >
                <img src={employee.image} alt={employee.name} className="w-10 h-10 object-cover rounded-md" />
                <div>
                  <div className="text-sm font-medium text-text">{employee.role}</div>
                  <div className="text-xs text-text">{employee.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Profile */}
        <div className="flex-1 p-4 card bg-background rounded-lg">
          <div className="relative mb-5">
            <div className="relative h-24 rounded-lg overflow-hidden shadow-md">
              <img
                src={`https://picsum.photos/1200/200?random=${activeProfile.id}`}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              {activeProfile.id === profileData.defaultProfile.id && (
                <button
                  onClick={() => navigate("/people/edit-profile")}
                  className="absolute top-3 right-4 bg-white/30 backdrop-blur-lg text-text font-medium px-4 py-1.5 rounded-md shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 hover:scale-105 text-sm ring-1 ring-white/20"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="absolute top-12 left-6 z-10">
              <img
                src={activeProfile.image}
                alt={activeProfile.name}
                className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
              />
              <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white absolute bottom-0 right-0"></div>
            </div>

            {/* Info Card */}
            <div className="relative mt-4">
              <div className="card bg-secondary shadow rounded-md py-4 pr-4 pl-36 flex flex-wrap justify-between gap-2 sm:gap-4">
                <div className="flex flex-col min-w-0">
                  <p className="font-semibold text-text truncate sm:max-w-[250px]">
                    {activeProfile.id} - {activeProfile.name}
                  </p>
                  <p className="text-text truncate">{activeProfile.role}</p>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-text">Reporting to</p>
                  <p className="font-medium text-text text-opacity-80 break-words">
                    {activeProfile.reportingManager || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 card">
            {profileCards.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-secondary rounded-md shadow-sm">
                <div className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-text">{item.label}</div>
                  <div className="text-sm text-text">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="mb-6 card bg-secondary shadow p-2 rounded-lg">
            <h3 className="font-semibold mb-2 text-heading">About</h3>
            <p className="text-sm text-text">{activeProfile.about}</p>
          </div>

          {/* Work & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-purple-600 w-5 h-5" />
                <h3 className="text-lg font-semibold text-heading">Work Experience</h3>
              </div>
              <div className="text-sm text-text space-y-1">
                <div className="font-medium text-base text-text">{activeProfile.workExperience?.designation}</div>
                <div>{activeProfile.workExperience?.company}</div>
                <div className="text-s text-text">{activeProfile.workExperience?.description}</div>
                <div className="mt-2 text-sm italic text-text">{activeProfile.workExperience?.type}</div>
              </div>
            </div>

            <div className="bg-secondary p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="text-blue-600 w-5 h-5" />
                <h3 className="text-lg font-semibold text-heading">Education</h3>
              </div>
              <div className="text-sm text-text space-y-1">
                <div className="font-medium text-base text-text">{activeProfile.education?.degree}</div>
                <div>{activeProfile.education?.institute}</div>
                <div className="text-xs text-muted">{activeProfile.education?.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
