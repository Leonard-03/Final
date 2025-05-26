document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("loggedIn");
  function saveToLocalStorage(key, data) {
      try {
          localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
          console.error("Failed to save to localStorage", e);
      }
  }
  

  if (!currentUser || isLoggedIn !== "true") {
    window.location.href = "index.html";
    return;
  }
  
  function renderDashboardOverview() {
    const pets = JSON.parse(localStorage.getItem(`pets_${currentUser}`)) || [];    document.getElementById("petCount").textContent = `You have ${pets.length} pet(s) added`;

    const appts = JSON.parse(localStorage.getItem(`appointments_${currentUser}`)) || [];
    document.getElementById("apptCount").textContent = appts.length
      ? `${appts.length} appointment(s) booked`
      : `No appointments booked yet`;

    const records = JSON.parse(localStorage.getItem(`records_${currentUser}`)) || [];
    document.getElementById("recordCount").textContent = `${records.length} personal record(s) uploaded`;

    const reminders = JSON.parse(localStorage.getItem(`reminders_${currentUser}`)) || [];
    document.getElementById("reminderCount").textContent = `${reminders.length} reminder(s) set`;

    const tips = [
      "Remember to clean your pet's food and water bowls daily.",
      "Exercise your dog regularly to keep them healthy and happy.",
      "Groom your pet weekly to avoid matting and keep skin healthy.",
      "Keep your vet appointments up-to-date!",
      "Don't forget to trim your pet's nails!",
      "Reward good behavior immediately for effective training."
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById("dailyTip").textContent = randomTip;
  }

  function renderCommunityPosts() {
    const samplePosts = [
    {
      user: "PawsAndLove",
      message: "Just adopted this sweet senior dog from the shelter! Anyone have tips for helping him adjust to his new home? 🐕❤️ #AdoptDontShop"
    },
    {
      user: "CatWhisperer",
      message: "My cat brought me a 'present' this morning... a toy mouse at my pillow. Should I be concerned or flattered? 😅 #CatLife"
    },
    {
      user: "Dr. Patel (Vet)",
      message: "Reminder: Summer heat can be dangerous for pets! Always provide shade & fresh water, and never leave pets in parked cars. 🚗🔥 #PetSafety"
    },
    {
      user: "DogTrainingPro",
      message: "Teaching 'leave it' command today with my puppy. Using high-value treats works wonders! What commands are you working on? #DogTraining"
    },
    {
      user: "BunnyMom",
      message: "My rabbit just did her first binky since we adopted her! Such a happy moment seeing her comfortable in her new home. 🐰💕"
    },
    {
      user: "PetPhotographer",
      message: "Golden hour is the best time for pet photos! The warm light makes their fur glow. Here's my latest shoot with Max 🐶📸 #PetPhotography"
    },
    {
      user: "RescueVolunteer",
      message: "We have 15 kittens needing foster homes! If you're in the area and can help, please message me. All supplies provided. 🐱🏡"
    },
    {
      user: "BirdLover42",
      message: "My parrot learned to say 'I love you' today! 3 months of repetition finally paid off. Anyone else have talking pets? 🦜💬"
    },
    {
      user: "PetNutritionist",
      message: "Common misconception: Grain-free isn't necessarily better for dogs. Always consult your vet before changing diets! #PetNutrition"
    },
    {
      user: "AdventureCat",
      message: "Took Mittens on her first hike today! She loved riding in the backpack carrier. Any other adventure cats out there? 🐾⛰️"
    }
  ];

  const shuffled = samplePosts.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5); 
  const communityFeed = document.getElementById("communityFeed");
  
  if (communityFeed) {
    communityFeed.innerHTML = "";
    selected.forEach(post => {
      const div = document.createElement("div");
      div.className = "community-post";
      div.innerHTML = `
        <h4>@${post.user}</h4>
        <p>${post.message}</p>
      `;
      communityFeed.appendChild(div);
      });
    }
  }

  document.querySelectorAll(".sidebar-left a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");

      document.querySelectorAll(".sidebar-left a").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      document.querySelectorAll(".dashboard-section").forEach(section => {
        section.style.display = "none";
      });

      const target = document.getElementById(sectionId);
      if (target) target.style.display = "block";
    });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }

  const form = document.getElementById("petForm");
  const petList = document.getElementById("petList");
  const petSwitcher = document.getElementById("petSwitcher");
  function initializePetSwitcher() {
  const petSwitcher = document.getElementById("petSwitcher");
  if (!petSwitcher) return;

  petSwitcher.innerHTML = "";

  if (pets.length === 0) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "-1";
    defaultOption.textContent = "No pets added";
    petSwitcher.appendChild(defaultOption);
    return;
  }

  pets.forEach((pet, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = pet.name || `Pet ${index + 1}`;
    petSwitcher.appendChild(option);
  });

  petSwitcher.addEventListener("change", function() {
    const selectedIndex = parseInt(this.value);
    if (!isNaN(selectedIndex)) {
      updateSidebarProfile(selectedIndex);
    }
  });

  if (pets.length > 0) {
    updateSidebarProfile(0);
  }
}

  function updateSidebarProfile(index = 0) {
    const activePetPic = document.getElementById("activePetPic");
    const activePetName = document.getElementById("activePetName");
    const activePetBreed = document.getElementById("activePetBreed");
    const activePetWeight = document.getElementById("activePetWeight");
    
    activePetPic.src = "images/default-pet.png";
    activePetName.textContent = "No pet selected";
    activePetBreed.textContent = "N/A";
    activePetWeight.textContent = "N/A";

    activePetPic.onerror = () => {
      activePetPic.src = "images/default-pet.png";
    };

    if (pets.length === 0) return;

    index = Math.max(0, Math.min(index, pets.length - 1));
    const pet = pets[index];
    if (!pet) return;

    const petSwitcher = document.getElementById("petSwitcher");
    if (petSwitcher) {
      petSwitcher.value = index;
    }

    const img = new Image();
    img.src = pet.photo || "images/default-pet.png";
    img.onload = () => {
      activePetPic.src = pet.photo || "images/default-pet.png";
    };
    img.onerror = () => {
      activePetPic.src = "images/default-pet.png";
    };

    activePetName.textContent = pet.name || "Unnamed pet";
    activePetBreed.textContent = pet.breed || "N/A";
    activePetWeight.textContent = pet.weight || "N/A";
  }
  function renderPets() {
      if (!petList) return;
      
      petList.innerHTML = "";
      
      if (pets.length === 0) {
          petList.innerHTML = "<p>No pets added yet.</p>";
          updateSidebarProfile(); 
          return;
      }

      pets.forEach((pet, index) => {
          const petCard = document.createElement("div");
          petCard.className = "pet-card";
          petCard.innerHTML = `
              <img src="${pet.photo || 'images/dog.jpg'}" alt="${pet.name}" />
              <div>
                  <h3>${pet.name}</h3>
                  <p><strong>Breed:</strong> ${pet.breed}</p>
                  ${pet.weight ? `<p><strong>Weight:</strong> ${pet.weight}</p>` : ""}
                  ${pet.attitudes ? `<p><strong>Attitudes:</strong> ${pet.attitudes}</p>` : ""}
              </div>
              <div class="buttons">
                  <button data-index="${index}" class="edit-btn">Edit</button>
                  <button data-index="${index}" class="delete-btn">Delete</button>
              </div>
          `;
          petList.appendChild(petCard);
      });

      console.log("Current pets:", pets);
      petList.addEventListener("click", (e) => {
           if (e.target.classList.contains("delete-btn")) {
              const index = parseInt(e.target.getAttribute("data-index"));
              if (isNaN(index)) return;
              if (!confirm("Are you sure?")) return;

              pets.splice(index, 1);
              saveToLocalStorage(`pets_${currentUser}`, pets);
              renderPets();
              initializePetSwitcher();
              updateSidebarProfile(); 
              
              if (pets.length === 0) {
                  const form = document.getElementById("petForm");
                  if (form) {
                      form.reset();
                      document.getElementById("petPhoto").value = "";
                  }
              }
          }
          
          if (e.target.classList.contains("edit-btn")) {
              const index = parseInt(e.target.getAttribute("data-index"));
              const pet = pets[index];
              document.getElementById("petName").value = pet.name;
              document.getElementById("petBreed").value = pet.breed;
              document.getElementById("petWeight").value = pet.weight || "";
              document.getElementById("petAttitudes").value = pet.attitudes || "";
              form.dataset.editIndex = index;
          }
      });
  }

  if (form) {
      form.addEventListener("submit", (e) => {
          e.preventDefault();

          const name = document.getElementById("petName").value;
          const breed = document.getElementById("petBreed").value;
          const weight = document.getElementById("petWeight").value;
          
          if (!name || !breed) {
              alert("Please fill in all required fields");
              return;
          }

          if (weight && !/^\d+\.?\d*\s*[a-zA-Z]*$/.test(weight)) {
              alert("Please enter weight in format like '25' or '25kg'");
              return;
          }

          const attitudes = document.getElementById("petAttitudes").value;
          const fileInput = document.getElementById("petPhoto");
          const file = fileInput.files[0];
          const editIndex = form.dataset.editIndex;

          const resetForm = () => {
              form.reset();
              document.getElementById("petPhoto").value = "";
              delete form.dataset.editIndex;
              form.querySelector("button[type='submit']").disabled = false;
          };

          if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                  const photo = reader.result;

                  if (editIndex !== undefined) {
                      pets[editIndex] = { name, breed, weight, attitudes, photo };
                  } else {
                      pets.push({ name, breed, weight, attitudes, photo });
                  }

                  saveToLocalStorage(`pets_${currentUser}`, pets);
                  renderPets();
                  initializePetSwitcher();
                  resetForm();
              };
              reader.readAsDataURL(file);
          } else if (editIndex !== undefined) {
              pets[editIndex] = { ...pets[editIndex], name, breed, weight, attitudes };
              saveToLocalStorage(`pets_${currentUser}`, pets);
              renderPets();
              resetForm();
          } else {
              alert("Please upload a photo for the new pet.");
          }
      });
  }

  const consultTypeRadios = document.querySelectorAll('input[name="consultType"]');
  const onlineForm = document.getElementById("onlineForm");
  const clinicSelection = document.getElementById("clinicSelection");
  const clinicList = document.getElementById("clinicList");
  const onsiteForm = document.getElementById("onsiteForm");
  const doctorListDiv = document.getElementById("doctorList");
  const doctorsUl = document.getElementById("doctors");
  const onlineBookingForm = document.getElementById("onlineBookingForm");
  const confirmationDiv = document.getElementById("confirmation");
  const appointmentList = document.querySelector("#appointmentList ul");

  const clinics = [
    { id: 1, name: "Happy Paws Vet Clinic", address: "123 Main St", distance: "2.3km" },
    { id: 2, name: "Furry Friends Animal Hospital", address: "456 Oak Ave", distance: "5.1km" },
    { id: 3, name: "Paws & Claws Veterinary", address: "789 Pine Rd", distance: "7.8km" }
  ];

  const doctors = [
    { id: 1, name: "Dr. Emily", specialty: "General Vet" },
    { id: 2, name: "Dr. Sam", specialty: "Dermatologist" },
    { id: 3, name: "Dr. Alex", specialty: "Behavior Specialist" }
  ];

  let selectedClinicId = null;
  let selectedDoctorId = null;

  function updateConsultType() {
  const selected = [...consultTypeRadios].find(r => r.checked)?.value;
  onlineForm.style.display = selected === "online" ? "block" : "none";
  clinicSelection.style.display = selected === "onsite" ? "block" : "none";
  doctorListDiv.style.display = "none";
  onsiteForm.style.display = "none";
  confirmationDiv.style.display = "none";

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formattedDate = tomorrow.toISOString().split('T')[0];
  
  const clinicDateInput = document.getElementById("clinicDate");
  if (clinicDateInput) {
    clinicDateInput.min = formattedDate;
    clinicDateInput.value = ""; 
  }
  
  const doctorDateInput = document.getElementById("doctorDate");
  if (doctorDateInput) {
    doctorDateInput.min = formattedDate;
    doctorDateInput.value = ""; 
  }

  if (selected === "onsite") renderClinicList();
}

  function renderClinicList() {
    if (!clinicList) return;
    
    clinicList.innerHTML = "";
    clinics.forEach(clinic => {
      const li = document.createElement("li");
      li.textContent = `${clinic.name} (${clinic.distance}) - ${clinic.address}`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        selectedClinicId = clinic.id;
        onsiteForm.style.display = "block";
      });
      clinicList.appendChild(li);
    });
  }

  function renderDoctorList() {
    if (!doctorsUl) return;
    
    doctorsUl.innerHTML = "";
    doctors.forEach(doctor => {
      const li = document.createElement("li");
      li.textContent = `${doctor.name} - ${doctor.specialty}`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        selectedDoctorId = doctor.id;
        onlineBookingForm.style.display = "block";
      });
      doctorsUl.appendChild(li);
    });
  }

  function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser}`)) || [];
    appointments.push(appointment);
    localStorage.setItem(`appointments_${currentUser}`, JSON.stringify(appointments));
  }

  function renderAppointments() {
    if (!appointmentList) return;
    
    let appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser}`)) || []; 
    appointmentList.innerHTML = "";
    
    if (appointments.length === 0) {
      appointmentList.innerHTML = "<li>No appointments booked yet.</li>";
      return;
    }
    
    appointments.forEach(appt => {
      const li = document.createElement("li");
      if (appt.type === "On-site") {
        li.textContent = `${appt.type} at ${appt.location} on ${appt.date} at ${appt.time}`;
      } else {
        li.textContent = `${appt.type} with ${appt.doctor} on ${appt.date} at ${appt.time}`;
      }
      appointmentList.appendChild(li);
    });
  }

  if (consultTypeRadios.length) {
    consultTypeRadios.forEach(r => r.addEventListener("change", updateConsultType));
    updateConsultType();
  }

  if (onsiteForm) {
    onsiteForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateAppointmentDate("clinicDate", "clinicTime")) return;
      const date = document.getElementById("clinicDate").value;
      const time = document.getElementById("clinicTime").value;
      if (!selectedClinicId || !date || !time) return alert("Please fill in all fields.");
      const clinic = clinics.find(c => c.id === selectedClinicId);
      saveAppointment({ type: "On-site", location: clinic.name, date, time });
      onsiteForm.reset();
      confirmationDiv.style.display = "block";
      clinicSelection.style.display = "none";
      renderAppointments();
      updateNextAppointment();
    });
  }

  if (onlineForm) {
    onlineForm.addEventListener("submit", e => {
      e.preventDefault();
      const symptoms = document.getElementById("symptoms").value.trim();
      if (!symptoms) return alert("Please describe the symptoms.");
      doctorListDiv.style.display = "block";
      renderDoctorList();
    });
  }

  if (onlineBookingForm) {
    const doctorDateInput = document.getElementById("doctorDate");
    if (doctorDateInput) {
    doctorDateInput.min = getTodayDate();
  }
    onlineBookingForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateAppointmentDate("doctorDate", "doctorTime")) return;
      const date = document.getElementById("doctorDate").value;
      const time = document.getElementById("doctorTime").value;
      if (!selectedDoctorId || !date || !time) return alert("Please fill in all fields.");
      const doctor = doctors.find(d => d.id === selectedDoctorId);
      saveAppointment({ type: "Online", doctor: doctor.name, date, time });
      onlineBookingForm.reset();
      confirmationDiv.style.display = "block";
      doctorListDiv.style.display = "none";
      renderAppointments();
      updateNextAppointment();
    });
  }

  const personalTab = document.getElementById("personalTab");
  const doctorTab = document.getElementById("doctorTab");

  if (personalTab && doctorTab) {
    personalTab.addEventListener("click", () => {
      document.getElementById("personalRecords").style.display = "block";
      document.getElementById("doctorRecords").style.display = "none";
      personalTab.classList.add("active");
      doctorTab.classList.remove("active");
    });

    doctorTab.addEventListener("click", () => {
      document.getElementById("personalRecords").style.display = "none";
      document.getElementById("doctorRecords").style.display = "block";
      personalTab.classList.remove("active");
      doctorTab.classList.add("active");
    });
  }

  function renderPersonalRecords() {
    const container = document.getElementById("personalRecordList");
    if (!container) return;
    
    container.innerHTML = "";
    const records = JSON.parse(localStorage.getItem(`records_${currentUser}`)) || [];

    if (records.length === 0) {
      container.innerHTML = "<p>No personal records uploaded yet.</p>";
      return;
    }

    records.forEach(rec => {
      const div = document.createElement("div");
      div.className = "record-item";
      div.innerHTML = `
        <p><strong>${rec.title}</strong> (${rec.date})</p>
        <a href="${rec.fileData}" target="_blank">${rec.fileName}</a>
      `;
      container.appendChild(div);
    });
  }

  function renderDoctorRecords() {
    const container = document.getElementById("doctorRecordList");
    if (!container) return;
    
    container.innerHTML = "";
    const doctorRecords = [
      {
        title: "Vaccination Certificate",
        date: "2025-05-20",
        doctor: "Dr. Emily",
        link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      {
        title: "Health Report",
        date: "2025-05-14",
        doctor: "Dr. Alex",
        link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    ];

    doctorRecords.forEach(rec => {
      const div = document.createElement("div");
      div.className = "record-item";
      div.innerHTML = `
        <p><strong>${rec.title}</strong> by ${rec.doctor} (${rec.date})</p>
        <a href="${rec.link}">View Document</a>
      `;
      container.appendChild(div);
    });
  }

  const personalRecordForm = document.getElementById("personalRecordForm");
  if (personalRecordForm) {
    personalRecordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("recordTitle").value;
      const date = document.getElementById("recordDate").value;
      const file = document.getElementById("recordFile").files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const record = {
          title,
          date,
          fileData: reader.result,
          fileName: file.name
        };

        let records = JSON.parse(localStorage.getItem(`records_${currentUser}`)) || [];  
        records.push(record);
        localStorage.setItem(`records_${currentUser}`, JSON.stringify(records));  
        renderPersonalRecords();
        e.target.reset();
      };
      reader.readAsDataURL(file);
    });
  }

  const reminderForm = document.getElementById("reminderForm");
  const reminderList = document.getElementById("reminderList");
  let reminders = JSON.parse(localStorage.getItem(`reminders_${currentUser}`)) || [];

  function saveReminders() {
  localStorage.setItem(`reminders_${currentUser}`, JSON.stringify(reminders)); 
  }

  function renderReminders() {
    if (!reminderList) return;
    
    reminderList.innerHTML = "";

    if (reminders.length === 0) {
      reminderList.innerHTML = "<p>No reminders yet.</p>";
      return;
    }

    reminders
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
      .forEach((reminder, index) => {
        const div = document.createElement("div");
        div.className = "reminder-item";
        div.innerHTML = `
          <h4>${reminder.title}</h4>
          <p>${reminder.description}</p>
          <p><small>${reminder.datetime}</small></p>
          <button data-index="${index}" class="delete-reminder">Delete</button>
        `;
        reminderList.appendChild(div);
      });

    document.querySelectorAll(".delete-reminder").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        reminders.splice(index, 1);
        saveReminders();
        renderReminders();
      });
    });
  }

  if (reminderForm) {
    reminderForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("reminderTitle").value;
      const description = document.getElementById("reminderDescription").value;
      const date = document.getElementById("reminderDate").value;
      const time = document.getElementById("reminderTime").value;

      const datetime = `${date}T${time}:00`;
      reminders.push({ title, description, datetime });
      saveReminders();
      renderReminders();
      reminderForm.reset();
    });
  }

  const toggleSupportBtn = document.getElementById("toggleSupportBtn");
  const supportFormContainer = document.getElementById("supportFormContainer");
  const sendSupportBtn = document.getElementById("sendSupportBtn");
  const supportMessage = document.getElementById("supportMessage");
  const supportEmail = document.getElementById("supportEmail");
  const supportSuccessMessage = document.getElementById("supportSuccessMessage");
  const dismissSupportMsg = document.getElementById("dismissSupportMsg");

  if (toggleSupportBtn) {
    toggleSupportBtn.addEventListener("click", () => {
      supportFormContainer.classList.toggle("hidden");
      supportSuccessMessage.classList.add("hidden");
    });
  }

  if (sendSupportBtn) {
    sendSupportBtn.addEventListener("click", () => {
      const message = supportMessage.value.trim();
      const email = supportEmail.value.trim();

      if (!message || !email || !email.includes("@")) {
        alert("Please enter a valid message and email.");
        return;
      }

      supportFormContainer.classList.add("hidden");
      supportSuccessMessage.classList.remove("hidden");
      supportMessage.value = "";
      supportEmail.value = "";
    });
  }

  if (dismissSupportMsg) {
    dismissSupportMsg.addEventListener("click", () => {
      supportSuccessMessage.classList.add("hidden");
    });
  }
  function updateNextAppointment() {
  const nextAppointmentInfo = document.getElementById("nextAppointmentInfo");
  if (!nextAppointmentInfo) return;
  
  const appointments = JSON.parse(localStorage.getItem(`appointments_${currentUser}`)) || [];
  
  if (appointments.length === 0) {
    nextAppointmentInfo.textContent = "No upcoming appointments.";
    return;
  }
  
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });
  
  const nextAppointment = sortedAppointments[0];
  
  if (nextAppointment.type === "On-site") {
    nextAppointmentInfo.textContent = `${nextAppointment.type} at ${nextAppointment.location} on ${nextAppointment.date} at ${nextAppointment.time}`;
  } else {
    nextAppointmentInfo.textContent = `${nextAppointment.type} with ${nextAppointment.doctor} on ${nextAppointment.date} at ${nextAppointment.time}`;
  }
  
}
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function validateAppointmentDate(dateInputId, timeInputId) {
  const dateInput = document.getElementById(dateInputId);
  const timeInput = document.getElementById(timeInputId);
  
  if (!dateInput || !timeInput || !dateInput.value || !timeInput.value) {
      alert("Please select both date and time");
      return false;
  }
  
  const selectedDate = new Date(`${dateInput.value}T${timeInput.value}`);
  const now = new Date();
  
  if (selectedDate < now) {
    alert("Please select a future date and time.");
    return false;
  }
  
  return true;
}
const addPetBtn = document.getElementById("addPetBtn");
if (addPetBtn) {
  addPetBtn.addEventListener("click", () => {
    document.querySelectorAll(".dashboard-section").forEach(section => {
      section.style.display = "none";
    });
    
    document.getElementById("pet-profile").style.display = "block";
    
    document.querySelectorAll(".sidebar-left a").forEach(link => link.classList.remove("active"));
    document.querySelector('[data-section="pet-profile"]').classList.add("active");
    
    const form = document.getElementById("petForm");
    if (form && form.dataset.editIndex) {
      delete form.dataset.editIndex;
      form.reset();
      document.getElementById("petPhoto").value = "";
    }
  });
}
  let pets = JSON.parse(localStorage.getItem(`pets_${currentUser}`)) || [];
  initializePetSwitcher();
  updateSidebarProfile();
  renderDashboardOverview();
  renderCommunityPosts();
  renderPets();
  renderAppointments();
  updateNextAppointment();
  renderPersonalRecords();
  renderDoctorRecords();
  renderReminders();
});