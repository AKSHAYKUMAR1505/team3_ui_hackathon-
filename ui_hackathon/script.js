var sportsEvents = [
    {
        id: "ATH101",
        name: "100m Sprint",
        category: "Track",
        date: "12 February 2026",
        time: "9:00 AM",
        venue: "Main Track",
        status: "Open",
        image: "images/sports-event-images/100ms.jpg",
        fee: "Rs. 50",
        registration: "Individual"
    },
    {
        id: "ATH102",
        name: "Long Jump",
        category: "Field",
        date: "12 February 2026",
        time: "11:00 AM",
        venue: "Field Area",
        status: "Open",
        image: "images/sports-event-images/longjump.jpg",
        fee: "Rs. 50",
        registration: "Individual"
    },
    {
        id: "TEAM201",
        name: "Football",
        category: "Team",
        date: "13 February 2026",
        time: "4:00 PM",
        venue: "Football Ground",
        status: "Open",
        image: "images/sports-event-images/football.jpg",
        fee: "Rs. 300 per team",
        registration: "Team"
    },
    {
        id: "IND301",
        name: "Badminton",
        category: "Indoor",
        date: "14 February 2026",
        time: "10:00 AM",
        venue: "Indoor Stadium",
        status: "Open",
        image: "images/sports-event-images/badminton.jpg",
        fee: "Rs. 100",
        registration: "Individual"
    },
    {
        id: "TEAM202",
        name: "Basketball",
        category: "Team",
        date: "14 February 2026",
        time: "3:00 PM",
        venue: "Basketball Court",
        status: "Closed",
        image: "images/sports-event-images/basketball.jpg",
        fee: "Rs. 250 per team",
        registration: "Team"
    }
];

function getStoredData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function fillEventSelect(selectElement) {
    if (!selectElement) {
        return;
    }

    selectElement.innerHTML = '<option value="">Select event</option>';
    for (var i = 0; i < sportsEvents.length; i++) {
        var event = sportsEvents[i];
        var option = document.createElement("option");
        option.value = event.id;
        option.textContent = event.name + " - " + event.id;
        selectElement.appendChild(option);
    }
}

function showEvents() {
    var eventList = document.getElementById("eventList");
    if (!eventList) {
        return;
    }

    eventList.innerHTML = "";
    for (var i = 0; i < sportsEvents.length; i++) {
        var event = sportsEvents[i];
        var card = document.createElement("article");
        card.innerHTML =
            '<img class="event-image" src="' + event.image + '" alt="' + event.name + ' banner">' +
            "<h3>" + event.name + "</h3>" +
            "<p><strong>Event ID:</strong> " + event.id + "</p>" +
            "<p><strong>Category:</strong> " + event.category + "</p>" +
            "<p><strong>Date/Time:</strong> " + event.date + ", " + event.time + "</p>" +
            "<p><strong>Venue:</strong> " + event.venue + "</p>" +
            "<p><strong>Entry Fee:</strong> " + event.fee + "</p>" +
            "<p><strong>Registration:</strong> " + event.registration + "</p>" +
            "<p><strong>Status:</strong> " + event.status + "</p>";
        eventList.appendChild(card);
    }
}

function isRegisterNumberValid(registerNumber) {
    return /^[A-Za-z0-9.]+$/.test(registerNumber) && registerNumber.length >= 6;
}

function isMobileValid(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

function findEvent(eventId) {
    for (var i = 0; i < sportsEvents.length; i++) {
        if (sportsEvents[i].id === eventId) {
            return sportsEvents[i];
        }
    }

    return null;
}

function setupParticipationForm() {
    var form = document.getElementById("participationForm");
    if (!form) {
        return;
    }

    fillEventSelect(document.getElementById("eventSelect"));
    setupTeamFields();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var message = document.getElementById("participationMessage");
        var name = document.getElementById("studentName").value.trim();
        var registerNumber = document.getElementById("registerNumber").value.trim();
        var email = document.getElementById("email").value.trim();
        var mobile = document.getElementById("mobile").value.trim();
        var department = document.getElementById("department").value.trim();
        var year = document.getElementById("year").value;
        var eventId = document.getElementById("eventSelect").value;
        var type = document.getElementById("participationType").value;
        var teamName = document.getElementById("teamName").value.trim();
        var teamMembers = document.getElementById("teamMembers").value;
        var selectedEvent = findEvent(eventId);

        if (!isRegisterNumberValid(registerNumber)) {
            message.textContent = "Enter a valid register number.";
            return;
        }

        if (!isMobileValid(mobile)) {
            message.textContent = "Mobile number must contain exactly 10 digits.";
            return;
        }

        if (type === "Team") {
            if (teamName === "" || teamMembers < 2 || teamMembers > 6) {
                message.textContent = "Team entries need a team name and 2 to 6 members.";
                return;
            }
        }

        if (selectedEvent && selectedEvent.registration === "Team" && type === "Individual") {
            message.textContent = "Individual registration is not allowed for team sports.";
            return;
        }

        if (selectedEvent && selectedEvent.registration === "Individual" && type === "Team") {
            message.textContent = "Team registration is not allowed for individual sports.";
            return;
        }

        if (selectedEvent && selectedEvent.status === "Closed") {
            message.textContent = "Registration is closed for this event.";
            return;
        }

        var entries = getStoredData("participations");
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].registerNumber === registerNumber && entries[i].eventId === eventId) {
                message.textContent = "Duplicate entry not allowed for the same register number and event.";
                return;
            }
        }

        entries.push({
            name: name,
            registerNumber: registerNumber,
            email: email,
            mobile: mobile,
            department: department,
            year: year,
            eventId: eventId,
            type: type,
            teamName: teamName,
            teamMembers: teamMembers
        });

        saveStoredData("participations", entries);
        message.textContent = "Registration successful.";
        form.reset();
    });
}

function setupTeamFields() {
    var participationType = document.getElementById("participationType");
    var teamFields = document.getElementsByClassName("team-field");
    var teamName = document.getElementById("teamName");
    var teamMembers = document.getElementById("teamMembers");

    if (!participationType) {
        return;
    }

    function updateTeamFields() {
        var shouldShow = participationType.value === "Team";

        for (var i = 0; i < teamFields.length; i++) {
            if (shouldShow) {
                teamFields[i].classList.add("show");
            } else {
                teamFields[i].classList.remove("show");
            }
        }

        teamName.required = shouldShow;
        teamMembers.required = shouldShow;

        if (!shouldShow) {
            teamName.value = "";
            teamMembers.value = "";
        }
    }

    participationType.addEventListener("change", updateTeamFields);
    updateTeamFields();
}

function setupFeedbackForm() {
    var form = document.getElementById("feedbackForm");
    if (!form) {
        return;
    }

    fillEventSelect(document.getElementById("feedbackEvent"));
    displayFeedback();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var message = document.getElementById("feedbackMessage");
        var name = document.getElementById("feedbackName").value.trim();
        var registerNumber = document.getElementById("feedbackRegister").value.trim();
        var eventId = document.getElementById("feedbackEvent").value;
        var rating = Number(document.getElementById("rating").value);
        var comments = document.getElementById("comments").value.trim();

        if (!isRegisterNumberValid(registerNumber)) {
            message.textContent = "Enter a valid register number.";
            return;
        }

        if (rating < 1 || rating > 5) {
            message.textContent = "Rating must be from 1 to 5.";
            return;
        }

        if (comments.length > 20) {
            message.textContent = "Comments must be 20 characters or less.";
            return;
        }

        var feedbacks = getStoredData("feedbacks");
        feedbacks.push({
            name: name,
            registerNumber: registerNumber,
            eventId: eventId,
            rating: rating,
            comments: comments
        });

        saveStoredData("feedbacks", feedbacks);
        message.textContent = "Feedback submitted successfully.";
        form.reset();
        displayFeedback();
    });
}

function displayFeedback() {
    var feedbackList = document.getElementById("feedbackList");
    var totalFeedback = document.getElementById("totalFeedback");
    var averageRating = document.getElementById("averageRating");

    if (!feedbackList || !totalFeedback || !averageRating) {
        return;
    }

    var feedbacks = getStoredData("feedbacks");
    var total = 0;

    feedbackList.innerHTML = "";
    for (var i = 0; i < feedbacks.length; i++) {
        total += feedbacks[i].rating;
        var item = document.createElement("div");
        item.className = "feedback-item";
        item.innerHTML =
            "<p><strong>" + feedbacks[i].name + "</strong> (" + feedbacks[i].registerNumber + ")</p>" +
            "<p>Event: " + feedbacks[i].eventId + "</p>" +
            "<p>Rating: " + feedbacks[i].rating + "/5</p>" +
            "<p>" + feedbacks[i].comments + "</p>";
        feedbackList.appendChild(item);
    }

    totalFeedback.textContent = feedbacks.length;
    averageRating.textContent = feedbacks.length === 0 ? "0" : (total / feedbacks.length).toFixed(1);
}

function showHomeDate() {
    var eventDate = document.getElementById("eventDate");
    if (eventDate) {
        eventDate.textContent = "12 February 2026 to 14 February 2026";
    }
}

function showCurrentTime() {
    var currentTime = document.getElementById("currentTime");
    if (!currentTime) {
        return;
    }

    currentTime.textContent = new Date().toLocaleString();
}

showHomeDate();
showCurrentTime();
setInterval(showCurrentTime, 1000);
showEvents();
setupParticipationForm();
setupFeedbackForm();
