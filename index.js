const COHORT = "2503-FTB-ET-WEB-AM";

const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: []
}

const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL)
    const { data } = await response.json()

    state.events = data

    renderAllEvents()
  } catch (error) {
    console.log(error)
  }
}

const createNewEvent = async (name, description, location, date) => {
 const formattedDate = new Date(date).toISOString();
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
          name,
          location,
          description,
          date: formattedDate
      }),
      headers: {
          "Content-Type": "application/json",
      },
    })


    fetchAllEvents();

  } catch (error) {
    console.log(error);
  }
};

 const removeEvent = async (id) => {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        })

    fetchAllEvents();

      } catch (error) {
        console.log(error);
      }
    };

const renderAllEvents = () => {
  const eventsContainer = document.getElementById("events-container")
  const eventList = state.events

  if (!eventList || eventList.length === 0) {
    eventsContainer.innerHTML = "<h3>No events found</h3>"
    return
  }

  eventsContainer.innerHTML = ""

  eventList.forEach((event) => {
    const eventElement = document.createElement("div")
    eventElement.classList.add("event-card")
    eventElement.innerHTML = `
            <h4>${event.name}</h4>
            <p>${event.location}</p>
            <p>${event.description}</p>
            <p>${event.date}</p>
            <button class="delete-button" data-id="${event.id}">Remove</button>
        `
      eventsContainer.appendChild(eventElement)

      const deleteButton = eventElement.querySelector(".delete-button")
      deleteButton.addEventListener("click", (e) => {
        try {
          e.preventDefault()
          removeEvent(event.id)
        } catch (error) {
          console.log(error)
      }
    })
  })
}

const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    console.log("Form Values:", {
  name: form.name.value,
  location: form.location.value,
  description: form.description.value,
  date: form.date.value,
});

    await createNewEvent(
      form.name.value,
      form.location.value,
      form.description.value,
      form.date.value
    )

    form.name.value = "";
    form.location.value = "";
    form.description.value = "";
    form.date.value = "";
  });
};

const init = async () => {
  await fetchAllEvents()
  addListenerToForm()
}

init();