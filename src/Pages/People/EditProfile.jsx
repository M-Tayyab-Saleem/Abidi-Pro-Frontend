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
        experience: experienceList.map((e) => ({
          company: e.company || "",
          jobType: e.type || "Full-time",
          description: e.job || e.description || "",
          startDate: new Date(),
          endDate: null,
        })),
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
    <div className="relative flex flex-col bg-primary text-text p-5 border m-8 rounded-xl shadow-sm min-h-[700px]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/people/profile")}
        className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md shadow-sm hover:bg-blue-200 transition"
      >
        <IoArrowBack className="text-lg" />
        Back
      </button>

      {/* Banner & Profile Pic */}
      <div className="relative h-24 rounded-lg overflow-hidden shadow-md mb-10">
        <img
          src={`https://picsum.photos/1200/200?random=${user._id}`}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative -mt-14 pl-6 z-99 mb-10">
        <div className="relative group">
          <img
            src={user.avatar || `https://randomuser.me/api/portraits/lego/${user?._id ? user._id.length % 10 : 1}.jpg`}
            alt={user?.name || "User"}
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white"
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


      <h2 className="text-xl text-text font-semibold font-sans mb-4">Edit Your Profile</h2>

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
                placeholder="Institution"
                className="w-full mb-2 p-2 mt-4 border rounded-md text-sm bg-background"
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
                className="w-full mb-2 p-2 border rounded-md text-sm bg-background"
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
                className="w-full p-2 border rounded-md text-sm bg-background"
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
                placeholder="Role or Description"
                className="w-full mb-2 p-2 border rounded-md text-sm bg-background"
                value={exp.job || exp.description}
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
                  placeholder="Date (optional)"
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
      <div className="flex justify-end mt-6">
        <button
          className={`bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}



