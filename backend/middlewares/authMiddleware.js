function isAuthenticated(req, res, next) {
  // Check if the session has a userId indicating the user is logged in
  if (req.session.userId) {
    console.log('User is authenticated');
    return next(); // Proceed to the next middleware or route handler
  }
  
  // If not authenticated, send a response indicating the user must be logged in to access this resource
  console.log('User is not authenticated. Redirecting to login.');
  res.status(401).json({ message: 'You must be logged in to access this resource' });
}

module.exports = isAuthenticated;