const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Check if this is an API request
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'Please log in to access this resource'
        });
    }
    
    // For non-API requests, redirect to login
    res.redirect("/login");
};

module.exports = { isLoggedIn };