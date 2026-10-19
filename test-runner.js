// Automated test suite for SetuConnect Job Search and Grievance Solve MVP features
const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = {
  speechSynthesis: {
    cancel: () => {},
    speak: () => {},
    getVoices: () => []
  },
  addEventListener: () => {}
};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};
global.document = {
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        value: '',
        innerText: '',
        innerHTML: '',
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
          toggle: () => {}
        },
        style: {},
        appendChild: () => {}
      };
    }
    return this.elements[id];
  },
  querySelectorAll() { return []; },
  querySelector() { return { classList: { add: () => {}, remove: () => {} } }; },
  createElement() {
    return {
      classList: { add: () => {}, remove: () => {} },
      style: {},
      innerHTML: '',
      appendChild: () => {},
      remove: () => {}
    };
  },
  addEventListener: () => {},
  elements: {}
};

const vm = require('vm');
// Load data.js and app.js into global context
const dataCode = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf-8');
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');

vm.runInThisContext(dataCode);
vm.runInThisContext(appCode);

console.log("=== RUNNING SETUCONNECT TEST SUITE ===");

// Initialize database
initDatabase();
console.log(`✓ Database initialized: ${db.workers.length} workers, ${db.jobs.length} jobs, ${db.grievances.length} grievances, ${db.employments.length} employments`);

// Test Worker Login
const ramesh = db.workers.find(w => w.phone === '9876543210');
currentUser = ramesh;
currentRole = 'worker';
console.log(`✓ Logged in as: ${currentUser.name} (${currentUser.id}), Home: ${currentUser.homeState}, Host: ${currentUser.currentState}`);

// 1. Test Passbook Stats & Job Matching
const userJobs = db.employments.filter(e => e.workerId === currentUser.id);
const totalDays = userJobs.reduce((acc, j) => {
  const start = new Date(j.joiningDate);
  const end = j.exitDate ? new Date(j.exitDate) : new Date();
  return acc + (Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1);
}, 0);
console.log(`✓ Worker passbook total verified days: ${totalDays}`);

// Verify Job Search matching calculations
const jobToApply = db.jobs[0];
console.log(`✓ Testing job: ${jobToApply.title} by ${jobToApply.companyName} at ₹${jobToApply.dailyWage}/day`);

// 2. Test Applying to Job with Passbook
handleApplyJobWithPassbook(jobToApply.id);
const newApp = db.applications.find(a => a.jobId === jobToApply.id && a.workerId === currentUser.id);
if (!newApp) throw new Error("Application not created in db.applications");
console.log(`✓ 1-Click Passbook Application created: #${newApp.id}, Status: '${newApp.status}', Verified Days: ${newApp.passbookDaysVerified}`);

// 3. Test Employer Console & Offer Issuance
currentUser = db.employers[0];
currentRole = 'employer';
console.log(`✓ Switched to Employer: ${currentUser.companyName}`);
handleEmployerIssueOffer(newApp.id);
if (newApp.status !== 'Offer Letter Issued') throw new Error("Status failed to update to 'Offer Letter Issued'");
console.log(`✓ Employer approved passbook days and issued offer: Status is '${newApp.status}'`);

// 4. Test Worker Accepting Offer & Auto-Adding to Passbook
currentUser = ramesh;
currentRole = 'worker';
const initialEmploymentCount = db.employments.filter(e => e.workerId === currentUser.id).length;
handleAcceptJobOffer(newApp.id);
const updatedEmploymentCount = db.employments.filter(e => e.workerId === currentUser.id).length;
if (newApp.status !== 'Accepted & Joined') throw new Error("Application status not 'Accepted & Joined'");
if (updatedEmploymentCount !== initialEmploymentCount + 1) throw new Error("New employment was not added to passbook");
console.log(`✓ Worker accepted offer! Status: '${newApp.status}', Passbook employments: ${initialEmploymentCount} -> ${updatedEmploymentCount}`);

// 5. Test Grievance Auto-Fill from Passbook
document.elements['grv-employer'] = { value: '' };
document.elements['grv-days'] = { value: '' };
document.elements['grv-amount'] = { value: '' };
document.elements['grv-category'] = { value: '' };
document.elements['grv-desc'] = { value: '' };

handleSelectPassbookJobForGrievance('JOB-502');
console.log(`✓ Auto-filled Grievance: Employer='${document.elements['grv-employer'].value}', Days=${document.elements['grv-days'].value}, Amount=₹${document.elements['grv-amount'].value}`);
if (!document.elements['grv-employer'].value || !document.elements['grv-amount'].value) {
  throw new Error("Grievance auto-fill failed for JOB-502");
}

// 6. Test Worker Grievance Solve Flow
// Before solving, check paymentStatus of JOB-502
const job502 = db.employments.find(e => e.id === 'JOB-502');
console.log(`✓ Before grievance resolution: JOB-502 Payment Status is '${job502.paymentStatus}'`);
if (job502.paymentStatus !== 'Pending') throw new Error("Expected JOB-502 paymentStatus to be Pending initially");

// Find existing grievance linked to JOB-502
const grv101 = db.grievances.find(g => g.id === 'GRV-2026-101');
console.log(`✓ Existing Grievance #${grv101.id} Status: '${grv101.status}'`);

// Test worker solving the grievance
handleWorkerConfirmSettlement('GRV-2026-101');
console.log(`✓ Worker confirmed settlement! Grievance #${grv101.id} Status: '${grv101.status}'`);
if (grv101.status !== 'Resolved') throw new Error("Expected grievance status to be Resolved");

// Verify that JOB-502 in digital passbook automatically updated to 'Paid'
console.log(`✓ After grievance resolution: JOB-502 Payment Status in Passbook is '${job502.paymentStatus}'`);
if (job502.paymentStatus !== 'Paid') throw new Error("Passbook employment paymentStatus was not updated to Paid!");

console.log("\nALL TESTS PASSED WITH 100% SUCCESS!");
