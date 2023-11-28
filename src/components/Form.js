import { Dialog, Transition } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiSave } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const TaskForm = ({ edit = false }) => {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [usersList, setUsersList] = useState([]);
  const [update, setUpdate] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const [attachedFile, setAttachedFile] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/api/user/fetchUsers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      let _tmp = await res.json();
      setUsersList(_tmp);
    });
  }, []);
  const updateArray = (user) => {
    var _tmp = selectedUsers;
    if (_tmp.indexOf(user) !== -1) {
      _tmp.pop(user);
    } else {
      _tmp.push(user);
      setSelectedUsers(_tmp);
    }
    setUpdate(update + 1);
  };

  // const onChange = (e) => {
  //   setAttachedFile(e.target.files);
  // };

  const onCreate = async (e) => {
    e.preventDefault();
    let data = {
      title: name,
      startDate,
      endDate,
      assignee: selectedUsers.map((e) => e.fullNames)[0],
      selectedProject: projects,
      description,
      priority,
      // attachedFile: "testing",
    };
    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      alert("Error");
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-white p-5 rounded-xl flex-col w-1/2 justify-self-center">
          <div className="flex justify-between">
            <span className="font-bold">Create Task</span>
            <button className="flex items-center justify-between">
              <BiSave /> Save Draft
            </button>
          </div>
          <form onSubmit={onCreate} encType="multipart/form-data">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Name
              </label>
              <input
                className={`${
                  name !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="grid-first-name"
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              {name === "" && (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              )}
            </div>
            <div className="flex">
              <div className="w-full px-3 mb-6 md:mb-0 w-1/2">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Start Date
                </label>
                <input
                  className={`${
                    startDate !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                  } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                  type="date"
                  placeholder="Start Date"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
                {startDate === "" && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field.
                  </p>
                )}
              </div>
              <div className="w-full px-3 mb-6 md:mb-0 w-1/2">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  End Date
                </label>
                <input
                  className={`${
                    endDate !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                  } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                  id="grid-first-name"
                  type="date"
                  placeholder="End Date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
                {endDate === "" && (
                  <p className="text-red-500 text-xs italic">
                    Please fill out this field.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full px-3 mb-6 md:mb-0 w-1/2">
              <label className="">ASSIGNEE</label>
              <div className="grid grid-cols-2">
                {usersList.map((user, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`text-sm m-2  text-white ${
                      selectedUsers.indexOf(user) !== -1
                        ? "bg-[#22c55e]"
                        : "bg-black"
                    }`}
                    onClick={(e) => {
                      updateArray(user);
                    }}
                  >
                    {user.fullNames}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Projects
              </label>
              <input
                className={`${
                  projects !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="grid-first-name"
                type="text"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="Projects"
              />
              {projects === "" && (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              )}
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Description
              </label>
              <textarea
                maxLength={50}
                cols={50}
                className={`${
                  description !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="grid-first-name"
                placeholder="ADD MORE DETAILS TO THIS TASK"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {description === "" && (
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              )}
            </div>

            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Priority
            </h3>
            <ul className="flex justify-center items-center w-full text-sm font-medium justify-around">
              <li className="w-full">
                <div className="flex items-center ps-3">
                  <input
                    id="horizontal-list-radio-license"
                    type="radio"
                    value="LOW"
                    name="list-radio"
                    className="w-4 h-4 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="horizontal-list-radio-license"
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    Low
                  </label>
                </div>
              </li>
              <li className="w-full">
                <div className="flex items-center ps-3">
                  <input
                    id="horizontal-list-radio-id"
                    type="radio"
                    value="NORMAL"
                    name="list-radio"
                    className="w-4 h-4 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="horizontal-list-radio-id"
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    Normal
                  </label>
                </div>
              </li>
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div className="flex items-center ps-3">
                  <input
                    id="horizontal-list-radio-military"
                    type="radio"
                    value="HIGH"
                    name="list-radio"
                    className="w-4 h-4 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor="horizontal-list-radio-military"
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    High
                  </label>
                </div>
              </li>
            </ul>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Attach
              </label>
              <input
                className={`${
                  projects !== "" ? "border-[#22c55e]" : "border-[#ef4444]"
                } appearance-none block w-full text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                id="grid-first-name"
                type="file"
                accept=".png, .jpg, .jpeg"
                name="myFile"
              />
            </div>
            <div className="my-4 flex justify-end">
              <div>
                <button className="bg-white mx-4 border text-black">
                  Cancel
                </button>
                <button className="bg-blue">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
