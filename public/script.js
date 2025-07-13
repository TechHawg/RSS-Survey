let customSkillCount = 0;
        let projectCount = 1;
        
        // Initialize progress to 0
        document.addEventListener('DOMContentLoaded', function() {
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.style.transition = 'none'; // Disable transition for initial set
                setTimeout(function() {
                    progressBar.style.transition = 'width 0.3s ease'; // Re-enable transition
                }, 50);
            }
            if (progressText) progressText.textContent = '0% Complete';
            // Also handle the other learning interests text field
            const otherLearningField = document.getElementById('other_learning');
            if (otherLearningField) {
                otherLearningField.addEventListener('input', function() {
                    if (this.value.trim() !== '') {
                        const noneCheckbox = document.getElementById('learn_none');
                        if (noneCheckbox && noneCheckbox.checked) {
                            noneCheckbox.checked = false;
                        }
                    }
                    updateProgress();
                });
            }
        });
        
        // Handle None checkbox in learning interests
        function handleNoneCheckbox(noneCheckbox) {
            const allCheckboxes = document.querySelectorAll('input[name="learning_interests"]');
            
            if (noneCheckbox.checked) {
                // Uncheck all other checkboxes
                allCheckboxes.forEach(checkbox => {
                    if (checkbox.id !== 'learn_none') {
                        checkbox.checked = false;
                    }
                });
                // Also clear the other learning interests text field
                const otherLearning = document.getElementById('other_learning');
                if (otherLearning) otherLearning.value = '';
            }
            
            updateProgress();
        }
        
        // Prevent selecting other options when None is checked
        document.addEventListener('DOMContentLoaded', function() {
            const learningCheckboxes = document.querySelectorAll('input[name="learning_interests"]:not(#learn_none)');
            learningCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        const noneCheckbox = document.getElementById('learn_none');
                        if (noneCheckbox && noneCheckbox.checked) {
                            noneCheckbox.checked = false;
                        }
                    }
                    updateProgress();
                });
            });
        });
        
        // Progress bar functionality
        function updateProgress() {
            try {
                const sections = document.querySelectorAll('.section');
                let completedSections = 0;
                
                sections.forEach((section, index) => {
                    let sectionComplete = false;
                    
                    // Section 0: Personal Info (Name & Email) - REQUIRED
                    if (index === 0) {
                        const name = section.querySelector('input[name="name"]');
                        const email = section.querySelector('input[name="email"]');
                        sectionComplete = (name && name.value.trim() !== '') && 
                                        (email && email.value.trim() !== '');
                    }
                    
                    // Section 1: Skill Proficiency - REQUIRED (at least one)
                    else if (index === 1) {
                        const ratedSkills = section.querySelectorAll('input[type="radio"]:checked');
                        sectionComplete = ratedSkills.length > 0;
                    }
                    
                    // Section 2: Learning Interests - REQUIRED (at least one)
                    else if (index === 2) {
                        const checkedInterests = section.querySelectorAll('input[type="checkbox"]:checked');
                        const otherInterests = section.querySelector('input[name="other_learning_interests"]');
                        sectionComplete = checkedInterests.length > 0 || (otherInterests && otherInterests.value.trim() !== '');
                    }
                    
                    // Section 3: Project Participation Interest - REQUIRED
                    else if (index === 3) {
                        const projectInterest = section.querySelector('select[name="project_interest"]');
                        sectionComplete = projectInterest && projectInterest.value !== '';
                    }
                    
                    // Section 4: Project Ideas - REQUIRED (at least one complete project)
                    else if (index === 4) {
                        // Check if at least one project has all three fields filled
                        const projects = section.querySelectorAll('.project-container');
                        for (let project of projects) {
                            const title = project.querySelector('input[id*="_title"]');
                            const benefits = project.querySelector('input[id*="_benefits"]');
                            const description = project.querySelector('textarea[id*="_description"]');
                            
                            if (title && title.value.trim() !== '' &&
                                benefits && benefits.value.trim() !== '' &&
                                description && description.value.trim() !== '') {
                                sectionComplete = true;
                                break;
                            }
                        }
                    }
                    
                    // Section 5: Time Availability - REQUIRED
                    else if (index === 5) {
                        const timeAvail = section.querySelector('select[name="time_availability"]');
                        sectionComplete = timeAvail && timeAvail.value !== '';
                    }
                    
                    // Section 6: Additional Input - OPTIONAL
                    else if (index === 6) {
                        sectionComplete = true; // Always consider optional section as complete
                    }
                    
                    // Update visual indicator
                    const sectionTitle = section.querySelector('h2.section-title');
                    if (sectionTitle) {
                        if (sectionComplete) {
                            sectionTitle.classList.add('complete');
                            if (index !== 6) completedSections++; // Don't count optional section
                        } else {
                            sectionTitle.classList.remove('complete');
                        }
                    }
                });
                
                // Calculate progress based on 6 required sections
                const progress = (completedSections / 6) * 100;
                const progressBar = document.getElementById('progressBar');
                const progressText = document.getElementById('progressText');
                
                if (progressBar) progressBar.style.width = progress + '%';
                if (progressText) progressText.textContent = Math.round(progress) + '% Complete';
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
        
        // Add event listeners for progress updates when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            try {
                const formInputs = document.querySelectorAll('input, select, textarea');
                formInputs.forEach(input => {
                    input.addEventListener('change', updateProgress);
                    input.addEventListener('input', updateProgress);
                });
                
                // Set initial progress to 0 before calculation
                const progressBar = document.getElementById('progressBar');
                const progressText = document.getElementById('progressText');
                if (progressBar) progressBar.style.width = '0%';
                if (progressText) progressText.textContent = '0% Complete';
                
                // Initial progress check
                updateProgress();
                // Double-check after a brief delay to ensure all elements are loaded
                setTimeout(updateProgress, 100);
                
                // Highlight selected skill ratings
                document.addEventListener('change', function(e) {
                    if (e.target && e.target.type === 'radio' && e.target.name.startsWith('skill_')) {
                        // Remove previous selection highlights for this skill
                        const skillRow = e.target.closest('tr');
                        if (skillRow) {
                            skillRow.querySelectorAll('.rating-cell').forEach(cell => {
                                cell.classList.remove('selected-1', 'selected-2', 'selected-3', 'selected-4', 'selected-5');
                            });
                            
                            // Add highlight to selected rating
                            const selectedCell = e.target.closest('.rating-cell');
                            if (selectedCell) {
                                selectedCell.classList.add('selected-' + e.target.value);
                            }
                        }
                    }
                });
                
                // Form submission handler
                const surveyForm = document.getElementById('surveyForm');
                if (surveyForm) {
                    surveyForm.addEventListener('submit', handleFormSubmit);
                }
            } catch (error) {
                console.error('Error setting up event listeners:', error);
            }
        });
        
        // Toggle project interest details
        function toggleProjectSection(value) {
            try {
                const detailsSection = document.getElementById('project_interest_details');
                const timeAvailability = document.getElementById('time_availability');
                const projectInfoBox = document.getElementById('projectInfoBox');
                
                // Show details field for all options except "no"
                if (value && value !== 'no') {
                    if (detailsSection) detailsSection.style.display = 'block';
                } else {
                    if (detailsSection) detailsSection.style.display = 'none';
                }
                
                // Update project info box message based on participation interest
                if (value === 'no' && projectInfoBox) {
                    projectInfoBox.innerHTML = '<p>Even though you cannot participate now, <strong style="color: #e74c3c;">please share at least one complete project idea (all fields required).</strong></p>' +
                        '<p style="margin-top: 8px; font-size: 0.9em;">Your suggestions help us plan initiatives that might interest you in the future.</p>';
                } else if (projectInfoBox) {
                    projectInfoBox.innerHTML = '<p>Share your project ideas. <strong style="color: #e74c3c;">At least one complete project is required (all fields).</strong></p>' +
                        '<p style="margin-top: 8px; font-size: 0.9em;">For each project, please provide: Title, Who Benefits, and Description.</p>';
                }
                
                // Handle time availability based on interest
                if (value === 'no') {
                    // Suggest "none" for time availability when not interested
                    if (timeAvailability && !timeAvailability.value) {
                        timeAvailability.value = 'none';
                    }
                } else {
                    // Reset time availability if it was set to "none" and they change their mind
                    if (timeAvailability && timeAvailability.value === 'none' && value !== 'no') {
                        timeAvailability.value = '';
                    }
                }
                
                updateProgress();
            } catch (error) {
                console.error('Error in toggleProjectSection:', error);
            }
        }
        
        // Add custom skill row
        function addSkillRow() {
            try {
                customSkillCount++;
                const skillName = 'custom_skill_' + customSkillCount;
                
                // Show custom skills group if hidden
                const customGroup = document.getElementById('customSkillsGroup');
                if (customGroup) customGroup.style.display = 'block';
                
                const tbody = document.getElementById('customSkillsBody');
                if (!tbody) return;
                
                const newRow = document.createElement('tr');
                newRow.style.animation = 'slideInUp 0.4s ease';
                newRow.innerHTML = '<td>' +
                    '<input type="text" class="editable-skill" name="' + skillName + '_name" placeholder="Enter skill name" required>' +
                    '<button type="button" class="remove-skill-btn" onclick="removeSkillRow(this)">Remove</button>' +
                    '</td>' +
                    '<td class="rating-cell"><input type="radio" name="' + skillName + '_rating" value="1"></td>' +
                    '<td class="rating-cell"><input type="radio" name="' + skillName + '_rating" value="2"></td>' +
                    '<td class="rating-cell"><input type="radio" name="' + skillName + '_rating" value="3"></td>' +
                    '<td class="rating-cell"><input type="radio" name="' + skillName + '_rating" value="4"></td>' +
                    '<td class="rating-cell"><input type="radio" name="' + skillName + '_rating" value="5"></td>';
                
                tbody.appendChild(newRow);
                
                // Add event listeners to new inputs
                newRow.querySelectorAll('input').forEach(input => {
                    input.addEventListener('change', updateProgress);
                    input.addEventListener('input', updateProgress);
                });
            } catch (error) {
                console.error('Error adding skill row:', error);
            }
        }
        
        // Remove skill row
        function removeSkillRow(button) {
            try {
                const row = button.closest('tr');
                if (!row) return;
                
                row.style.animation = 'fadeOut 0.3s ease';
                setTimeout(function() {
                    row.remove();
                    updateProgress();
                    
                    // Hide custom skills group if no custom skills remain
                    const tbody = document.getElementById('customSkillsBody');
                    const customGroup = document.getElementById('customSkillsGroup');
                    if (tbody && customGroup && tbody.children.length === 0) {
                        customGroup.style.display = 'none';
                    }
                }, 300);
            } catch (error) {
                console.error('Error removing skill row:', error);
            }
        }
        
        // Add project
        function addProject() {
            try {
                if (projectCount >= 3) {
                    alert('You can add up to 3 projects only.');
                    return;
                }
                
                projectCount++;
                const container = document.getElementById('projectsContainer');
                if (!container) return;
                
                const newProject = document.createElement('div');
                newProject.className = 'project-container';
                newProject.setAttribute('data-project', projectCount);
                
                newProject.innerHTML = '<div class="project-number">' + projectCount + '</div>' +
                    '<button type="button" class="remove-project-btn" onclick="removeProject(this)">×</button>' +
                    '<div class="project-fields">' +
                    '<div class="form-group">' +
                    '<label for="project' + projectCount + '_title" class="required">Project Title</label>' +
                    '<input type="text" id="project' + projectCount + '_title" name="project' + projectCount + '_title" placeholder="e.g., Customer Feedback Dashboard (Required)" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="project' + projectCount + '_benefits" class="required">Who Benefits</label>' +
                    '<input type="text" id="project' + projectCount + '_benefits" name="project' + projectCount + '_benefits" placeholder="e.g., Management team, End-users, Internal processes" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="project' + projectCount + '_description" class="required">Project Description</label>' +
                    '<textarea id="project' + projectCount + '_description" name="project' + projectCount + '_description" placeholder="Describe the project, its goals, and expected outcomes..." required></textarea>' +
                    '</div>' +
                    '</div>';
                
                container.appendChild(newProject);
                
                // Add event listeners to new inputs
                newProject.querySelectorAll('input, textarea').forEach(input => {
                    input.addEventListener('change', updateProgress);
                    input.addEventListener('input', updateProgress);
                });
                
                // Hide add button if 3 projects
                if (projectCount >= 3) {
                    const addBtn = document.querySelector('.add-project-btn');
                    if (addBtn) addBtn.style.display = 'none';
                }
            } catch (error) {
                console.error('Error adding project:', error);
            }
        }
        
        // Remove project
        function removeProject(button) {
            try {
                const project = button.closest('.project-container');
                if (!project) return;
                
                project.style.animation = 'fadeOut 0.4s ease';
                
                setTimeout(function() {
                    project.remove();
                    projectCount--;
                    
                    // Renumber remaining projects
                    const projects = document.querySelectorAll('.project-container');
                    projects.forEach(function(proj, index) {
                        const num = index + 1;
                        proj.setAttribute('data-project', num);
                        const projectNum = proj.querySelector('.project-number');
                        if (projectNum) projectNum.textContent = num;
                        
                        // Update field names and IDs
                        proj.querySelectorAll('input, textarea').forEach(function(field) {
                            const oldName = field.name;
                            const oldId = field.id;
                            if (oldName) {
                                field.name = oldName.replace(/project\d+/, 'project' + num);
                            }
                            if (oldId) {
                                field.id = oldId.replace(/project\d+/, 'project' + num);
                            }
                        });
                        
                        // Update labels
                        proj.querySelectorAll('label').forEach(function(label) {
                            const forAttr = label.getAttribute('for');
                            if (forAttr) {
                                label.setAttribute('for', forAttr.replace(/project\d+/, 'project' + num));
                            }
                        });
                    });
                    
                    // Show add button again
                    const addBtn = document.querySelector('.add-project-btn');
                    if (addBtn) addBtn.style.display = 'flex';
                    updateProgress();
                }, 400);
            } catch (error) {
                console.error('Error removing project:', error);
            }
        }
        
        // Format form data function
        function getFormData() {
            const form = document.getElementById('surveyForm');
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (data[key]) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            });
            return data;
        }
        
        // Form submission handler
        async function handleFormSubmit(e) {
            e.preventDefault();
            try {
                // Validate name and email (already required by HTML5)
                const name = document.querySelector('input[name="name"]');
                const email = document.querySelector('input[name="email"]');
                if (!name || !name.value.trim() || !email || !email.value.trim()) {
                    alert('Please provide your name and email address.');
                    return;
                }
                
                // Validate at least one skill is rated
                const skillInputs = document.querySelectorAll('input[type="radio"]:checked');
                if (skillInputs.length === 0) {
                    alert('Please rate at least one skill before submitting.');
                    return;
                }
                
                // Validate custom skills have ratings
                const customSkills = document.querySelectorAll('.editable-skill');
                for (let skill of customSkills) {
                    if (skill.value && skill.value.trim()) {
                        const skillName = skill.name.replace('_name', '_rating');
                        const rating = document.querySelector('input[name="' + skillName + '"]:checked');
                        if (!rating) {
                            alert('Please rate the skill "' + skill.value + '" or remove it.');
                            skill.focus();
                            return;
                        }
                    }
                }
                
                // Validate learning interests (at least one including "None")
                const learningInterests = document.querySelectorAll('input[name="learning_interests"]:checked');
                const otherLearning = document.querySelector('input[name="other_learning_interests"]');
                if (learningInterests.length === 0 && (!otherLearning || !otherLearning.value.trim())) {
                    alert('Please select at least one learning interest (you can select "None" if not interested in learning new skills).');
                    return;
                }
                
                // Validate project participation interest
                const projectInterest = document.querySelector('select[name="project_interest"]');
                if (!projectInterest || !projectInterest.value) {
                    alert('Please select your project participation interest.');
                    return;
                }
                
                // Validate at least one complete project (all three fields)
                let hasCompleteProject = false;
                const projectContainers = document.querySelectorAll('.project-container');
                for (let project of projectContainers) {
                    const title = project.querySelector('input[id*="_title"]');
                    const benefits = project.querySelector('input[id*="_benefits"]');
                    const description = project.querySelector('textarea[id*="_description"]');
                    
                    if (title && title.value.trim() !== '' &&
                        benefits && benefits.value.trim() !== '' &&
                        description && description.value.trim() !== '') {
                        hasCompleteProject = true;
                        break;
                    }
                }
                if (!hasCompleteProject) {
                    alert('Please provide at least one complete project idea with title, who benefits, and description.');
                    return;
                }
                
                // Validate time availability
                const timeAvail = document.querySelector('select[name="time_availability"]');
                if (!timeAvail || !timeAvail.value) {
                    alert('Please select your weekly time availability.');
                    return;
                }
                
                const CLOUD_FUNCTION_URL = 'https://us-central1-gen-lang-client-0010833840.cloudfunctions.net/submitSurvey';
                
                if (CLOUD_FUNCTION_URL === 'YOUR_CLOUD_FUNCTION_URL_HERE') {
                    alert('The CLOUD_FUNCTION_URL is not configured. Please contact the administrator.');
                    return;
                }

                const formData = getFormData();
                
                const submitButton = document.querySelector('.submit-btn');
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';

                const response = await fetch(CLOUD_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    window.location.href = 'thank-you.html';
                } else {
                    alert('There was an error submitting your survey. Please try again.');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Survey';
                }

            } catch (error) {
                console.error('Error during form submission:', error);
                alert('An error occurred. Please check the form and try again.');
                const submitButton = document.querySelector('.submit-btn');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Survey';
            }
        }
        
        // Add fade out animation keyframe if not already present
        if (!document.getElementById('dynamicStyles')) {
            const style = document.createElement('style');
            style.id = 'dynamicStyles';
            style.innerHTML = '@keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.8); } }';
            document.head.appendChild(style);
        }