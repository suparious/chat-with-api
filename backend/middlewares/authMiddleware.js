function isAuthenticated(req, res, next) {
  // Check if the session has a user object indicating the user is logged in
  if (req.session.user) {
    console.log('User is authenticated');
    return next(); // Proceed to the next middleware or route handler
  }
  
  // If not authenticated, redirect to the login page with a message
  console.log('User is not authenticated. Redirecting to login.');
  res.status(401).json({ message: 'You must be logged in to access this resource' });
}

module.exports = isAuthenticated;