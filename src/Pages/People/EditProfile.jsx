import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";
import api from "../../axios";
import { toast } from "react-toastify";
import { Spin } from "antd";

export default function EditProfile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [about, setAbout] = useState("");
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });

        const user = res.data.user;
        setUser(user);
        setUserId(user._id);
        setAbout(user.about || "");
        setEducationList(user.education || []);
        setExperienceList(user.experience || []);
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        about,
        education: educationList.map((e) => ({
          institution: e.institution || e.institute || "",
          degree: e.degree || e.program || "",
          startYear: parseInt((e.date || "").split("–")[0]) || 0,
          endYear: parseInt((e.date || "").split("–")[1]) || 0,
        })),
        experience: experienceList.map((e) => {
          // Parse dates from date string or use existing dates
          let startDate = e.startDate ? new Date(e.startDate) : new Date();
          let endDate = e.endDate ? new Date(e.endDate) : null;
          
          // Try to parse from date string if available
          if (e.date) {
            const dateParts = e.date.split("–").map(d => d.trim());
            if (dateParts.length >= 1 && dateParts[0]) {
              try {
                startDate = new Date(dateParts[0]);
              } catch (err) {
                console.warn("Could not parse start date:", dateParts[0]);
              }
            }
            if (dateParts.length >= 2 && dateParts[1]) {
              try {
                endDate = new Date(dateParts[1]);
              } catch (err) {
                console.warn("Could not parse end date:", dateParts[1]);
              }
            }
          }
          
          return {
            company: e.company || "",
            jobType: e.type || "Full-time",
            description: e.job || e.description || "",
            startDate: startDate,
            endDate: endDate,
          };
        }),
      };

      await api.put(`/users/${userId}`, payload, {
        withCredentials: true,
      });
      toast.success("Profile updated successfully!");
      navigate("/people/profile");
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await api.post(`/users/${userId}/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the user with new avatar URL
      setUser(prev => ({ ...prev, avatar: response.data.avatarUrl }));
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile picture");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () =>
    setEducationList([...educationList, { institution: "", degree: "", date: "" }]);

  const removeEducation = (index) =>
    setEducationList(educationList.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperienceList([...experienceList, { company: "", job: "", date: "", type: "Full-time" }]);

  const removeExperience = (index) =>
    setExperienceList(experienceList.filter((_, i) => i !== index));

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <Spin size="large" tip="Loading profile..." />
    </div>
  }

  return (
    <div className="relative flex flex-col bg-transparent text-text p-4 rounded-[1.2rem] min-h-[700px]">
      {/* Back Button */}
        <button
          onClick={() => navigate("/people/profile")}
          className="absolute top-10 right-10 bg-white/30 backdrop-blur-lg text-slate-800 font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 hover:scale-105 text-sm ring-1 ring-white/20 z-50 flex items-center gap-2"
        >
          <IoArrowBack className="text-base" />
          Back
        </button>

      {/* Banner & Profile Pic */}
      <div className="relative h-28 rounded-lg overflow-hidden shadow-md mb-8">
        <img
          src={`https://picsum.photos/1200/200?random=${user._id}`}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative -mt-14 pl-6 z-10 mb-8">
        <div className="relative group">
          <img
            src={user.avatar || `https://randomuser.me/api/portraits/lego/${user?._id ? user._id.length % 10 : 1}.jpg`}
            alt={user?.name || "User"}
            className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-white"
          />
          <label
            htmlFor="avatar-upload-edit"
            className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <FiCamera className="text-white text-xl" />
          </label>
          <input
            id="avatar-upload-edit"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={loading}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-tight">Edit Your Profile</h2>

      {/* About */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[1.2rem] p-4 mb-6 shadow-md border border-white/50">
        <h3 className="font-semibold mb-3 text-sm text-slate-800 uppercase tracking-wide">About</h3>
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
          rows={5}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      {/* Education & Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-base text-slate-800 uppercase tracking-tight">Education</h3>
            <button
              onClick={addEducation}
              className="p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm"
              title="Add Education"
            >
              <FiPlus className="text-lg" />
            </button>
          </div>
          {educationList.map((edu, idx) => (
            <div
              key={idx}
              className="relative bg-white/90 backdrop-blur-sm rounded-[1.2rem] p-4 mb-4 shadow-md border border-white/50"
            >
              {idx > 0 && (
                <button
                  onClick={() => removeEducation(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove"
                >
                  <FiX className="text-lg" />
                </button>
              )}
              <input
                type="text"
                placeholder="Institution"
                className="w-full mb-3 p-3 mt-1 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                value={edu.institution || edu.institute}
                onChange={(e) =>
                  setEducationList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, institution: e.target.value } : item
                    )
                  )
                }
              />
              <input
                type="text"
                placeholder="Degree / Program"
                className="w-full mb-3 p-3 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                value={edu.degree || edu.program}
                onChange={(e) =>
                  setEducationList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, degree: e.target.value } : item
                    )
                  )
                }
              />
              <input
                type="text"
                placeholder="Year Range (e.g. 2018–2022)"
                className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                value={edu.date || `${edu.startYear}–${edu.endYear}`}
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-base text-slate-800 uppercase tracking-tight">Work Experience</h3>
            <button
              onClick={addExperience}
              className="p-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition shadow-sm"
              title="Add Experience"
            >
              <FiPlus className="text-lg" />
            </button>
          </div>
          {experienceList.map((exp, idx) => (
            <div
              key={idx}
              className="relative bg-white/90 backdrop-blur-sm rounded-[1.2rem] p-4 mb-4 shadow-md border border-white/50"
            >
              {idx > 0 && (
                <button
                  onClick={() => removeExperience(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Remove"
                >
                  <FiX className="text-lg" />
                </button>
              )}
              <input
                type="text"
                placeholder="Company Name"
                className="w-full mb-3 p-3 mt-1 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
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
                placeholder="Role or Description"
                className="w-full mb-3 p-3 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                value={exp.job || exp.description}
                onChange={(e) =>
                  setExperienceList((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, job: e.target.value } : item
                    )
                  )
                }
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Date (optional)"
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
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
                  className="w-40 p-3 bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  value={exp.type}
                  onChange={(e) =>
                    setExperienceList((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, type: e.target.value } : item
                      )
                    )
                  }
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
        <button
          className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}