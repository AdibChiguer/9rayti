import axios from "axios";
import React, { FC, useEffect, useState } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URI}/get-gdrive-course`, {
        videoId: videoUrl,
      })
      .then((res) => {
        console.log(res.data.videoUrl);
        setUrl(res.data.videoUrl);
      });
  }, [videoUrl]);

  return (
    <div className="!w-full" style={{position: "relative" , paddingTop: "56.25%" , overflow :"hidden"}}>
      {url !== "" && (

        <video 
          src={`${url}`}
          // className="border-0 h-100% max-w-[100%]"
          style={{position: "absolute" , top: "0" , left: "0" , width: "100%" , height: "100%" , border: "0"}}
          controls
          autoPlay={false}
        >
        </video>
      )}
    </div>
  );
};

export default CoursePlayer;
