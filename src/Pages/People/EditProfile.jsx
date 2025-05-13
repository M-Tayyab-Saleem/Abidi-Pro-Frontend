"use client";

import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // Optional icon for back

export default function EditProfile() {
  const navigate = useNavigate();

  const defaultProfile = {
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
      date: "",
    },
    education: {
      institute: "Bahria University, Karachi Campus",
      program: "Bachelors in Software Engineering",
      date: "2021 – Present",
    },
  };

  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(
    `https://picsum.photos/1200/200?random=${defaultProfile.id}`
  );
  const [profileImage, setProfileImage] = useState(defaultProfile.image);
  const [profilePreview, setProfilePreview] = useState(defaultProfile.image);
  const [about, setAbout] = useState(defaultProfile.about);
  const [educationList, setEducationList] = useState([
    { ...defaultProfile.education },
  ]);
  const [experienceList, setExperienceList] = useState([
    { ...defaultProfile.workExperience },
  ]);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const addEducation = () =>
    setEducationList([
      ...educationList,
      { institute: "", program: "", date: "" },
    ]);

  const removeEducation = (index) =>
    setEducationList(educationList.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperienceList([
      ...experienceList,
      { company: "", job: "", date: "", type: "Full time" },
    ]);

  const removeExperience = (index) =>
    setExperienceList(experienceList.filter((_, i) => i !== index));

  const handleSave = () => {
    console.log({
      profileImage,
      bannerImage,
      about,
      educationList,
      experienceList,
    });
    alert("Changes saved (simulated)!");
  };

  return (
    <div className="relative flex flex-col bg-primary text-text p-5 border m-8 rounded-xl shadow-sm min-h-[700px]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/people/profile")}
        className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md shadow-sm hover:bg-blue-200 transition"
      >
        <IoArrowBack className="text-lg" />
        Back
      </button>

      <h2 className="text-xl text-text font-semibold font-sans mb-4">
        Edit Your Profile
      </h2>

      {/* Banner */}
      <div className="relative h-32 mb-8">
        <img
          src={bannerPreview}
          alt="Banner Preview"
          className="w-full h-full object-cover rounded-2xl shadow-md"
        />
        <label className="absolute top-2 right-2 cursor-pointer">
          <span className="text-text bg-secondary rounded-full px-1 py-1 hover:bg-white">
            ✎
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerUpload}
          />
        </label>
        <img
          src={profilePreview}
          alt="Profile Preview"
          className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-2 border-white object-cover shadow-md"
        />
      </div>

      {/* Upload & Save Buttons */}
      <div className="bg-background mb-6 rounded-md p-4 flex gap-4 items-center mt-8">
        <label className="bg-text text-background font-medium border px-4 py-2 rounded-md cursor-pointer text-sm md:text-base whitespace-nowrap">
          Upload New Picture
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
          />
        </label>

        <button
          className="bg-primary text-text px-4 py-2 rounded-md hover:brightness-105 transition text-sm md:text-base whitespace-nowrap"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      {/* About */}
      <div className="bg-background rounded-md p-4 mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <textarea
          className="w-full p-2 border rounded-md text-sm bg-background"
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Education</h3>
            <button
              onClick={addEducation}
              className="rounded-md p-2 bg-blue-100 hover:bg-blue-200 transition"
              title="Add Education"
            >
              <FiPlus className="text-blue-800 text-xl" />
            </button>
          </div>
          {educationList.map((edu, idx) => (
            <div
              key={idx}
              className="relative bg-background rounded-md p-4 mb-4 shadow-sm"
            >
              {idx > 0 && (
                <button
                  onClick={() => removeEducation(idx)}
                  className="absolute top-2 right-3 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <FiX className="text-xl" />
                </button>
              )}
              <input
                type="text"
                placeholder="Institute Name"
                className="w-full mb-2 p-2 mt-4 border rounded-md text-sm bg-background"
                value={edu.institute}
                onChange={(e) =>
                  setEducationList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, institute: e.target.value } : item
                    )
                  )
                }
              />
              <input
                type="text"
                placeholder="Program"
                className="w-full mb-2 p-2 border rounded-md text-sm bg-background"
                value={edu.program}
                onChange={(e) =>
                  setEducationList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, program: e.target.value } : item
                    )
                  )
                }
              />
              <input
                type="text"
                placeholder="Date (DD/MM/YYYY)"
                className="w-full p-2 border rounded-md text-sm bg-background"
                value={edu.date}
                onChange={(e) =>
                  setEducationList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, date: e.target.value } : item
                    )
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* Experience */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Work Experience</h3>
            <button
              onClick={addExperience}
              className="rounded-md p-2 bg-blue-100 hover:bg-blue-200 transition"
              title="Add Experience"
            >
              <FiPlus className="text-blue-800 text-xl" />
            </button>
          </div>
          {experienceList.map((exp, idx) => (
            <div
              key={idx}
              className="relative bg-background rounded-md p-4 mb-4 shadow-sm"
            >
              {idx > 0 && (
                <button
                  onClick={() => removeExperience(idx)}
                  className="absolute top-2 right-3 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <FiX className="text-xl" />
                </button>
              )}
              <input
                type="text"
                placeholder="Company Name"
                className="w-full mb-2 p-2 mt-4 border rounded-md text-sm bg-background"
                value={exp.company}
                onChange={(e) =>
                  setExperienceList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, company: e.target.value } : item
                    )
                  )
                }
              />
              <input
                type="text"
                placeholder="Job Description"
                className="w-full mb-2 p-2 border rounded-md text-sm bg-background"
                value={exp.job}
                onChange={(e) =>
                  setExperienceList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, job: e.target.value } : item
                    )
                  )
                }
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Date (DD/MM/YYYY)"
                  className="w-full p-2 border rounded-md text-sm bg-background"
                  value={exp.date}
                  onChange={(e) =>
                    setExperienceList((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, date: e.target.value } : item
                      )
                    )
                  }
                />
                <select
                  className="w-40 p-2 bg-background text-text border rounded-md text-sm"
                  value={exp.type}
                  onChange={(e) =>
                    setExperienceList((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, type: e.target.value } : item
                      )
                    )
                  }
                >
                  <option>Full time</option>
                  <option>Part time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
