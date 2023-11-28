import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import moment from "moment";
import ReactToPrint from "react-to-print";

// Using a class component, everything works without issue
export class PrintableFormat extends React.PureComponent {
  render() {
    let tasks = this.props.tasks;
    return (
      <div>
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
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((task, idx) => (
                <tr key={idx} className="border">
                  <td className="p-5">{idx + 1}</td>
                  <td className="p-5">{task.title}</td>
                  <td className="p-5">{moment(task.startDate).format("ll")}</td>
                  <td className="p-5">{moment(task.endDate).format("ll")}</td>
                  <td className="p-5">{task.assignee}</td>
                  <td className="p-5">{task.selectedProject}</td>
                  <td className="p-4 m-2">{task.description}</td>
                  <td className="p-4 m-2">{task.priority}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default class PrintDataTable extends React.PureComponent {
  render() {
    let tasks = this.props.tasks;
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return (
              <a
                href="#"
                className="bg-[#d97706] p-3 text-white rounded-md border-[#d97706]"
              >
                Print this out!
              </a>
            );
          }}
          content={() => this.componentRef}
        />
        <div className="hidden">
          <PrintableFormat
            ref={(el) => (this.componentRef = el)}
            tasks={tasks}
          />
        </div>
      </div>
    );
  }
}
