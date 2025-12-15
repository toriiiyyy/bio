(() => {
  const audio = document.getElementById("music");
  const playBtn = document.getElementById("playBtn");
  const trackBox = document.querySelector(".track");

  if (!audio || !playBtn) return;

  const KEY = {
    time: "bio_music_time",
    vol: "bio_music_vol",
    shouldPlay: "bio_music_should_play",
  };

  function setBtn(isPlaying, needsGesture = false) {
    playBtn.textContent = isPlaying ? "⏸" : "▶";
    if (trackBox) {
      // маленькая подсказка на новой странице, если autoplay заблокирован
      const hint = trackBox.querySelector(".hint") || (() => {
        const el = document.createElement("span");
        el.className = "hint";
        el.style.opacity = ".65";
        el.style.fontSize = "12px";
        el.style.marginTop = "2px";
        trackBox.appendChild(el);
        return el;
      })();
      hint.textContent = needsGesture ? "Tap to resume" : "";
    }
  }

  async function safePlay() {
    try {
      await audio.play();
      setBtn(true, false);
      sessionStorage.setItem(KEY.shouldPlay, "1");
      return true;
    } catch {
      // autoplay blocked
      setBtn(false, true);
      sessionStorage.setItem(KEY.shouldPlay, "1");
      return false;
    }
  }

  function saveState() {
    sessionStorage.setItem(KEY.time, String(audio.currentTime || 0));
    sessionStorage.setItem(KEY.vol, String(audio.volume ?? 1));
    sessionStorage.setItem(KEY.shouldPlay, audio.paused ? "0" : "1");
  }

  // restore volume/time
  const v = sessionStorage.getItem(KEY.vol);
  if (v !== null) audio.volume = Number(v);

  const t = sessionStorage.getItem(KEY.time);
  if (t !== null) audio.currentTime = Number(t);

  const shouldPlay = sessionStorage.getItem(KEY.shouldPlay) === "1";

  // try resume if it was playing
  if (shouldPlay) {
    safePlay();
  } else {
    setBtn(false, false);
  }

  // on-page gesture resume (fix for your case)
  const resumeOnGesture = async () => {
    const want = sessionStorage.getItem(KEY.shouldPlay) === "1";
    if (want && audio.paused) {
      try {
        await audio.play();
        setBtn(true, false);
      } catch {
        // still blocked (rare), keep hint
        setBtn(false, true);
      }
    }
    cleanupGesture();
  };

  function cleanupGesture() {
    document.removeEventListener("pointerdown", resumeOnGesture, true);
    document.removeEventListener("click", resumeOnGesture, true);
    document.removeEventListener("keydown", resumeOnGesture, true);
  }

  document.addEventListener("pointerdown", resumeOnGesture, true);
  document.addEventListener("click", resumeOnGesture, true);
  document.addEventListener("keydown", resumeOnGesture, true);

  // controls
  playBtn.addEventListener("click", async () => {
    if (audio.paused) {
      await safePlay();
    } else {
      audio.pause();
      setBtn(false, false);
      sessionStorage.setItem(KEY.shouldPlay, "0");
    }
    saveState();
  });

  audio.addEventListener("timeupdate", () => {
    // не слишком часто
    if ((audio.currentTime | 0) % 2 === 0) saveState();
  });
  audio.addEventListener("play", () => { setBtn(true, false); saveState(); });
  audio.addEventListener("pause", () => { setBtn(false, false); saveState(); });

  window.addEventListener("pagehide", saveState);

  audio.addEventListener("error", () => {
    setBtn(false, false);
  });
})();
window.openTelegram = function () {
  window.open("https://t.me/toriiiyuy", "_blank", "noopener,noreferrer");
};

window.copyText = async function (text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Скопировано");
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("Скопировано");
  }
};

function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 1400);
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tgBtn")?.addEventListener("click", () => {
    window.open("https://t.me/toriiiyuy", "_blank", "noopener,noreferrer");
  });

  document.getElementById("mailBtn")?.addEventListener("click", () => {
    window.copyText?.("toriiiyyy@toriiiyyy.xyz");
  });

  document.getElementById("dcBtn")?.addEventListener("click", () => {
    window.copyText?.("gofa");
  });
});
