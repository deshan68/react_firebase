import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firbase-config";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setmovieList] = useState([]);
  const moviesCollection = collection(db, "moveis");

  // new movie State
  const [newMovieTitile, setNewMovieTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(true);

  //update title State
  const [updateTitle, setUpdaleTitle] = useState("");

  //file upload State
  const [fileUpload, setFileUpload] = useState();

  const getMovieList = async () => {
    //read the data
    //set the movie list
    try {
      const data = await getDocs(moviesCollection);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setmovieList(filterData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollection, {
        title: newMovieTitile,
        releaseDate: releaseDate,
        RecievedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser.uid,
      });
      getMovieList();
    } catch (err) {
      console.log(err);
    }
  };
  const updatetitle = async (id) => {
    const movieDoc = doc(db, "moveis", id);
    await updateDoc(movieDoc, { title: updateTitle });
    getMovieList();
  };

  const deletMovie = async (id) => {
    const movieDoc = doc(db, "moveis", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const fileFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFolderRef, fileUpload);
      alert("uploaded");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Auth></Auth>
      <input
        placeholder="Movie title"
        onChange={(e) => setNewMovieTitle(e.target.value)}
      />
      <input
        placeholder="Release Date"
        type={"number"}
        onChange={(e) => setReleaseDate(Number(e.target.value))}
      />
      <input
        type={"checkbox"}
        value={isNewMovieOscar}
        onChange={(e) => setIsNewMovieOscar(e.target.value)}
      />
      <label>Recieved An Oscar</label>
      <button onClick={onSubmitMovie}>Submit Movie</button>
      <div>
        {movieList.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid lightsalmon",
              padding: "12px",
              marginBottom: "5px",
            }}
          >
            <h1>{movie.title}</h1>
            <p>{movie.releaseDate}</p>
            <button onClick={() => deletMovie(movie.id)}>Dlete Movie</button>
            <input
              onChange={(e) => setUpdaleTitle(e.target.value)}
              placeholder="New Title"
            />
            <button onClick={() => updatetitle(movie.id)}> Update Title</button>
          </div>
        ))}
        <input
          type={"file"}
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
