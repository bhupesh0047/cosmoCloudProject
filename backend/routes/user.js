import express from 'express'; // Use import instead of require
const router = express.Router();

// Define your user-related routes
router.get('/', (req, res) => {
    res.send('User route');
});

// Example: Create a new user route
router.post('/', (req, res) => {
    const newUser = req.body; // Assuming you send user data in the request body
    // Logic to save the new user to the database would go here
    res.status(201).json({ message: 'User created', user: newUser });
});

// Example: Get all users route
router.get('/all', (req, res) => {
    // Logic to fetch users from the database would go here
    res.json({ message: 'List of users' });
});

// Export the router
export default router; // Ensure this line is present
