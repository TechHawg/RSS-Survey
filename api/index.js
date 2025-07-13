const { google } = require('googleapis');

// This is the main function that will be executed by Google Cloud Functions.
exports.submitSurvey = async (req, res) => {
    // Set CORS headers to allow requests from your GitHub Pages domain.
    // IMPORTANT: Replace 'https://your-github-username.github.io' with your actual GitHub Pages URL.
    res.set('Access-Control-Allow-Origin', 'https://techhawg.github.io');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests for CORS.
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // Authenticate with Google Sheets.
    const auth = new google.auth.GoogleAuth({
        // Scopes define the level of access to Google APIs.
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        // The credentials are provided as environment variables for security.
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // The ID of the spreadsheet to write to.
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Extract the form data from the request body.
    const { body } = req;

    // Define the headers for the Google Sheet. This is now a static list of all possible columns.
    const headers = [
        'Timestamp', 'Name', 'Email', 'Project Interest', 'Interest Details', 
        'Time Availability', 'Additional Input', 'Learning Interests', 'Other Learning',
        'Skill: SharePoint', 'Skill: Copilot/MS AI', 'Skill: Power BI', 'Skill: Azure/M365', 
        'Skill: Excel (Advanced)', 'Skill: VeloCloud/SD-WAN', 'Skill: Network Switches', 
        'Skill: Firewall Management', 'Skill: Network Protocols', 'Skill: Python', 'Skill: C++', 
        'Skill: Java', 'Skill: SQL', 'Skill: Git/Azure DevOps', 'Skill: Automation Tools', 
        'Skill: OCR Tools', 'Skill: API Integration', 'Skill: ServiceNow', 'Skill: Active Directory',
        'Custom Skill 1: Name', 'Custom Skill 1: Rating',
        'Custom Skill 2: Name', 'Custom Skill 2: Rating',
        'Custom Skill 3: Name', 'Custom Skill 3: Rating',
        'Project 1: Title', 'Project 1: Benefits', 'Project 1: Description',
        'Project 2: Title', 'Project 2: Benefits', 'Project 2: Description',
        'Project 3: Title', 'Project 3: Benefits', 'Project 3: Description'
    ];

    // Prepare the data row to be inserted into the sheet.
    const rowData = [
        new Date().toISOString(),
        body.name || '',
        body.email || '',
        body.project_interest || '',
        body.interest_details || '',
        body.time_availability || '',
        body.additional_input || '',
        Array.isArray(body.learning_interests) ? body.learning_interests.join(', ') : body.learning_interests || '',
        body.other_learning_interests || '',
        body.skill_sharepoint || '',
        body.skill_copilot || '',
        body.skill_powerbi || '',
        body.skill_azure || '',
        body.skill_excel || '',
        body.skill_velocloud || '',
        body.skill_switches || '',
        body.skill_firewall || '',
        body.skill_protocols || '',
        body.skill_python || '',
        body.skill_cpp || '',
        body.skill_java || '',
        body.skill_sql || '',
        body.skill_git || '',
        body.skill_automation || '',
        body.skill_ocr || '',
        body.skill_api || '',
        body.skill_servicenow || '',
        body.skill_activedirectory || '',
        body.custom_skill_1_name || '', body.custom_skill_1_rating || '',
        body.custom_skill_2_name || '', body.custom_skill_2_rating || '',
        body.custom_skill_3_name || '', body.custom_skill_3_rating || '',
        body.project1_title || '', body.project1_benefits || '', body.project1_description || '',
        body.project2_title || '', body.project2_benefits || '', body.project2_description || '',
        body.project3_title || '', body.project3_benefits || '', body.project3_description || ''
    ];

    try {
        // Check if the sheet has headers. If not, add them.
        const headerResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!1:1',
        });

        if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [headers],
                },
            });
        }

        // Append the new survey data to the sheet.
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData],
            },
        });

        // Send a success response.
        res.status(200).send({ message: 'Survey submitted successfully!' });

    } catch (error) {
        console.error('Error writing to Google Sheet:', error);
        res.status(500).send({ message: 'Error submitting survey.' });
    }
};
