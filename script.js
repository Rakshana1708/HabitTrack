
const habitList = document.getElementById("habitList");
const habitForm = document.getElementById("habitForm");
const habitName = document.getElementById("habitName");
const addHabitBtn = document.getElementById("addHabitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const emptyMessage = document.getElementById("emptyMessage");

let habits = JSON.parse(localStorage.getItem("habitTrackData")) || [];

const today = new Date();
const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

function saveHabits() {
    localStorage.setItem("habitTrackData", JSON.stringify(habits));
}

function renderHabits() {
    habitList.innerHTML = "";

    const completedCount = habits.filter(
        habit => habit.completedOn === todayKey
    ).length;

    const total = habits.length;
    const progress = total === 0
        ? 0
        : Math.round((completedCount / total) * 100);

    document.getElementById("totalHabits").textContent = total;
    document.getElementById("completedHabits").textContent = completedCount;
    document.getElementById("progressText").textContent = progress + "%";
    document.getElementById("progressBar").style.width = progress + "%";

    const message = document.getElementById("progressMessage");

    if (total === 0) {
        message.textContent = "Let's get started!";
    } else if (progress === 100) {
        message.textContent = "Amazing! All habits completed 🎉";
    } else {
        message.textContent = "Keep going, you're doing great!";
    }

    emptyMessage.style.display = total === 0 ? "block" : "none";

    habits.forEach(habit => {
        const isCompleted = habit.completedOn === todayKey;

        const item = document.createElement("div");
        item.className = "habit-item";

        if (isCompleted) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "habit-check";
        checkbox.checked = isCompleted;
        checkbox.setAttribute("aria-label", "Complete " + habit.name);

        checkbox.addEventListener("change", () => {
            habit.completedOn = checkbox.checked ? todayKey : "";
            saveHabits();
            renderHabits();
        });

        const info = document.createElement("div");
        info.className = "habit-info";

        const title = document.createElement("h3");
        title.textContent = habit.name;

        const subtitle = document.createElement("p");
        subtitle.textContent = isCompleted
            ? "Completed today ✓"
            : "A little progress every day";

        info.appendChild(title);
        info.appendChild(subtitle);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            if (confirm(`Delete "${habit.name}"?`)) {
                habits = habits.filter(item => item.id !== habit.id);
                saveHabits();
                renderHabits();
            }
        });

        item.append(checkbox, info, deleteButton);
        habitList.appendChild(item);
    });
}

addHabitBtn.addEventListener("click", () => {
    habitForm.classList.remove("hidden");
    habitName.focus();
});

cancelBtn.addEventListener("click", () => {
    habitForm.reset();
    habitForm.classList.add("hidden");
});

habitForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = habitName.value.trim();

    if (!name) return;

    habits.push({
        id: Date.now().toString(),
        name: name,
        completedOn: ""
    });

    saveHabits();
    renderHabits();

    habitForm.reset();
    habitForm.classList.add("hidden");
});

renderHabits();
