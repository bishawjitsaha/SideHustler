import React from "react";
import AddImage from "../components/AddImage";

function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">SideHustler</h1>
      <p className="text-lg font-semibold">
        A database of side hustles - built by hustlers
      </p>
      {/* <AddImage cred={currentUser} type={"pfp"} /> */}
    </div>

  );
}

export default HomePage;
