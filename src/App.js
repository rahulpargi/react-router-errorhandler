import "./App.css";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [init, setInit] = useState(0);
  const [page, setPage] = useState(0);
  const [firstElement, setFirstElement] = useState(null);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log(entry.target.id, entry.isIntersecting, page);
        if (entry.isIntersecting && entry.target.id === "last") {
          setPage((prevPage) => prevPage + 1);
        } else if (entry.isIntersecting && entry.target.id === "first") {
          setPage((prevPage) => {
            if (prevPage > 0) {
              return prevPage - 1;
            } else {
              return prevPage;
            }
          });
        }
      },
      { threshold: 1.0 }
    )
  );

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://api.instantwebtools.net/v1/passenger?page=${page}&size=20`
      );

      // Currpage + 1
      if (page === init + 3) {
        const newArr = [...data];
        let tempArr = newArr.slice(init + 20);
        setData(tempArr);
      }
      if (res.data.data.length) {
        res.data.data.map((dt) => {
          setData((prevData) => [...prevData, dt]);
        });
      }
    })();
  }, [page]);

  useEffect(() => {
    const lastEle = lastElement;
    const firstEle = firstElement;
    const currentObserver = observer.current;

    if (lastEle) {
      currentObserver.observe(lastEle);
    }
    if (firstEle) {
      currentObserver.observe(firstEle);
    }

    return () => {
      if (lastEle) {
        currentObserver.unobserve(lastEle);
      } else if (firstEle) {
        currentObserver.unobserve(firstEle);
      }
    };
  }, [lastElement, firstElement]);

  return (
    <div
      style={{
        height: "300px",
        overflow: "scroll",
        border: "1px solid black",
        margin: "5em",
      }}
    >
      {data.length &&
        data.map((dt, i) => {
          if (i === 0) {
            return (
              <div id="first" ref={setFirstElement}>
                {i}
                {dt.name}
              </div>
            );
          } else if (i === data.length - 1) {
            return (
              <div id="last" ref={setLastElement}>
                {i}
                {dt.name}
              </div>
            );
          } else {
            return (
              <div id="usual">
                {i}
                {dt.name}
              </div>
            );
          }
        })}
    </div>
  );
}

export default App;
