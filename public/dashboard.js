// Check if user is logged in
if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = '/';
}

// Virtual Cursor Configuration
let virtualCursor = null;
let currentGazeX = 0;
let currentGazeY = 0;
let hoveredElement = null;
let hoverStartTime = 0;
const CLICK_DURATION = 1500; // 1.5 seconds to trigger click
let isHovering = false;
let clickEnabled = true;
let webgazerInitialized = false;

// Initialize WebGazer on Dashboard
function initWebGazerDashboard() {
    console.log('Initializing WebGazer on Dashboard...');
    
    virtualCursor = document.getElementById('virtualCursor');
    
    webgazer.setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(function(data, elapsedTime) {
            if (data == null) return;
            
            updateVirtualCursor(data.x, data.y);
            checkGazeHover(data.x, data.y);
        })
        .begin()
        .then(() => {
            console.log('WebGazer started on Dashboard');
            webgazerInitialized = true;
            
            if (virtualCursor) {
                virtualCursor.style.display = 'block';
            }
        })
        .catch(err => {
            console.error('WebGazer initialization error:', err);
        });
    
    webgazer.showPredictionPoints(false);
    webgazer.applyKalmanFilter(true);
    window.saveDataAcrossSessions = true;
}

// Update virtual cursor position
function updateVirtualCursor(x, y) {
    if (!virtualCursor) return;
    
    currentGazeX = x;
    currentGazeY = y;
    virtualCursor.style.left = x + 'px';
    virtualCursor.style.top = y + 'px';
}

// Check if gaze is hovering over a clickable element
function checkGazeHover(x, y) {
    if (!clickEnabled) return;
    
    const element = document.elementFromPoint(x, y);
    
    if (!element) {
        resetHover();
        return;
    }
    
    const isClickable = (
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.onclick !== null ||
        element.classList.contains('action-btn') ||
        element.classList.contains('btn') ||
        element.classList.contains('logout-btn')
    );
    
    if (isClickable && element !== hoveredElement) {
        resetHover();
        hoveredElement = element;
        hoverStartTime = Date.now();
        isHovering = true;
        
        element.classList.add('gaze-hover');
        virtualCursor.classList.add('hovering');
        
        requestAnimationFrame(updateHoverProgress);
    } else if (!isClickable && hoveredElement) {
        resetHover();
    }
}

// Update hover progress
function updateHoverProgress() {
    if (!isHovering || !hoveredElement) return;
    
    const elapsed = Date.now() - hoverStartTime;
    const progress = Math.min(elapsed / CLICK_DURATION, 1);
    
    const circle = document.getElementById('cursorProgressCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 26;
        const offset = circumference - (progress * circumference);
        circle.style.strokeDashoffset = offset;
    }
    
    if (progress >= 1) {
        performGazeClick();
    } else {
        requestAnimationFrame(updateHoverProgress);
    }
}

// Perform gaze-triggered click
function performGazeClick() {
    if (!hoveredElement) return;
    
    console.log('Gaze click triggered on:', hoveredElement);
    
    virtualCursor.classList.add('clicking');
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${currentGazeX}px;
        top: ${currentGazeY}px;
        width: 20px;
        height: 20px;
        background: rgba(255, 107, 0, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10000;
        animation: clickPulse 0.5s ease;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
        }
        virtualCursor.classList.remove('clicking');
    }, 500);
    
    setTimeout(() => {
        hoveredElement.click();
        resetHover();
    }, 100);
}

// Reset hover state
function resetHover() {
    if (hoveredElement) {
        hoveredElement.classList.remove('gaze-hover');
        hoveredElement = null;
    }
    
    isHovering = false;
    hoverStartTime = 0;
    
    if (virtualCursor) {
        virtualCursor.classList.remove('hovering');
    }
    
    const circle = document.getElementById('cursorProgressCircle');
    if (circle) {
        circle.style.strokeDashoffset = 163.36;
    }
}

// Navigate to transfer page
function goToTransfer() {
    if (webgazerInitialized) {
        webgazer.pause();
    }
    window.location.href = '/transfer';
}

// Logout function
function logout() {
    sessionStorage.clear();
    if (webgazerInitialized) {
        webgazer.end();
    }
    window.location.href = '/';
}

// Add animations on load
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.balance-card, .action-btn, .transaction-item');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideUp 0.5s ease forwards';
        }, index * 50);
    });
    
    // Initialize WebGazer after a short delay
    setTimeout(initWebGazerDashboard, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (webgazerInitialized) {
        webgazer.end();
    }
});

