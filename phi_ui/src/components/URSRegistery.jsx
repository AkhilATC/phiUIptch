import { useEffect, useState } from "react";

export default function URSRegistry() {
  const [ursList, setUrsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchURS() {
      try {
        const res = await fetch("http://0.0.0.0:5990/urs-agent/urs");
        const data = await res.json();
        setUrsList(data.data);
      } catch (err) {
        console.error("Failed to load URS", err);
      } finally {
        setLoading(false);
      }
    }

    fetchURS();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📋 URS Registry</h2>

      {loading && <p>Loading URS documents...</p>}

      {!loading && ursList.length === 0 && (
        <p>No URS documents found.</p>
      )}

      {!loading && ursList.length > 0 && (
        <table className="border w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Version</th>
            </tr>
          </thead>
          <tbody>
            {ursList.map((urs) => (
              <tr key={urs.id}>
                <td className="border p-2">{urs.name}</td>
                <td className="border p-2">{urs.created_by}</td>
                <td className="border p-2">
                  {new Date(urs.created_at).toLocaleString()}
                </td>
                <td className="border p-2">{urs.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
