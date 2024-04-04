import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate()
  const url = "https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin";
  const [data, setData] = useState({
    phone_number: "",
    password: "",
  });
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      phone_number: data.phone_number,
      password: data.password,
    };
    console.log(data);
    try {
      const response = await Axios.post(url, userData);
      console.log(response);
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error(error);
    }

    Axios.post(url, userData).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h2>Sign in</h2>
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-[30px]"
        >
          <input
            onChange={(e) => setData({ ...data, phone_number: e.target.value })}
            type="number"
            id="number"
            placeholder="your number"
            className="w-[500px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
          />
          <input
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="your password"
            type="password"
            id="password"
            className="w-[500px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
          />
          <button
            type="submit"
            className="border-2 border-black w-[120px] rounded-2xl px-[10px] py-[5px]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
