// Global state
const state = {
    currentLanguage: 'en',
    currentTheme: 'light',
    currentTemplate: 'default',
    cvData: {
        personal: {
            fullName: '',
            professionalTitle: '',
            email: '',
            phone: '',
            linkedin: '',
            address: '',
            summary: ''
        },
        education: [],
        experience: [],
        skills: '',
        languages: '',
        projects: []
    }
};

// DOM Elements
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    languageToggle: document.getElementById('languageToggle'),
    exportPDF: document.getElementById('exportPDF'),
    exportImage: document.getElementById('exportImage'),
    exportJSON: document.getElementById('exportJSON'),
    importJSON: document.getElementById('importJSON'),
    printCV: document.getElementById('printCV'),
    notification: document.getElementById('notification'),
    notificationMessage: document.getElementById('notificationMessage'),
    loading: document.getElementById('loading'),
    cvContent: document.getElementById('cvContent'),
    templateSelect: document.getElementById('templateSelect')
};

// Initialize the application
function init() {
    setupEventListeners();
    loadFromLocalStorage();
    updatePreview();
    updateLanguageUI();
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Language toggle
    elements.languageToggle.addEventListener('change', toggleLanguage);

    // Export buttons
    elements.exportPDF.addEventListener('click', exportPDF);
    elements.exportImage.addEventListener('click', exportImage);
    elements.exportJSON.addEventListener('click', exportJSON);
    elements.importJSON.addEventListener('click', () => elements.importJSON.click());
    elements.importJSON.addEventListener('change', importJSON);
    elements.printCV.addEventListener('click', printCV);

    // Template selection
    elements.templateSelect.addEventListener('change', (e) => {
        state.currentTemplate = e.target.value;
        updatePreview();
    });

    // Tab navigation
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Form input listeners
    setupFormListeners();

    // Dynamic list buttons
    document.getElementById('addEducation').addEventListener('click', addEducationItem);
    document.getElementById('addExperience').addEventListener('click', addExperienceItem);
    document.getElementById('addProject').addEventListener('click', addProjectItem);
}

// Set up form input listeners
function setupFormListeners() {
    // Personal info
    const personalInputs = ['fullName', 'professionalTitle', 'email', 'phone', 'linkedin', 'address', 'summary'];
    personalInputs.forEach(id => {
        const input = document.getElementById(id);
        const inputAr = document.getElementById(id + 'Ar');
        if (input) input.addEventListener('input', updatePersonalInfo);
        if (inputAr) inputAr.addEventListener('input', updatePersonalInfo);
    });

    // Skills and languages
    document.getElementById('skills').addEventListener('input', updateSkills);
    document.getElementById('skillsAr').addEventListener('input', updateSkills);
    document.getElementById('languages').addEventListener('input', updateLanguages);
    document.getElementById('languagesAr').addEventListener('input', updateLanguages);
}

// Update personal information
function updatePersonalInfo(e) {
    const id = e.target.id.replace('Ar', '');
    const value = e.target.value;
    
    if (id === 'fullName') {
        state.cvData.personal.fullName = value;
    } else if (id === 'professionalTitle') {
        state.cvData.personal.professionalTitle = value;
    } else if (id === 'email') {
        state.cvData.personal.email = value;
    } else if (id === 'phone') {
        state.cvData.personal.phone = value;
    } else if (id === 'linkedin') {
        state.cvData.personal.linkedin = value;
    } else if (id === 'address') {
        state.cvData.personal.address = value;
    } else if (id === 'summary') {
        state.cvData.personal.summary = value;
    }

    saveToLocalStorage();
    updatePreview();
}

// Update skills
function updateSkills(e) {
    state.cvData.skills = e.target.value;
    saveToLocalStorage();
    updatePreview();
}

// Update languages
function updateLanguages(e) {
    state.cvData.languages = e.target.value;
    saveToLocalStorage();
    updatePreview();
}

// Add education item
function addEducationItem() {
    const educationList = document.getElementById('educationList');
    const itemId = Date.now();
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <input type="text" class="form-input" placeholder="Degree" data-field="degree">
        <input type="text" class="form-input" placeholder="Institution" data-field="institution">
        <input type="text" class="form-input" placeholder="Years (e.g., 2020-2024)" data-field="years">
        <button class="remove-btn" onclick="removeItem(this, 'education')">×</button>
    `;
    educationList.appendChild(item);
    
    // Add event listeners
    item.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => updateDynamicItem(e, itemId, 'education'));
    });
    
    state.cvData.education.push({ id: itemId, degree: '', institution: '', years: '' });
    saveToLocalStorage();
}

// Add experience item
function addExperienceItem() {
    const experienceList = document.getElementById('experienceList');
    const itemId = Date.now();
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <input type="text" class="form-input" placeholder="Position" data-field="position">
        <input type="text" class="form-input" placeholder="Company" data-field="company">
        <input type="text" class="form-input" placeholder="Years (e.g., 2022-Present)" data-field="years">
        <textarea class="form-textarea" placeholder="Description" data-field="description"></textarea>
        <button class="remove-btn" onclick="removeItem(this, 'experience')">×</button>
    `;
    experienceList.appendChild(item);
    
    // Add event listeners
    item.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', (e) => updateDynamicItem(e, itemId, 'experience'));
    });
    
    state.cvData.experience.push({ id: itemId, position: '', company: '', years: '', description: '' });
    saveToLocalStorage();
}

// Add project item
function addProjectItem() {
    const projectsList = document.getElementById('projectsList');
    const itemId = Date.now();
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <input type="text" class="form-input" placeholder="Project Name" data-field="name">
        <input type="text" class="form-input" placeholder="Technologies" data-field="technologies">
        <textarea class="form-textarea" placeholder="Description" data-field="description"></textarea>
        <button class="remove-btn" onclick="removeItem(this, 'projects')">×</button>
    `;
    projectsList.appendChild(item);
    
    // Add event listeners
    item.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', (e) => updateDynamicItem(e, itemId, 'projects'));
    });
    
    state.cvData.projects.push({ id: itemId, name: '', technologies: '', description: '' });
    saveToLocalStorage();
}

// Update dynamic item
function updateDynamicItem(e, itemId, type) {
    const field = e.target.getAttribute('data-field');
    const value = e.target.value;
    
    const item = state.cvData[type].find(item => item.id === itemId);
    if (item) {
        item[field] = value;
        saveToLocalStorage();
        updatePreview();
    }
}

// Remove item
function removeItem(button, type) {
    const item = button.parentElement;
    const itemId = parseInt(item.dataset.id || Array.from(item.parentElement.children).indexOf(item));
    
    state.cvData[type] = state.cvData[type].filter((item, index) => index !== itemId);
    item.remove();
    saveToLocalStorage();
    updatePreview();
}

// Switch tab
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Toggle theme
function toggleTheme() {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', state.currentTheme);
    
    // Update button text
    const themeText = state.currentTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    const themeTextAr = state.currentTheme === 'light' ? '🌙 الوضع الداكن' : '☀️ الوضع المضيء';
    
    elements.themeToggle.querySelector('[data-lang="en"]').textContent = themeText;
    elements.themeToggle.querySelector('[data-lang="ar"]').textContent = themeTextAr;
    
    saveToLocalStorage();
}

// Toggle language
function toggleLanguage() {
    state.currentLanguage = state.currentLanguage === 'en' ? 'ar' : 'en';
    document.body.setAttribute('dir', state.currentLanguage === 'ar' ? 'rtl' : 'ltr');
    updateLanguageUI();
    saveToLocalStorage();
}

// Update language UI
function updateLanguageUI() {
    // Show/hide language-specific elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        if (element.getAttribute('data-lang') === state.currentLanguage) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Update input placeholders based on language
    updateInputPlaceholders();
    
    // Update preview
    updatePreview();
}

// Update input placeholders based on language
function updateInputPlaceholders() {
    const placeholders = {
        en: {
            fullName: 'John Doe',
            professionalTitle: 'Software Engineer',
            email: 'john@example.com',
            phone: '+1234567890',
            linkedin: 'https://linkedin.com/in/johndoe',
            address: 'City, Country',
            summary: 'Brief professional summary...',
            skills: 'JavaScript, React, Node.js, Python',
            languages: 'English (Fluent), Arabic (Native)'
        },
        ar: {
            fullName: 'محمد أحمد',
            professionalTitle: 'مهندس برمجيات',
            email: 'john@example.com',
            phone: '+1234567890',
            linkedin: 'https://linkedin.com/in/johndoe',
            address: 'المدينة، الدولة',
            summary: 'ملخص مهني موجز...',
            skills: 'جافا سكريبت، رياكت، نود.جي إس، بايثون',
            languages: 'الإنجليزية (متقن)، العربية (أم)'
        }
    };
    
    const lang = state.currentLanguage;
    document.getElementById('fullName' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].fullName;
    document.getElementById('professionalTitle' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].professionalTitle;
    document.getElementById('email').placeholder = placeholders[lang].email;
    document.getElementById('phone').placeholder = placeholders[lang].phone;
    document.getElementById('linkedin').placeholder = placeholders[lang].linkedin;
    document.getElementById('address' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].address;
    document.getElementById('summary' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].summary;
    document.getElementById('skills' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].skills;
    document.getElementById('languages' + (lang === 'ar' ? 'Ar' : '')).placeholder = placeholders[lang].languages;
}

// Update CV preview
function updatePreview() {
    const { personal, education, experience, skills, languages, projects } = state.cvData;
    const lang = state.currentLanguage;
    
    let html = `
        <div class="cv-header">
            <h1 class="cv-name">${personal.fullName || (lang === 'en' ? 'Your Name' : 'اسمك')}</h1>
            <div class="cv-title">${personal.professionalTitle || (lang === 'en' ? 'Professional Title' : 'المسمى الوظيفي')}</div>
            <div class="cv-contact">
                ${personal.email ? `<div>📧 ${personal.email}</div>` : ''}
                ${personal.phone ? `<div>📱 ${personal.phone}</div>` : ''}
                ${personal.linkedin ? `<div>🔗 ${personal.linkedin}</div>` : ''}
                ${personal.address ? `<div>📍 ${personal.address}</div>` : ''}
            </div>
        </div>
    `;
    
    // Summary section
    if (personal.summary) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Summary' : 'ملخص'}</h2>
                <p>${personal.summary}</p>
            </div>
        `;
    }
    
    // Education section
    if (education.length > 0) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Education' : 'التعليم'}</h2>
                ${education.map(edu => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title">${edu.degree}</div>
                            <div class="cv-item-date">${edu.years}</div>
                        </div>
                        <div class="cv-item-subtitle">${edu.institution}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Experience section
    if (experience.length > 0) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Experience' : 'الخبرة'}</h2>
                ${experience.map(exp => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title">${exp.position}</div>
                            <div class="cv-item-date">${exp.years}</div>
                        </div>
                        <div class="cv-item-subtitle">${exp.company}</div>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Skills section
    if (skills) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Skills' : 'المهارات'}</h2>
                <div class="cv-skills">
                    ${skills.split(',').map(skill => `
                        <span class="skill-tag">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Languages section
    if (languages) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Languages' : 'اللغات'}</h2>
                <p>${languages}</p>
            </div>
        `;
    }
    
    // Projects section
    if (projects.length > 0) {
        html += `
            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'en' ? 'Projects' : 'المشاريع'}</h2>
                ${projects.map(proj => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title">${proj.name}</div>
                        </div>
                        <div class="cv-item-subtitle">${proj.technologies}</div>
                        <p>${proj.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    elements.cvContent.innerHTML = html;
    elements.cvContent.className = `cv-template ${state.currentTemplate}-template`;
}

// Export to PDF
function exportPDF() {
    showLoading();
    
    setTimeout(() => {
        const element = elements.cvContent;
        const opt = {
            margin: 10,
            filename: 'my-cv.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            hideLoading();
            showNotification('PDF exported successfully!', 'success');
        });
    }, 500);
}

// Export to Image
function exportImage() {
    showLoading();
    
    setTimeout(() => {
        html2canvas(elements.cvContent).then(canvas => {
            const link = document.createElement('a');
            link.download = 'my-cv.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            hideLoading();
            showNotification('Image exported successfully!', 'success');
        });
    }, 500);
}

// Export to JSON
function exportJSON() {
    const dataStr = JSON.stringify(state.cvData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cv-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('JSON exported successfully!', 'success');
}

// Import JSON
function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            state.cvData = data;
            loadFormData();
            updatePreview();
            saveToLocalStorage();
            showNotification('JSON imported successfully!', 'success');
        } catch (error) {
            showNotification('Error importing JSON file', 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Print CV
function printCV() {
    const originalContents = document.body.innerHTML;
    const printContents = elements.cvContent.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    
    // Reinitialize the application
    init();
}

// Load form data from state
function loadFormData() {
    // Personal info
    document.getElementById('fullName').value = state.cvData.personal.fullName;
    document.getElementById('professionalTitle').value = state.cvData.personal.professionalTitle;
    document.getElementById('email').value = state.cvData.personal.email;
    document.getElementById('phone').value = state.cvData.personal.phone;
    document.getElementById('linkedin').value = state.cvData.personal.linkedin;
    document.getElementById('address').value = state.cvData.personal.address;
    document.getElementById('summary').value = state.cvData.personal.summary;
    
    // Skills and languages
    document.getElementById('skills').value = state.cvData.skills;
    document.getElementById('languages').value = state.cvData.languages;
    
    // TODO: Load dynamic lists (education, experience, projects)
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('cvData', JSON.stringify(state.cvData));
    localStorage.setItem('currentLanguage', state.currentLanguage);
    localStorage.setItem('currentTheme', state.currentTheme);
    localStorage.setItem('currentTemplate', state.currentTemplate);
}

// Load from localStorage
function loadFromLocalStorage() {
    const cvData = localStorage.getItem('cvData');
    const currentLanguage = localStorage.getItem('currentLanguage');
    const currentTheme = localStorage.getItem('currentTheme');
    const currentTemplate = localStorage.getItem('currentTemplate');
    
    if (cvData) state.cvData = JSON.parse(cvData);
    if (currentLanguage) state.currentLanguage = currentLanguage;
    if (currentTheme) state.currentTheme = currentTheme;
    if (currentTemplate) state.currentTemplate = currentTemplate;
    
    // Apply saved settings
    document.body.setAttribute('data-theme', state.currentTheme);
    document.body.setAttribute('dir', state.currentLanguage === 'ar' ? 'rtl' : 'ltr');
    elements.templateSelect.value = state.currentTemplate;
    
    // Load form data
    loadFormData();
}

// Show notification
function showNotification(message, type = 'success') {
    elements.notificationMessage.textContent = message;
    elements.notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Show loading
function showLoading() {
    elements.loading.classList.add('show');
}

// Hide loading
function hideLoading() {
    elements.loading.classList.remove('show');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);