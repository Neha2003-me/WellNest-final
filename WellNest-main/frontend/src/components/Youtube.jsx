import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Youtube = () => {
  const [depressionVideos, setDepressionVideos] = useState([]);
  const [anxietyVideos, setAnxietyVideos] = useState([]);
  const [ocdVideos, setOcdVideos] = useState([]);

  const fetchVideos = async (query, setVideos) => {
    try {
      const response = await axios.post("https://wellnest-5zry.onrender.com/api/youtube-search", { query });
      setVideos(response.data);
    } catch (error) {
      console.error(`Error fetching ${query} videos:`, error);
    }
  };

  useEffect(() => {
    fetchVideos('depression', setDepressionVideos);
    fetchVideos('anxiety', setAnxietyVideos);
    fetchVideos('ocd', setOcdVideos);
  }, []);

  // React Slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show 4 videos at a time
    slidesToScroll: 4, // Scroll 4 videos at a time
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderCarousel = (videos, title) => {

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Know more about {title}</h2>
        <Slider {...settings}>
          {videos.map((video, idx) => (
            <div key={idx} className="px-2">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-48">
                <a href={video.url} target='_blank'>
                <img
                  className="w-full aspect-sqaure" // Fixed height for all videos
                  src={video.thumbnail}
                  title={video.title}
                ></img></a>
                <div className="p-4">
                  <h2 className="text-white font-semibold">{video.title}</h2>
                  <p className="text-gray-400 text-sm">{video.channel}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {renderCarousel(depressionVideos, 'Depression')}
      {renderCarousel(anxietyVideos, 'Anxiety')}
      {renderCarousel(ocdVideos, 'OCD')}
    </div>
  );
};

export default Youtube;