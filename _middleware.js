export default function middleware(req) {
  const url = new URL(req.url);
  
  // Only redirect if we're not already on a hash route
  // Check if the URL already has a hash component
  if (url.hash) {
    return Response.next();
  }
  
  // Special handling for admin routes - redirect them to the home page with hash routes
  if (url.pathname === '/admin-login') {
    return Response.redirect(new URL('/#/admin-login', url.origin));
  }

  if (url.pathname.startsWith('/admin')) {
    return Response.redirect(new URL('/#/admin', url.origin));
  }

  // For all other routes, let them pass through
  return Response.next();
} 