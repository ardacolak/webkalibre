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
const CLICK_DURATION = 1500; // 1.5 seconds to trigger click
let isHovering = false;
let clickEnabled = true;

// Initialize WebGazer
function initWebGazer() {
    console.log('Initializing WebGazer...');
    
    // Initialize virtual cursor
    virtualCursor = document.getElementById('virtualCursor');
    
    webgazer.setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(function(data, elapsedTime) {
            if (data == null) return;
            
            // Store gaze data
            gazeData.push({
                x: data.x,
                y: data.y,
                time: elapsedTime
            });
            
            // Update virtual cursor position
            updateVirtualCursor(data.x, data.y);
            
            // Check if looking at confirm button (for transfer confirmation)
            checkGazeOnButton(data.x, data.y);
            
            // Check for hover and potential click
            checkGazeHover(data.x, data.y);
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
    
    // Improve accuracy over time
    window.saveDataAcrossSessions = true;
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
    const points = [
        { x: '10%', y: '10%' },
        { x: '90%', y: '10%' },
        { x: '50%', y: '50%' },
        { x: '10%', y: '90%' },
        { x: '90%', y: '90%' }
    ];
    
    let currentPoint = 0;
    
    function showNextPoint() {
        if (currentPoint >= points.length) {
            updateWebGazerStatus('active');
            return;
        }
        
        const point = points[currentPoint];
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            left: ${point.x};
            top: ${point.y};
            width: 20px;
            height: 20px;
            background: red;
            border-radius: 50%;
            z-index: 10000;
            transform: translate(-50%, -50%);
            cursor: pointer;
            animation: pulse 1s infinite;
        `;
        
        document.body.appendChild(dot);
        
        dot.addEventListener('click', function() {
            document.body.removeChild(dot);
            currentPoint++;
            setTimeout(showNextPoint, 500);
        });
        
        // Auto-advance after 5 seconds
        setTimeout(() => {
            if (document.body.contains(dot)) {
                document.body.removeChild(dot);
                currentPoint++;
                showNextPoint();
            }
        }, 5000);
    }
    
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

