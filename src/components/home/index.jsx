import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import axios from "axios";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const url = "https://autoapi.dezinfeksiyatashkent.uz/api/categories";
  const imgUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error fetching data:", error));
    console.log(data);
  }, []);

  const [images, setImages] = useState(null);

  const handleFileChange = (event) => {
    setImages(event.target.files[0]);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData) {
      tabs(storedData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name_en", e.target.value);
    formData.append("name_ru", e.target.value);
    formData.append("images", images);
    const authTtoken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authTtoken}`,
    };
    axios({
      url: url,
      method: "POST",
      data: formData,
      headers: headers,
    })
      .then((res) => {
        if (res && res.data) {
          message.success("Ok");
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Error");
      });
  };
  return (
    <div className="h-full flex flex-col gap-[100px]">
      <div>
        {data?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-center gap-[10px]"
          >
            <img
              className="w-[90px] h-[40px]"
              src={`${imgUrl}${category.image_src}`}
              alt=""
            />
            <h2>{category.id}</h2>
            <h2>{category.name_en}</h2>
            <h2>{category.name_ru}</h2>
            <h2>{category.created_at}</h2>
            <button className="w-[50px] border-2 bg-red-500 text-white rounded-lg p-1">
              Delet
            </button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button type="primary" onClick={showModal}>
          Add
        </Button>
        <Modal
          title="Add"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col gap-[30px]"
            >
              <input
                onChange={(e) => setTabs({ ...tabs, name_en: e.target.value })}
                type="text"
                placeholder="text uz"
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <input
                onChange={(e) => setTabs({ ...tabs, name_ru: e.target.value })}
                type="text"
                placeholder="text uz"
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <input
                onChange={handleFileChange}
                type="file"
                placeholder="text uz"
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <button
                type="submit"
                className="border-2 border-black w-[120px] rounded-2xl px-[10px] py-[5px]"
              >
                Adds
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
