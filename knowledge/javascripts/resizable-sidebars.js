(function () {
  'use strict';

  function restoreSidebarWidths() {
    const primaryWidth = localStorage.getItem('sidebar-width-primary');
    const secondaryWidth = localStorage.getItem('sidebar-width-secondary');

    if (primaryWidth) {
      document.documentElement.style.setProperty('--sidebar-primary-width', primaryWidth);
    } else {
      document.documentElement.style.removeProperty('--sidebar-primary-width');
    }

    if (secondaryWidth) {
      document.documentElement.style.setProperty('--sidebar-secondary-width', secondaryWidth);
    } else {
      document.documentElement.style.removeProperty('--sidebar-secondary-width');
    }
  }

  function setupDrag(handle, sidebar, type) {
    let startX, startWidth;

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: true });

    // Double click to reset to default
    handle.addEventListener('dblclick', () => {
      document.documentElement.style.removeProperty(`--sidebar-${type}-width`);
      localStorage.removeItem(`sidebar-width-${type}`);
    });

    function startDrag(e) {
      if (e.type === 'mousedown') {
        e.preventDefault(); // Prevent text selection/highlighting
      }

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      startX = clientX;
      startWidth = sidebar.offsetWidth;

      handle.classList.add('is-dragging');
      document.body.classList.add('is-sidebar-dragging');

      if (e.touches) {
        window.addEventListener('touchmove', doDrag, { passive: false });
        window.addEventListener('touchend', stopDrag);
      } else {
        window.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', stopDrag);
      }
    }

    function doDrag(e) {
      if (e.cancelable) {
        e.preventDefault(); // Prevent page scroll on touch devices while dragging
      }

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = clientX - startX;
      let newWidth;

      if (type === 'primary') {
        newWidth = startWidth + delta;
      } else {
        newWidth = startWidth - delta;
      }

      // Clamp to sensible range
      const minWidth = 160;
      const maxWidth = window.innerWidth * 0.35;

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      document.documentElement.style.setProperty(`--sidebar-${type}-width`, `${newWidth}px`);
      localStorage.setItem(`sidebar-width-${type}`, `${newWidth}px`);
    }

    function stopDrag() {
      handle.classList.remove('is-dragging');
      document.body.classList.remove('is-sidebar-dragging');

      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', doDrag);
      window.removeEventListener('touchend', stopDrag);
    }
  }

  function initSidebarResize() {
    const primarySidebar = document.querySelector('.md-sidebar--primary');
    const secondarySidebar = document.querySelector('.md-sidebar--secondary');

    if (primarySidebar && !primarySidebar.querySelector('.sidebar-resize-handle')) {
      const handle = document.createElement('div');
      handle.className = 'sidebar-resize-handle';
      primarySidebar.appendChild(handle);
      setupDrag(handle, primarySidebar, 'primary');
    }

    if (secondarySidebar && !secondarySidebar.querySelector('.sidebar-resize-handle')) {
      const handle = document.createElement('div');
      handle.className = 'sidebar-resize-handle';
      secondarySidebar.appendChild(handle);
      setupDrag(handle, secondarySidebar, 'secondary');
    }
  }

  function setupResizableSidebars() {
    restoreSidebarWidths();
    initSidebarResize();
  }

  // Restore saved width as early as possible
  restoreSidebarWidths();

  // Support both normal page loads and possible instant loading (via document$)
  if (typeof document$ !== 'undefined') {
    document$.subscribe(function () {
      setupResizableSidebars();
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setupResizableSidebars();
    });
  }
})();
