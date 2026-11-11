(() => {
  const DISCORD_ID = "968401137290051594";
  const dot = document.querySelector("#status-dot");
  const statusText = document.querySelector("#status-text");
  const lastUpdated = document.querySelector(".last-updated");
  const yearSpan = document.querySelector("#year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

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
        offline: "Offline on Discord",
      };
      dot.classList.toggle("online", state === "online");
      dot.classList.toggle("idle", state === "idle" || state === "dnd");
      statusText.textContent = labels[state] || "Offline";
    } catch {
      dot.classList.remove("Online", "Idle");
      statusText.textContent = "Offline";
    }
  }

  updateDiscordStatus();
  window.setInterval(updateDiscordStatus, 60_000);

  async function updateLastUpdated() {
    if (!lastUpdated) return;
    try {
      const response = await fetch("https://api.github.com/repos/WideShotCreative/WideShotCreative.github.io/commits/main");
      if (!response.ok) throw new Error("GitHUb request failed");
      const commit = await response.json();
      const date = new Date(commit.commit.committer.date);
      lastUpdated.textContent = "Last updated: " + date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }catch{
      lastUpdated.textContent = "Last updated: unavailable";
    }
  }
  updateLastUpdated();
})();
