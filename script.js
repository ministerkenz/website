// Cloud navigation functionality
const cloudButtons = document.querySelectorAll('.cloud-button');
const cloudOverlay = document.querySelector('.cloud-overlay');
const cloudContents = document.querySelectorAll('.cloud-content');
const closeButtons = document.querySelectorAll('.close-cloud');

// Add click event listeners to cloud buttons
cloudButtons.forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        const content = document.getElementById(`${section}-content`);
        
        // Activate cloud animation
        button.classList.add('active');
        
        // Show overlay and content after animation
        setTimeout(() => {
            cloudOverlay.classList.add('active');
            content.classList.add('active');
        }, 400);
    });
});

// Function to close cloud modals
function closeCloud() {
    // Hide content and overlay
    cloudContents.forEach(content => content.classList.remove('active'));
    cloudOverlay.classList.remove('active');
    
    // Return cloud to original position
    setTimeout(() => {
        cloudButtons.forEach(button => button.classList.remove('active'));
    }, 100);
}

// Close on X button click
closeButtons.forEach(button => {
    button.addEventListener('click', closeCloud);
});

// Close on overlay click
cloudOverlay.addEventListener('click', closeCloud);

// Close on escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCloud();
    }
});

// Prevent cloud content from closing when clicking inside the modal
cloudContents.forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Add hover effects to clouds (only for non-touch devices)
if (window.matchMedia('(hover: hover)').matches) {
    cloudButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                button.style.transform = 'scale(1.1)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.transform = 'scale(1)';
            }
        });
    });
}

// Add touch feedback for mobile devices
cloudButtons.forEach(button => {
    button.addEventListener('touchstart', () => {
        if (!button.classList.contains('active')) {
            button.style.transform = 'scale(0.95)';
        }
    }, { passive: true });
    
    button.addEventListener('touchend', () => {
        if (!button.classList.contains('active')) {
            button.style.transform = 'scale(1)';
        }
    }, { passive: true });
});

//Image track functionality
const track = document.getElementById("image-track");

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
   
    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards"});

    for(const image of track.getElementsByClassName("image")){
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards"});
    }
}

const fadeZoneWidth = window.innerWidth * 0.1; // 10% of screen width


function updateImageOpacity() {
    const trackRect = track.getBoundingClientRect();
    const images = track.querySelectorAll(".image");
    const windowWidth = window.innerWidth;

    const fadeZoneWidth = 200; // pixels from start/end of track to begin fading

    images.forEach(image => {
        const imgRect = image.getBoundingClientRect();
        const imgLeft = imgRect.left;
        const imgRight = imgRect.right;

        let opacity = 1;

        // Fade near the left edge
        if (imgLeft < fadeZoneWidth) {
            opacity = (imgLeft / fadeZoneWidth);
        }

        // Fade near the right edge
        else if (imgRight > windowWidth - fadeZoneWidth) {
            opacity = (windowWidth - imgRight) / fadeZoneWidth;
        }

        // Clamp to 0–1
        opacity = Math.max(0, Math.min(1, opacity));

        image.style.opacity = opacity;
    });
}


// Update opacity continuously with scroll/drag
window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;
   
    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards"});

    for(const image of track.getElementsByClassName("image")){
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards"});
    }

    updateImageOpacity();
};

// Also update on resize to reposition correctly
window.addEventListener('resize', updateImageOpacity);

window.addEventListener('load', updateImageOpacity);





// Image cycling functionality
const imageArray = [
    'assets/default.png',
    'assets/studying.png',
    'assets/forgetful.png',
    'assets/angry.png',
    'assets/overwhelming joy.png',
    'assets/sad.png',
    'assets/disgust.png',
    'assets/greedy.png'
];

let currentImageIndex = 0;

// Get the cycling image element
const cyclingImage = document.getElementById('cycling-image');

// Function to cycle images
function cycleImage() {
    // Add fade out effect
    cyclingImage.classList.add('fade-out');
    
    // After fade out completes, change image and fade back in
    setTimeout(() => {
        // Move to next image in array
        currentImageIndex = (currentImageIndex + 1) % imageArray.length;
        
        // Change the image source
        cyclingImage.src = imageArray[currentImageIndex];
        
        // Remove fade out class to fade back in
        cyclingImage.classList.remove('fade-out');
    }, 150); // Half of the CSS transition duration
}

// Add both click and touch event listeners for image cycling
cyclingImage.addEventListener('click', cycleImage);
cyclingImage.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double-firing on mobile
    cycleImage();
}, { passive: false });

// Background Music Functionality
const backgroundMusic = document.getElementById('backgroundMusic');
const creucatGif = document.getElementById('creucat-gif');

// Set initial volume for background music
backgroundMusic.volume = 0.3; // 30% volume, adjust as needed

// Music toggle functionality
let isPlaying = false;

// Function to toggle music
function toggleMusic() {
    if (isPlaying) {
        // Pause music
        backgroundMusic.pause();
        creucatGif.classList.remove('dancing');
        creucatGif.src = 'creucat-still.png'; // Static image when paused
        creucatGif.title = 'Click to play music';
        isPlaying = false;
    } else {
        // Play music with better error handling
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                creucatGif.classList.add('dancing');
                creucatGif.src = 'creucat-dancing.gif'; // Animated GIF when playing
                creucatGif.title = 'Click to pause music';
                isPlaying = true;
            }).catch(error => {
                console.log('Music playback failed:', error);
                // Show user-friendly message
                if (error.name === 'NotAllowedError') {
                    alert('Please interact with the page first to enable audio playback.');
                } else {
                    alert('Unable to play background music. Please check that the audio file exists.');
                }
            });
        }
    }
}

// Add both click and touch event listeners for music control
creucatGif.addEventListener('click', toggleMusic);
creucatGif.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double-firing on mobile
    toggleMusic();
}, { passive: false });

// Handle music ending (for non-looping scenarios)
backgroundMusic.addEventListener('ended', function() {
    creucatGif.classList.remove('dancing');
    creucatGif.src = 'creucat-still.png';
    creucatGif.title = 'Click to play music';
    isPlaying = false;
});

// Handle music errors
backgroundMusic.addEventListener('error', function(e) {
    console.log('Background music error:', e);
    creucatGif.classList.remove('dancing');
    creucatGif.src = 'creucat-still.png';
    creucatGif.title = 'Click to play music';
    isPlaying = false;
});

// Auto-pause music when page becomes hidden (user switches tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying) {
        backgroundMusic.pause();
        creucatGif.classList.remove('dancing');
        creucatGif.src = 'creucat-still.png';
        creucatGif.title = 'Click to play music';
        isPlaying = false;
    }
});

// Mobile-specific optimizations
// Prevent default touch behaviors that might interfere
document.addEventListener('touchmove', function(e) {
    // Allow scrolling in cloud content modals
    if (e.target.closest('.cloud-content')) {
        return;
    }
    // Prevent overscroll on iOS
    if (e.target === document.body) {
        e.preventDefault();
    }
}, { passive: false });

// Improve touch responsiveness
document.addEventListener('touchstart', function() {
    // This empty touch handler helps with iOS responsiveness
}, { passive: true });

// Handle orientation changes on mobile
window.addEventListener('orientationchange', function() {
    // Small delay to ensure proper rendering after orientation change
    setTimeout(() => {
        // Force recalculation of cloud positions if needed
        cloudButtons.forEach(button => {
            if (button.classList.contains('active')) {
                button.style.transform = 'translate(-50%, -50%) scale(3)';
            }
        });
    }, 100);
});

// Prevent zoom on double-tap for specific elements
const preventZoomElements = [cyclingImage, creucatGif, ...cloudButtons];
preventZoomElements.forEach(element => {
    element.addEventListener('touchend', function(e) {
        e.preventDefault();
    }, { passive: false });
});

// Audio context unlock for mobile browsers (iOS Safari requirement)
let audioUnlocked = false;

function unlockAudio() {
    if (!audioUnlocked) {
        // Create a temporary audio buffer to unlock the audio context
        const tempAudio = document.createElement('audio');
        tempAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        tempAudio.play().then(() => {
            audioUnlocked = true;
        }).catch(() => {
            // Silently fail if audio unlock doesn't work
        });
    }
}

// Unlock audio on first user interaction
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

// Add smooth scrolling for mobile
document.documentElement.style.scrollBehavior = 'smooth';

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize resize handling
const handleResize = debounce(() => {
    // Recalculate positions if needed
    if (document.querySelector('.cloud-content.active')) {
        // Ensure modal is still centered after resize
        const activeContent = document.querySelector('.cloud-content.active');
        activeContent.style.transform = 'translate(-50%, -50%)';
    }
}, 250);

window.addEventListener('resize', handleResize);