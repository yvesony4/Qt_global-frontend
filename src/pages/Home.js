import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import moment from "moment";
import { GoPlusCircle } from "react-icons/go";
import Pagination from "../components/Pagination";
import PrintDataTable from "../components/Print";

// components

const Home = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const results = [];
  if (tasks) {
    for (let index = 0; index < tasks.length; index += 10) {
      results.push(tasks.slice(index, index + 10));
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);
  const onDelete = async (e, id) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    const response = await fetch("/api/tasks/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_TASK", payload: json });
    }
  };
  const onNext = () => {
    if (currentPage < results.length) {
      setData(results[currentPage]);
      setCurrentPage(currentPage + 1);
    }
  };
  const onPrevious = () => {
    if (currentPage !== 0 && currentPage <= results.length) {
      setCurrentPage(currentPage - 1);
      setData(results[currentPage]);
    }
  };
  useEffect(() => {
    if (results.length > 0) {
      setData(results[0]);
    }
  }, []);

  return (
    <div className="relative flex flex-wrap items-center justify-between bg-white shadow-md rounded-xl w-fit ">
      <table className="table-auto border bg-white p-5 rounded-md w-full">
        <thead>
          <tr>
            <th className="p-3">No#</th>
            <th className="p-3">Title</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Assignee</th>
            <th className="p-3">Selected Project</th>
            <th className="p-3">Description</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Update</th>
            <th className="p-3">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task, idx) => (
            <tr key={idx} className="border">
              <td className="p-5">{idx + 1}</td>
              <td className="p-5">{task.title}</td>
              <td className="p-5">{moment(task.startDate).format("ll")}</td>
              <td className="p-5">{moment(task.endDate).format("ll")}</td>
              <td className="p-5">{task.assignee}</td>
              <td className="p-5">{task.selectedProject}</td>
              <td className="p-4 m-2">{task.description}</td>
              <td className="p-4 m-2">{task.priority}</td>
              <td>
                <button className="p-4 border border-[#facc15] hover:bg-[#facc15] hover:text-white rounded-md bg-green">
                  <FaRegEdit />
                </button>
              </td>
              <td>
                <button
                  id={task.id}
                  className="p-4 border border-[#b91c1c] hover:text-white rounded-md bg-red hover:bg-[#b91c1c] hover:border-red"
                  onClick={(e) => {
                    onDelete(e, task._id);
                  }}
                >
                  <CiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full items-center p-3 flex flex-row justify-between">
        <div className="flex flex-col">
          <span className="mx-4">
            showing 1 to 10 out of {tasks && tasks.length} results
          </span>
          <div className="m-2">
            <nav aria-label="Page navigation example">
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      onPrevious();
                    }}
                    className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      onNext();
                    }}
                    className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div>
          <Link
            to="/add-task"
            className="flex items-center justify-between bg-[#65a30d] p-3 rounded-md text-white"
          >
            Add Record <GoPlusCircle />
          </Link>
        </div>
        <div>{tasks && <PrintDataTable tasks={tasks} />}</div>
      </div>
    </div>
  );
};

export default Home;
