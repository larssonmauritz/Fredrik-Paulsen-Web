// Get references to elements
const captionContainer = document.getElementById("captionContainer");
const displayImage = document.getElementById("display-image");
const textContainer = document.getElementById("textContainer");

// Event listeners for "Index" and "About" buttons
document.querySelector(".index-button").addEventListener("click", toggleIndex);
document.querySelector(".about-button").addEventListener("click", toggleAbout);

// Function to toggle the index container overlay
function toggleIndex() {
    const indexButton = document.querySelector(".index-button"); // Get the Index button
    const indexContainer = document.getElementById("indexContainer"); // Get the Index container

    if (isMobileScreen()) {
        const isActive = indexContainer.style.opacity === "1";
        indexContainer.style.opacity = isActive ? "0" : "1"; // Toggle visibility
        aboutContainer.style.display = "none";

        // Toggle the underline class
        if (isActive) {
            indexButton.classList.remove("active"); // Remove underline when inactive
        } else {
            indexButton.classList.add("active"); // Add underline when active
        }
    }
}

function toggleAbout() {
    const aboutContainer = document.getElementById("aboutContainer"); // Get About container
    const indexButton = document.querySelector(".index-button"); // Get the Index button

    if (isMobileScreen()) {
        const isAboutActive = aboutContainer.style.display === "block";
        aboutContainer.style.display = isAboutActive ? "none" : "block"; // Toggle About container
        document.getElementById("indexContainer").style.opacity = "0"; // Ensure Index container is hidden

        // Remove underline from Index button when About is active
        indexButton.classList.remove("active");
    }
}

// Ensure the active state for Index on load
window.addEventListener("load", () => {
    const indexContainer = document.getElementById("indexContainer");
    const indexButton = document.querySelector(".index-button");

    // Set the initial state for Index container and underline
    indexContainer.style.opacity = "1"; // Ensure Index container is visible
    indexButton.classList.add("active"); // Add underline to Index button
});




// Function to calculate the exact offset of a caption in the container
function calculateOffset(caption) {
    const containerRect = captionContainer.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();

    // Offset is the vertical distance from the container's top to the caption's top
    const offset = captionRect.top - containerRect.top + captionContainer.scrollTop;

    return offset;
}

// Function to smoothly scroll to a caption
function smoothScrollToCaption(caption, duration = 500) {
    const start = captionContainer.scrollTop;
    const targetOffset = calculateOffset(caption); // Get the exact offset for the caption
    const distance = targetOffset - start;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOut = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        captionContainer.scrollTop = start + distance * easeInOut;

        if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
        } else {
            updateImage();
            updateText();
        }
    }

    requestAnimationFrame(scrollAnimation);
}

// Function to scroll to the clicked caption
function scrollToCaption(event) {
    const caption = event.currentTarget;
    smoothScrollToCaption(caption, 500); // Scroll to the clicked caption
}

function updateImage() {
    const captions = captionContainer.querySelectorAll(".caption");
    const markerOffset = 10; // Adjust marker position by 10px
    const markerPosition = captionContainer.getBoundingClientRect().top + markerOffset;

    captions.forEach(caption => {
        const captionRect = caption.getBoundingClientRect();

        if (captionRect.top <= markerPosition && captionRect.bottom > markerPosition) {
            const imageSrc = caption.getAttribute("data-image");
            displayImage.src = imageSrc;
            displayImage.style.display = "block";
            caption.style.opacity = "1";
        } else {
            caption.style.opacity = "0.3";
        }
    });
}

function updateText() {
    const captions = captionContainer.querySelectorAll(".caption");
    const markerOffset = 10; // Adjust marker position by 10px
    const markerPosition = captionContainer.getBoundingClientRect().top + markerOffset;

    captions.forEach(caption => {
        const captionRect = caption.getBoundingClientRect();

        if (captionRect.top <= markerPosition && captionRect.bottom > markerPosition) {
            const textContent = caption.getAttribute("data-text");
            if (textContent) {
                document.querySelector("#textContainer p").textContent = textContent;
            }
        }
    });
}

// Debounce function to optimize scroll performance
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Event listeners for scroll updates
captionContainer.addEventListener("scroll", debounce(() => {
    updateImage();
    updateText();
}, 10));

// Event listeners for caption clicks
document.querySelectorAll(".caption").forEach(caption => {
    caption.addEventListener("click", event => {
        scrollToCaption(event);
    });
});

document.addEventListener("keydown", (event) => {
    const captions = [...captionContainer.querySelectorAll(".caption")]; // Get all captions
    const markerOffset = 10; // Adjust marker position by 10px
    const markerPosition = captionContainer.getBoundingClientRect().top + markerOffset;

    // Find the currently active caption
    const currentCaption = captions.find(caption => {
        const captionRect = caption.getBoundingClientRect();
        return captionRect.top <= markerPosition && captionRect.bottom > markerPosition;
    });

    if (currentCaption) {
        let targetCaption;
        if (event.key === "ArrowDown") {
            // Get the next caption
            const currentIndex = captions.indexOf(currentCaption);
            targetCaption = captions[currentIndex + 1];
        } else if (event.key === "ArrowUp") {
            // Get the previous caption
            const currentIndex = captions.indexOf(currentCaption);
            targetCaption = captions[currentIndex - 1];
        }

        // Scroll to the target caption if it exists
        if (targetCaption) {
            smoothScrollToCaption(targetCaption, 500);
        }
    }
});

// Check if the user is on a mobile screen
function isMobileScreen() {
    return window.innerWidth <= 768;
}

// Initialize the image and text on page load
window.addEventListener("load", () => {
    const firstCaption = captionContainer.querySelector(".caption");
    if (firstCaption) {
        const imageSrc = firstCaption.getAttribute("data-image");
        const textContent = firstCaption.getAttribute("data-text");
        displayImage.src = imageSrc;
        displayImage.style.display = "block";
        if (textContent) {
            document.querySelector("#textContainer p").textContent = textContent;
        }
    }
});