import { getClients, addClient } from "./actions";
import { Plus } from "lucide-react";
import ClientsClient from "./ClientsClient";

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await getClients();
  console.log("SERVER LOG - fetched clients:", clients);

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Clients</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your client portfolio</p>
        </div>
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      <div className="panel" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>Quick Add Client</h3>
        <form action={addClient} style={{ display: "flex", gap: "1rem" }}>
          <input type="text" name="name" className="input-field" placeholder="Client Name" required style={{ flex: 2 }} />
          <input type="number" name="postsRequired" className="input-field" placeholder="Posts" required style={{ flex: 1 }} />
          <input type="number" name="reelsRequired" className="input-field" placeholder="Reels" required style={{ flex: 1 }} />
          <input type="number" name="carouselsRequired" className="input-field" placeholder="Carousels" required style={{ flex: 1 }} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>Create</button>
        </form>
      </div>

      <ClientsClient initialClients={clients} />
    </div>
  );
}
