// SetuConnect Core Application Logic

// Global Application State
let db = {
  workers: [],
  employers: [],
  employments: [],
  notifications: [],
  schemes: []
};

let currentUser = null; // Currently logged in user object
let currentRole = null; // 'worker', 'employer', or 'admin'
let selectedLanguage = 'english'; // Default language

// Speech Recognition & Synthesis Engines
let speechRecognition = null;
let speechSynth = window.speechSynthesis;

// Translation mappings for Speech Output & Prompts
const TRANSLATIONS = {
  english: {
    welcome: "Welcome to SetuConnect. How can I help you today?",
    listening: "Listening... Speak now",
    notUnderstood: "Sorry, I didn't catch that. Please try again.",
    noSpeechSupport: "Speech recognition is not supported in this browser.",
    navigatingSchemes: "Showing available welfare schemes.",
    navigatingJobs: "Opening your work passbook.",
    navigatingHealth: "Showing nearby health services.",
    navigatingProfile: "Opening your digital ID card.",
    navigatingNotif: "Showing your notifications.",
    jobAdded: "New employment added successfully.",
    verified: "Identity verified successfully. Your Portable ID is ready."
  },
  hindi: {
    welcome: "सेतुकनेक्ट में आपका स्वागत है। आज मैं आपकी क्या मदद कर सकता हूँ?",
    listening: "सुन रहा हूँ... अब बोलें",
    notUnderstood: "माफ़ कीजिये, मैं समझ नहीं पाया। कृपया फिर से प्रयास करें।",
    noSpeechSupport: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है।",
    navigatingSchemes: "उपलब्ध कल्याणकारी योजनाएं दिखा रहा हूँ।",
    navigatingJobs: "आपका काम पासबुक खोल रहा हूँ।",
    navigatingHealth: "आस-पास की स्वास्थ्य सेवाएं दिखा रहा हूँ।",
    navigatingProfile: "आपका डिजिटल पहचान पत्र खोल रहा हूँ।",
    navigatingNotif: "आपकी सूचनाएं दिखा रहा हूँ।",
    jobAdded: "नया रोजगार सफलतापूर्वक जोड़ दिया गया है।",
    verified: "पहचान सफलतापूर्वक सत्यापित हो गई है।"
  },
  telugu: {
    welcome: "సేతుకనెక్ట్ కి స్వాగతం. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
    listening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
    notUnderstood: "క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    noSpeechSupport: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ లేదు.",
    navigatingSchemes: "అందుబాటులో ఉన్న సంక్షేమ పథకాలను చూపిస్తున్నాను.",
    navigatingJobs: "మీ పని పాస్‌బుక్‌ను ఓపెన్ చేస్తున్నాను.",
    navigatingHealth: "దగ్గరలోని ఆరోగ్య సేవలను చూపిస్తున్నాను.",
    navigatingProfile: "మీ డిజిటల్ ఐడి కార్డ్‌ను ఓపెన్ చేస్తున్నాను.",
    navigatingNotif: "మీ నోటిఫికేషన్‌లను చూపిస్తున్నాను.",
    jobAdded: "కొత్త ఉపాధి విజయవంతంగా జోడించబడింది.",
    verified: "గుర్తింపు విజయవంతంగా ధృవీకరించబడింది."
  },
  tamil: {
    welcome: "சேதுகனெக்ட் உங்களை வரவேற்கிறது. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    listening: "கேட்கிறது... இப்போது பேசுங்கள்",
    notUnderstood: "மன்னிக்கவும், எனக்கு புரியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    noSpeechSupport: "இந்த உலாவியில் பேச்சு அங்கீகாரம் ஆதரிக்கப்படவில்லை.",
    navigatingSchemes: "கிடைக்கக்கூடிய நலத்திட்டங்களை காட்டுகிறது.",
    navigatingJobs: "உங்கள் பணி பாஸ்புக்கை திறக்கிறது.",
    navigatingHealth: "அருகிலுள்ள சுகாதார சேவைகளைக் காட்டுகிறது.",
    navigatingProfile: "உங்கள் டிஜிட்டல் அடையாள அட்டையைத் திறக்கிறது.",
    navigatingNotif: "உங்கள் அறிவிப்புகளைக் காட்டுகிறது.",
    jobAdded: "புதிய வேலைவாய்ப்பு வெற்றிகரமாக சேர்க்கப்பட்டது.",
    verified: "அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது."
  },
  kannada: {
    welcome: "ಸೇತುಕನೆಕ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ",
    notUnderstood: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.",
    noSpeechSupport: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
    navigatingSchemes: "ಲಭ್ಯವಿರುವ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    navigatingJobs: "ನಿಮ್ಮ ಕೆಲಸದ ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.",
    navigatingHealth: "ಹತ್ತಿರದ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    navigatingProfile: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಐಡಿ ಕಾರ್ಡ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.",
    navigatingNotif: "ನಿಮ್ಮ ಅಧಿಸೂಚನೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    jobAdded: "ಹೊಸ ಉದ್ಯೋಗವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ.",
    verified: "ಗುರುತು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ."
  }
};

// Map languages to Speech API locale codes
const LOCALE_MAP = {
  english: 'en-IN',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  tamil: 'ta-IN',
  kannada: 'kn-IN'
};

// Initialize Databases & LocalStorage
function initDatabase() {
  const getStored = (key, seedData) => {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(val);
  };

  db.workers = getStored('setu_workers', DEFAULT_WORKERS);
  db.employers = getStored('setu_employers', DEFAULT_EMPLOYERS);
  db.employments = getStored('setu_employments', DEFAULT_EMPLOYMENTS);
  db.notifications = getStored('setu_notifications', DEFAULT_NOTIFICATIONS);
  db.schemes = getStored('setu_schemes', INITIAL_SCHEMES);
  db.nodalOfficers = getStored('setu_nodal_officers', typeof DEFAULT_NODAL_OFFICERS !== 'undefined' ? DEFAULT_NODAL_OFFICERS : []);
  db.grievances = getStored('setu_grievances', typeof DEFAULT_GRIEVANCES !== 'undefined' ? DEFAULT_GRIEVANCES : []);
  db.stateRequests = getStored('setu_state_requests', typeof DEFAULT_STATE_REQUESTS !== 'undefined' ? DEFAULT_STATE_REQUESTS : []);

  // Ensure all workers have state-prefixed IDs (BR-MW-..., UP-MW-...)
  let migrated = false;
  db.workers = db.workers.map(w => {
    if (w.id && (w.id.startsWith('W-') || !w.id.includes('-MW-'))) {
      const oldId = w.id;
      w.id = generateMigrantWorkerID(w.homeState || 'Bihar');
      db.employments.forEach(e => { if (e.workerId === oldId) e.workerId = w.id; });
      db.notifications.forEach(n => { if (n.workerId === oldId) n.workerId = w.id; });
      migrated = true;
    }
    return w;
  });
  if (migrated) {
    saveDB('setu_workers', db.workers);
    saveDB('setu_employments', db.employments);
  }
}

function saveDB(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Router & Screen Navigation
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.app-screen-view').forEach(screen => {
    screen.classList.add('hidden');
  });

  // Show selected screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update navbar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.screen === screenId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Hide main header or show depending on screen
  const noHeaderScreens = ['auth-screen', 'register-screen', 'ekyc-screen'];
  if (noHeaderScreens.includes(screenId)) {
    document.querySelector('.app-header').classList.add('hidden');
    document.querySelector('.app-navbar').classList.add('hidden');
    document.querySelector('.voice-assistant-trigger').classList.add('hidden');
  } else {
    document.querySelector('.app-header').classList.remove('hidden');
    // Hide bottom navbar if employer, admin or nodal
    if (currentRole === 'worker') {
      document.querySelector('.app-navbar').classList.remove('hidden');
      document.querySelector('.voice-assistant-trigger').classList.remove('hidden');
    } else {
      document.querySelector('.app-navbar').classList.add('hidden');
      document.querySelector('.voice-assistant-trigger').classList.add('hidden');
    }
  }

  // Update header role badge based on role
  const roleBadge = document.getElementById('app-header-role-badge');
  if (roleBadge) {
    if (currentRole === 'nodal') {
      roleBadge.innerText = `${currentUser.stateCode || currentUser.state} Nodal`;
      roleBadge.classList.remove('hidden');
    } else if (currentRole === 'admin') {
      roleBadge.innerText = "National Admin";
      roleBadge.classList.remove('hidden');
    } else if (currentRole === 'employer') {
      roleBadge.innerText = "Employer";
      roleBadge.classList.remove('hidden');
    } else {
      roleBadge.classList.add('hidden');
    }
  }

  // Perform screen specific updates
  if (screenId === 'dashboard-screen') {
    renderDashboard();
  } else if (screenId === 'passbook-screen') {
    renderPassbook();
  } else if (screenId === 'welfare-screen') {
    renderWelfare();
  } else if (screenId === 'health-screen') {
    renderHealth();
  } else if (screenId === 'notif-screen') {
    renderNotifications();
  } else if (screenId === 'admin-screen') {
    renderAdminDashboard();
  } else if (screenId === 'employer-screen') {
    renderEmployerDashboard();
  } else if (screenId === 'nodal-screen') {
    renderNodalDashboard();
  } else if (screenId === 'grievance-screen') {
    renderWorkerGrievances();
  }
}

// Custom Toast Toast Notification Manager
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let borderColor = 'var(--primary)';
  if (type === 'error') borderColor = 'var(--danger)';
  if (type === 'warning') borderColor = 'var(--warning)';
  if (type === 'info') borderColor = 'var(--info)';
  
  toast.style.borderLeftColor = borderColor;
  toast.innerHTML = `
    <span>${message}</span>
    <i class="fas fa-times" style="margin-left:12px; cursor:pointer;" onclick="this.parentElement.remove()"></i>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// SMS / OTP Simulation Toast Trigger
function simulateSMS(phone, code) {
  setTimeout(() => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'toast';
    alertDiv.style.borderLeftColor = 'var(--secondary)';
    alertDiv.style.background = '#1e1f29';
    alertDiv.innerHTML = `
      <div>
        <strong style="color:var(--secondary);display:block;font-size:0.75rem;margin-bottom:2px;">✉️ SMS RECEIVER (SIMULATED)</strong>
        <span>SetuConnect OTP is: <strong>${code}</strong> for +91 ${phone}</span>
      </div>
    `;
    document.getElementById('toast-container').appendChild(alertDiv);
  }, 1000);
}

// --- PHASE 1 & 2: User Registration & OTP Login ---
let generatedOTP = null;
let tempRegisterData = null;

// Generate standardized State-Prefixed Migrant Worker ID
function generateMigrantWorkerID(homeState) {
  const code = (typeof STATE_CODES !== 'undefined' && STATE_CODES[homeState]) ? STATE_CODES[homeState] : "MW";
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${code}-MW-${year}-${rand}`;
}

function handleLoginSubmit() {
  const phone = document.getElementById('login-phone').value;
  if (!phone || phone.length !== 10) {
    showToast("Please enter a valid 10-digit mobile number.", "error");
    return;
  }

  // Admin bypass
  if (phone === '9999999999') {
    currentRole = 'admin';
    currentUser = { name: "National Registry Admin" };
    showToast("Welcome National Administrator!", "success");
    showScreen('admin-screen');
    return;
  }

  // State Nodal Officer login
  const nodal = db.nodalOfficers.find(n => n.phone === phone);
  if (nodal) {
    currentUser = nodal;
    currentRole = 'nodal';
    showToast(`Welcome ${nodal.name} (${nodal.state} Nodal Desk)!`, "success");
    showScreen('nodal-screen');
    return;
  }

  // Check if Worker exists
  const worker = db.workers.find(w => w.phone === phone);
  if (worker) {
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    simulateSMS(phone, generatedOTP);
    showToast("OTP code sent to mobile.", "info");
    
    // Show OTP panel
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('otp-verification-container').classList.remove('hidden');
    document.getElementById('otp-target-phone').innerText = `+91 ${phone}`;
    document.getElementById('otp-verify-btn').onclick = () => verifyLoginOTP(worker);
  } else {
    // Check if Employer exists
    const employer = db.employers.find(e => e.phone === phone);
    if (employer) {
      generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      simulateSMS(phone, generatedOTP);
      showToast("OTP code sent to mobile.", "info");
      
      document.getElementById('login-form-container').classList.add('hidden');
      document.getElementById('otp-verification-container').classList.remove('hidden');
      document.getElementById('otp-target-phone').innerText = `+91 ${phone}`;
      document.getElementById('otp-verify-btn').onclick = () => verifyLoginOTP(employer, 'employer');
    } else {
      showToast("User not registered. Please sign up first.", "warning");
      setTimeout(() => navigateToRegister(phone), 1500);
    }
  }
}

function verifyLoginOTP(userObj, role = 'worker') {
  const codeInputs = document.querySelectorAll('.otp-box');
  let enteredCode = "";
  codeInputs.forEach(input => enteredCode += input.value);

  if (enteredCode === generatedOTP || enteredCode === '123456') { // Allow 123456 bypass
    currentUser = userObj;
    currentRole = role;
    showToast("Login successful!", "success");
    
    // Reset OTP boxes
    codeInputs.forEach(i => i.value = "");
    document.getElementById('login-form-container').classList.remove('hidden');
    document.getElementById('otp-verification-container').classList.add('hidden');
    
    if (role === 'worker') {
      showScreen('dashboard-screen');
    } else {
      showScreen('employer-screen');
    }
  } else {
    showToast("Incorrect OTP code. Try again.", "error");
  }
}

function navigateToRegister(prefilledPhone = '') {
  showScreen('register-screen');
  if (prefilledPhone) {
    document.getElementById('reg-phone').value = prefilledPhone;
  }
}

function handleRegisterSubmit() {
  const name = document.getElementById('reg-name').value;
  const phone = document.getElementById('reg-phone').value;
  const dob = document.getElementById('reg-dob').value;
  const gender = document.getElementById('reg-gender').value;
  const homeState = document.getElementById('reg-homestate').value;
  const currentState = document.getElementById('reg-currentstate').value;
  const occupation = document.getElementById('reg-occupation').value;
  const skill = document.getElementById('reg-skill').value;
  const emergency = document.getElementById('reg-emergency').value;

  if (!name || !phone || !dob || !homeState || !currentState || !occupation) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  // Check unique phone
  if (db.workers.some(w => w.phone === phone) || db.employers.some(e => e.phone === phone)) {
    showToast("Mobile number is already registered.", "error");
    return;
  }

  // Create temporary profile object with Home State Migrant Worker ID
  const newWorkerId = generateMigrantWorkerID(homeState);
  tempRegisterData = {
    id: newWorkerId,
    name,
    phone,
    dob,
    gender,
    homeState,
    currentState,
    occupation,
    skillCategory: skill,
    emergencyContact: emergency,
    bloodGroup: "Not Stored",
    verified: false,
    bankStatus: "Not Linked",
    upiId: "None",
    aadhaar: "None"
  };

  // Request Registration OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  simulateSMS(phone, generatedOTP);
  showToast("OTP verification code sent.", "info");

  document.getElementById('register-form-view').classList.add('hidden');
  document.getElementById('reg-otp-container').classList.remove('hidden');
}

function verifyRegisterOTP() {
  const codeInputs = document.querySelectorAll('.reg-otp-box');
  let enteredCode = "";
  codeInputs.forEach(input => enteredCode += input.value);

  if (enteredCode === generatedOTP || enteredCode === '123456') {
    // Add worker to db
    db.workers.push(tempRegisterData);
    saveDB('setu_workers', db.workers);
    
    // Automatically login worker
    currentUser = tempRegisterData;
    currentRole = 'worker';
    
    // Show toast and send verification notification
    showToast("Registration completed!", "success");
    
    // Add welcome notification
    const welcomeNotif = {
      id: `notif-${Date.now()}`,
      workerId: currentUser.id,
      message: "Welcome to SetuConnect! Complete your Aadhaar Verification to unlock all features.",
      status: "unread",
      date: new Date().toISOString()
    };
    db.notifications.unshift(welcomeNotif);
    saveDB('setu_notifications', db.notifications);

    // Redirect to eKYC directly
    showScreen('ekyc-screen');
    
    // Reset inputs
    codeInputs.forEach(i => i.value = "");
    document.getElementById('register-form-view').classList.remove('hidden');
    document.getElementById('reg-otp-container').classList.add('hidden');
  } else {
    showToast("Incorrect OTP code. Try again.", "error");
  }
}

// --- PHASE 3: Aadhaar eKYC Verification ---
function handleKYCSubmit() {
  const aadhaarNum = document.getElementById('kyc-aadhaar').value;
  if (!aadhaarNum || aadhaarNum.replace(/\s+/g, '').length !== 12) {
    showToast("Please enter a valid 12-digit Aadhaar number.", "error");
    return;
  }

  const fileInput = document.getElementById('kyc-file-upload');
  if (fileInput.files.length === 0) {
    showToast("Please capture or upload document photo.", "error");
    return;
  }

  // Trigger eKYC Scanning Animation
  const loader = document.getElementById('kyc-progress-loader');
  const btn = document.getElementById('kyc-submit-btn');
  loader.classList.remove('hidden');
  btn.classList.add('hidden');

  setTimeout(() => {
    // Complete eKYC Verification
    currentUser.verified = true;
    currentUser.aadhaar = `XXXX-XXXX-${aadhaarNum.slice(-4)}`;
    
    // Update worker in storage
    const idx = db.workers.findIndex(w => w.id === currentUser.id);
    if (idx !== -1) {
      db.workers[idx] = currentUser;
      saveDB('setu_workers', db.workers);
    }
    
    loader.classList.add('hidden');
    btn.classList.remove('hidden');
    
    speakWelcomeText(TRANSLATIONS[selectedLanguage].verified);
    showToast("Identity verified! Digital Card Activated.", "success");
    
    // Direct back to home dashboard
    showScreen('dashboard-screen');
  }, 2500);
}

// --- RENDER SCREEN DATA: Dashboard / ID Card ---
function renderDashboard() {
  if (!currentUser) return;

  // Render text translations
  document.getElementById('dash-welcome-name').innerText = currentUser.name;
  
  // Render digital worker card
  const frontCard = document.getElementById('id-card-front-view');
  const backCard = document.getElementById('id-card-back-view');
  
  const verifiedBadge = currentUser.verified 
    ? `<span class="id-card-status status-verified"><i class="fas fa-check-circle"></i> Verified</span>`
    : `<span class="id-card-status status-pending" onclick="showScreen('ekyc-screen')"><i class="fas fa-exclamation-triangle"></i> Verify eKYC</span>`;
  
  frontCard.innerHTML = `
    <div class="id-card-header">
      <div class="id-card-logo" style="display:flex; align-items:center; gap:6px;">
        <span class="logo-icon-emblem card-emblem"></span>
        <span style="font-size:0.85rem; font-weight:800; color:var(--text-main);">SetuConnect</span>
      </div>
      ${verifiedBadge}
    </div>
    <div class="id-card-body">
      <div class="id-photo-mock">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="id-info">
        <div class="id-name">${currentUser.name}</div>
        <div class="id-field" style="color:var(--primary); font-weight:600;"><i class="fas fa-landmark"></i> Issued by Govt. of ${currentUser.homeState}</div>
        <div class="id-field">Occupation: <span>${currentUser.occupation}</span></div>
        <div class="id-field">Location: <span>${currentUser.currentState} (Host State)</span></div>
      </div>
    </div>
    <div class="id-card-footer">
      <span class="id-number" style="color:var(--primary); font-weight:bold;">${currentUser.id}</span>
      <span class="id-field">Emergency Contact: <span>${currentUser.emergencyContact || 'N/A'}</span></span>
    </div>
  `;

  backCard.innerHTML = `
    <div class="id-card-header">
      <div class="id-card-logo" style="font-size:0.8rem;">Govt. of ${currentUser.homeState} • Labor Registry</div>
      <span class="id-card-status status-verified">Official ID</span>
    </div>
    <div class="id-card-body" style="align-items:center; justify-content:space-between; width:100%;">
      <div class="qr-code-holder" id="worker-qr-code"></div>
      <div class="id-info" style="gap:8px;">
        <div class="id-field">Aadhaar: <span>${currentUser.aadhaar}</span></div>
        <div class="id-field">Home State: <span>${currentUser.homeState}</span></div>
        <div class="id-field">Blood Group: <span>${currentUser.bloodGroup || 'O+'}</span></div>
        <div class="id-field">Bank Link: <span>${currentUser.bankStatus}</span></div>
      </div>
    </div>
    <div class="id-card-footer">
      <span>UPI: ${currentUser.upiId || 'N/A'}</span>
      <span style="font-size:0.6rem; color:var(--text-muted);">Tab Card to Flip</span>
    </div>
  `;

  // Draw QR code dynamically
  setTimeout(() => {
    const qrContainer = document.getElementById('worker-qr-code');
    if (qrContainer) {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: `setuconnect://worker/${currentUser.id}`,
        width: 72,
        height: 72,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }, 100);

  // Render recent job and recent schemes widget on dashboard
  const userJobs = db.employments.filter(e => e.workerId === currentUser.id);
  const activeJob = userJobs.find(j => j.status === 'Ongoing');
  const dashJobWidget = document.getElementById('dash-job-widget');
  
  if (activeJob) {
    dashJobWidget.innerHTML = `
      <div class="job-card-header">
        <h4 class="title-sm">${activeJob.jobTitle}</h4>
        <span class="job-badge badge-ongoing">Ongoing</span>
      </div>
      <div class="id-field" style="margin-bottom:4px;">Employer: <strong>${activeJob.companyName}</strong></div>
      <div class="id-field">Location: <span>${activeJob.location}</span></div>
      <div class="id-field" style="margin-top:6px;">Daily Wage: <strong style="color:var(--primary);">₹${activeJob.dailyWage} / day</strong></div>
    `;
  } else {
    dashJobWidget.innerHTML = `
      <div class="text-center" style="padding:10px 0;">
        <p class="text-muted" style="margin-bottom:8px;">No active ongoing employment logged.</p>
        <button class="btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="showScreen('passbook-screen')">View Passbook</button>
      </div>
    `;
  }

  // Update notification count badge
  const unreadCount = db.notifications.filter(n => n.workerId === currentUser.id && n.status === 'unread').length;
  const badge = document.getElementById('notif-badge-count');
  if (unreadCount > 0) {
    badge.classList.remove('hidden');
    badge.innerText = unreadCount;
  } else {
    badge.classList.add('hidden');
  }
}

// --- PHASE 3: Digital Work Passbook ---
function renderPassbook() {
  if (!currentUser) return;

  const userJobs = db.employments.filter(e => e.workerId === currentUser.id);
  
  // Calculate analytics
  const totalDays = userJobs.reduce((acc, job) => {
    const start = new Date(job.joiningDate);
    const end = job.exitDate ? new Date(job.exitDate) : new Date(); // default to today if ongoing
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return acc + diffDays;
  }, 0);

  const totalEarnings = userJobs.reduce((acc, job) => {
    const start = new Date(job.joiningDate);
    const end = job.exitDate ? new Date(job.exitDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return acc + (diffDays * job.dailyWage);
  }, 0);

  document.getElementById('passbook-days').innerText = totalDays;
  document.getElementById('passbook-earnings').innerText = `₹${totalEarnings.toLocaleString('en-IN')}`;

  // Render job lists
  const passbookList = document.getElementById('passbook-job-list');
  passbookList.innerHTML = "";

  if (userJobs.length === 0) {
    passbookList.innerHTML = `<div class="text-center text-muted" style="padding:40px 0;">No employment history logged yet.</div>`;
    return;
  }

  userJobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    const badgeClass = job.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed';
    const exitText = job.exitDate ? `Exit Date: ${job.exitDate}` : 'Exit Date: Active';
    
    card.innerHTML = `
      <div class="job-card-header">
        <div>
          <h4 class="title-sm">${job.jobTitle}</h4>
          <span style="font-size:0.75rem; color:var(--text-muted);">${job.companyName}</span>
        </div>
        <span class="job-badge ${badgeClass}">${job.status}</span>
      </div>
      <div style="font-size:0.8rem; margin:8px 0; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
        <div>📍 Location: <span style="color:var(--text-main);">${job.location}</span></div>
        <div>🗓️ Period: <span style="color:var(--text-main);">${job.joiningDate} to ${job.exitDate || 'Present'}</span></div>
        <div>💳 Payment: <strong style="color:${job.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)'};">${job.paymentStatus}</strong></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:8px; margin-top:8px;">
        <span style="font-size:0.75rem; color:var(--text-muted);">Wage Rate:</span>
        <strong style="color:var(--primary);">₹${job.dailyWage} / day</strong>
      </div>
    `;
    passbookList.appendChild(card);
  });
}

// --- PHASE 4: Welfare Scheme Discovery ---
let selectedWelfareCategory = 'All';

function renderWelfare() {
  if (!currentUser) return;

  const currentSelectState = document.getElementById('welfare-state-select').value || currentUser.currentState;
  document.getElementById('welfare-state-select').value = currentSelectState;

  // Filter schemes matching selected state + Central schemes
  const stateSchemes = db.schemes.filter(s => s.state === currentSelectState || s.state === 'Central');
  
  // Filter by category
  const filtered = selectedWelfareCategory === 'All' 
    ? stateSchemes 
    : stateSchemes.filter(s => s.category === selectedWelfareCategory);

  const container = document.getElementById('welfare-schemes-list');
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:40px 0;">No active welfare schemes listed for ${currentSelectState} in ${selectedWelfareCategory}.</div>`;
    return;
  }

  filtered.forEach(scheme => {
    const card = document.createElement('div');
    card.className = 'scheme-card';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span class="job-badge" style="background:hsla(var(--primary-hue), 85%, 42%, 0.15); color:var(--primary);">${scheme.category}</span>
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${scheme.state} Scheme</span>
      </div>
      <h3 class="title-sm" style="margin-bottom:6px;">${scheme.name}</h3>
      <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin-bottom:8px;">${scheme.description}</p>
      
      <div style="font-size:0.75rem; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px; padding:8px; margin-bottom:12px;">
        <strong>Eligibility:</strong> ${scheme.eligibility}<br/>
        <strong>Documents:</strong> ${scheme.documents}
      </div>
      
      <a href="${scheme.link}" target="_blank" class="btn-primary" style="padding:8px 12px; font-size:0.8rem; border-radius:8px; text-decoration:none; display:inline-flex; width:auto;">
        Apply Scheme <i class="fas fa-external-link-alt"></i>
      </a>
    `;
    container.appendChild(card);
  });
}

function handleWelfareCategoryClick(btn, category) {
  document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedWelfareCategory = category;
  renderWelfare();
}

// --- PHASE 6 & 7: Health & Financial Referrals ---
function renderHealth() {
  if (!currentUser) return;

  // Filter hospitals close to worker current state
  const hospitals = INITIAL_HOSPITALS.filter(h => h.state === currentUser.currentState);
  const container = document.getElementById('hospitals-list');
  container.innerHTML = "";

  if (hospitals.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:20px 0;">No nearby network hospitals mapped for ${currentUser.currentState} yet.</div>`;
  } else {
    hospitals.forEach(h => {
      const el = document.createElement('div');
      el.className = 'job-card';
      el.style.marginBottom = '8px';
      el.innerHTML = `
        <div class="job-card-header">
          <h4 class="title-sm">${h.name}</h4>
          <span style="font-size:0.7rem; color:var(--primary); font-weight:600;"><i class="fas fa-map-marker-alt"></i> ${h.distance}</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">📍 ${h.location}</div>
        <div style="font-size:0.75rem; font-weight:500;">Type: <span style="color:var(--success);">${h.type}</span></div>
        <div style="margin-top:8px; display:flex; gap:10px;">
          <a href="tel:${h.contact}" class="btn-secondary" style="padding:4px 8px; font-size:0.75rem; border-radius:6px; width:auto;"><i class="fas fa-phone-alt"></i> Call</a>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // Update profile bank details if stored
  document.getElementById('fin-bank-status').innerText = currentUser.bankStatus;
  document.getElementById('fin-upi-id').innerText = currentUser.upiId;

  // Render health variables
  document.getElementById('health-blood-group').innerText = currentUser.bloodGroup;
  document.getElementById('health-emergency').innerText = currentUser.emergencyContact || 'N/A';
}

function handleSaveHealthInfo() {
  const blood = document.getElementById('health-blood-select').value;
  const emergency = document.getElementById('health-emergency-input').value;

  currentUser.bloodGroup = blood;
  currentUser.emergencyContact = emergency;

  // Save to DB
  const idx = db.workers.findIndex(w => w.id === currentUser.id);
  if (idx !== -1) {
    db.workers[idx] = currentUser;
    saveDB('setu_workers', db.workers);
    showToast("Health details updated!", "success");
    renderHealth();
  }
}

function handleSaveFinancialInfo() {
  const upi = document.getElementById('fin-upi-input').value;
  const status = document.getElementById('fin-bank-select').value;

  currentUser.upiId = upi || 'None';
  currentUser.bankStatus = status;

  // Save to DB
  const idx = db.workers.findIndex(w => w.id === currentUser.id);
  if (idx !== -1) {
    db.workers[idx] = currentUser;
    saveDB('setu_workers', db.workers);
    showToast("Financial profile updated!", "success");
    renderHealth();
  }
}

// --- PHASE 8: Notifications ---
function renderNotifications() {
  if (!currentUser) return;

  const notifs = db.notifications.filter(n => n.workerId === currentUser.id);
  const container = document.getElementById('notifications-list');
  container.innerHTML = "";

  if (notifs.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:40px 0;">No alerts or notifications yet.</div>`;
    return;
  }

  notifs.forEach(n => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.background = n.status === 'unread' ? 'rgba(30, 114, 255, 0.08)' : 'var(--glass-bg)';
    card.style.borderLeft = n.status === 'unread' ? '3px solid var(--secondary)' : '1px solid var(--border)';
    
    const formattedDate = new Date(n.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    card.innerHTML = `
      <div style="font-size:0.85rem; line-height:1.4; color:var(--text-main); margin-bottom:6px;">${n.message}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-muted);">
        <span>${formattedDate}</span>
        ${n.status === 'unread' ? `<button class="btn-secondary" style="padding:2px 6px; font-size:0.65rem; border-radius:4px; width:auto;" onclick="markNotificationRead('${n.id}')">Mark read</button>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

function markNotificationRead(id) {
  const idx = db.notifications.findIndex(n => n.id === id);
  if (idx !== -1) {
    db.notifications[idx].status = 'read';
    saveDB('setu_notifications', db.notifications);
    renderNotifications();
    renderDashboard();
  }
}

// --- PHASE 5: Voice Assistant (Speech Recognition) ---
function initVoiceAssistant() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn("SpeechRecognition not supported in this browser.");
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;

  speechRecognition.onstart = () => {
    document.getElementById('voice-assistant-overlay').classList.add('active');
    document.getElementById('voice-mic-icon').classList.add('listening');
    document.getElementById('voice-transcript').innerText = "...";
    document.getElementById('voice-status').innerText = TRANSLATIONS[selectedLanguage].listening;
  };

  speechRecognition.onerror = (e) => {
    console.error("Speech Error:", e);
    closeVoiceAssistant();
    showToast("Voice assistant error. Try again.", "error");
  };

  speechRecognition.onend = () => {
    document.getElementById('voice-mic-icon').classList.remove('listening');
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    document.getElementById('voice-transcript').innerText = `"${transcript}"`;
    
    setTimeout(() => {
      processVoiceCommand(transcript);
    }, 1000);
  };
}

function toggleVoiceAssistant() {
  if (!speechRecognition) {
    showToast(TRANSLATIONS[selectedLanguage].noSpeechSupport, "error");
    return;
  }
  
  // Set speech language config
  speechRecognition.lang = LOCALE_MAP[selectedLanguage];
  speechRecognition.start();
}

function closeVoiceAssistant() {
  document.getElementById('voice-assistant-overlay').classList.remove('active');
  if (speechRecognition) {
    speechRecognition.stop();
  }
}

function speakWelcomeText(text) {
  if (!speechSynth) return;
  // Cancel active speech
  speechSynth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LOCALE_MAP[selectedLanguage];
  
  // Try to find a local voice for language
  const voices = speechSynth.getVoices();
  const matchedVoice = voices.find(v => v.lang.includes(LOCALE_MAP[selectedLanguage]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  
  speechSynth.speak(utterance);
}

function processVoiceCommand(command) {
  closeVoiceAssistant();
  
  // Clean command text
  const text = command.trim();
  
  // English Commands
  if (text.includes("scheme") || text.includes("welfare") || text.includes("yojana") || text.includes("పథకాలు") || text.includes("திட்டங்கள்") || text.includes("ಯೋಜನೆ")) {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].navigatingSchemes);
    showScreen('welfare-screen');
  } 
  else if (text.includes("job") || text.includes("passbook") || text.includes("work") || text.includes("earnings") || text.includes("काम") || text.includes("పని") || text.includes("வேலை") || text.includes("ಕೆಲಸ")) {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].navigatingJobs);
    showScreen('passbook-screen');
  }
  else if (text.includes("hospital") || text.includes("health") || text.includes("doctor") || text.includes("अस्पताल") || text.includes("ఆసుపత్రి") || text.includes("மருத்துவமனை") || text.includes("ಆಸ್ಪತ್ರೆ")) {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].navigatingHealth);
    showScreen('health-screen');
  }
  else if (text.includes("card") || text.includes("profile") || text.includes("identity") || text.includes("पहचान") || text.includes("గుర్తింపు") || text.includes("அடையாளம்") || text.includes("ಕಾರ್ಡ್")) {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].navigatingProfile);
    showScreen('dashboard-screen');
  }
  else if (text.includes("notification") || text.includes("alert") || text.includes("सुझाव") || text.includes("సందేశాలు") || text.includes("அறிவிப்பு") || text.includes("ಅಧಿಸೂಚನೆ")) {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].navigatingNotif);
    showScreen('notif-screen');
  }
  else {
    speakWelcomeText(TRANSLATIONS[selectedLanguage].notUnderstood);
    showToast(TRANSLATIONS[selectedLanguage].notUnderstood, "info");
  }
}

// Handle Language Switch
function handleLanguageChange(lang) {
  selectedLanguage = lang;
  document.getElementById('lang-select-btn').innerText = lang.charAt(0).toUpperCase() + lang.slice(1);
  
  // Toggle active language button in profile
  document.querySelectorAll('.lang-btn-opt').forEach(btn => {
    if (btn.dataset.lang === lang) btn.style.background = 'var(--primary)';
    else btn.style.background = 'var(--bg-input)';
  });
  
  showToast(`Language set to ${lang.toUpperCase()}`, "success");
  
  // Speak welcome prompt in chosen language
  speakWelcomeText(TRANSLATIONS[lang].welcome);
}

// --- EMPLOYER CONSOLE: Log jobs for worker ---
function renderEmployerDashboard() {
  if (!currentUser) return;
  document.getElementById('emp-company-name').innerText = currentUser.companyName;
  document.getElementById('emp-location-name').innerText = currentUser.location;
}

function handleEmployerLogJob() {
  const workerPhone = document.getElementById('emp-worker-phone').value;
  const jobTitle = document.getElementById('emp-job-title').value;
  const wage = parseFloat(document.getElementById('emp-job-wage').value);
  const joinDate = document.getElementById('emp-job-join').value;
  const exitDate = document.getElementById('emp-job-exit').value;
  const payStatus = document.getElementById('emp-pay-status').value;

  if (!workerPhone || !jobTitle || !wage || !joinDate) {
    showToast("Please fill in all job details.", "error");
    return;
  }

  // Find worker in DB
  const workerObj = db.workers.find(w => w.phone === workerPhone || w.id === workerPhone);
  if (!workerObj) {
    showToast("Worker ID or Mobile not registered in system.", "error");
    return;
  }

  // Create new job entry
  const newJob = {
    id: `JOB-${Date.now().toString().slice(-4)}`,
    workerId: workerObj.id,
    employerId: currentUser.id,
    companyName: currentUser.companyName,
    location: currentUser.location,
    jobTitle,
    joiningDate: joinDate,
    exitDate: exitDate || "",
    dailyWage: wage,
    status: exitDate ? "Completed" : "Ongoing",
    paymentStatus: payStatus
  };

  db.employments.push(newJob);
  saveDB('setu_employments', db.employments);

  // Send Notification Alert to Worker
  const alertNotif = {
    id: `notif-${Date.now()}`,
    workerId: workerObj.id,
    message: `Employer '${currentUser.companyName}' added job: '${jobTitle}' at ₹${wage}/day. Status: ${newJob.status}.`,
    status: "unread",
    date: new Date().toISOString()
  };
  db.notifications.unshift(alertNotif);
  saveDB('setu_notifications', db.notifications);

  showToast("Employment record successfully logged!", "success");
  
  // Clear inputs
  document.getElementById('emp-worker-phone').value = "";
  document.getElementById('emp-job-title').value = "";
  document.getElementById('emp-job-wage').value = "";
  document.getElementById('emp-job-exit').value = "";
}

// --- ADMIN CONTROL PANEL & ANALYTICS ---
let adminChart = null;

function renderAdminDashboard() {
  // Update admin card stats
  document.getElementById('adm-stat-workers').innerText = db.workers.length;
  document.getElementById('adm-stat-employers').innerText = db.employers.length;
  document.getElementById('adm-stat-jobs').innerText = db.employments.length;
  document.getElementById('adm-stat-schemes').innerText = db.schemes.length;

  // Render Verification lists
  const pendingWorkers = db.workers.filter(w => !w.verified);
  const pendingContainer = document.getElementById('admin-pending-list');
  pendingContainer.innerHTML = "";

  if (pendingWorkers.length === 0) {
    pendingContainer.innerHTML = `<div class="text-center text-muted" style="padding:10px 0; font-size:0.85rem;">No profiles pending verification.</div>`;
  } else {
    pendingWorkers.forEach(w => {
      const el = document.createElement('div');
      el.className = 'job-card';
      el.style.marginBottom = '8px';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${w.name}</strong><br/>
            <span style="font-size:0.75rem; color:var(--text-muted);">ID: ${w.id} | Phone: ${w.phone}</span>
          </div>
          <button class="btn-primary" style="padding:6px 12px; width:auto; font-size:0.75rem; border-radius:8px;" onclick="adminVerifyWorker('${w.id}')">Verify</button>
        </div>
      `;
      pendingContainer.appendChild(el);
    });
  }

  // Draw chart mapping workers per Home State
  drawAdminAnalytics();
}

function adminVerifyWorker(workerId) {
  const idx = db.workers.findIndex(w => w.id === workerId);
  if (idx !== -1) {
    db.workers[idx].verified = true;
    db.workers[idx].aadhaar = "Verified by Admin";
    saveDB('setu_workers', db.workers);
    showToast("Worker verified successfully!", "success");
    renderAdminDashboard();
  }
}

function handleAdminAddScheme() {
  const state = document.getElementById('adm-scheme-state').value;
  const name = document.getElementById('adm-scheme-name').value;
  const category = document.getElementById('adm-scheme-cat').value;
  const eligibility = document.getElementById('adm-scheme-elig').value;
  const docs = document.getElementById('adm-scheme-docs').value;
  const desc = document.getElementById('adm-scheme-desc').value;

  if (!name || !eligibility || !docs) {
    showToast("Please fill in scheme requirements.", "error");
    return;
  }

  const newScheme = {
    id: `scheme-${Date.now()}`,
    state,
    name,
    category,
    eligibility,
    documents: docs,
    description: desc || "No description provided.",
    link: "https://india.gov.in"
  };

  db.schemes.push(newScheme);
  saveDB('setu_schemes', db.schemes);
  showToast("Welfare scheme added successfully!", "success");
  
  // Clear inputs
  document.getElementById('adm-scheme-name').value = "";
  document.getElementById('adm-scheme-elig').value = "";
  document.getElementById('adm-scheme-docs').value = "";
  document.getElementById('adm-scheme-desc').value = "";
  
  renderAdminDashboard();
}

function drawAdminAnalytics() {
  // Aggregate workers count per Home State
  const stateCounts = {};
  db.workers.forEach(w => {
    stateCounts[w.homeState] = (stateCounts[w.homeState] || 0) + 1;
  });

  const states = Object.keys(stateCounts);
  const counts = Object.values(stateCounts);

  const canvas = document.getElementById('admin-analytics-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Use Chart.js if library loaded, otherwise manual Canvas render
  if (window.Chart) {
    if (adminChart) adminChart.destroy();
    adminChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: states,
        datasets: [{
          label: 'Migrant Workers by Home State',
          data: counts,
          backgroundColor: 'rgba(52, 211, 153, 0.7)',
          borderColor: 'rgb(52, 211, 153)',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Worker Demographic Distribution', color: '#fff' }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: { color: '#888' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          x: {
            ticks: { color: '#888' },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    // Basic Canvas rendering placeholder
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText("Loading charts dynamically...", 20, 50);
  }
}

// --- GRIEVANCE REDRESSAL DESK: WORKER ---
function handleWorkerSubmitGrievance() {
  const category = document.getElementById('grv-category').value;
  const employer = document.getElementById('grv-employer').value.trim();
  const amount = parseFloat(document.getElementById('grv-amount').value) || 0;
  const desc = document.getElementById('grv-desc').value.trim();

  if (!employer || !desc) {
    showToast("Please provide employer name and issue description.", "error");
    return;
  }

  const newGrievance = {
    id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
    workerId: currentUser.id,
    workerName: currentUser.name,
    workerPhone: currentUser.phone,
    homeState: currentUser.homeState,
    currentState: currentUser.currentState,
    category,
    employerName: employer,
    disputedAmount: amount,
    description: desc,
    status: "Pending Investigation",
    priority: amount > 10000 ? "High" : "Medium",
    filedDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    assignedOfficerState: currentUser.homeState,
    officerRemarks: `Grievance registered and forwarded to ${currentUser.homeState} State Nodal Labor Desk.`
  };

  db.grievances.unshift(newGrievance);
  saveDB('setu_grievances', db.grievances);

  // Send in-app notification
  const notif = {
    id: `notif-${Date.now()}`,
    workerId: currentUser.id,
    message: `Grievance #${newGrievance.id} submitted to Govt. of ${currentUser.homeState} Nodal Desk.`,
    status: "unread",
    date: new Date().toISOString()
  };
  db.notifications.unshift(notif);
  saveDB('setu_notifications', db.notifications);

  showToast("Grievance logged! Nodal Officer notified.", "success");
  document.getElementById('grv-employer').value = "";
  document.getElementById('grv-amount').value = "";
  document.getElementById('grv-desc').value = "";
  renderWorkerGrievances();
}

function renderWorkerGrievances() {
  if (!currentUser) return;
  const list = db.grievances.filter(g => g.workerId === currentUser.id);
  const container = document.getElementById('worker-grievance-list');
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:24px 0;">No grievances filed yet.</div>`;
    return;
  }

  list.forEach(g => {
    const card = document.createElement('div');
    card.className = 'grievance-card';
    let statusClass = 'badge-pending';
    if (g.status === 'Under Investigation') statusClass = 'badge-investigation';
    if (g.status === 'Action Taken') statusClass = 'badge-action';
    if (g.status === 'Resolved') statusClass = 'badge-resolved';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span class="badge-grievance ${statusClass}">${g.status}</span>
        <span style="font-size:0.7rem; color:var(--text-muted);">${g.id}</span>
      </div>
      <h4 class="title-sm" style="margin-bottom:4px;">${g.category}</h4>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">Employer: <strong style="color:var(--text-main);">${g.employerName}</strong> | Amount: <strong style="color:var(--primary);">₹${g.disputedAmount.toLocaleString('en-IN')}</strong></div>
      <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin-bottom:10px;">${g.description}</p>
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px; padding:8px; font-size:0.75rem;">
        <strong style="color:var(--secondary); display:block; margin-bottom:2px;"><i class="fas fa-building-columns"></i> ${g.assignedOfficerState} Nodal Officer Remarks:</strong>
        <span>${g.officerRemarks}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- STATE NODAL LEVEL OFFICER DASHBOARD ---
let currentNodalFilter = 'All';

function renderNodalDashboard() {
  if (!currentUser || currentRole !== 'nodal') return;

  const stateUpper = currentUser.state.toUpperCase();
  document.getElementById('nodal-state-insignia').innerHTML = `<i class="fas fa-shield-halved"></i> GOVT. OF ${stateUpper} • LABOUR NODAL CELL`;
  document.getElementById('nodal-officer-name').innerText = currentUser.name;
  document.getElementById('nodal-officer-dept').innerText = currentUser.designation;

  const totalNative = db.workers.filter(w => w.homeState === currentUser.state);
  const inflowWorkers = db.workers.filter(w => w.currentState === currentUser.state && w.homeState !== currentUser.state);

  const stateGrievances = db.grievances.filter(g => g.assignedOfficerState === currentUser.state || g.homeState === currentUser.state || g.currentState === currentUser.state);
  const openDisputes = stateGrievances.filter(g => g.status !== 'Resolved');
  const resolvedDisputes = stateGrievances.filter(g => g.status === 'Resolved');

  document.getElementById('nodal-stat-outflow').innerText = totalNative.length;
  document.getElementById('nodal-stat-inflow').innerText = inflowWorkers.length;
  document.getElementById('nodal-stat-disputes').innerText = openDisputes.length;
  document.getElementById('nodal-stat-resolved').innerText = resolvedDisputes.length;

  renderNodalGrievancesList(stateGrievances);
  renderNodalStateRequests();
}

function filterNodalGrievances(status, btn) {
  currentNodalFilter = status;
  document.querySelectorAll('#nodal-screen .category-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const stateGrievances = db.grievances.filter(g => g.assignedOfficerState === currentUser.state || g.homeState === currentUser.state);
  renderNodalGrievancesList(stateGrievances);
}

function renderNodalGrievancesList(allGrievances) {
  const container = document.getElementById('nodal-grievances-list');
  if (!container) return;
  container.innerHTML = "";

  const filtered = currentNodalFilter === 'All' 
    ? allGrievances 
    : allGrievances.filter(g => g.status === currentNodalFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:20px 0;">No ${currentNodalFilter} grievances in this state jurisdiction.</div>`;
    return;
  }

  filtered.forEach(g => {
    const card = document.createElement('div');
    card.className = 'grievance-card';
    let statusClass = 'badge-pending';
    if (g.status === 'Under Investigation') statusClass = 'badge-investigation';
    if (g.status === 'Action Taken') statusClass = 'badge-action';
    if (g.status === 'Resolved') statusClass = 'badge-resolved';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <span class="badge-grievance ${statusClass}">${g.status}</span>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">${g.id}</span>
        </div>
        <span style="font-size:0.7rem; color:var(--text-muted);">${new Date(g.filedDate).toLocaleDateString()}</span>
      </div>
      <h4 class="title-sm" style="margin-bottom:4px;">${g.category}</h4>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">
        Worker: <strong style="color:var(--text-main);">${g.workerName}</strong> (${g.workerId})<br/>
        Migrated: <strong>${g.homeState} ➔ ${g.currentState}</strong> | Employer: <strong>${g.employerName}</strong><br/>
        Amount at stake: <strong style="color:var(--primary);">₹${g.disputedAmount.toLocaleString('en-IN')}</strong>
      </div>
      <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin-bottom:10px;">${g.description}</p>
      
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:8px; padding:8px; font-size:0.75rem; margin-bottom:10px;">
        <strong>Officer Remarks:</strong> ${g.officerRemarks}
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${g.status === 'Pending Investigation' ? `
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.75rem; border-radius:6px; width:auto;" onclick="nodalUpdateGrievanceStatus('${g.id}', 'Under Investigation')">
            <i class="fas fa-magnifying-glass"></i> Initiate Investigation
          </button>
        ` : ''}
        ${g.status !== 'Resolved' ? `
          <button class="btn-secondary" style="padding:6px 10px; font-size:0.75rem; border-radius:6px; width:auto; border-color:var(--warning); color:var(--warning);" onclick="nodalUpdateGrievanceStatus('${g.id}', 'Action Taken')">
            <i class="fas fa-gavel"></i> Issue Notice
          </button>
          <button class="btn-primary" style="padding:6px 10px; font-size:0.75rem; border-radius:6px; width:auto;" onclick="nodalUpdateGrievanceStatus('${g.id}', 'Resolved')">
            <i class="fas fa-check-circle"></i> Resolve & Order Relief
          </button>
        ` : `<span style="font-size:0.75rem; color:var(--success); font-weight:700;"><i class="fas fa-check-double"></i> Redressal Completed</span>`}
      </div>
    `;
    container.appendChild(card);
  });
}

function nodalUpdateGrievanceStatus(grvId, newStatus) {
  const g = db.grievances.find(item => item.id === grvId);
  if (!g) return;

  let defaultRemark = newStatus === 'Resolved' ? "Wage dispute reconciled and relief credited to worker bank account." :
    newStatus === 'Action Taken' ? "Official summons issued to contractor by State Labor Department." :
    "Inter-state labor cell assigned officer to inspect worksite.";

  let remark = prompt(`Enter official Nodal Officer remark for '${newStatus}':`, defaultRemark);
  if (remark === null) return;

  g.status = newStatus;
  g.officerRemarks = remark || defaultRemark;
  g.updatedDate = new Date().toISOString();
  saveDB('setu_grievances', db.grievances);

  // Notify worker
  const notif = {
    id: `notif-${Date.now()}`,
    workerId: g.workerId,
    message: `State Nodal Officer (${currentUser.state}) updated grievance #${g.id} to '${newStatus}'. Remarks: ${g.officerRemarks}`,
    status: "unread",
    date: new Date().toISOString()
  };
  db.notifications.unshift(notif);
  saveDB('setu_notifications', db.notifications);

  showToast(`Grievance #${g.id} updated to ${newStatus}`, "success");
  renderNodalDashboard();
}

function renderNodalStateRequests() {
  const container = document.getElementById('nodal-requests-list');
  if (!container) return;
  container.innerHTML = "";

  const requests = db.stateRequests.filter(r => r.toState === currentUser.state || r.fromState === currentUser.state);
  if (requests.length === 0) {
    container.innerHTML = `<div class="text-center text-muted" style="padding:16px 0;">No pending inter-state requests.</div>`;
    return;
  }

  requests.forEach(r => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.marginBottom = '8px';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--primary);">${r.fromState} ➔ ${r.toState}</span>
        <span class="job-badge ${r.status === 'Approved' ? 'badge-completed' : 'badge-ongoing'}">${r.status}</span>
      </div>
      <div style="font-size:0.8rem; font-weight:600;">${r.requestType}</div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin:4px 0;">Worker: <strong>${r.workerName}</strong> (${r.workerId})</div>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">${r.reason}</p>
      ${r.status === 'Pending' && r.toState === currentUser.state ? `
        <div style="display:flex; gap:8px;">
          <button class="btn-primary" style="padding:4px 8px; font-size:0.7rem; border-radius:6px; width:auto;" onclick="nodalResolveStateRequest('${r.id}', 'Approved')">Verify & Approve</button>
          <button class="btn-secondary" style="padding:4px 8px; font-size:0.7rem; border-radius:6px; width:auto;" onclick="nodalResolveStateRequest('${r.id}', 'Rejected')">Reject</button>
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

function nodalResolveStateRequest(reqId, status) {
  const req = db.stateRequests.find(r => r.id === reqId);
  if (req) {
    req.status = status;
    saveDB('setu_state_requests', db.stateRequests);
    showToast(`Request ${status}!`, "success");
    renderNodalDashboard();
  }
}

function nodalOpenReportModal() {
  if (!currentUser || currentRole !== 'nodal') return;

  const totalNative = db.workers.filter(w => w.homeState === currentUser.state);
  const totalInflow = db.workers.filter(w => w.currentState === currentUser.state && w.homeState !== currentUser.state);
  const stateGrievances = db.grievances.filter(g => g.assignedOfficerState === currentUser.state || g.homeState === currentUser.state);
  const resolved = stateGrievances.filter(g => g.status === 'Resolved');
  const resolutionRate = stateGrievances.length > 0 ? Math.round((resolved.length / stateGrievances.length) * 100) : 100;

  const modalBody = document.getElementById('report-modal-body');
  modalBody.innerHTML = `
    <div style="text-align:center; padding-bottom:12px; border-bottom:1px solid var(--border);">
      <div style="font-size:0.7rem; font-weight:800; color:var(--secondary); letter-spacing:1px; text-transform:uppercase;">OFFICIAL INTER-STATE MIGRANT WORKER AUDIT REPORT</div>
      <h2 class="title-md" style="margin:4px 0;">Government of ${currentUser.state}</h2>
      <div style="font-size:0.75rem; color:var(--text-muted);">${currentUser.department}</div>
      <div style="font-size:0.7rem; color:var(--primary); margin-top:4px;">Report Ref: SETU/${currentUser.stateCode}/AUDIT/${Date.now().toString().slice(-6)}</div>
    </div>

    <div style="margin:16px 0; font-size:0.8rem; display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>Issuing Nodal Officer:</span><strong>${currentUser.name}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>Registered Native Emigrants (Outflow):</span><strong style="color:var(--info);">${totalNative.length} Workers</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>In-State Hosted Migrants (Inflow):</span><strong style="color:var(--success);">${totalInflow.length} Workers</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>Total Grievances Registered:</span><strong>${stateGrievances.length} Cases</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>Grievances Successfully Resolved:</span><strong style="color:var(--primary);">${resolved.length} (${resolutionRate}%)</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--border); padding-bottom:4px;">
        <span>Inter-State Portability Compliance:</span><strong style="color:var(--success);">100% Verified</strong>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:10px; padding:10px; font-size:0.75rem;">
      <strong style="display:block; margin-bottom:4px; color:var(--text-main);">Registered Citizens Registry Snapshot:</strong>
      <ul style="padding-left:14px; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
        ${totalNative.map(w => `<li><strong>${w.name}</strong> (${w.id}) - Working in <em>${w.currentState}</em> as ${w.occupation}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-top:16px; text-align:right; font-size:0.7rem; color:var(--text-muted);">
      <div>Digitally Signed & Certified via SetuConnect National Portal</div>
      <div style="font-weight:700; color:var(--text-main); margin-top:2px;">${currentUser.officeLocation}</div>
    </div>
  `;

  document.getElementById('report-modal').classList.remove('hidden');
}

// Dynamic Dark Theme Logo Processor
function initDarkHeaderLogo() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = 'header-logo.png';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];

        // If near-white background, make transparent
        if (r > 215 && g > 215 && b > 215) {
          d[i + 3] = 0;
        } else {
          const pixelX = (i / 4) % canvas.width;
          if (pixelX > 430) {
            // Text area "SetuConnect" -> render crisp white
            d[i] = 255;
            d[i + 1] = 255;
            d[i + 2] = 255;
          } else {
            // Emblem area -> boost vibrant emerald green
            d[i] = Math.min(255, Math.round(r * 1.1));
            d[i + 1] = Math.min(255, Math.round(g * 1.3));
            d[i + 2] = Math.min(255, Math.round(b * 1.1));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const darkLogoDataUrl = canvas.toDataURL('image/png');

      // Apply dark transparent logo to header and auth badges
      document.querySelectorAll('.header-logo-img').forEach(el => {
        el.src = darkLogoDataUrl;
      });
      document.querySelectorAll('.auth-logo-img').forEach(el => {
        el.src = darkLogoDataUrl;
      });
    } catch (e) {
      console.warn("Canvas logo transparency optimization fallback:", e);
    }
  };
}

// App Logout
function handleLogout() {
  currentUser = null;
  currentRole = null;
  showToast("Logged out successfully.", "info");
  showScreen('auth-screen');
}

// Initialize Application on Window Load
window.addEventListener('load', () => {
  initDatabase();
  initVoiceAssistant();
  initDarkHeaderLogo();
  
  // Show authentication screen by default
  showScreen('auth-screen');
  
  // Card flipping click handler
  document.getElementById('worker-digital-id-card').addEventListener('click', function() {
    this.classList.toggle('flipped');
  });
});
