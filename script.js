// ==========================================================================
// Theme Switcher (Dark / Light Mode)
// ==========================================================================

const themeToggleBtn = document.getElementById('theme-toggle');

// Check for stored theme preference or use system preference
const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    return storedTheme;
  }
  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  if (userMedia.matches) {
    return 'dark';
  }
  return 'light';
};

// Set theme attribute on root element
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize Theme
const currentTheme = getPreferredTheme();
setTheme(currentTheme);

// Toggle Theme on Click
themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// Sync with system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const next = e.matches ? 'dark' : 'light';
    setTheme(next);
  }
});
