document.addEventListener("DOMContentLoaded", function () {

        // Add an event listener for form submission
        document.getElementById('manual-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                IAT: parseFloat(document.getElementById('IAT').value),
                Magnitue: parseFloat(document.getElementById('Magnitue').value),
                syn_count: parseFloat(document.getElementById('syn_count').value),
                AVG: parseFloat(document.getElementById('AVG').value),
                Min: parseFloat(document.getElementById('Min').value),
                'Tot size': parseFloat(document.getElementById('Tot size').value),
                syn_flag_number: parseFloat(document.getElementById('syn_flag_number').value),
                Header_Length: parseFloat(document.getElementById('Header_Length').value),
                SourceIP: document.getElementById('SourceIP').value,
                DestinationIP: document.getElementById('DestinationIP').value,
                Max: parseFloat(document.getElementById('Max').value),
            };
            try {
                const response = await fetch('/packet', {
                method: 'POST', // Use POST method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            const data = await response.json();
                 // Extract relevant data from the response
            const { ipAddress, attackType, timeStamp } = data;

            // Create a new object in the desired format
            const newIntruder = {
               ipAddress,
               attackType,
                timeStamp,
            };
                // Display the JSON data in a nice format
                //const responseElement = document.getElementById('response');
                const intruderElement = document.getElementById('intruder-section');
                
                intruderElement.style.display = 'block';
                document.getElementById('ipAddress').value = newIntruder.ipAddress;
                document.getElementById('attackType').value = newIntruder.attackType;
                document.getElementById('timeStamp').value = newIntruder.timeStamp;

            intruderElement.scrollIntoView({ behavior: 'smooth' });// Format with two-space indentation
            } catch (error) {
                // Handle errors that occur during the request
                console.error('Error:', error);
                const responseElement = document.getElementById('response');
                responseElement.innerHTML = '<p style="color:red">An error occurred while processing your request.</p>';
            }
        });
        
        
        //jwt 
       // Add an event listener for the "Create Transaction" button inside the intruder section form
    document.getElementById('intruder-section').addEventListener('submit', async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Hide the manual form section
        // const manualFormSection = document.getElementById('manual-form-section');
        // manualFormSection.style.display = 'none';

        // Show the user registration form
        const registerSection = document.getElementById('register-section');
        registerSection.style.display = 'block';

        // Automatically scroll down to the registration section
        registerSection.scrollIntoView({ behavior: 'smooth' });
    });





    // Handle form submission for user registration
   // Event listener for the registration form submission
document.getElementById('registration-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const orgName = document.getElementById('orgName').value;

    try {
        // Send a POST request to the server
        const response = await fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, orgName }), // Send username and orgName to the server
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Process the response, which is expected to contain a JWT token
        const data = await response.json();
        const jwtToken = data.token; // Capture the JWT token
        const message =data.message;
        // Set the captured JWT token in the JWT Token input field
        const jwtTokenField = document.getElementById('jwtToken');
        const  jwtTokenSection = document.getElementById('jwtTokenField');
        jwtTokenSection.style.display = 'block';
        jwtTokenField.value = jwtToken;
        const regResponsefield = document.getElementById('reg-response');
        const registerSection = document.getElementById('register-section');
        registerSection.style.display = 'none';
        regResponsefield.innerHTML=`<h2 style="color: green;">${message}</h2>`;

        // You can also use the JWT token for authentication in future requests.
        jwtTokenSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
});

document.getElementById('invoke-transaction-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get the JWT token from the input field
        const jwtToken = document.getElementById('jwtToken').value;
        const ipAddress = document.getElementById('ipAddress').value;
        const attackType = document.getElementById('attackType').value;
        const timeStamp = document.getElementById('timeStamp').value;

        const newIntruder ={
        fcn: "createIntrusion3",
        peers:["peer0.org1.example.com","peer0.org2.example.com"],
        chaincodeName:"intrusion",
        channelName:"mychannel",
        args:[ipAddress,attackType,timeStamp]
        };
        console.log(newIntruder);

        try {
            // Make a POST request to the server to invoke the transaction
            const response = await fetch('http://localhost:4000/channels/mychannel/chaincodes/intrusion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`, // Set the JWT token in the 'Authorization' header
                },
                body: JSON.stringify({ newIntruder}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Process the response
            const data = await response.json();

            // Display the response or perform further actions
            const transactionResponse = document.getElementById('transaction-response');
            if(data.result.tx_id){
            transactionResponse.innerHTML = `<p style="color:#000000;">Succussefully added intruder to Block chain       <br>      Transaction Id: ${JSON.stringify(data.result.tx_id || data)}</p>
            <a href="http://localhost:5984/_utils/#database/mychannel_intrusion/_all_docs">click here to see the data in dataBase</a>`;

            }
            else{
            transactionResponse.innerHTML = `<p style="color:#000000;">Transaction Result: ${JSON.stringify(data.errerData || data)}</p>`;
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error:', error);
            const transactionResponse = document.getElementById('transaction-response');
            transactionResponse.innerHTML = '<p style="color:red">An error occurred while processing the transaction.</p>';
        }
    });    
});