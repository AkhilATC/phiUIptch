import { useEffect, useState } from "react";

export default function URSRegistry() {
  const [ursList, setUrsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchURS() {
      try {
        const res = await fetch("http://0.0.0.0:5990/urs-agent/urs");
        const data = await res.json();
        console.log(data.data)
        setUrsList(data.data || []);
      } catch (err) {
        console.error("Failed to load URS", err);
      } finally {
        setLoading(false);
      }
    }

    fetchURS();
  }, []);

  function downloadURS(id) {
    // Example download URL
    window.open(`http://0.0.0.0:5990/urs-agent/urs/${id}/download`, "_blank");
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-3">📋 URS Registry</h2>

      {loading && <p>Loading URS documents...</p>}

      {!loading && ursList.length === 0 && <p>No URS documents found.</p>}

      {!loading && ursList.length > 0 && (
        <table className="border w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">URS ID</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Created On</th>
              <th className="border p-2 text-center">Download</th>
            </tr>
          </thead>

          <tbody>
            {ursList.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="border p-2 font-mono">{u._id}</td>

                <td className="border p-2">
                  <StatusBadge status={u.status} />
                </td>

                <td className="border p-2">
                  {new Date(u.created_on).toLocaleString()}
                </td>

                <td className="border p-2 text-center">
                  {u.workflow_status ? (
                    <button
                      onClick={() => downloadURS(u._id)}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                      title="Download URS PDF"
                    >
                      ⬇️
                    </button>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }) {
  let color = "bg-gray-300 text-black";

  if (status === "Approved") color = "bg-green-200 text-green-800";
  if (status === "DRAFT") color = "bg-yellow-200 text-yellow-800";
  if (status === "Rejected") color = "bg-red-200 text-red-800";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
