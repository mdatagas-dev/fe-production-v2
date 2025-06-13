import fetchWithAuth from "@/lib/fetchWithAuth";
import { useRouter } from "next/navigation";

export default function BtnDelete({ endPoint }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const result = await fetchWithAuth(endPoint, {
        method: "DELETE",
      });
      router.push(`/scanview?alert=${result.message}`);
    } catch (error) {}
  };
  return (
    <>
      <button
        onClick={() => document.getElementById("my_modal_5").showModal()}
        className="btn btn-soft btn-error"
      >
        Delete
      </button>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirmation</h3>
          <p className="py-4">Are you sure you want to delete this data ?</p>
          <div className="modal-action">
            <button className="btn btn-soft btn-error" onClick={handleDelete}>
              Delete
            </button>
            <form method="dialog">
              <button className="btn btn-soft btn-warning">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
