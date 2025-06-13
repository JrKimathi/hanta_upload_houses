// Close Dialog
document.getElementById("closeDialogBtn").addEventListener("click", function () {
  document.getElementById("successDialog").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("uploadForm").reset();
});

// Form Submit Handler
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  const fields = [
    "rent", "location", "floorLevel", "deposit",
    "proximityToRoad", "squareMetres", "bedroomDescription", "latitude", "longitude",
    "storiesTotal", "parking", "security", "wifi", "water", "electricity", "garbage"
  ];

  // Validation
  for (const name of fields) {
    if (!input) {
      alert(`Input field "${name}" not found in the form`);
      continue;
    }
    if (!form[name].value.trim()) {
      alert(`Please fill in the "${name}" field.`);
      return;
    }
    formData.append(name, form[name].value);
  }

  // Append image files
  const imageFiles = form['images'].files;
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append("images", imageFiles[i]);
  }

  // Append video files
  const videoFiles = form['videos'].files;
  for (let i = 0; i < videoFiles.length; i++) {
    formData.append("videos", videoFiles[i]);
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Uploading...";
  spinner.style.display = "flex";

  try {
    const response = await fetch("https://houses-data-1037566601387.us-central1.run.app/user/addData", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      document.getElementById("successDialog").style.display = "block";
      document.getElementById("overlay").style.display = "block";
    } else {
      alert("Error submitting data: " + (result.message || "Unknown error"));
    }

  } catch (error) {
    console.error("Upload error:", error);
    alert("Something went wrong while submitting the form.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    spinner.style.display = "none";
  }
});


document.getElementById("viewHousesBtn").addEventListener("click", async () => {
  const container = document.getElementById("housesDataContainer");
  container.innerHTML = "<p>Loading houses...</p>";

  try {
    const response = await fetch("https://houses-data-1037566601387.us-central1.run.app/user/getData");
    const result = await response.json();
    const data = result.data;


    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No houses found.</p>";
      return;
    }

    container.innerHTML = "";
    data.forEach(house => {
      const card = document.createElement("div");
      card.className = "house-card";

      const imageUrl = house.images?.[0] || null;
      const videoUrl = house.videos?.[0] || null;

      card.innerHTML = `
        <h3>${house.bedroomDescription}</h3>
        <p><strong>Rent:</strong> ${house.rent}</p>
        <p><strong>Deposit:</strong> ${house.deposit}</p>
        <p><strong>Location:</strong> ${house.location}</p>
        <p><strong>Floor Level:</strong> ${house.floorLevel || "N/A"}</p>
        <p><strong>Proximity to Road:</strong> ${house.proximityToRoad || "N/A"}</p>
        <p><strong>Square Metres:</strong> ${house.squareMetres || "N/A"}</p>
        <p><strong>Bedrooms Total:</strong> ${house.bedroomsTotal || "N/A"}</p>
        <p><strong>Stories Total:</strong> ${house.storiesTotal}</p>
        <p><strong>Utilities:</strong> ${house.utilities}</p>
        <p><strong>Parking:</strong> ${house.parking}</p>
        <p><strong>Agent Phone:</strong> ${house.agentPhone}</p>
        ${imageUrl ? `<img src="${imageUrl}" alt="House Image" class="house-img">` : ""}
        ${videoUrl ? `<p><strong>Video:</strong> <a href="${videoUrl}" target="_blank">Watch Tour</a></p>` : ""}
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Error fetching house data.</p>";
    console.error(err);
  }
});

