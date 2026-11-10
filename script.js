(() => {
  const DISCORD_ID = "968401137290051594";
  const dot = document.querySelector("#status-dot");
  const statusText = document.querySelector("#status-text");

  document.querySelector("#year").textContent = new Date().getFullYear();

  // Press feedback also works for pointer and keyboard activation.
  document.querySelectorAll(".pressable").forEach((element) => {
    element.addEventListener("pointerdown", () => element.classList.add("is-pressed"));
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      element.addEventListener(eventName, () => element.classList.remove("is-pressed"));
    });
    element.addEventListener("blur", () => element.classList.remove("is-pressed"));
  });

  async function updateDiscordStatus() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("Lanyard request failed");
      const result = await response.json();
      if (!result.success || !result.data) throw new Error("No presence data");

      const state = result.data.discord_status;
      const labels = {
        online: "Online on Discord",
        idle: "Away on Discord",
        dnd: "Do not disturb",
        offline: "That_Dark_Cheese"
      };
      dot.classList.toggle("online", state === "online");
      dot.classList.toggle("idle", state === "idle" || state === "dnd");
      statusText.textContent = labels[state] || "That_Dark_Cheese";
    } catch {
      dot.classList.remove("online", "idle");
      statusText.textContent = "That_Dark_Cheese";
    }
  }

  updateDiscordStatus();
  window.setInterval(updateDiscordStatus, 60_000);
})();
