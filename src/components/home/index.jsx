import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import axios from "axios";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [images, setImages] = useState(null);
  const [tabs, setTabs] = useState({
    name_en: "",
    name_ru: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const url = "https://autoapi.dezinfeksiyatashkent.uz/api/categories";
  const imgUrl = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    setIsModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleFileChange = (event) => {
    setImages(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name_en", tabs.name_en);
    formData.append("name_ru", tabs.name_ru);
    formData.append("images", images);
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    let requestConfig = {
      url: url,
      method: "POST",
      data: formData,
      headers: headers,
    };
    if (editingCategoryId) {
      requestConfig = {
        ...requestConfig,
        url: `${url}/${editingCategoryId}`,
        method: "PUT",
      };
    }
    axios(requestConfig)
      .then((res) => {
        if (res && res.data) {
          message.success("Operation successful");
          setData((prevData) => {
            const newData = [...prevData];
            const existingIndex = newData.findIndex(
              (category) => category.id === editingCategoryId
            );
            if (existingIndex !== -1) {
              newData[existingIndex] = res.data;
            } else {
              newData.push(res.data);
            }
            return newData;
          });
          setIsModalOpen(false);
          setEditingCategoryId(null);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Error");
      });
  };

  const handleDelete = (categoryId) => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    axios({
      url: `${url}/${categoryId}`,
      method: "DELETE",
      headers: headers,
    })
      .then((res) => {
        if (res && res.data) {
          message.success("Category deleted successfully");
          setData(data.filter((category) => category.id !== categoryId));
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Error deleting category");
      });
  };

  const handleEdit = (categoryId) => {
    const categoryToEdit = data.find((category) => category.id === categoryId);
    if (categoryToEdit) {
      setTabs({
        name_en: categoryToEdit.name_en,
        name_ru: categoryToEdit.name_ru,
      });
      setEditingCategoryId(categoryId);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="h-full flex flex-col gap-[100px]">
      <div>
        {data.map((category) => (
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
            <button
              className="w-[50px] border-2 bg-red-500 text-white rounded-lg p-1"
              onClick={() => handleDelete(category.id)}
            >
              Delete
            </button>
            <button
              className="w-[50px] border-2 bg-blue-500 text-white rounded-lg p-1"
              onClick={() => handleEdit(category.id)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button type="primary" onClick={showModal}>
          Add
        </Button>
        <Modal
          title={editingCategoryId ? "Edit" : "Add"}
          visible={isModalOpen}
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
                placeholder="text en"
                value={tabs.name_en}
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <input
                onChange={(e) => setTabs({ ...tabs, name_ru: e.target.value })}
                type="text"
                placeholder="text ru"
                value={tabs.name_ru}
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <input
                onChange={handleFileChange}
                type="file"
                className="w-[300px] h-[60px] border-2 border-black px-[10px] py-[20px] rounded-xl"
              />
              <button
                onClick={() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }}
                type="submit"
                className="border-2 border-black w-[120px] rounded-2xl px-[10px] py-[5px]"
              >
                {editingCategoryId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
