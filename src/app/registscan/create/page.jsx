"use client";
import AlertError from "@/components/alert/error";
import FormRegist from "@/components/form/formRegisScan";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useRef, useState, useEffect } from "react";
import BtnBack from "@/components/btn/btnBack";

export default function RegistscanPage() {
  const [error, setError] = useState(null);
  const [finish, setFinish] = useState([]);
  const modalRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("accessToken");
      const decode = jwtDecode(token);

      const endPoint = `${apiBaseUrl}/registscan/checkregist`;
      const getResult = await fetchWithAuth(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          iduser: decode.id,
        },
      });
      setFinish(getResult.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(finish);
    if (finish.length > 0) {
      setShowForm(false);
      modalRef.current.showModal();
    }
  }, [finish]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/registscan/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (result.error) {
        setError(result.error);
        const timeout = setTimeout(() => {
          setError(null);
        }, 3000);
        return () => clearTimeout(timeout);
      }
      e.target.reset();
      router.push("/registscan?alert=Data Successfuly saved");
    } catch (error) {
      console.log(error.message);
      setError(error);
    }
  };

  return (
    <div>
      <dialog
        id="my_modal_5"
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Harap lengkapi record berikut!</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Plan</th>
                <th>Scan</th>
              </tr>
            </thead>
            <tbody>
              {finish.map((item) => (
                <tr key={item.id}>
                  <td>{item.model}</td>
                  <td>{item.plan}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="modal-action">
            <form method="dialog">
              <BtnBack url="/registscan" />
            </form>
          </div>
        </div>
      </dialog>
      {error && <AlertError text={error} />}
      {showForm && <FormRegist onSubmit={handleSubmit} />}
    </div>
  );
}
