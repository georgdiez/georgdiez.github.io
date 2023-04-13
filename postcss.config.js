const purgecss = require('@fullhuman/postcss-purgecss')({
    // Specify the paths to all of the template files in your project
    content: [
        './docs/*.html',
        './docs/*.vue',
        './docs/*.js',
        './docs/**/*.html',
        './docs/**/*.vue',
        './docs/**/*.js',
        // etc.
    ],
    // Include any special characters you're using in your CSS
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        // Add @fullhuman/postcss-purgecss here
        ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
    ],
};