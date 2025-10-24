// Check if user is logged in
if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = '/';
}

// WebGazer Configuration
let webgazerInitialized = false;
let gazeData = [];
let isLookingAtButton = false;
let lookStartTime = 0;
const LOOK_DURATION = 3000; // 3 seconds

// Virtual Cursor Configuration
let virtualCursor = null;
let currentGazeX = 0;
let currentGazeY = 0;
let hoveredElement = null;
let hoverStartTime = 0;
let CLICK_DURATION = 1500; // 1.5 seconds to trigger click (will be adjusted for mobile)
let isHovering = false;
let clickEnabled = true;

// Mobil cihaz kontrolü
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Smoothing configuration for stable tracking (mobilde daha fazla)
let gazeHistory = [];
const SMOOTHING_WINDOW = isMobile ? 15 : 10; // Mobilde daha fazla smoothing
const SMOOTHING_FACTOR = isMobile ? 0.2 : 0.3; // Mobilde daha smooth
let smoothedX = 0;
let smoothedY = 0;
const UPDATE_THROTTLE = isMobile ? 100 : 50; // Mobilde 10 FPS, desktop'ta 20 FPS
let lastUpdateTime = 0;

// Tıklama süresi (mobilde daha uzun)
const CLICK_DURATION_ADJUSTED = isMobile ? 2500 : 1500;

// Log mobil modu
if (isMobile) {
    console.log('📱 Mobil mod aktif - Optimizasyonlar uygulandı');
    console.log(`   Smoothing: ${SMOOTHING_WINDOW}, Factor: ${SMOOTHING_FACTOR}`);
    console.log(`   FPS: ${1000/UPDATE_THROTTLE}, Click: ${CLICK_DURATION_ADJUSTED}ms`);
}

// Initialize WebGazer
function initWebGazer() {
    console.log('Initializing WebGazer...');
    
    // Mobil için tıklama süresini ayarla
    if (isMobile) {
        CLICK_DURATION = CLICK_DURATION_ADJUSTED;
    }
    
    // Initialize virtual cursor
    virtualCursor = document.getElementById('virtualCursor');
    
    webgazer.setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(function(data, elapsedTime) {
            if (data == null) return;
            
            // Throttle updates for stability
            const now = Date.now();
            if (now - lastUpdateTime < UPDATE_THROTTLE) {
                return;
            }
            lastUpdateTime = now;
            
            // Apply smoothing to gaze data
            const smoothed = applySmoothingFilter(data.x, data.y);
            
            // Store gaze data
            gazeData.push({
                x: smoothed.x,
                y: smoothed.y,
                time: elapsedTime
            });
            
            // Update virtual cursor position with smoothed data
            updateVirtualCursor(smoothed.x, smoothed.y);
            
            // Check if looking at confirm button (for transfer confirmation)
            checkGazeOnButton(smoothed.x, smoothed.y);
            
            // Check for hover and potential click
            checkGazeHover(smoothed.x, smoothed.y);
        })
        .begin()
        .then(() => {
            console.log('WebGazer started successfully');
            webgazerInitialized = true;
            updateWebGazerStatus('active');
            
            // Show virtual cursor
            if (virtualCursor) {
                virtualCursor.style.display = 'block';
            }
            
            // Show calibration button
            document.getElementById('calibrate-btn').style.display = 'inline-block';
        })
        .catch(err => {
            console.error('WebGazer initialization error:', err);
            updateWebGazerStatus('error');
        });
    
    // Store predictions
    webgazer.showPredictionPoints(false);
    
    // Apply Kalman filter for smoother tracking
    webgazer.applyKalmanFilter(true);
    
    // Set more stable parameters
    webgazer.params.showVideo = !isMobile; // Mobilde video gizle (performans için)
    webgazer.params.showFaceOverlay = false;
    webgazer.params.showFaceFeedbackBox = false;
    
    // Mobilde düşük çözünürlük
    if (isMobile) {
        webgazer.params.videoWidth = 320;
        webgazer.params.videoHeight = 240;
        console.log('📱 Mobil: Düşük çözünürlük video (320x240)');
    }
    
    // Improve accuracy over time
    window.saveDataAcrossSessions = true;
}

// Apply smoothing filter to reduce jitter
function applySmoothingFilter(x, y) {
    // Add to history
    gazeHistory.push({ x: x, y: y });
    
    // Keep only recent history
    if (gazeHistory.length > SMOOTHING_WINDOW) {
        gazeHistory.shift();
    }
    
    // Calculate moving average
    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < gazeHistory.length; i++) {
        avgX += gazeHistory[i].x;
        avgY += gazeHistory[i].y;
    }
    avgX /= gazeHistory.length;
    avgY /= gazeHistory.length;
    
    // Apply exponential smoothing
    smoothedX = smoothedX === 0 ? avgX : (smoothedX * (1 - SMOOTHING_FACTOR) + avgX * SMOOTHING_FACTOR);
    smoothedY = smoothedY === 0 ? avgY : (smoothedY * (1 - SMOOTHING_FACTOR) + avgY * SMOOTHING_FACTOR);
    
    return {
        x: Math.round(smoothedX),
        y: Math.round(smoothedY)
    };
}

// Update virtual cursor position
function updateVirtualCursor(x, y) {
    if (!virtualCursor) return;
    
    currentGazeX = x;
    currentGazeY = y;
    
    // Smooth cursor movement
    virtualCursor.style.left = x + 'px';
    virtualCursor.style.top = y + 'px';
}

// Check if gaze is hovering over a clickable element
function checkGazeHover(x, y) {
    if (!clickEnabled) return;
    
    // Get element at gaze position
    const element = document.elementFromPoint(x, y);
    
    if (!element) {
        resetHover();
        return;
    }
    
    // Check if element is clickable
    const isClickable = (
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.onclick !== null ||
        element.classList.contains('action-btn') ||
        element.classList.contains('tab-btn') ||
        element.type === 'submit' ||
        element.classList.contains('btn')
    );
    
    if (isClickable && element !== hoveredElement) {
        // New element hovered
        resetHover();
        hoveredElement = element;
        hoverStartTime = Date.now();
        isHovering = true;
        
        // Add hover effect
        element.classList.add('gaze-hover');
        virtualCursor.classList.add('hovering');
        
        // Start hover progress animation
        requestAnimationFrame(updateHoverProgress);
    } else if (!isClickable && hoveredElement) {
        // No longer hovering over clickable element
        resetHover();
    } else if (isClickable && element !== hoveredElement) {
        // Different clickable element
        resetHover();
    }
}

// Update hover progress
function updateHoverProgress() {
    if (!isHovering || !hoveredElement) return;
    
    const elapsed = Date.now() - hoverStartTime;
    const progress = Math.min(elapsed / CLICK_DURATION, 1);
    
    // Update progress circle
    const circle = document.getElementById('cursorProgressCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 26; // radius = 26
        const offset = circumference - (progress * circumference);
        circle.style.strokeDashoffset = offset;
    }
    
    if (progress >= 1) {
        // Trigger click
        performGazeClick();
    } else {
        requestAnimationFrame(updateHoverProgress);
    }
}

// Perform gaze-triggered click
function performGazeClick() {
    if (!hoveredElement) return;
    
    console.log('Gaze click triggered on:', hoveredElement);
    
    // Add click animation
    virtualCursor.classList.add('clicking');
    
    // Visual feedback
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
        document.body.removeChild(ripple);
        virtualCursor.classList.remove('clicking');
    }, 500);
    
    // Trigger actual click
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
    
    // Reset progress circle
    const circle = document.getElementById('cursorProgressCircle');
    if (circle) {
        circle.style.strokeDashoffset = 163.36;
    }
}

// Toggle click functionality
function toggleGazeClick(enabled) {
    clickEnabled = enabled;
    if (!enabled) {
        resetHover();
    }
}

// Update WebGazer status
function updateWebGazerStatus(status) {
    const statusElement = document.getElementById('webgazer-status');
    const statusText = document.getElementById('status-text');
    
    switch(status) {
        case 'active':
            statusElement.classList.add('active');
            statusText.textContent = 'Göz takibi aktif';
            break;
        case 'calibrating':
            statusText.textContent = 'Kalibrasyon yapılıyor...';
            break;
        case 'error':
            statusText.textContent = 'Göz takibi başlatılamadı';
            break;
        default:
            statusText.textContent = 'Göz takibi başlatılıyor...';
    }
}

// Calibration
document.getElementById('calibrate-btn')?.addEventListener('click', function() {
    updateWebGazerStatus('calibrating');
    
    // Show calibration points
    showCalibrationPoints();
});

function showCalibrationPoints() {
    // More calibration points for better accuracy
    const points = [
        // Corners
        { x: '10%', y: '10%' },
        { x: '90%', y: '10%' },
        { x: '90%', y: '90%' },
        { x: '10%', y: '90%' },
        // Center and mid points
        { x: '50%', y: '50%' },
        { x: '50%', y: '10%' },
        { x: '50%', y: '90%' },
        { x: '10%', y: '50%' },
        { x: '90%', y: '50%' }
    ];
    
    let currentPoint = 0;
    let clickCount = 0;
    const CLICKS_REQUIRED = 5; // Require 5 clicks per point for better calibration
    
    function showNextPoint() {
        if (currentPoint >= points.length) {
            updateWebGazerStatus('active');
            // Reset smoothing after calibration
            gazeHistory = [];
            smoothedX = 0;
            smoothedY = 0;
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4CAF50;
                color: white;
                padding: 20px 40px;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            successMsg.textContent = '✅ Kalibrasyon Tamamlandı!';
            document.body.appendChild(successMsg);
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 2000);
            return;
        }
        
        const point = points[currentPoint];
        clickCount = 0;
        
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            left: ${point.x};
            top: ${point.y};
            width: 30px;
            height: 30px;
            background: #FF6B00;
            border: 3px solid white;
            border-radius: 50%;
            z-index: 10000;
            transform: translate(-50%, -50%);
            cursor: pointer;
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.6);
            animation: pulse 1.5s infinite;
        `;
        
        const counter = document.createElement('div');
        counter.style.cssText = `
            position: fixed;
            left: ${point.x};
            top: calc(${point.y} + 40px);
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10001;
        `;
        counter.textContent = `${currentPoint + 1}/${points.length} - ${clickCount}/${CLICKS_REQUIRED}`;
        
        document.body.appendChild(dot);
        document.body.appendChild(counter);
        
        dot.addEventListener('click', function() {
            clickCount++;
            counter.textContent = `${currentPoint + 1}/${points.length} - ${clickCount}/${CLICKS_REQUIRED}`;
            
            // Visual feedback
            dot.style.background = '#4CAF50';
            setTimeout(() => {
                if (document.body.contains(dot)) {
                    dot.style.background = '#FF6B00';
                }
            }, 200);
            
            if (clickCount >= CLICKS_REQUIRED) {
                document.body.removeChild(dot);
                document.body.removeChild(counter);
                currentPoint++;
                setTimeout(showNextPoint, 800);
            }
        });
        
        // Auto-advance after 10 seconds
        setTimeout(() => {
            if (document.body.contains(dot)) {
                document.body.removeChild(dot);
                document.body.removeChild(counter);
                currentPoint++;
                showNextPoint();
            }
        }, 10000);
    }
    
    // Show instruction
    const instruction = document.createElement('div');
    instruction.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: bold;
        z-index: 10002;
        text-align: center;
    `;
    instruction.innerHTML = '🎯 Kalibrasyon<br><small>Her noktaya 5 kez tıklayın</small>';
    document.body.appendChild(instruction);
    
    setTimeout(() => {
        if (document.body.contains(instruction)) {
            document.body.removeChild(instruction);
        }
    }, 12000);
    
    showNextPoint();
}

// Check if gaze is on button
function checkGazeOnButton(x, y) {
    const button = document.getElementById('gazeConfirmBtn');
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const isLooking = (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
    
    if (isLooking && !isLookingAtButton) {
        // Started looking
        isLookingAtButton = true;
        lookStartTime = Date.now();
        updateGazeProgress();
    } else if (!isLooking && isLookingAtButton) {
        // Stopped looking
        isLookingAtButton = false;
        resetGazeProgress();
    }
}

// Update gaze progress
function updateGazeProgress() {
    if (!isLookingAtButton) return;
    
    const elapsed = Date.now() - lookStartTime;
    const progress = Math.min(elapsed / LOOK_DURATION, 1);
    
    // Update progress circle
    const circle = document.getElementById('gazeProgressCircle');
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset;
    
    // Update status text
    const statusText = document.getElementById('gazeStatus');
    statusText.textContent = `${Math.round(progress * 100)}% tamamlandı`;
    
    if (progress >= 1) {
        // Completed!
        isLookingAtButton = false;
        submitTransfer();
    } else {
        requestAnimationFrame(updateGazeProgress);
    }
}

// Reset gaze progress
function resetGazeProgress() {
    const circle = document.getElementById('gazeProgressCircle');
    circle.style.strokeDashoffset = 339.292;
    
    const statusText = document.getElementById('gazeStatus');
    statusText.textContent = 'Butona bakın...';
}

// Transfer form handling
const transferForm = document.getElementById('transferForm');
const amountInput = document.getElementById('amount');

// Update summary on amount change
amountInput?.addEventListener('input', function() {
    const amount = parseFloat(this.value) || 0;
    const fee = 0; // Free transfer
    const total = amount + fee;
    
    document.getElementById('summaryAmount').textContent = `₺${amount.toFixed(2)}`;
    document.getElementById('summaryFee').textContent = `₺${fee.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `₺${total.toFixed(2)}`;
});

// Transfer type selection
function selectTransferType(type) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide relevant sections
    document.getElementById('ibanSection').style.display = type === 'iban' ? 'flex' : 'none';
    document.getElementById('phoneSection').style.display = type === 'phone' ? 'flex' : 'none';
    document.getElementById('savedSection').style.display = type === 'saved' ? 'flex' : 'none';
}

// Form submission
transferForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide submit button, show gaze confirmation
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('gazeConfirmation').style.display = 'block';
    
    // Scroll to gaze confirmation
    document.getElementById('gazeConfirmation').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Update gaze status
    document.getElementById('gazeStatus').textContent = 'Butona bakın...';
});

// Submit transfer
function submitTransfer() {
    const recipientName = document.getElementById('recipientName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const txId = 'TX' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Show success modal
    document.getElementById('modalRecipient').textContent = recipientName;
    document.getElementById('modalAmount').textContent = `₺${amount.toFixed(2)}`;
    document.getElementById('modalTxId').textContent = txId;
    document.getElementById('successModal').style.display = 'flex';
    
    // Stop WebGazer
    if (webgazerInitialized) {
        webgazer.pause();
    }
}

// Navigation functions
function goBack() {
    window.location.href = '/dashboard';
}

function goToDashboard() {
    window.location.href = '/dashboard';
}

function logout() {
    sessionStorage.clear();
    if (webgazerInitialized) {
        webgazer.end();
    }
    window.location.href = '/';
}

// IBAN formatting
document.getElementById('recipientIban')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted.toUpperCase();
});

// Phone formatting
document.getElementById('recipientPhone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substr(0, 10);
    
    let formatted = value;
    if (value.length > 3) {
        formatted = value.substr(0, 3) + ' ' + value.substr(3);
    }
    if (value.length > 6) {
        formatted = value.substr(0, 3) + ' ' + value.substr(3, 3) + ' ' + value.substr(6);
    }
    if (value.length > 8) {
        formatted = value.substr(0, 3) + ' ' + value.substr(3, 3) + ' ' + value.substr(6, 2) + ' ' + value.substr(8);
    }
    
    e.target.value = formatted;
});

// Initialize WebGazer when page loads
window.addEventListener('load', function() {
    setTimeout(initWebGazer, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (webgazerInitialized) {
        webgazer.end();
    }
});

