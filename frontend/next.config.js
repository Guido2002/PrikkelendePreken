/** @type {import('next').NextConfig} */

// GitHub repository name - update this for your repo
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (e.g., /repo-name)
  basePath: isProduction ? `/${repoName}` : '',
  
  // Asset prefix for static files
  assetPrefix: isProduction ? `/${repoName}/` : '',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  
  // Trailing slashes for cleaner static URLs
  trailingSlash: true,
};

module.exports = nextConfig;
