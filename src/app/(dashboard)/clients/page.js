import { getClients, addClient, deleteClient } from "./actions";
import { Users, Plus, Trash2 } from "lucide-react";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Clients</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your client portfolio</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>Add New Client</h3>
        <form action={addClient} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="text" name="name" className="input-field" placeholder="Client Name (e.g. Sompro)" required style={{ flex: 2 }} />
            <input type="number" name="postsRequired" className="input-field" placeholder="Posts Required" required style={{ flex: 1 }} />
            <input type="number" name="reelsRequired" className="input-field" placeholder="Reels Required" required style={{ flex: 1 }} />
            <input type="number" name="carouselsRequired" className="input-field" placeholder="Carousels Required" required style={{ flex: 1 }} />
            <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
              <Plus size={18} /> Add Client
            </button>
          </div>
        </form>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-secondary)", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>CLIENT NAME</th>
              <th style={{ padding: "1rem" }}>REQUIRED (P/R/C)</th>
              <th style={{ padding: "1rem" }}>STATUS</th>
              <th style={{ padding: "1rem" }}>ADDED ON</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  No clients found. Add one above.
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ padding: "0.25rem", backgroundColor: "rgba(59, 130, 246, 0.2)", borderRadius: "4px", color: "var(--accent-blue)" }}>
                      <Users size={16} />
                    </div>
                    {client.name}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                    {client.postsRequired} / {client.reelsRequired} / {client.carouselsRequired}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "9999px", 
                      fontSize: "0.875rem",
                      backgroundColor: client.status === "active" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: client.status === "active" ? "#4ade80" : "#f87171" 
                    }}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <form action={deleteClient}>
                      <input type="hidden" name="id" value={client.id} />
                      <button type="submit" style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", transition: "var(--transition)" }}>
                        <Trash2 size={18} />
                      </button>
                    </form>
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
