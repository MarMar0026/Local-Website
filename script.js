
/* =========================================
   MSTORE - JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Get all page elements and navigation controls
    const pages = document.querySelectorAll(".page");
    const navButtons = document.querySelectorAll(".nav-btn");
    const gotoButtons = document.querySelectorAll("[data-goto]");
    const images = document.querySelectorAll("img");

    images.forEach(function (image) {
        function retryImageFromRepositoryRoot() {
            if (image.dataset.rootFallbackTried) {
                return;
            }

            image.dataset.rootFallbackTried = "true";
            image.src = image.getAttribute("src").split("/").pop();
        }

        image.addEventListener("error", retryImageFromRepositoryRoot, { once: true });

        if (image.complete && image.naturalWidth === 0) {
            retryImageFromRepositoryRoot();
        }
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Update the copyright year automatically
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Switch to the selected page
    function showPage(pageId, updateURL = true) {

        const targetPage = document.getElementById(pageId);

        // Only allow existing page sections
        if (!targetPage || !targetPage.classList.contains("page")) {
            return;
        }

        // Hide every page except the selected one
        pages.forEach(function (page) {
            page.classList.toggle("active", page.id === pageId);
        });

        // Update the active navbar button
        navButtons.forEach(function (button) {
            const isActive = button.dataset.page === pageId;

            button.classList.toggle("active", isActive);

            if (isActive) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

        // Close the mobile navigation after selecting a page
        if (navLinks) {
            navLinks.classList.remove("open");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        }

        // Start the selected page at the top
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        // Update the URL without loading another HTML file
        if (updateURL) {
            const newURL = pageId === "home"
                ? window.location.pathname + window.location.search
                : "#" + pageId;

            history.replaceState(null, "", newURL);
        }
    }

    // Navbar buttons
    navButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    // Buttons and links that navigate to another page
    gotoButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {

            const pageId = button.dataset.goto;

            if (pageId) {
                event.preventDefault();
                showPage(pageId);
            }
        });
    });

    // Mobile menu open/close
    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });
    }

    // Open a page directly when a URL fragment is provided
    function loadPageFromURL() {

        const pageId = window.location.hash.substring(1);

        const targetPage = document.getElementById(pageId);

        if (targetPage && targetPage.classList.contains("page")) {
            showPage(pageId, false);
        } else {
            showPage("home", false);
        }
    }

    // Support browser back and forward navigation
    window.addEventListener("popstate", loadPageFromURL);
    window.addEventListener("hashchange", loadPageFromURL);

    // Display the correct initial page
    loadPageFromURL();

});
