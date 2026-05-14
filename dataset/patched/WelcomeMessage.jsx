
import React, { useMemo } from "react";

export function WelcomeMessage({ username, greetingType }) {
  const greetings = useMemo(() => ({
    formal: "Welcome, esteemed visitor",
    casual: "Hey there",
    friendly: "Welcome back, friend"
  }), []);

  const greeting = greetings[greetingType] || "Welcome";

  return (
    <section className="welcome-section">
      <h1>{greeting}, {username}!</h1>
      <p>We're happy to see you</p>
    </section>
  );
}


