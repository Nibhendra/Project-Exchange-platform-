document.addEventListener("DOMContentLoaded", function() {
    console.log("ProjiEx is ready!");

    // User registration handling
    const userState = {
        isLoggedIn: false,
        userData: null
    };

    function updateUIForAuthState() {
        const registerBtn = document.getElementById('register-btn');
        const welcomeMsg = document.getElementById('welcome-msg');
        const userNameDisplay = document.getElementById('user-name-display');
        const sections = document.querySelectorAll('main > section');

        if (userState.isLoggedIn && userState.userData) {
            registerBtn.style.display = 'none';
            welcomeMsg.style.display = 'inline-block';
            userNameDisplay.textContent = userState.userData.name;
            sections.forEach(section => section.classList.remove('not-logged-in'));
        } else {
            registerBtn.style.display = 'inline-block';
            welcomeMsg.style.display = 'none';
            sections.forEach(section => section.classList.add('not-logged-in'));
        }
    }

    // Registration modal handling
    const registerBtn = document.getElementById('register-btn');
    const registrationModal = document.getElementById('registration-modal');
    const registrationForm = document.getElementById('registration-form');

    registerBtn.addEventListener('click', function() {
        registrationModal.classList.add('show');
    });

    window.addEventListener('click', function(event) {
        if (event.target === registrationModal) {
            registrationModal.classList.remove('show');
        }
    });

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        userState.userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            institution: document.getElementById('reg-institution').value,
            studyField: document.getElementById('reg-study-field').value,
            academicYear: document.getElementById('reg-academic-year').value
        };
        userState.isLoggedIn = true;
        
        // Store user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userState.userData));
        
        updateUIForAuthState();
        registrationModal.classList.remove('show');
        
        // Show success message
        alert('Registration successful! Welcome to ProjiEx.');
    });

    // Check for existing user data
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        userState.userData = JSON.parse(storedUserData);
        userState.isLoggedIn = true;
        updateUIForAuthState();
    } else {
        updateUIForAuthState();
    }

    // Login state management
    let isLoggedIn = false;

    // DOM Elements
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const mainContent = document.querySelector('header');
    const userStatus = document.getElementById('user-status');
    const welcomeMsg = document.getElementById('welcome-msg');
    const userNameDisplay = document.getElementById('user-name-display');

    // Show login modal on page load if not logged in
    function showLoginModal() {
        if (loginModal) {
            loginModal.classList.add('active');
            mainContent.classList.add('hidden');
        }
    }

    function hideLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('active');
            mainContent.classList.remove('hidden');
        }
    }

    // Handle login form submission
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Add loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.innerHTML = 'Logging in... <span class="loading-spinner"></span>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            try {
                // For demo purposes, accept any email/password
                isLoggedIn = true;
                const userName = email.split('@')[0];
                
                // Update UI
                hideLoginModal();
                registerBtn.style.display = 'none';
                welcomeMsg.style.display = 'inline-block';
                userNameDisplay.textContent = userName;
                
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', userName);
                
            } catch (error) {
                console.error('Login failed:', error);
                alert('Login failed. Please try again.');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }, 1500);
    }

    // Handle register button click
    function handleRegister(e) {
        e.preventDefault();
        alert('Registration functionality will be implemented soon!');
    }

    // Handle logout
    function handleLogout() {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        registerBtn.style.display = 'inline-block';
        welcomeMsg.style.display = 'none';
        showLoginModal();
    }

    // Check login state and initialize
    function initializeLoginState() {
        const storedLoginState = localStorage.getItem('isLoggedIn');
        const storedUserName = localStorage.getItem('userName');
        
        if (storedLoginState === 'true' && storedUserName) {
            isLoggedIn = true;
            registerBtn.style.display = 'none';
            welcomeMsg.style.display = 'inline-block';
            userNameDisplay.textContent = storedUserName;
        } else {
            showLoginModal();
        }
    }

    // Initialize event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', handleLogout);
    }

    // Initialize login state
    initializeLoginState();

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Add active class to the clicked nav link
            const activeLink = document.querySelector(`[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    // Show the first section by default
    showSection('task-posting');

    // Handle task posting form submission
    const taskPostingForm = document.getElementById('task-posting-form');
    taskPostingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!userState.isLoggedIn) {
            alert('Please register or login to post a task.');
            return;
        }

        const subject = document.getElementById('subject').value;
        const difficulty = document.getElementById('difficulty').value;
        const deadline = document.getElementById('deadline').value;
        const budget = document.getElementById('budget').value;
        const description = document.getElementById('description').value;
        const projectFiles = document.getElementById('project-files').files;

        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <h3>${subject}</h3>
            <p><strong>Posted by:</strong> ${userState.userData.name} (${userState.userData.institution})</p>
            <p><strong>Difficulty:</strong> ${difficulty}</p>
            <p><strong>Deadline:</strong> ${deadline}</p>
            <p><strong>Budget:</strong> ₹${budget}</p>
            <p>${description}</p>
            <form class="bid-form">
                <label for="bid-price">Your Bid:</label>
                <input type="number" id="bid-price" name="bid-price" required>
                <button type="submit">Submit Bid</button>
            </form>
            <div class="project-files-list">
                ${Array.from(projectFiles).map(file => `<p>${file.name}</p>`).join('')}
            </div>
        `;

        // Add task to the review form's task selection
        const taskOption = document.createElement('option');
        taskOption.value = subject;
        taskOption.textContent = subject;
        document.getElementById('task').appendChild(taskOption);

        // Track task status and bids
        taskElement.dataset.status = 'open';
        taskElement.dataset.bids = '[]';
        taskElement.dataset.postedBy = userState.userData.name;

        // Add bid form submission handler
        const bidForm = taskElement.querySelector('.bid-form');
        bidForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (!userState.isLoggedIn) {
                alert('Please register or login to place a bid.');
                return;
            }

            const bidPrice = this.querySelector('#bid-price').value;
            const bids = JSON.parse(taskElement.dataset.bids);
            
            // Add new bid with user information
            bids.push({
                price: bidPrice,
                bidder: userState.userData.name,
                institution: userState.userData.institution,
                studyField: userState.userData.studyField,
                academicYear: userState.userData.academicYear,
                timestamp: new Date().toISOString()
            });
            
            taskElement.dataset.bids = JSON.stringify(bids);
            
            // Update bid display
            const bidsList = taskElement.querySelector('.bids-list') || document.createElement('div');
            bidsList.className = 'bids-list';
            bidsList.innerHTML = `
                <h4>Current Bids:</h4>
                ${bids.map(bid => `
                    <div class="bid-item">
                        <p><strong>${bid.bidder}</strong> (${bid.institution}) bid ₹${bid.price}</p>
                        <p>Field: ${bid.studyField} | Year: ${bid.academicYear}</p>
                        <small>${new Date(bid.timestamp).toLocaleString()}</small>
                    </div>
                `).join('')}
            `;
            
            if (!taskElement.querySelector('.bids-list')) {
                taskElement.appendChild(bidsList);
            }
            
            this.reset();
        });

        const taskList = document.getElementById('task-list');
        taskList.appendChild(taskElement);

        taskPostingForm.reset();
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const academicBackground = document.getElementById('academic-background').value;
        const skills = document.getElementById('skills').value;

        document.getElementById('display-name').textContent = name;
        document.getElementById('display-academic-background').textContent = academicBackground;
        document.getElementById('display-skills').textContent = skills;

        document.getElementById('profile-form').style.display = 'none';
        document.getElementById('profile-display').style.display = 'block';
    });

    // Handle profile edit
    document.getElementById('edit-profile').addEventListener('click', function() {
        document.getElementById('profile-form').style.display = 'block';
        document.getElementById('profile-display').style.display = 'none';
    });

    // Handle chat form submission
    const chatForm = document.getElementById('chat-form');
    chatForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const chatMessage = document.getElementById('chat-message').value;

        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.textContent = chatMessage;

        const chatBox = document.getElementById('chat-box');
        chatBox.appendChild(messageElement);

        chatForm.reset();
    });

    // Handle review form submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const task = document.getElementById('task').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <p><strong>Task:</strong> ${task}</p>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p>${review}</p>
        `;

        const reviewList = document.getElementById('review-list');
        reviewList.appendChild(reviewElement);

        reviewForm.reset();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    function updateActiveSection() {
        const currentScroll = window.scrollY;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
    
    // Project submission functionality
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const deadline = document.getElementById('project-deadline').value;
            const budget = document.getElementById('project-budget').value;
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="project-details">
                    <span>Deadline: ${deadline}</span>
                    <span>Budget: $${budget}</span>
                </div>
                <button class="btn">Apply Now</button>
            `;
            
            projectsList.appendChild(projectCard);
            projectForm.reset();
        });
    }
    
    // File upload handling
    const fileInput = document.getElementById('project-files');
    const filesList = document.getElementById('project-files-list');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            filesList.innerHTML = `
                <div class="project-files-list">
                    ${Array.from(files).map(file => `<p>${file.name}</p>`).join('')}
                </div>
            `;
        });
    }
});
