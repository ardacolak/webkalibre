// Check if user is logged in
if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = '/';
}

// Mobil cihaz kontrolü (EN BAŞTA TANIMLANMALI)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Virtual Cursor Configuration
let virtualCursor = null;
let currentGazeX = 0;
let currentGazeY = 0;
let hoveredElement = null;
let hoverStartTime = 0;
let CLICK_DURATION = isMobile ? 2500 : 1500; // Mobilde daha uzun
let isHovering = false;
let clickEnabled = true;
let webgazerInitialized = false;

// Smoothing configuration for stable tracking (mobilde daha fazla)
let gazeHistory = [];
const SMOOTHING_WINDOW = isMobile ? 15 : 10;
const SMOOTHING_FACTOR = isMobile ? 0.2 : 0.3;
let smoothedX = 0;
let smoothedY = 0;
const UPDATE_THROTTLE = isMobile ? 100 : 30;
let lastUpdateTime = 0;

// Tıklama süresi (mobilde daha uzun)
const CLICK_DURATION_ADJUSTED = isMobile ? 2500 : 1500;

if (isMobile) {
    console.log('📱 Mobil mod aktif - Dashboard optimizasyonları');
    console.log(`   Smoothing: ${SMOOTHING_WINDOW}, FPS: ${1000/UPDATE_THROTTLE}`);
}

// Apply smoothing filter to reduce jitter
function applySmoothingFilter(x, y) {
    gazeHistory.push({ x: x, y: y });
    
    if (gazeHistory.length > SMOOTHING_WINDOW) {
        gazeHistory.shift();
    }
    
    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < gazeHistory.length; i++) {
        avgX += gazeHistory[i].x;
        avgY += gazeHistory[i].y;
    }
    avgX /= gazeHistory.length;
    avgY /= gazeHistory.length;
    
    smoothedX = smoothedX === 0 ? avgX : (smoothedX * (1 - SMOOTHING_FACTOR) + avgX * SMOOTHING_FACTOR);
    smoothedY = smoothedY === 0 ? avgY : (smoothedY * (1 - SMOOTHING_FACTOR) + avgY * SMOOTHING_FACTOR);
    
    return {
        x: Math.round(smoothedX),
        y: Math.round(smoothedY)
    };
}

// Initialize WebGazer on Dashboard
function initWebGazerDashboard() {
    console.log('Initializing WebGazer on Dashboard...');
    
    virtualCursor = document.getElementById('virtualCursor');
    
    webgazer.setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(function(data, elapsedTime) {
            if (data == null) return;
            
            // Throttle updates
            const now = Date.now();
            if (now - lastUpdateTime < UPDATE_THROTTLE) {
                return;
            }
            lastUpdateTime = now;
            
            // Apply smoothing
            const smoothed = applySmoothingFilter(data.x, data.y);
            
            updateVirtualCursor(smoothed.x, smoothed.y);
            checkGazeHover(smoothed.x, smoothed.y);
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
    webgazer.params.showVideo = !isMobile; // Mobilde gizle
    webgazer.params.showFaceOverlay = false;
    webgazer.params.showFaceFeedbackBox = false;
    
    // Mobilde düşük çözünürlük
    if (isMobile) {
        webgazer.params.videoWidth = 320;
        webgazer.params.videoHeight = 240;
    }
    
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

