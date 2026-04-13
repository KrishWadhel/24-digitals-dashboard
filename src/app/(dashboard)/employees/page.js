import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getEmployees, addEmployee, deleteEmployee } from "./actions";
import { UserCircle, Plus, Trash2, ShieldAlert } from "lucide-react";

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "senior")) {
    redirect("/");
  }

  const employees = await getEmployees();

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Employees</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage staff and senior accounts</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>Add New Employee</h3>
        <form action={addEmployee} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="text" name="name" className="input-field" placeholder="Employee Name" required style={{ flex: 1 }} />
            <input type="email" name="email" className="input-field" placeholder="Email Address" required style={{ flex: 1 }} />
            <select name="role" className="input-field" style={{ flex: 1 }}>
              <option value="employee">Standard Employee</option>
              <option value="senior">Senior/Admin</option>
            </select>
            <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
              <Plus size={18} /> Add User
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Note: New users are created with default password "password". They can log in immediately.</p>
        </form>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-secondary)", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>EMPLOYEE</th>
              <th style={{ padding: "1rem" }}>EMAIL</th>
              <th style={{ padding: "1rem" }}>ROLE</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ padding: "0.25rem", backgroundColor: "rgba(168, 85, 247, 0.2)", borderRadius: "4px", color: "#a855f7" }}>
                      <UserCircle size={16} />
                    </div>
                    {emp.name}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                    {emp.email}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "9999px", 
                      fontSize: "0.875rem",
                      backgroundColor: emp.role === "senior" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
                      color: emp.role === "senior" ? "#f87171" : "#4ade80",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      {emp.role === "senior" && <ShieldAlert size={14} />}
                      {emp.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    {emp.id !== "1" && (
                        <form action={deleteEmployee}>
                          <input type="hidden" name="id" value={emp.id} />
                          <button type="submit" style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", transition: "var(--transition)" }}>
                            <Trash2 size={18} />
                          </button>
                        </form>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
