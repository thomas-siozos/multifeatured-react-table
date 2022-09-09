import MultifeaturedTable from "./MultifeaturedTable";
import './App.css';
import {MOCK_DATA} from "./mockData";

const columns = [
  {
    id: "employee_id",
    header: "Employee ID",
    accessorKey: "employee_id",
    enableGlobalFilter: false
  },
  {
    id: "first_name",
    header: "First Name",
    accessorKey: "first_name"
  },
  {
    id: "last_name",
    header: "Last Name",
    accessorKey: "last_name"
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email"
  },
  {
    id: "gender",
    header: "Gender",
    accessorKey: "gender"
  },
  {
    id: "job_title",
    header: "Job Title",
    accessorKey: "job_title"
  },
  {
    id: "start_date",
    header: "Starting Date",
    accessorKey: "start_date"
  },
  {
    id: "salary",
    header: "Salary",
    accessorKey: "salary",
    enableGlobalFilter: false
  }
];

function App() {
  return (
    <MultifeaturedTable
        columns={columns}
        data={MOCK_DATA}
    />
  );
}

export default App;
