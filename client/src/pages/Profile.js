import React from "react";

import GameTable from "../components/GameTable";

// import { Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { QUERY_ME } from "../utils/queries";

// import Auth from "../utils/auth";

const Profile = () => {
  // If there is no `profileId` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(QUERY_ME);

  // Check if data is returning from the `QUERY_ME` query,
  const profile = data?.me || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile?.name) {
    return (
      <h4>
        You need to be logged in to see your profile page. Use the navigation
        links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <GameTable profilePage={true}/>
    </div>
  );
};

export default Profile;
