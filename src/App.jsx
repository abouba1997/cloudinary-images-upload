import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  file: "",
};

const URL = "https://cloudinary-image-upload-98d9b0404442.herokuapp.com";

const App = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setFetchLoading(true);
        const result = await axios.get(`${URL}/api/uploads`);
        // setImages(result?.data?.resources); // From cloudinary
        console.log(result);
        setImages(result?.data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
      setFormData({ ...formData, file: uploadedFile });
    } else {
      setFile(null);
      setFormData({ ...formData, file: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        toast.info("Veuillez ajouter un fichier.");
        return;
      }
      setLoading(true);
      const data = new FormData();
      data.append("myfile", formData.file);
      const result = await axios.post(`${URL}/api/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData(initialState);
      setFile(null);

      toast.success(result?.data?.message);
      // Refetch images after successful upload
      const resultImages = await axios.get(`${URL}/api/uploads`);
      setImages(resultImages?.data?.resources);
    } catch (error) {
      console.error(error);
      toast.info(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto my-auto p-4">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-center mb-3">
            Ajout d&apos;un nouveau image
          </h2>
          <form onSubmit={handleSubmit} className="w-full md:max-w-md mx-auto">
            <div className="flex items-center justify-center w-full mb-3 flex-col">
              {file && (
                <div id="preview-container" className="mb-3 h-72">
                  <img
                    src={file}
                    alt="Uploaded Image"
                    className="object-cover h-full w-full rounded-md"
                  />
                </div>
              )}
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex items-center justify-between px-4">
                  <div className="w-1/12">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-col text-center w-11/12">
                    <span className="font-semibold">
                      Ajouter une image ou glisser et deposer l&apos;image
                    </span>
                    <span> SVG, PNG, JPG</span>
                  </div>
                </div>
                <input
                  id="file"
                  type="file"
                  name="file"
                  className="opacity-0 absolute"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                {loading ? "uploading..." : "Televerser l'image"}
              </button>
            </div>
          </form>
        </div>

        <div className="max-w-screen-lg mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fetchLoading ? (
            "Loading..."
          ) : (
            <>
              {images.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-52 object-cover hover:object-scale-down hover:cursor-pointer transition-all duration-500"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
