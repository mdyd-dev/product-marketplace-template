const dashboardSidebar = document.querySelector('[data-dashboard-sidebar]');
dashboardSidebar.querySelector(`a[href='${location.pathname}']`).classList.add("border-b-2","border-blue-700","font-bold");
