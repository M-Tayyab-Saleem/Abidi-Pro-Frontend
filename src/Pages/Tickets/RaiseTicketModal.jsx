import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../axios";
import {toast } from "react-toastify";

const RaiseTicketModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    ticketID: "",
    subject: "",
    description: "",
    attachment: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const ticketData = new FormData();
      ticketData.append("ticketID", form.ticketID);
      ticketData.append("emailAddress", user.email); // ⬅️ match schema
      ticketData.append("subject", form.subject);
      ticketData.append("description", form.description);
      if (form.attachment) {
        ticketData.append("attachment", form.attachment); // will be converted in backend to attachments array
      }

      const response = await api.post("/tickets", ticketData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSubmit(response.data);
      onClose();
      toast.success("Ticket submitted successfully!");
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      toast.error(error.response?.data?.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch bg-black bg-opacity-50">
      <div className="bg-white w-75 sm:max-w-[90%] md:max-w-[500px] h-full p-6 shadow-xl transform transition-transform duration-300 translate-x-0 rounded-tl-3xl rounded-bl-3xl overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Raise a Ticket</h2>
          <button
            onClick={onClose}
            className="text-black text-lg font-bold hover:text-grey-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            <span className="block font-medium">Ticket ID:</span>
            <input
              name="ticketID"
              className="w-full border p-2 rounded"
              value={form.ticketID}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span className="block font-medium">Subject:</span>
            <input
              name="subject"
              className="w-full border p-2 rounded"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span className="block font-medium">Description:</span>
            <textarea
              name="description"
              className="w-full border p-2 rounded"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </label>

          <label>
            <span className="block font-medium">Attachment:</span>
            <input
              name="attachment"
              type="file"
              className="block w-full"
              onChange={handleChange}
            />
          </label>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#497a71] text-white hover:bg-[#99c7be] hover:text-black"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketModal;
