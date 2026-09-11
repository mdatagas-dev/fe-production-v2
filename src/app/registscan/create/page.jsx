"use client";
import AlertError from "@/components/alert/error";
import FormRegist from "@/components/form/formRegisScan";
import fetchWithAuth from "@/lib/fetchWithAuth";
import apiBaseUrl from "@/lib/urlEndPoint";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import BtnBack from "@/components/btn/btnBack";
import AlertSuccess from "@/components/alert/success";

export default function RegistscanPage() {
  const [error, setError] = useState(null);
  const [finish, setFinish] = useState([]);
  const [alert, setAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);
  const [models, setModels] = useState({});
  const modalRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (finish.length > 0) {
      setShowForm(false);
      modalRef.current.showModal();
    }
  }, [finish]);

  const getModelChildren = async (data) => {
    if (data !== undefined) {
      const getData = data;
      const model = getData?.map((item) => item.model);
      setModels(model);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    const matchModel = models.includes(data.model);
    if (!matchModel) {
      setAlert("error");
      setAlertMsg("Model tidak di temukan");
      return;
    }
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

  useEffect(() => {
    getModelChildren();

    if (alert) {
      const time = setTimeout(() => {
        setAlert(null);
        setAlertMsg(null);
      }, 3000);
      return () => clearTimeout(time);
    }

    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      //request regist yang belum close
      const endPoint = `${apiBaseUrl}/registscan/checkregist`;
      const getResult = await fetchWithAuth(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          iduser: userId,
        },
      });
      setFinish(getResult?.data);
    };
    fetchData();
  }, [models, alert]);

  return (
    <div>
      {alert === "error" ? (
        <AlertError text={alertMsg} />
      ) : (
        <AlertSuccess text={alertMsg} />
      )}
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
      {showForm && (
        <FormRegist
          onSubmit={handleSubmit}
          handleModel={getModelChildren}
          load={"data"}
        />
      )}
    </div>
  );
}
