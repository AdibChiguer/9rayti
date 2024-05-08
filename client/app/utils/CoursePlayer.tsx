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
    <div >
      {url !== "" && (

        <video 
          src={`${url}`}
          className="border-0 h-100% max-w-[90%]"
          controls
          autoPlay
        >
        </video>
      )}
    </div>
  );
};

export default CoursePlayer;
