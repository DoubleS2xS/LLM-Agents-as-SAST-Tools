
import React, { useMemo } from "react";

export function WelcomeMessage({ username, greetingType }) {
  const messageHtml = useMemo(() => {
    const greetings = {
      formal: "Welcome, esteemed visitor",
      casual: "Hey there",
      friendly: "Welcome back, friend"
    };
    const greeting = greetings[greetingType] || "Welcome";
    return `
      <div class="welcome-section">
        <h1>${greeting}, ${username}!</h1>
        <p>We're happy to see you</p>
      </div>
    `;
  }, [username, greetingType]);

  return (
    <section dangerouslySetInnerHTML={{ __html: messageHtml }} />
  );
}


