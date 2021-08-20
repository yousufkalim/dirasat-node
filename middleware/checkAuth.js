// Check auth
exports.checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		// If user authenticated
		res.set(
			"cache-control",
			"no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
		);
		next();
	} else {
		// If not
		res.status(403).send("Your session is expired");
	}
};
