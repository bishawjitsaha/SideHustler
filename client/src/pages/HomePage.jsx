import React from "react";
import HomePageSlider from "../components/HomePageSlider.jsx"

function HomePage() {
  return (
    <div className=" bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
      <h1>Welcome to SideHustler</h1>
      <p>Our website is your go-to hub for finding quick and easy jobs. Whether you're looking to earn some extra cash or find help with tasks, it's as simple as posting a job or browsing available opportunities. From tech gigs to everyday tasks like pet sitting or lawn care, there's something for everyone. Just create a profile, share your skills, and connect with people in your neighborhood. You can apply for jobs that fit your expertise or post tasks to find the perfect help. Our user-friendly rating system ensures you can always rely on quality talent. Join us and discover how simple it is to find work or get things done!</p>
      <div className="flex items-center justify-center ">
        <HomePageSlider />
      </div>
    </div>
  );

}

export default HomePage;
